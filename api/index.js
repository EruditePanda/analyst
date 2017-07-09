const express = require('express')
const http = require('http')
const elasticsearch = require('elasticsearch')
const cors = require('cors')

const app = express()
app.use(cors())
http.createServer(app).listen(3000, 'localhost')

const getElasticNews = (client, type, id) => new Promise((resolve, reject) => {
  client.get({ index: 'news', type, id }, (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})

const topNews = news => {
  const MAX_RECORDS = 10
  return news
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_RECORDS)
}

const postprocessDaily = source => source.data
  .map(x => ({ topic: x.topic, data: topNews(x.data.news) }))
  .reduce((acc, { topic, data }) => {
    // TODO use Map in elastic instead of Array to store daily news
    acc[topic] = data
    return acc
  }, {})

const getNews = (type, req, res) => {
  const currentDate = (new Date()).toISOString().substr(0, 10)
  const client = elasticsearch.Client({ host: 'localhost:9200' })
  getElasticNews(client, type, currentDate)
    .then(r => {
      let result = r._source
      if (type === 'daily') {
        result = postprocessDaily(result)
      }
      res.send(result)
    })
    .catch(err => {
      console.error(`Api error during loading ${type} news: ${err}`)
      res.status(404)
      res.send('')
    })
}

const dailyNews = (req, res) => getNews('daily', req, res)
const weeklyNews = (req, res) => getNews('weekly', req, res)

app.get('/daily', dailyNews)
app.get('/weekly', weeklyNews)
