import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import Stiri from './pages/Stiri';
import Contact from './pages/Contact'
import Article from './pages/Article';
import Search from './pages/Search';
import AdsContext from './context/AdsContext';
import Client from './components/Client'
import AppFooter from './components/AppFooter';


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
          <Route path="/search" component={Search} />
          <Route path="/stiri/:article_slug" component={Article} />
          <Route path="/stiri" component={Stiri} />
        </Switch>
        <AppFooter />
      </Router>
    </AdsContext.Provider>
  );
}

export default App;
