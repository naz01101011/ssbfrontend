import React from 'react';
import {Link} from 'react-router-dom';
import urlFor from '../components/ImgBuilder'
import SerializeDate from '../serializers/SerializeDate'

const NewsListItem = (props) => {
    // console.log(props.image)
    
    return (
        <li className='newslistitem'>
            
            <Link to={'/' + props.slug}>
                <div className='card'>
                    <div className='card-content'>
                        <img src={urlFor(props.image).width(200).url()} />
                        <span>{SerializeDate(props.date)}</span>
                        <span>{props.cat}</span>
                        <h4 className='left-align'>{props.title}</h4>
                    </div>
                </div>
            </Link>
            
            
        </li>
    )
} 

export default NewsListItem;