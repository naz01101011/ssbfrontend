import React, { useEffect, useState } from "react";
import Client from "../components/Client";
import NewsList from "../components/NewsList";
import SideBar from "../components/SideBar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Helmet } from 'react-helmet-async';

const Stiri = () => {
  const [archive, setArchive] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState(new Date());
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dayStart = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    const dayEnd = new Date(value.getFullYear(), value.getMonth(), value.getDate() + 1);
    const query =
      '*[_type == "post" && publishedAt >= $start && publishedAt < $end] | order(publishedAt desc) { _id, title, publishedAt, "categ": categories[0]->title, "authorName": authors[0].author->name, "slug": slug.current}';
    const fetchData = () => {
      Client.fetch(query, { start: dayStart.toISOString(), end: dayEnd.toISOString() })
        .then((res) => {
          setArchive(res);
          setLoaded(true);
        })
        .catch((err) => {
          setHasError(true);
          setError(err);
        });
    };
    fetchData();
  }, [value]);

  if (hasError) {
    return (
      <main className="container section">
        <h3>Error!</h3>
        <p>{String(error)}</p>
      </main>
    )
  }

  return (
    <main className="container">
            <Helmet>
                    <title>Arhiva Stiri de Sibiu</title>
                    <meta name="description" content="Cauta articolele publicate de Stiri de Sibiu" />
                    <meta name="keywords" content="stiri sibiu arhiva" />
                    <link rel="canonical" href="https://www.stiridesibiu.ro/stiri" />
            </Helmet>
      {loaded ? (
        <div>
          <div className="row section">
            <div className="col s12 m8">
              <h4>
                Știri publicate în data de {('0' + value.getDate()).slice(-2)}.
                {('0' + (value.getMonth()+1)).slice(-2)}.{value.getFullYear()}
              </h4>
              <NewsList list={archive} images="false" />
            </div>
            <div className="col s12 m4">
              <h5>Filtrează știrile după dată</h5>
              <Calendar
                onChange={setValue}
                value={value}
                calendarType="ISO 8601"
                locale="ro-RO"
              />
              <SideBar />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="center">Aduc din arhivă...</h4>
        </div>
      )}
    </main>
  );
};

export default Stiri;
