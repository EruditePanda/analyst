require('dotenv').config();
let request = require('request');
let Twitter = require('twitter');
let _ = require('lodash');
let settings = require('./settings.json');

console.log('starting data-stream');

let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

console.log(client);

function twitterDateToJSDate(aDate){
  return new Date(Date.parse(aDate.replace(/( \+)/, ' UTC$1')));
}

function toStoredTweet(tweet){
  return {
    id: tweet.id.toString(),
    created_at: twitterDateToJSDate(tweet.created_at),
    text: tweet.text,
    lang: tweet.lang,
    userId: _.get(tweet, 'user.id', null),
    userName: _.get(tweet, 'user.name', null),
    userLocation: _.get(tweet, 'user.location', null)
  };
}

const isTweet = _.conforms({
  id_str: _.isString,
  text: _.isString,
});

function saveTweetAsync(tweet) {
  request({
    uri: settings.elasticSearchAddress,
    method: "POST",
    timeout: 10000,
    followRedirect: false,
    maxRedirects: 10,
    json: {}
  }, function(error, response, body) {
    if (error) {
      console.error(error);
    } else if (response.statusCode >= 400) {
      console.error(`Can't save tweet - ${response.statusCode}`);
    } else {
      console.log('tweet saved');
    }
  });
}

var stream = client.stream('statuses/filter', {track: settings.twitterTrack});
stream.on('data', function(event) {
  if (isTweet(event)){
    const storedTweet = toStoredTweet(event);
    saveTweetAsync(storedTweet);
  }
});

stream.on('error', function(error) {
  console.error(error);
});
