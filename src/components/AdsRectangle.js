import React, { useContext } from 'react';
import AdsContext from '../context/AdsContext';
import urlFor from './ImgBuilder';
import AdSense from 'react-adsense';
import ErrorBoundary from './ErrorBoundary';
import ConsentContext from '../context/ConsentContext';

const Rectangle = () => {
    let ads = useContext(AdsContext)
    const consent = useContext(ConsentContext)
    let publishedBanners = Object.values(ads);
    let currentBanners = publishedBanners.filter(obj => {
        return obj.positionSet[0] === 'rectangle'
    })
    // console.log(ads)
    // console.log(currentBanners.length)

    const googleAds = consent && (
        <>
            <span className='adlabel left-align'>Publicitate Google</span>
            <ErrorBoundary>
                <AdSense.Google
                    client='ca-pub-2723789094037700'
                    slot='4430780933'
                    format='auto'
                    style={{ display: 'block' }}
                    responsive='true'
                />
            </ErrorBoundary>
            <br />
            <ErrorBoundary>
                <AdSense.Google
                    client='ca-pub-2723789094037700'
                    slot='7132965898'
                    format='auto'
                    style={{ display: 'block' }}
                    responsive='true'
                />
            </ErrorBoundary>
        </>
    );

    if (currentBanners.length !== 0) {
        return (
            <div className='center grey lighten-4 adcontainer'>
                <span className='adlabel left-align'>Publicitate</span>
                {currentBanners.map((ad, index) => {
                    return (
                        <div key={ad._id} >
                            <a href={ad.url} target='_blank' rel="noopener noreferrer">
                                <img className='responsive-img' src={urlFor(ad.bannerImg).width(300).url()} id={ad._id} alt='tall' />
                            </a>
                        </div>
                    )
                })}
                {googleAds}
            </div>
        );
    }

    if (!consent) return null;

    return (
        <div className='center grey lighten-4 adcontainer'>
            {googleAds}
        </div>
    );
}

export default Rectangle;
