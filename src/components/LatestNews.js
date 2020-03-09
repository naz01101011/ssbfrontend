import React from 'react';
import {Link} from 'react-router-dom';
import NewsList from './NewsList';
import urlFor from '../components/ImgBuilder'
import SerializeDate from '../serializers/SerializeDate'


const LatestNews = (props) => {
    // console.log(props)
    let mainPost = props.initNews[0]
    let nextPosts = props.initNews.slice(1, 6); 

    // console.log(mainPost)
    return (
        <div className='row section'>
            <div className="col m12 l8">
                <Link to={'/' + mainPost.slug}>
                    <div>
                        <div className="featImg">
                            <img className='responsive-img' src={urlFor(mainPost.mainImage).width(800).height(400).fit('crop').crop('focalpoint').quality(30).url()} />
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
            <div className="col m12 l4">
                <NewsList list={nextPosts} />
            </div>
        </div>
    );
}     

export default LatestNews;