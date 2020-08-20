import React from 'react';
import AdsRectangle from '../components/AdsRectangle';
import NewsList from '../components/NewsList';

const SideBar = (props) => {
    return (
        <div>
            <AdsRectangle />
            <NewsList list={props.list} images='false'/>
        </div>
    )
}

export default SideBar;