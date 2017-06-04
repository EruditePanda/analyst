http put http://localhost:9200/tweets < /tmp/tweets_index.json
http put http://localhost:9200/tweets/_mapping/tweet < /tmp/tweet_mapping.json
http put http://localhost:9200/news < /tmp/news_index.json
http put http://localhost:9200/news/_mapping/daily < /tmp/news_daily_mapping.json
