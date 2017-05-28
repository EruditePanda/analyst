const express = require('express')
const http = require('http')
const elasticsearch = require('elasticsearch')

const app = express()
http.createServer(app).listen(3000)

const loadNews = (type, id) => {
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
  }
}

const dailyHandler = (req, res) => {
  const currentDate = (new Date()).toISOString().substr(0,10)
  const client = elasticsearch.Client({host: 'localhost:9200'})
  client.get({
    index: 'news',
    type: 'daily',
    id: currentDate
  }, (err, data) => {
    if (err) {
      res.status(404)
      res.send('Looks like we don\'t have anything now for your request')
    } else {
      //TODO refactor the name to data
      const result = data._source.tweets
        .map(x => ({
          topic: x.topic,
          data: x.data.tweets
        }))
      res.send(result)
    }
  })
}

app.get('/daily', dailyHandler)
app.get('/weekly', dailyHandler)
app.get('/monthly', dailyHandler)
