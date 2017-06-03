const {usefulTweets} = require('./twitter')

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

exports.searchTweets = (client, settings) => {
  //TODO use cursor here
  return client.search({
    index: 'tweets',
    type: 'tweet',
    body: createElasticQuery(settings)
  }).then(resp => {
    const hits = resp.hits.hits
    const tweets = usefulTweets(hits)
    return {query: settings.query,
            tweets: tweets,
            totalCount: hits.length,
            usefulCount: tweets.length}
  },
          err => console.error('Error occured:' + err))
}

exports.saveDailyNews = (client, date, news) => {
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
