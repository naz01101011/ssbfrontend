import React from 'react';
import {BrowserRouter as Router, Switch, Route, } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Home from './components/Home';
import Contact from './components/Contact'
import Article from './components/Article';

function App() {
  return (
    <Router>
    <div className="wrapper">
      <AppHeader />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/contact" component={Contact} />
        <Route path="/:article_slug" component={Article} />
      </Switch>
    </div>
    </Router>
  );
}

export default App;
