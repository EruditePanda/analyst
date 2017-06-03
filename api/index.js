const express = require('express')
const http = require('http')
const elasticsearch = require('elasticsearch')

const app = express()
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

const dailyHandler = (req, res) => {
  const currentDate = (new Date()).toISOString().substr(0,10)
  const client = elasticsearch.Client({host: 'localhost:9200'})
  loadNews(client, 'daily', currentDate)
    .then(data => {
      //TODO refactor the name to data
      const result = data._source.tweets
        .map(x => ({
          topic: x.topic,
          data: x.data.tweets
        }))
      res.send(result)
    })
    .catch(err => {
      res.status(404)
      res.send({error: 'Looks like we don\'t have anything now for your request'})
    })
}

app.get('/daily', dailyHandler)
//app.get('/weekly', weeklyHandler)
//app.get('/monthly', monthlyHandler)
