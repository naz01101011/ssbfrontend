import React from 'react';
import {Link} from 'react-router-dom';
import NewsList from './NewsList';
import urlFor from '../components/ImgBuilder';
import SerializeDate from '../serializers/SerializeDate';
import SerializeText from '../serializers/SerializeText';
import AdsLeaderboard from '../components/AdsLeaderboard';
import NewsListItem from './NewsListItem';


const LatestNews = (props) => {
    // console.log(props)
    let mainPost = props.data[0]
    let nextPosts = props.data.slice(1, 6); 

    // check for nextPosts post that has pinned true, if existing
    let pinnedPost = nextPosts.filter(post => post.pinned === true);
    console.log(pinnedPost)

    let listPosts = nextPosts.filter(post => post.pinned !== true);
    console.log(listPosts)

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
                                    <span className='info grey lighten-3 deep-orange-text text-darken-1'>{SerializeDate(mainPost.publishedAt)} <span className='grey'>{mainPost.authorName}</span></span>
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

                {pinnedPost.length > 0 &&
                <div className="pinnedPost">
                    <NewsListItem  title={pinnedPost[0].title} key={pinnedPost[0]._id} slug={pinnedPost[0].slug} image={pinnedPost[0].mainImage} cat={pinnedPost[0].categ} author={pinnedPost[0].authorName} date={pinnedPost[0].publishedAt} hasImages={false} hasExcerpt={false} excerpt={pinnedPost[0].excerpt}/>
                </div>
                }

                    <NewsList list={nextPosts} images='false'/>
                </div>
            </div>
        </div>
        
    );
}     

export default LatestNews;
