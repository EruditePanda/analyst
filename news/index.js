const elasticsearch = require('elasticsearch')
const { searchTweets, saveNews, weeklyDailyNews } = require('./elastic')
const { importantTweets, createSettings, removeRetweet } = require('./twitter')

const dailyImportantTweets = (client, settings, query) =>
  searchTweets(client, Object.assign(settings, { query }))
    .then(x => ({
      totalCount: x.totalCount,
      usefulCount: x.usefulCount,
      query: x.query,
      news: importantTweets(x.tweets)
    }))

const run = (client, settings, topics) => {
  topics.reduce((p, { topic, query }) =>
    p.then(results =>
      dailyImportantTweets(client, settings, query)
        .then(data => {
          results.push({ topic, data })
          return results
        })), Promise.resolve([]))
    .then(data => ({ from: settings.from, to: settings.to, data }))
    .then(news => saveNews(client, 'daily', settings.date, news))
    .catch(err => {
      console.error(`Error occured: ${err}`)
      process.exit(1)
    })
}

const runDaily = () => {
  try {
    const topics = [
      { topic: 'javascript', query: 'javascript' },
      { topic: 'clojure', query: 'clojure' },
      { topic: 'golang', query: 'golang' }]
    const settings = createSettings(new Date())
    const client = elasticsearch.Client({ host: 'http://localhost:9200' })

    run(client, settings, topics)
  }
  catch(err) {
    console.error(`Error occured: ${err}`)
    process.exit(1)
  }
}

const reduceDaily = (acc, news) => {
  return news
    .reduce((acc, { topic, data }) => {
      const accData = acc[topic] || []
      acc[topic] = accData.concat(data.news)
      return acc
    }, acc)
}

const reduceCount = news => {
  const MAX_RECORDS = 10
  const dict = news
    .reduce((acc, { text, count }) => {
      const accCount = acc[text] || 0
      acc[text] = accCount + count
      return acc
    }, {})
  return Object.keys(dict)
    .map(text => ({ text: removeRetweet(text), count: dict[text] }))
    .sort((x, y) => y.count - x.count)
    .slice(0, MAX_RECORDS)
}

const runMonthly = () => {
  const client = elasticsearch.Client({ host: 'http://localhost:9200' })
  weeklyDailyNews(client)
    .then(news => {
      const allNews = news
        .reduce(reduceDaily, {})
      const weeklyNews = Object.keys(allNews)
        .map(key => ({ topic: key, news: reduceCount(allNews[key]) }))
        .reduce((acc, { topic, news }) => {
          acc[topic] = news
          return acc
        }, {})
      saveNews(client, 'weekly', (new Date()).toISOString().substr(0, 10), weeklyNews)
    })
}

const args = new Set(process.argv.filter(arg => arg.startsWith('--')))
if (args.length <= 2) {
  console.error('you need to pass --daily or --weekly')
} else {
  if (args.has('--daily')) {
    runDaily()
  }
  if (args.has('--weekly')) {
    runMonthly()
  }
}
