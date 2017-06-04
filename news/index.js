const elasticsearch = require('elasticsearch')
const {searchTweets, saveDailyNews} = require('./elastic')
const {importantTweets, createSettings} = require('./twitter')

const dailyImportantTweets = (client, settings, query) => {
  return searchTweets(client, Object.assign(settings, {query: query}))
    .then(x => Object.assign({}, x, {tweets: importantTweets(x.tweets)}))
}

const run = (client, settings, topics) => {
  topics.reduce((p, {topic, query}) => {
    return p.then(results => {
      return dailyImportantTweets(client, settings, query)
        .then(data => {
          results.push({topic,
                        data})
          return results
        })
    })
  }, Promise.resolve([]))
  .then(results => ({
    from: settings.from,
    to: settings.to,
    tweets: results
  }))
  .then(news => saveDailyNews(client, settings.date, news))
  .catch(err => {
    console.error(`Error occured: ${err}`)
    process.exit(1)
  })
}

try {
  const topics = [{topic: 'javascript',
                   query: 'javascript'},
                  {topic: 'clojure',
                   query: 'clojure'},
                  {topic: 'golang',
                   query: 'golang'}]
  const settings = createSettings(new Date())
  const client = elasticsearch.Client({host: 'http://localhost:9200'})

  run(client, settings, topics)
}
catch(err) {
  console.error(`Error occured: ${err}`)
  process.exit(1)
}
