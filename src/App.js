import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import Home from "./pages/Home";
import Stiri from "./pages/Stiri";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Article from "./pages/Article";
import Search from "./pages/Search";
import AdsContext from "./context/AdsContext";
import Client from "./components/Client";
import AppFooter from "./components/AppFooter";
import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

function App() {
  const adsquery = '*[_type == "banner"] | order(publishedAt desc)';

  const [ads, setAds] = useState({});

  const fetchAds = () => {
    Client.fetch(adsquery).then((res) => setAds(res));
  };

  // console.log(ads)

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <AdsContext.Provider value={ads}>
      <Router>
        <AppHeader />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/contact" component={Contact} />
          <Route path="/confidentialitate" component={Privacy} />
          <Route path="/search" component={Search} />
          <Route path="/stiri/:article_slug" component={Article} />
          <Route path="/stiri" component={Stiri} />
        </Switch>
        <AppFooter />
        <CookieConsent
          location="bottom"
          buttonText="OK"
          style={{ color: "#888", background: "#FFF", border: "2px solid #888", borderRadius: "10px", margin: "10px", width: "auto", right: "0", left: "auto" }}
          buttonStyle={{
            background: "#f4511e",
            color: "#fff",
            fontSize: "13px"
          }}
          expires={1}
          debug={true}
        >
          Acest site foloseste cookies pentru a imbunatatii experienta
          cititorilor. Citeste{" "}
          <Link className="orange-text text-darken-4" to="/confidentialitate">
            Politica de Confidențialitate
          </Link>{" "}
          pentru a intelege cum folosim datele personale.
        </CookieConsent>
      </Router>
    </AdsContext.Provider>
  );
}

export default App;
