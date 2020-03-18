import React, {useContext} from 'react';
import AdsContext from '../context/AdsContext';
import urlFor from '../components/ImgBuilder'

const Leaderboard = () => {
    let ads = useContext(AdsContext)
    let publishedBanners = Object.values(ads);
    let currentBanner = publishedBanners.find(obj => {
        return obj.positionSet[0] === 'mid-leaderboard'
    })
    // console.log(ads)
    // console.log(currentBanner)

    if (currentBanner) {
        return (
            <div className='center grey lighten-4 leaderboardzone'>
                <span className='adslabel left-align'>Pubicitate</span>
                <div>
                    <a href={currentBanner.url} target='_blank' rel="noopener noreferrer">
                        <img className='responsive-img' src={urlFor(currentBanner.bannerImg).width(728).height(90).url()} id={currentBanner._id} alt='leaderboard' />
                    </a>
                </div>
            </div>
        );
    } else {
        return (
            <div className='center grey lighten-4 leaderboardzone'>
                <span className='adslabel left-align'>Google Ads</span>
            </div>
        );
    }

    
}

export default Leaderboard;

