const {createSettings, usefulTweets, importantTweets} = require('./twitter')

test('should create settings for the previous day', () => {
  const {from, to, date} = createSettings(new Date('2017-03-20T00:30:00Z'))
  expect(from).toEqual(new Date('2017-03-19T00:00:00Z'))
  expect(to).toEqual(new Date('2017-03-20T00:00:00Z'))
  expect(date).toBe('2017-03-19')
})

test('should create settings for the current day', () => {
  const {from, to, date} = createSettings(new Date('2017-03-20T03:30:00Z'))
  expect(from).toEqual(new Date('2017-03-20T00:00:00Z'))
  expect(to).toEqual(new Date('2017-03-20T03:30:00Z'))
  expect(date).toBe('2017-03-20')
})

test('should return only important tweets', () => {
  const tweets = ['aaa', 'bb', 'aaa', 'ccc', 'dd', 'aaa', 'eee', 'bb']
  expect(importantTweets(tweets))
    .toEqual([{text: 'aaa',
               count: 3},
              {text: 'bb',
               count: 2}])
})

test('should return only useful tweets (with no more than 3 hashtags)', () => {
  const hits = [{_source: {text: "text1"}},
                {_source: {text: "text2 #tag1"}},
                {_source: {text: "text3 #tag1 #tag2"}},
                {_source: {text: "text4 #tag1 #tag2 #tag3"}},
                {_source: {text: "text5 #tag1 #tag2 #tag3 #tag4"}},
                {_source: {text: "text6 #tag1 #tag2 #tag3"}},
                {_source: {text: "text7 #tag1 #tag2"}},
                {_source: {text: "text8 #tag1 #tag2 #tag3 #tag4 #tag5"}}]
  expect(usefulTweets(hits))
    .toEqual(['text1',
              'text2 #tag1',
              'text3 #tag1 #tag2',
              'text4 #tag1 #tag2 #tag3',
              'text6 #tag1 #tag2 #tag3',
              'text7 #tag1 #tag2'])
})
