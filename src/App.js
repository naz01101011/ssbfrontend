import React from 'react';
// import './App.css';
import HomepageImage from './components/HomepageImage';
import AppHeader from './components/AppHeader';
import LatestNews from './components/LatestNews';

function App() {
  return (
    <div className="wrapper" style={{textAlign: 'center'}}>
      <AppHeader />
      <LatestNews />
    </div>
  );
}

export default App;
