import React, {useEffect, useState} from 'react';
import LatestNews from '../components/LatestNews';
import Highlight from '../components/HighlightNews';
import NewsList from '../components/NewsList';
import Client from '../components/Client';
import SideBar from '../components/SideBar';
import Helmet from 'react-helmet';

const Home = () => {

    const [initNews, setInitNews] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const pinnedPost = initNews.find(post => post.pinned === true);
    const blogNews = initNews.filter(post => post.pinned !== true);

    let latestNewsData = blogNews.slice(0, 6);
    let highlightNewsData = blogNews.slice(6, 7);
    let blogListData = blogNews.slice(7, 20);
    let olderArticles = blogNews.slice(20, 30)

    if (pinnedPost !== undefined) {
        latestNewsData = blogNews.slice(0, 5);
        highlightNewsData = blogNews.slice(5, 6);
        blogListData = blogNews.slice(6, 19);
        olderArticles = blogNews.slice(19, 29)
    }

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
            <Helmet>
                    <title>Stiri de Sibiu</title>
                    <meta name="description" content="Pagina principala Stiri de Sibiu. Cele mai importante stiri din judetul Sibiu, oferite respectand etica si deontologia jurnalistica." />
                    <meta name="keywords" content="stiri sibiu jurnalism romania" />
                    <link rel="canonical" href="https://www.stiridesibiu.ro" />
            </Helmet>
            {loaded ? (
                <div>
                    <LatestNews data={latestNewsData} pinned={pinnedPost}/>
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
