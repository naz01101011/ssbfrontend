import React, {useContext} from 'react';
import AdsContext from '../context/AdsContext';
import urlFor from './ImgBuilder'

const Rectangle = () => {
    let ads = useContext(AdsContext)
    let publishedBanners = Object.values(ads);
    let currentBanners = publishedBanners.filter(obj => {
        return obj.positionSet[0] === 'tall'
    })
    // console.log(ads)
    // console.log(currentBanners)

    if (currentBanners) {
        return (
            <div className='center grey lighten-4 adzone'>
                <span className='adslabel left-align'>Pubicitate</span>
                {currentBanners.map((ad, index) => {
                    return (
                        <div key={ad._id} >
                            <a href={ad.url} target='_blank' rel="noopener noreferrer">
                                <img className='responsive-img' src={urlFor(ad.bannerImg).width(300).url()} id={ad._id} alt='tall' />
                            </a>
                        </div>
                    )    
                })}
                
            </div>
        );
    } else {
        return (
            <div className='center grey lighten-4 adzone'>
                <span className='adslabel left-align'>Google Ads</span>
            </div>
        );
    }

    
}

export default Rectangle;

