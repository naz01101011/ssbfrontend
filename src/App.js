import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import Contact from './pages/Contact'
import Article from './pages/Article';
import AdsContext from './context/AdsContext';
import Client from './components/Client'


function App() {
  const adsquery = '*[_type == "banner"] | order(publishedAt desc)';

  const [ads, setAds] = useState({});

  const fetchAds = () => {
    Client.fetch(adsquery)
        .then(res => setAds(res))
  }

  // console.log(ads)

  useEffect(() => {
      fetchAds();
  }, [])

  return (
    <AdsContext.Provider value={ads}>
      <Router>
        <AppHeader />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/contact" component={Contact} />
          <Route path="/:article_slug" component={Article} />
        </Switch>
      </Router>
    </AdsContext.Provider>
  );
}

export default App;
