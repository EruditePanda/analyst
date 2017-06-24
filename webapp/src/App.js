import React, { Component } from 'react'
import './App.css'
import NewsTable from './NewsTable'
import TopicMenu from './TopicMenu'

const Header = () => (
  <header className='App-header'>
    <h2>Programming news</h2>
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
           news: [],
           status: 'fetching'
  }

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
        setTimeout(() => this.setState((state, props) => {
          state.status = 'loaded'
          return state
        }), 500)
      })
      .catch(err => console.error(err))
  }
  render() {
    const news = this.state.news[this.state.topic]
    const content = this.state.status === 'fetching' ?
      <h4>Loading news...</h4> :
      <article><NewsTable news={news} /></article>

    return (
      <div className="App"> 
        <Header />
        <TopicMenu onTopicChange={this.onTopicChange} />
        {content}
      </div>
    )
  }
}

export default App
