import React, { Component } from 'react'
import './App.css'
import NewsTable from './NewsTable'
import TopicMenu from './TopicMenu'

const Header = () => (
  <header className='App-header'>
    <h2>4news</h2>
  </header>
)

const loadNews = (dailyNewsUrl) => {
  return new Promise((resolve, reject) => {
    fetch(dailyNewsUrl)
      .then(resp => {
        resp.json()
          .then(json => resolve(json))
          .catch(err => resolve(err))
      })
      .catch(err => reject(err))
  })
}

class App extends Component {
  state = {topic: 'javascript',
           news: []}

  onTopicChange = (newTopic) => {
    this.setState((state, props) => {
      state.topic = newTopic
      return state
    })
  }
  componentDidMount = () => {
    const dailyNewsUrl = 'http://51.15.47.25:3000/daily'
    loadNews(dailyNewsUrl)
      .then(news => {
        news = news.reduce((acc, {topic, data}) => {
          acc[topic] = data
          return acc
        }, {})
        this.setState((state, props) => {
          state.news = news 
          return state
        })
      })
      .catch(err => console.error(err))
  }
  render() {
    const news = this.state.news[this.state.topic]
    return (
      <div className="App"> 
        <Header />
        <TopicMenu onTopicChange={this.onTopicChange} />
        <article>
          <NewsTable news={news} />
        </article>
      </div>
    )
  }
}

export default App
