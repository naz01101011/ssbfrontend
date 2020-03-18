import React, {useEffect, useState} from 'react';
import LatestNews from '../components/LatestNews';
import Highlight from '../components/HighlightNews';
import NewsList from '../components/NewsList';
import Client from '../components/Client';

const Home = () => {
    const query = '*[_type == "post"] | order(publishedAt desc) { _id, title, mainImage, publishedAt, "categ": categories[0]->title, "slug": slug.current, excerpt }[0...20]';

    const [initNews, setInitNews] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const fetchData = () => {
        Client.fetch(query)
            .then(res => {
                // console.log(res);
                setInitNews(res)
                setLoaded(true)
            })
    }

    // console.log(initNews)

    const latestNewsData = initNews.slice(0, 6);
    const highlightNewsData = initNews.slice(6, 7);
    const blogListData = initNews.slice(8, 20);

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className='wrapper'>
            {loaded ? (
                <div>
                    <LatestNews data={latestNewsData}/>
                    <Highlight data={highlightNewsData}/>
                    <div className='container section row'>
                        <div className='col s12 m8'>
                            <NewsList list={blogListData} images='false'/>
                        </div>
                        <div className='col s12 m4'></div>
                    </div>
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