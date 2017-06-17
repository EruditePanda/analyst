import React, { Component } from 'react'
import './TopicMenu.css'

class MenuItem extends Component {
  onClick = () => {
    const {topic, onTopicChange} = this.props
    onTopicChange(topic)
  }
  render() {
    const {topic, text} = this.props
    const href = `#${topic}`
    return (
      <a className='Topic-item' href={href} onClick={this.onClick}>{text}</a>
    )
  }
}


class TopicMenu extends Component {
  render() {
    const {onTopicChange} = this.props
    return (
      <nav className='Topic-menu'>
        <MenuItem text='JavaScript' topic='javascript' onTopicChange={onTopicChange}/>
        <MenuItem text='Golang' topic='golang' onTopicChange={onTopicChange}/>
        <MenuItem text='Clojure' topic='clojure' onTopicChange={onTopicChange}/>
      </nav>
    )
  }
}

export default TopicMenu
