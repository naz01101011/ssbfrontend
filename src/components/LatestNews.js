import React from 'react';
import {Link} from 'react-router-dom';
import NewsList from './NewsList';
import urlFor from '../components/ImgBuilder'
import SerializeDate from '../serializers/SerializeDate'
import AdsLeaderboard from '../components/AdsLeaderboard';


const LatestNews = (props) => {
    // console.log(props)
    let mainPost = props.initNews[0]
    let nextPosts = props.initNews.slice(1, 6); 

    // console.log(mainPost)
    return (
        <div className='container'>
            <div className='row section flex'>
                <div className="col m12 l8">
                    <div>
                        <Link to={'/' + mainPost.slug}>
                            <div>
                                <div className="featImg">
                                    <img className='responsive-img' src={urlFor(mainPost.mainImage).width(900).height(470).fit('crop').crop('focalpoint').quality(30).url()} alt={mainPost.mainImage.alt} />
                                </div>
                                <div>
                                    <span>{SerializeDate(mainPost.publishedAt)}</span>
                                    <span>{mainPost.categ}</span>
                                    <h3 className="left-align">
                                        {mainPost.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div>
                        <AdsLeaderboard />
                    </div>
                </div>
                <div className="col m12 l4">
                    <NewsList list={nextPosts} />
                </div>
            </div>
        </div>
        
    );
}     

export default LatestNews;