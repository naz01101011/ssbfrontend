import React from 'react';
import {Link} from 'react-router-dom';
import urlFor from '../components/ImgBuilder';
import SerializeDate from '../serializers/SerializeDate';

const Highlight = (props) => {
    let highlightPost = props.data[0];
    // console.log(highlightPost)

    return (
        <div className='grey lighten-2'>
            <div className='container section'>
                <Link className='link' to={'/' + highlightPost.slug}>
                    <div className='row'>
                        <div className='col m12 l8'>
                            <span className='info grey lighten-4 deep-orange-text'>{SerializeDate(highlightPost.publishedAt)}  <span className='deep-orange darken-1'>{highlightPost.categ}</span></span>
                           
                            <h3 className="left-align">
                                {highlightPost.title}
                            </h3>
                            {/* <div className='main-story-excerpt'>
                                <SerializeText body={highlightPost.excerpt} id={highlightPost._id} />
                            </div> */}
                        </div>
                        <div className="col m12 l4">
                            <img className='responsive-img' src={urlFor(highlightPost.mainImage).width(400).height(300).fit('crop').crop('focalpoint').quality(30).url()} alt={highlightPost.mainImage.alt} />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Highlight;