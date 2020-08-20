import React, {useContext} from 'react';
import AdsContext from '../context/AdsContext';
import urlFor from '../components/ImgBuilder'

const Leaderboard = (props) => {
    // let position = 'mid-leaderboard'
    let ads = useContext(AdsContext)
    let publishedBanners = Object.values(ads);
    let currentBanner = publishedBanners.find(obj => {
        return obj.positionSet[0] === props.position
    });
    // console.log(ads)
    // console.log(currentBanner)

    if (currentBanner) {
        console.log(currentBanner)
        return (
            <div className='center grey lighten-4 adcontainer'>
                <span className='adlabel left-align black-text'>Pubicitate</span>
                <div>
                    <a href={currentBanner.url} target='_blank' rel="noopener noreferrer">
                        <img className='responsive-img' src={urlFor(currentBanner.bannerImg).width(728).height(90).url()} id={currentBanner._id} alt='leaderboard' />
                    </a>
                </div>
            </div>
        );
    } else {
        if (props.googleads == 'true') {
            return (
                <div className='center grey lighten-4 adcontainer'>
                    <span className='adlabel left-align'>Google Ads</span>
                </div>
            );
        } else {
            console.log("No published leaderboard")
            return null;
        }   
    }

    
}

export default Leaderboard;

