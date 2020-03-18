import React from 'react';
import {Link} from 'react-router-dom';
import urlFor from '../components/ImgBuilder'
import SerializeDate from '../serializers/SerializeDate'

const NewsListItem = (props) => {
    // console.log(props.image)

    if (!props.hasImages) {
        return (
            <li className='newslistitem'>
                
                <Link className='post-link' to={'/' + props.slug}>
                    <div className='section'>
                        <div className='s'>
                                <span>{SerializeDate(props.date)}</span>
                                <span>{props.cat}</span>
                                <h5>{props.title}</h5>
                        </div>
                    </div>
                </Link>
                
                <div className='divider'></div>
            </li>
            
        )
    } else {
        return (
            <li className='newslistitem'>
                
                <Link className='post-link' to={'/' + props.slug}>
                    <div className='section row'>
                        <div className='col s4'>
                            <img className='responsive-img' src={urlFor(props.image).width(400).height(300).fit('crop').crop('focalpoint').quality(30).url()} alt={props.image.alt} />
                        </div>
                        <div className='col s8'>
                                <span>{SerializeDate(props.date)}</span>
                                <span>{props.cat}</span>
                                <h5>{props.title}</h5>
                        </div>
                    </div>
                </Link>
                
                <div className='divider'></div>
            </li>
            
        )
    }
    
    
} 

export default NewsListItem;