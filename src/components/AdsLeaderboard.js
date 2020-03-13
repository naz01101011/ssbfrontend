import React, {useContext} from 'react';
import AdsContext from '../context/AdsContext';
import urlFor from '../components/ImgBuilder'

const Leaderboard = () => {
    let ads = useContext(AdsContext)
    let hasAds = false;
    let currentBanner = {};

    if (Object.keys(ads).length !== 0) {
        // console.log(ads)
        let publishedBanners = Object.values(ads);
        currentBanner = publishedBanners.find(obj => {
            return obj.title === 'leaderboard'
        })
        hasAds = true;
        // console.log(currentBanner.bannerImg)
    } else {
        console.log('no Ads')
    }

    return (
        <div>
            {hasAds ? (
                <div className='center grey lighten-4 leaderboardzone'>
                    <span className='adslabel left-align'>Pubicitate</span>
                    <div>
                        <a href={currentBanner.url} target='_blank'>
                            <img className='responsive-img' src={urlFor(currentBanner.bannerImg).width(728).height(90).url()} id={currentBanner._id} alt='leaderboard' />
                        </a>
                    </div>
                </div>
            ) : (
                <span></span>
            )}
        </div>
    );
}

export default Leaderboard;

