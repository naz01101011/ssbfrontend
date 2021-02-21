import React, { useEffect, useState } from "react";
import Client from "../components/Client";
import NewsList from "../components/NewsList";
import SideBar from "../components/SideBar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Stiri = () => {
  const [archive, setArchive] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState(new Date());
  const [theDate, setTheDate] = useState();

  useEffect(() => {
    setTheDate(
        value.getFullYear() + '-' + ('0' + (value.getMonth()+1)).slice(-2) + '-' + ('0' + value.getDate()).slice(-2)
    );
    const query =
      '*[_type == "post" && publishedAt >= "' +
      theDate +
      'T00:00:00.000Z" && publishedAt <= "' +
      theDate +
      'T23:59:59.000Z"] | order(publishedAt desc) { _id, title, publishedAt, "categ": categories[0]->title, "authorName": authors[0].author->name, "slug": slug.current}';
    const fetchData = () => {
      Client.fetch(query).then((res) => {
        setArchive(res);
        setLoaded(true);
      });
    };
    fetchData();
    console.log(theDate);
  }, [value, theDate]);

  return (
    <main className="container">
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
