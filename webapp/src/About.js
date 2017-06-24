import React from 'react'
import Header from './Header'
import './About.css'

const About = () => (
  <div>
    <Header />
    <div className='about'>
      <p>The site provides you the most popular programming news from Twitter. The more times tweet was retweeted the more likely it will be in the programming news.</p>
      <p>The site was created by <a href='https://github.com/abtv' target='_blank' rel='noopener noreferrer'>Andrey Butov</a> just to taste ES6 and all the modern libs.</p>
      <a href='/'>Go back to the news</a>
    </div>
      </div>
)

export default About
