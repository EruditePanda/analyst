import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import About from './About'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import createHistory from 'history/createBrowserHistory'
import { Router, Route, Switch } from 'react-router'

ReactDOM.render(
  <Router history={createHistory()}>
    <Switch>
      <Route path='/about' component={About} />
      <Route path='/' component={App} />
    </Switch>
  </Router>,
  document.getElementById('root'));
registerServiceWorker();
