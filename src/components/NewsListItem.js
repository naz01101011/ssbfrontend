import React from 'react';
import {Link} from 'react-router-dom';
import urlFor from '../components/ImgBuilder'
import SerializeDate from '../serializers/SerializeDate'

const NewsListItem = (props) => {
    // console.log(props.image)

    if (!props.hasImages) {
        return (
            <li className='newslistitem'>
                
                <Link className='link' to={'/' + props.slug}>
                    <div className='section'>
                        <div className='s'>
                                <span className='info grey lighten-4  deep-orange-text text-darken-1'>{SerializeDate(props.date)} <span className='deep-orange darken-1'>{props.cat}</span></span>
                                
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
                
                <Link className='link' to={'/' + props.slug}>
                    <div className='section row'>
                        <div className='col s4'>
                            <img className='responsive-img' src={urlFor(props.image).width(400).height(300).fit('crop').crop('focalpoint').quality(30).url()} alt='' />
                        </div>
                        <div className='col s8'>
                                <span className='info grey lighten-4  deep-orange-text text-darken-1'>{SerializeDate(props.date)} <span className='deep-orange darken-1'>{props.cat}</span></span>
                                
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