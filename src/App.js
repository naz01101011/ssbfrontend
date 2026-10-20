import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import Home from "./pages/Home";
import Stiri from "./pages/Stiri";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Article from "./pages/Article";
import Search from "./pages/Search";
import AdsContext from "./context/AdsContext";
import Client from "./components/Client";
import AppFooter from "./components/AppFooter";
import CookieConsent from "react-cookie-consent";
import ConsentContext from "./context/ConsentContext";
import { hasTrackingConsent, loadTracking } from "./consent";
import { Link } from "react-router-dom";

function App() {
  const adsquery = '*[_type == "banner"] | order(publishedAt desc)';

  const [ads, setAds] = useState({});
  const [consent, setConsent] = useState(hasTrackingConsent);

  const fetchAds = () => {
    Client.fetch(adsquery).then((res) => setAds(res));
  };

  // console.log(ads)

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (consent) loadTracking();
  }, [consent]);

  return (
    <AdsContext.Provider value={ads}>
      <ConsentContext.Provider value={consent}>
      <Router>
        <AppHeader />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/contact" component={Contact} />
          <Route path="/confidentialitate" component={Privacy} />
          <Route path="/cookies" component={Cookies} />
          <Route path="/search" component={Search} />
          <Route path="/stiri/:article_slug" component={Article} />
          <Route path="/stiri" component={Stiri} />
          <Route path='/sitemap' component={() => {
              window.location.href = 'https://sitemap.stiridesibiu.ro/sitemap';
              return null;
          }}/>
        </Switch>
        <AppFooter />
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          enableDeclineButton
          declineButtonText="Refuz"
          onAccept={() => setConsent(true)}
          onDecline={() => setConsent(false)}
          style={{ color: "#888", background: "#FFF", border: "2px solid #888", borderRadius: "10px", margin: "10px", width: "auto", right: "0", left: "auto" }}
          buttonStyle={{
            background: "#f4511e",
            color: "#fff",
            fontSize: "13px"
          }}
          declineButtonStyle={{
            background: "#fff",
            color: "#888",
            border: "1px solid #888",
            fontSize: "13px"
          }}
          expires={365}
          debug={false}
        >
          Acest site foloseste cookies pentru statistici si publicitate
          doar daca esti de acord. Poti refuza fara a pierde accesul la continut. Vezi aici{" "}
          <Link className="orange-text text-darken-4" to="/cookies">
            Politica de Cookies
          </Link>.{" "}
          Citeste si{" "}
          <Link className="orange-text text-darken-4" to="/confidentialitate">
            Politica de Confidențialitate
          </Link>{" "}
          pentru a intelege cum folosim datele personale.
        </CookieConsent>
      </Router>
      </ConsentContext.Provider>
    </AdsContext.Provider>
  );
}

export default App;
