import React from 'react';
import AdsRectangle from '../components/AdsRectangle';
import NewsList from '../components/NewsList';

const SideBar = (props) => {
    if (props.list) {
        return (
            <div>
                {/* Stuff for CleverNT ads */}
                <ins className='hstpnetworkads' style={{ display: "none", width: "300px", height: "600px" }}>SMTH</ins>

                <AdsRectangle />
                <div className='section'>
                    <h5 className='padding center grey lighten-4  deep-orange-text text-darken-1'>Arhiva recenta</h5>
                    <NewsList list={props.list} images='false' />
                </div>
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