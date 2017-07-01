import React, { Component } from 'react'
import './NewsTable.css'
import PropTypes from 'prop-types'

class TextElement extends Component {
  render() {
    const text = `${this.props.text} `
    if (text.startsWith('https://t.co/')) {
      return (
        <div className='Link'>
          <a href={text} target='_blank' rel='noopener noreferrer'>link</a>
          <span> </span>
        </div>
      )
    } else {
      return (<span>{text}</span>)
    }
  }
}

class NewsRow extends Component {
  render() {
    const {text, count} = this.props
    const texts = (text.match(/\S+/g) || [])
      .map((text, index) => <TextElement key={`${text} ${index}`} text={text}/>)
    return (
      <tr className="News-row">
        <td>
          <div>
            {texts}
          </div>
        </td>
        <td className='News-stars'>
          <span>{count}</span>
        </td>
      </tr>
    )
  }
}

NewsRow.propTypes = {
  text: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired
}

class NewsTable extends Component {
  createItems = (news) => (news || [])
    .map(({text, count}) => 
      <NewsRow key={text} text={text} count={count} />
      ) 
  render() {
    const dailyItems = this.createItems(this.props.news.daily)
    const weeklyItems = this.createItems(this.props.news.weekly)
    return (
      <div className='News-table'>
        <table className='News-table'>
          <tbody>
            <tr>
              <th className='News-header'>Text</th>
              <th className='News-header'>Stars</th>
            </tr>
            <tr>
              <td className='News-row-header' colSpan={2}>Daily</td>
            </tr>
            {dailyItems}
            <tr>
              <td className='News-row-header' colSpan={2}>Weekly</td>
            </tr>
            {weeklyItems}
          </tbody>
        </table>
      </div>
    )
  }
}

export default NewsTable
