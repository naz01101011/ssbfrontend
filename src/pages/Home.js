import React, {useEffect, useState} from 'react';
import LatestNews from '../components/LatestNews';
import Client from '../components/Client'

const Home = () => {
    const query = '*[_type == "post"] | order(publishedAt desc) { _id, title, mainImage, publishedAt, "categ": categories[0]->title, "slug": slug.current }[0...20]';

    const [initNews, setInitNews] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const fetchData = () => {
        Client.fetch(query)
            .then(res => {
                // console.log(res);
                setInitNews(res);
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