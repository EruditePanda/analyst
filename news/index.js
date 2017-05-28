const elasticsearch = require('elasticsearch')

const counter = (acc, x) => {
  const v = acc[x] || 0
  acc[x] = v + 1
  return acc
}

const importantTweets = (tweets) => {
  const MAX_TWEETS = 10
  const MIN_RETWEETS = 2
  const keys = []
  tweets = tweets
    .sort()
    .reduce(counter, {})
  for (tweet in tweets){
    keys.push(tweet)
  }
  keys.sort((x,y) => tweets[y] - tweets[x])
  return keys
    .map(x => ({
      text: x,
      count: tweets[x]
    }))
    .filter(x => x.count >= MIN_RETWEETS)
    .slice(0, MAX_TWEETS)
}

const createElasticQuery = ({query, from, to}) => ({
  query: {
    bool: {
      must: {
        match: {
          text: {
            query: query,
            operator: 'and'
          }
        }
      },
      filter: {
        range: {
          created_at: {
            gte: from,
            lte: to
          }
        }
      }
    }
  },
  size: 10000,
  sort: {created_at: 'desc'}
})

const createSettings = () => {
  const from = new Date()
  const to = new Date()
  from.setDate(to.getDate() - 1)
  const date = to.toISOString().substr(0,10)
  return {
    from,
    to,
    date
  }
}

const hitsToTweets = hits => {
  const regex = /(#.*){0,4}/g
  return hits
    .map(x => x._source.text)
    .filter(x => x.match(regex))
}

const searchTweets = (client, settings) => {
  return client.search({
    index: 'tweets',
    type: 'tweet',
    body: createElasticQuery(settings)
  }).then(resp => ({query: settings.query,
                    tweets: hitsToTweets(resp.hits.hits)}),
          err => console.error('Error occured:' + err))
}

const dailyImportantTweets = (client, settings, query) => {
  return searchTweets(client, Object.assign(settings, {query: query}))
    .then(x => Object.assign({}, x, {tweets: importantTweets(x.tweets)}))
}

const saveDailyNews = (client, date, news) => {
  return new Promise((resolve, reject) => {
    console.log(`Saving daily news ${JSON.stringify(news, null, 2)}`)
    client.index({
      index: 'news',
      type: 'daily',
      id: date,
      body: news
    }, (err, resp) => {
      if (err) {
        console.error(`Failed to save daily news ${err}`)
        reject(err)
      } else {
        console.log(`Daily news was saved ${JSON.stringify(resp, null, 2)}`)
        resolve(resp)
      }
    })
  })
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
}

const topics = [{topic: 'javascript',
                 query: 'javascript'},
                {topic: 'clojure',
                 query: 'clojure'},
                {topic: 'golang',
                 query: 'golang'}]
const settings = createSettings()
const client = elasticsearch.Client({host: 'localhost:9200'})

run(client, settings, topics)
