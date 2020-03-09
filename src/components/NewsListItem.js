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
} 

export default NewsListItem;