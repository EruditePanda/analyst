const express = require('express')
const http = require('http')
const elasticsearch = require('elasticsearch')
const cors = require('cors')

const app = express()
app.use(cors())
http.createServer(app).listen(3000)

const loadNews = (client, type, id) => {
  return new Promise((resolve, reject) => {
    client.get({
      index: 'news',
      type,
      id
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const getNews = (type, req, res) => {
  const currentDate = (new Date()).toISOString().substr(0,10)
  const client = elasticsearch.Client({host: 'localhost:9200'})
  loadNews(client, type, currentDate)
    .then(r => {
      if (type === 'daily') {
        const MAX_RECORDS = 10
        const result = r._source.data
          .map(x => ({
            topic: x.topic,
            data: x.data.news
              .sort((x,y) => y.count - x.count)
              .slice(0, MAX_RECORDS)
          }))
          .reduce((acc, {topic, data}) => {
            acc[topic] = data
            return acc
          }, {})
        res.send(result)
      } else {
        res.send(r._source)
      }
    })
    .catch(err => {
      console.error(`Api error during loading ${type} news: ${err}`)
      res.status(404)
      res.send('')
    })
}

const dailyNews = (req, res) => getNews('daily', req, res)
const weeklyNews = (req, res) => getNews('weekly', req, res)
const monthlyNews = (req, res) => getNews('monthly', req, res)

app.get('/daily', dailyNews)
app.get('/weekly', weeklyNews)
app.get('/monthly', monthlyNews)
