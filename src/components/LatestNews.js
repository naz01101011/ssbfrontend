import React, { useEffect, useState } from 'react';
import NewsList from './NewsList';

const LatestNews = (props) => {
    // console.log(props)
    return (
        <div className='section'>
            <h2 className=''>Ultimele Stiri</h2>
            <NewsList list={props.initNews} />
        </div>
    );
}     

export default LatestNews;