const express = require('express')
const http = require('http')
const elasticsearch = require('elasticsearch')

const app = express()
http.createServer(app).listen(3000)

app.get('/daily', function (req, res) {
  const currentDate = new Date()
  const client = elasticsearch.Client({host: 'localhost:9200'})
  client.get({
    index: 'news',
    type: 'daily',
    id: '2017-05-28'
  }, (err, data) => {
    if (err) {
      //TODO process error
    } else {
      const tweets = data._source.tweets
      res.send(tweets)
    }
  })
})
