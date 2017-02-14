"use strict"

const request = require('request')
const Twitter = require('twitter')
const _ = require('lodash')
const  settings = require('./settings.json')
const Log = require('log')
const fs = require('fs')

require('dotenv').config()
const log = new Log('info', fs.createWriteStream(settings.logFileName))

log.info('Starting data-stream')

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

log.info('Twitter client was created')

function twitterDateToJSDate(aDate){
  return new Date(Date.parse(aDate.replace(/( \+)/, ' UTC$1')))
}

function toStoredTweet(tweet){
  return {
    id: tweet.id.toString(),
    created_at: twitterDateToJSDate(tweet.created_at),
    text: tweet.text,
    lang: tweet.lang,
    userId: _.get(tweet, 'user.id', null),
    userName: _.get(tweet, 'user.name', null),
    userScreenName: _.get(tweet, 'user.screen_name', null),
    userDescription: _.get(tweet, 'user.description', null),
    userLocation: _.get(tweet, 'user.location', null),
    followersCount: _.get(tweet, 'user.followers_count', null),
    friendsCount: _.get(tweet, 'user.friends_count', null),
    statusesCount: _.get(tweet, 'user.statuses_count', null)
  }
}

const isTweet = _.conforms({
  id_str: _.isString,
  text: _.isString,
})

function saveTweetAsync(tweet) {
  let uri = settings.elasticSearchAddress
  if (!uri.endsWith("/")){
    uri += "/"
  }
  request({
    uri: uri + "tweets/tweet/" + tweet.id,
    method: "PUT",
    timeout: 10000,
    followRedirect: false,
    maxRedirects: 10,
    json: tweet
  }, (error, response, body) => {
    if (error) {
      log.error(error)
    } else if (response.statusCode >= 400) {
      log.error(`Can't save tweet - ${response.statusCode}: ${body}`)
    } else {
      log.info('tweet saved')
    }
  })
}

const stream = client.stream('statuses/filter', {track: settings.twitterTrack})
stream.on('data', event => {
  if (isTweet(event)){
    const storedTweet = toStoredTweet(event)
    saveTweetAsync(storedTweet)
  }
})

stream.on('error', error => {
  log.error(error)
})
