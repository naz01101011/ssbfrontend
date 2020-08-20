import React from 'react';
import {Link} from 'react-router-dom';
import NewsList from './NewsList';
import urlFor from '../components/ImgBuilder';
import SerializeDate from '../serializers/SerializeDate';
import SerializeText from '../serializers/SerializeText';
import AdsLeaderboard from '../components/AdsLeaderboard';


const LatestNews = (props) => {
    // console.log(props)
    let mainPost = props.data[0]
    let nextPosts = props.data.slice(1, 6); 

    // console.log(mainPost)
    return (
        <div className='container'>
            <div className='row section flex'>
                <div className="col m12 l8 main-flex">
                    <div className='main-story'>
                        <Link className='link' to={'/stiri/' + mainPost.slug}>
                            <div>
                                <div className="featImg">
                                    <img className='responsive-img' src={urlFor(mainPost.mainImage).width(900).height(470).fit('crop').crop('focalpoint').quality(30).url()} alt={mainPost.mainImage.alt} />
                                </div>
                                <div>
                                    <span className='info grey lighten-3 deep-orange-text text-darken-1'>{SerializeDate(mainPost.publishedAt)} <span className='deep-orange darken-1'>{mainPost.categ}</span></span>
                                    <h3 className="left-align">
                                        {mainPost.title}
                                    </h3>
                                    <div className='main-story-excerpt'>
                                        <SerializeText body={mainPost.excerpt} id={mainPost._id} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className='mid-lb'>
                        <AdsLeaderboard position='mid-leaderboard' googleads='true'/>
                    </div>
                </div>
                <div className="col m12 l4">
                    <NewsList list={nextPosts} images='false'/>
                </div>
            </div>
        </div>
        
    );
}     

export default LatestNews;