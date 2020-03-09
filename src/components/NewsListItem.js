import React from 'react';
import {Link} from 'react-router-dom';
import urlFor from '../components/ImgBuilder'
import SerializeDate from '../serializers/SerializeDate'

const NewsListItem = (props) => {
    // console.log(props.image)
    
    return (
        <li className='newslistitem'>
            
            <Link to={'/' + props.slug}>
                <div className='section'>
                    <div className='row valign-wrapper'>
                        <div className='col s2'>
                            <img className='responsive-img' src={urlFor(props.image).height(130).quality(30).url()} />
                        </div>
                        <div className='col s10'>
                            <span>{SerializeDate(props.date)}</span>
                            <span>{props.cat}</span>
                            <h4 className='left-align'>{props.title}</h4>
                        </div>
                    </div>
                </div>
            </Link>
            
            <div className='divider'></div>
        </li>
        
    )
} 

export default NewsListItem;