import React from 'react';
import AdsRectangle from '../components/AdsRectangle';
import NewsList from '../components/NewsList';

const SideBar = (props) => {
    if (props.list) {
        return (
            <div>
                <AdsRectangle />
                <NewsList list={props.list} images='false'/>
            </div>
        )
    } else {
        return (
            <div>
                <AdsRectangle />
            </div>
        )
    }
    
}

export default SideBar;