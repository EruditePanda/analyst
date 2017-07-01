import React, { Component } from 'react'
import './App.css'
import NewsTable from './NewsTable'
import TopicMenu from './TopicMenu'
import Header from './Header'

const Footer = () => (
  <footer className='App-header'>
    <a href='/about'>About the site</a>
  </footer>
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
           news: {'javascript': {},
                  'golang': {},
                  'clojure': {}},
           status: 'fetching'
  }

  onTopicChange = (newTopic) => {
    this.setState((state, props) => {
      state.topic = newTopic
      return state
    })
  }
  initState = (type, url) => {
    loadNews(url)
      .then(news => {
        this.setState((state, props) => {
          Object.keys(news)
            .forEach(key => state.news[key][type] = news[key])
          return state
        })
        setTimeout(() => this.setState((state, props) => {
          state.status = 'loaded'
          return state
        }), 500)
      })
      .catch(err => console.error(err))
  }
  componentDidMount = () => {
    this.initState('daily', 'http://51.15.47.25:3000/daily')
    this.initState('weekly', 'http://51.15.47.25:3000/weekly')
  }
  render() {
    const news = this.state.news[this.state.topic]
    const content = this.state.status === 'fetching' ?
      <h4>Loading news...</h4> :
      <article><NewsTable news={news} /></article>

    return (
      <div className="App"> 
        <Header />
        <TopicMenu onTopicChange={this.onTopicChange} selectedTopic={this.state.topic}/>
        {content}
        <Footer />
      </div>
    )
  }
}

export default App
