import { getCookieConsentValue } from "react-cookie-consent";

export const hasTrackingConsent = () => getCookieConsentValue() === "true";

const GA_ID = "G-FHFHVKW044";
const TRAFIC_ID = "stiridesibiu-ro";
const ADSENSE_CLIENT = "ca-pub-2723789094037700";

let loaded = false;

const addScript = (src, attrs = {}) => {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
  document.head.appendChild(script);
};

// Third-party analytics and advertising scripts. Call only after the visitor
// has accepted cookies; withdrawing consent reloads the page (see AppFooter).
export const loadTracking = () => {
  if (loaded) return;
  loaded = true;

  // Google Analytics
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);

  // trafic.ro
  window.t_rid = TRAFIC_ID;
  window.t_js_dw_time = new Date().getTime();
  window.t_as_js_en = true;
  addScript(
    `https://secure.trafic.ro/js/trafic.js?tk=${Math.pow(10, 16) * Math.random()}&t_rid=${TRAFIC_ID}`
  );
  addScript("https://ts.trafic.ro/js/traficlogger.js");

  // Google AdSense
  addScript("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
    "data-ad-client": ADSENSE_CLIENT,
  });
};
