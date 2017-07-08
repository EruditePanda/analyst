import React, { Component } from 'react'
import './TopicMenu.css'

class MenuItem extends Component {
  onClick = () => {
    const { topic, onTopicChange } = this.props
    onTopicChange(topic)
  }
  render() {
    const { text, selected } = this.props
    const className = selected ? 'Topic-menu-item-selected' : 'Topic-menu-item'
    return (
      <button className={className} onClick={this.onClick}>{text}</button>
    )
  }
}

class TopicMenu extends Component {
  data = [
    { text: 'JavaScript', topic: 'javascript' },
    { text: 'Golang', topic: 'golang' },
    { text: 'Clojure', topic: 'clojure' },
    { text: 'NoSQL', topic: 'nosql' },
    { text: 'DevOps', topic: 'devops' }
  ]
  render() {
    const { selectedTopic, onTopicChange } = this.props
    const menuItems = this.data.map(({text, topic}) =>
      <MenuItem key={topic}
                text={text}
                topic={topic}
                onTopicChange={onTopicChange}
                selected={topic === selectedTopic}/>)

    return (
      <nav className='Topic-menu'>
        {menuItems}
      </nav>
    )
  }
}

export default TopicMenu
