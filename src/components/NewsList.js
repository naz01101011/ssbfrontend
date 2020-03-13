import React from 'react';
import NewsListItem from './NewsListItem';

const NewsList = (props) => {
    // console.log(props)
    return (
        <div>
            <ul className='newslist'>
            {props.list.map(item => (
                <NewsListItem title={item.title} key={item._id} slug={item.slug} image={item.mainImage} cat={item.categ} date={item.publishedAt}/>
            ))}
            </ul>
        </div> 
    )
}

export default NewsList;