import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import LatestNews from './LatestNews';

const Home = () => {
    const API = 'https://w58sh5v7.apicdn.sanity.io/v1/data/query/production?query=';
    const query = '*[_type == "post"] | order(_createdAt desc) { _id, title, "categ": categories[0]->title, "slug": slug.current }[0...20]';

    const [initNews, setInitNews] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const fetchData = () => {
      Axios.get(API + query)
        .then(res => {
            // console.log(res.data.result);
            setInitNews(res.data.result);
            setLoaded(true);
        })
    }

    // console.log(initNews)

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className='container'>
            {loaded ? (
                <LatestNews initNews={initNews}/>
            ) : (
                <h2 className='center'>Aduc ultimele stiri...</h2>
            )}
            
        </div>
    )
}

export default Home;