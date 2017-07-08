exports.createSettings = current => {
  const from = new Date(current)
  const to = new Date(current)
  let date = ''

  if (current.getUTCHours() === 0) {
    // the whole previous day
    from.setUTCDate(to.getUTCDate() - 1)
    from.setUTCHours(0, 0, 0, 0)
    to.setUTCHours(0, 0, 0, 0)
    date = from.toISOString().substr(0, 10)
  } else {
    // the current day until the moment
    from.setUTCHours(0, 0, 0, 0)
    date = to.toISOString().substr(0, 10)
  }

  return { from, to, date }
}

const counter = (acc, x) => {
  const v = acc[x] || 0
  acc[x] = v + 1

  return acc
}

exports.importantTweets = tweets => {
  const MAX_RECORDS = 20
  const MIN_RETWEETS = 2
  const tweetsCounters = tweets
    .sort()
    .reduce(counter, {})
  const keys = Object.keys(tweetsCounters)
  keys.sort((x, y) => tweetsCounters[y] - tweetsCounters[x])

  return keys
    .map(x => ({ text: x, count: tweetsCounters[x] }))
    .filter(x => x.count >= MIN_RETWEETS)
    .slice(0, MAX_RECORDS)
}

exports.removeRetweet = text => {
  const match = text.match(/^RT\s@[^\s]+\s/)
  if (match) {
    const prefix = match[0]
    if (prefix.length < text.length) {
      return text.substring(prefix.length)
    }
    return text
  }
  return text
}

exports.usefulTweets = hits => {
  const regex = /(#.*){4,}/g

  return hits
    .map(x => exports.removeRetweet(x._source.text))
    .filter(x => !x.match(regex))
}
