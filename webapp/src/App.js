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
  state = {
    topic: 'javascript',
    news: {
      'javascript': {},
      'golang': {},
      'clojure': {},
      'nosql': {},
      'devops': {}
    },
    status: 'fetching'
  }

  onTopicChange = newTopic => {
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
      .catch(err => {
        this.setState((state, props) => {
          state.status = 'error'
          return state
        })
      })
  }
  componentDidMount = () => {
    this.initState('daily', '/api/daily')
    this.initState('weekly', '/api/weekly')
  }
  render() {
    const news = this.state.news[this.state.topic]

    let content = null
    switch (this.state.status) {
      case 'fetching':
        content = <h4>Loading news...</h4>
        break
      case 'error':
        content = <h4>Something went wrong. We are working on the problem. Try again later.</h4>
        break
      default:
        content = <article><NewsTable news={news} /></article>
        break
    }

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
