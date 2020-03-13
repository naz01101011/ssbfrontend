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
        <div className='wrapper'>
            {loaded ? (
                <div>
                    <LatestNews initNews={initNews}/>
                </div>
            ) : (
                <div>
                    <h4 className='center'>Aduc ultimele stiri...</h4>
                </div>
            )}
            
        </div>
    )
}

export default Home;