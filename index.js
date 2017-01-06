require('dotenv').config();
let Twitter = require('twitter');
let _ = require('lodash');

console.log('starting data-stream');

let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

console.log(client);

function toStoredTweet(tweet){
  return {
    id: tweet.id.toString(),
    created_at: tweet.created_at,
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

var stream = client.stream('statuses/filter', {track: 'Putin Trump, Japan'});
stream.on('data', function(event) {
  if (isTweet(event)){
    console.log(toStoredTweet(event));
  }
});

stream.on('error', function(error) {
  console.error(error);
});
