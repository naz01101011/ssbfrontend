import React from 'react';
import {Link} from 'react-router-dom';
import NewsList from './NewsList';
import urlFor from '../components/ImgBuilder'
import SerializeDate from '../serializers/SerializeDate'


const LatestNews = (props) => {
    // console.log(props)
    let mainPost = props.initNews[0]
    let nextPosts = props.initNews.slice(1); 

    // console.log(mainPost)
    return (
        <div className='row section'>
            <div className="col s12 m8 mainarticle">
                <Link to={'/' + mainPost.slug}>
                    <div className="card">
                        <div className="featImg">
                            <img src={urlFor(mainPost.mainImage).width(500).quality(30).url()} />
                        </div>
                        <div className="card-content">
                            <span>{SerializeDate(mainPost.publishedAt)}</span>
                            <span>{mainPost.categ}</span>
                            <h2 className="left-align">
                                {mainPost.title}
                            </h2>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="col s12 m4 mainarticlelist">
                <NewsList list={nextPosts} />
            </div>
        </div>
    );
}     

export default LatestNews;