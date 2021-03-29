import React, {useEffect, useState} from 'react';
import LatestNews from '../components/LatestNews';
import Highlight from '../components/HighlightNews';
import NewsList from '../components/NewsList';
import Client from '../components/Client';
import SideBar from '../components/SideBar';

const Home = () => {

    const [initNews, setInitNews] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const latestNewsData = initNews.slice(0, 6);
    const highlightNewsData = initNews.slice(6, 7);
    const blogListData = initNews.slice(8, 20);
    const olderArticles = initNews.slice(21, 30)

    useEffect(() => {

        const query = '*[_type == "post"] | order(publishedAt desc) { _id, title, mainImage, publishedAt, "categ": categories[0]->title, "authorName": authors[0].author->name, "slug": slug.current, excerpt, pinned }[0...30]';
        const fetchData = () => {
            Client.fetch(query)
                .then(res => {
                    // console.log(res);
                    setInitNews(res)
                    setLoaded(true)
                })
        }

        // console.log(initNews)


        fetchData();
    }, [])

    return (
        <main className='wrapper'>
            {loaded ? (
                <div>
                    <LatestNews data={latestNewsData}/>
                    <Highlight data={highlightNewsData}/>
                    
                    <div className='container section row'>
                        <div className='col s12 m8'>
                            <NewsList list={blogListData} images='true' excerpt='true'/>
                        </div>
                        <div className='col s12 m4'>
                            <SideBar list={olderArticles}/>
                        </div>
                    </div>
                    
                </div>
            ) : (
                <div>
                    <h4 className='center'>Aduc ultimele știri...</h4>
                </div>
            )}
            
        </main>
    )
}

export default Home;
