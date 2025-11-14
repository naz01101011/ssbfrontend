import React, { useEffect, useState } from 'react';
import Client from '../components/Client'
//import SerializeText from '../serializers/SerializeText'
import SerializeDate from '../serializers/SerializeDate'
import urlFor from '../components/ImgBuilder'
import SideBar from '../components/SideBar';
import BlockContent from '@sanity/block-content-to-react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import getYouTubeId from 'get-youtube-id';
import YouTube from 'react-youtube';
import ReactPlayer from "react-player"
import AdsLeaderboard from '../components/AdsLeaderboard';

const Article = (props) => {
    const [hasError, setHasError] = useState(false);
    const [body, setBody] = useState('');
    const [excerpt, setExcerpt] = useState('No Excerpt by default');
    //const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [cat, setCat] = useState('');
    const [img, setImg] = useState({});
    const [articleUrl, setArticleUrl] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchData = () => {
            let slug = props.match.params.article_slug
            let query = '*[slug.current == "' + slug + '"]{ _id, title, mainImage, publishedAt, "categ": categories[0]->title, body, excerpt}';

            Client.fetch(query)
                .then(res => {
                    setTitle(res[0].title)
                    setBody(res[0].body)
                    if (typeof res[0].excerpt != 'undefined') {
                        setExcerpt(res[0].excerpt[0].children[0].text)
                    } else {
                        setExcerpt('No excerpt!')
                    }
                    //setId(res[0]._id)
                    setDate(SerializeDate(res[0].publishedAt))
                    setCat(res[0].categ)
                    setImg(res[0].mainImage)
                    setArticleUrl("https://www.stiridesibiu.ro/stiri/" + slug)
                    setLoaded(true);
                })
                .catch(err => {
                    setHasError(true);
                    setError(err)
                })
        };

        fetchData();
    }, [props]);

    const serializers = {
        types: {
            mainImage: props => (
                <div style={{ maxWidth: 'max-content', marginLeft: 'auto', marginRight: 'auto' }}>
                    <img className='responsive-img' src={urlFor(props.node).height(450).fit('crop').crop('focalpoint').quality(60).url()} alt={props.node.alt} key={Math.random()} />
                    <span className='info grey lighten-4 text-darken-1' style={{ display: 'block' }}>{props.node.caption}</span>
                </div>
            ),
            youtube: ({ node }) => {
                const { url } = node
                const id = getYouTubeId(url)
                return (<YouTube videoId={id} />)
            },
            fbvideo: ({ node }) => {
                const {url} = node
                return (<ReactPlayer
                    url={url}
                    controls
                  />)
            }
        },
        marks: {
            strong: props => (
                <span style={{ fontWeight: 'bold' }}>{props.children}</span>
            ),
            link: props => (
                <a href={props.mark.href} rel="dofollow">{props.children}</a>
            )
        }

    }

    if (hasError) {
        return (
            <div className='container section'>
                <h3>Error!</h3>
                <p>{error}</p>
            </div>
        )
    } else {
        return (
            <main className='container section'>

                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={excerpt} />
                    <meta name="keywords" content={title} />
                    <link rel="canonical" href={articleUrl} />

                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={articleUrl} />
                    <meta property="og:title" content={title} />
                    <meta property="og:image" content={urlFor(img).width(900).height(450).fit('crop').crop('focalpoint').quality(60).url()} />
                    <meta property="og:description" content={excerpt} />
                </Helmet>

                {loaded ? (
                    <div>
                        <span><Link to='/'>Știri de Sibiu</Link> > Știri</span>
                        <h3>{title}</h3>

                        <div className='row section'>
                            <div className='col s12 m8'>
                                {img ? (
                                    <img className='responsive-img' width={900} height={540} src={urlFor(img).width(900).height(450).fit('crop').crop('focalpoint').quality(60).url()} alt={img.alt} />
                                ) : (
                                    <span className='info grey lighten-4  grey-text text-darken-2'>Articol fără imagine</span>
                                )}


                                <span className='info grey lighten-4  deep-orange-text text-darken-1'>{date} <span className='deep-orange darken-1'>{cat}</span></span>

                                <AdsLeaderboard position='mid-leaderboard' googleads='true'/>

                                <BlockContent blocks={body} serializers={serializers} />
                            </div>
                            <div className='col s12 m4'>
                                <SideBar />
                            </div>
                        </div>
                    </div>
                ) : <h3>Aduc Stirea...</h3>}

            </main>
        )
    }
}

export default Article;
