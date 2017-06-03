exports.createSettings = (current) => {
  let from = new Date(current)
  let to = new Date(current)
  let date = ''

  if (current.getUTCHours() == 0) {
    //the whole previous day
    from.setUTCDate(to.getUTCDate() - 1)
    from.setUTCHours(0,0,0,0)
    to.setUTCHours(0,0,0,0)
    date = from.toISOString().substr(0,10)
  } else {
    //the current day until the moment
    from.setUTCHours(0,0,0,0)
    date = to.toISOString().substr(0,10)
  }
  return {
    from,
    to,
    date
  }
}

const counter = (acc, x) => {
  const v = acc[x] || 0
  acc[x] = v + 1
  return acc
}

exports.importantTweets = (tweets) => {
  const MAX_RECORDS = 10
  const MIN_RETWEETS = 2
  const keys = []
  tweets = tweets
    .sort()
    .reduce(counter, {})
  for (tweet in tweets){
    keys.push(tweet)
  }
  keys.sort((x,y) => tweets[y] - tweets[x])
  return keys
    .map(x => ({
      text: x,
      count: tweets[x]
    }))
    .filter(x => x.count >= MIN_RETWEETS)
    .slice(0, MAX_RECORDS)
}

exports.usefulTweets = hits => {
  const regex = /(#.*){4,}/g
  return hits
    .map(x => x._source.text)
    .filter(x => !x.match(regex))
}
