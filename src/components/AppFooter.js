import React from "react";
import { Link } from "react-router-dom";
import AdsLeaderboard from "../components/AdsLeaderboard";

const AppFooter = () => {
  return (
    <footer className="page-footer grey lighten-4">
      <AdsLeaderboard position="large-bot-leaderboard" googleads="true" />
      <div className="container">
        <div className="row">
          <div className="col s12 m6">
            <Link className="deep-orange-text text-darken-1" to="/">
              știri de <b>Sibiu</b>
            </Link>
            <ul className="">
              <li>
                <Link
                  className="grey-text text-darken-2"
                  to="/confidentialitate"
                >
                  Politică de Confidențialitate
                </Link>
              </li>
              <li>
                <Link className="grey-text text-darken-2" to="/cookies">
                  Politică de Cookies
                </Link>
              </li>
              <li>
                <Link className="grey-text text-darken-2" to="/">
                  Acasă
                </Link>
              </li>
              <li>
                <Link className="grey-text text-darken-2" to="/stiri">
                  Știri
                </Link>
              </li>
              <li>
                <Link className="grey-text text-darken-2" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col s12 m6">
            <h6 className="deep-orange-text">Contactează-ne la</h6>
            <span className="grey-text text-darken-2">
              <b>E-mail:</b> redactie@stiridesibiu.ro
            </span>
            <br />
            <span className="grey-text text-darken-2">
              <b>Telefon:</b> 0746.773.513
            </span>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container deep-orange-text">
          © 2021 Stiri de Sibiu
          <Link
            className="grey-text text-darken-2 right"
            to="/confidentialitate"
          >
            Politică de Confidențialitate
          </Link>
          <span className="right" style={{ marginRight: 5, marginLeft: 5 }}>
            {" "}
            |{" "}
          </span>
          <Link className="grey-text text-darken-2 right" to="/cookies">
            Politică de Cookies
          </Link>
          <span className="right" style={{ marginRight: 5, marginLeft: 5 }}>
            {" "}
            |{" "}
          </span>
          <Link className="grey-text text-darken-2 right" to="https://sitemap.stiridesibiu.ro/sitemap">
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
