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

const dailyNews = (req, res) => {
  const currentDate = (new Date()).toISOString().substr(0,10)
  const client = elasticsearch.Client({host: 'localhost:9200'})
  loadNews(client, 'daily', currentDate)
    .then(r => {
      const result = r._source.data
        .map(x => ({
          topic: x.topic,
          data: x.data.news
        }))
      res.send(result)
    })
    .catch(err => {
      console.error(`Api error during loading daily news: ${err}`)
      res.status(404)
      res.send('')
    })
}

app.get('/daily', dailyNews)
//app.get('/weekly', weeklyHandler)
//app.get('/monthly', monthlyHandler)
