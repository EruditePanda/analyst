import React, { Component } from 'react'
import './NewsTable.css'
import PropTypes from 'prop-types'

class NewsRow extends Component {
  render() {
    const {text, count} = this.props
    return (
      <tr className="News-row">
        <td>
          {text}
        </td>
        <td>
          {count}
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
  render() {
    const news = this.props.news || []
    const newsItems = news.map(({text, count}) => 
      <NewsRow key={text} text={text} count={count} />
    )
    return (
      <div className='News-table'>
        <table className='News-table'>
          <tbody>
            <tr>
              <th className='News-header'>Topic</th>
              <th className='News-header'>Retweets</th>
            </tr>
            {newsItems}
          </tbody>
        </table>
      </div>
    )
  }
}

export default NewsTable
