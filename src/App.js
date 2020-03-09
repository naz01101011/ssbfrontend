import React from 'react';
import {BrowserRouter as Router, Switch, Route, } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import Contact from './pages/Contact'
import Article from './pages/Article';

function App() {
  return (
    <Router>
      <AppHeader />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/contact" component={Contact} />
        <Route path="/:article_slug" component={Article} />
      </Switch>
    </Router>
  );
}

export default App;
