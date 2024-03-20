import React, {useEffect, useState} from 'react';
import LatestNews from '../components/LatestNews';
import Highlight from '../components/HighlightNews';
import NewsList from '../components/NewsList';
import Client from '../components/Client';
import SideBar from '../components/SideBar';
import Helmet from 'react-helmet';

const Home = () => {

    const [latestNewsData, setLatestNewsData] = useState('');
    const [highlightNewsData, setHighlightNewsData] = useState('');
    const [blogListData, setBlogListData] = useState('');
    const [olderArticles, setOlderArticles] = useState('');
    const [pinnedPost, setPinnedPost] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        const query = '*[_type == "post"] | order(publishedAt desc) { _id, title, mainImage, publishedAt, "categ": categories[0]->title, "authorName": authors[0].author->name, "slug": slug.current, excerpt, pinned }[0...30]';
        const fetchData = () => {
            Client.fetch(query)
                .then(res => {
                    // console.log(res);
                    const pinned = res.find(post => post.pinned === true);
                    setPinnedPost(pinned);
                    const blogNews = res.filter(post => post.pinned !== true);
                    if (pinned !== undefined) {
                        setLatestNewsData(blogNews.slice(0, 5));
                        setHighlightNewsData(blogNews.slice(5, 6));
                        setBlogListData(blogNews.slice(6, 19));
                        setOlderArticles(blogNews.slice(19, 29));
                    } else {
                        setLatestNewsData(blogNews.slice(0, 6));
                        setHighlightNewsData(blogNews.slice(6, 7));
                        setBlogListData(blogNews.slice(7, 20));
                        setOlderArticles(blogNews.slice(20, 30));
                    }
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
                </div>
            )}

        </main>
    )
}

export default Home;
