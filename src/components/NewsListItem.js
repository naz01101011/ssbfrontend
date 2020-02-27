import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';


const NewsListItem = (props) => {
    // console.log(props)
    return (
        <li className='newslistitem'>
            
            <Link to={'/' + props.slug}>
                <div className='card'>
                    <div className='card-content'>
                        <h4 className='left-align'>{props.title}</h4>
                    </div>
                </div>
            </Link>
            
            
        </li>
    )
} 

export default NewsListItem;