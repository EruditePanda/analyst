const { usefulTweets } = require('./twitter')

const createTweetsQuery = ({ query, from, to }) => ({
  query: {
    bool: {
      must: { match: { text: { query, operator: 'or' } } },
      filter: { range: { created_at: { gte: from, lte: to } } },
      should: { term: { lang: 'en' } },
      minimum_should_match: 1
    }
  },
  size: 10000,
  sort: { createdAt: 'desc' }
})

// TODO use cursor here
exports.searchTweets = (client, settings) =>
  client.search({ index: 'tweets', type: 'tweet', body: createTweetsQuery(settings) })
    .then(resp => {
      const hits = resp.hits.hits
      const tweets = usefulTweets(hits)
      return { query: settings.query, tweets, totalCount: hits.length, usefulCount: tweets.length }
    }, err => {
      throw err
    })

exports.saveNews = (client, type, date, news) =>
  new Promise((resolve, reject) => {
    console.log(`Saving ${type} news ${JSON.stringify(news, null, 2)}`)
    client.index({ index: 'news', type, id: date, body: news }, (err, resp) => {
      if (err) {
        console.error(`Failed to save ${type} news ${err}`)
        reject(err)
      } else {
        console.log(`${type} news was saved ${JSON.stringify(resp, null, 2)}`)
        resolve(resp)
      }
    })
  })

const createDailyQuery = (from, to) => ({
  query: {
    bool: {
      filter: [
        { range: { from: { gte: from, lte: to } } },
        { range: { to: { gte: from, lte: to } } }
      ]
    }
  }
})

exports.weeklyDailyNews = client => {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 7)
  return client.search({ index: 'news', type: 'daily', body: createDailyQuery(from, to) })
    .then(
      resp => resp.hits.hits.map(x => x._source.data),
      err => {
        throw err
      })
}
