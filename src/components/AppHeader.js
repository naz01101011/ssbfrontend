import React from 'react';
import {Link} from 'react-router-dom';
import SearchBox from './SearchBox';
import AdsLeaderboard from '../components/AdsLeaderboard';


const AppHeader = (props) => {
    return (
        <header>
            <nav>
                <div className="nav-wrapper grey lighten-4">
                  //<div className='topflag'>
                    //<a href='https://www.sibfest.ro' target={'_blank'} rel='noopener noreferrer'> <img src='./fits.png' width={1170} height={90} alt="FITS 2023" /></a>
                  //</div>
                  <div className='container'>
                      <Link className="brand-logo deep-orange-text text-darken-1" to='/' >știri<span style={{color:"grey"}}>de</span>Sibiu<span style={{color:"grey"}}>.ro</span></Link>
                      <ul id="nav-mobile" className="right hide-on-med-and-down">
                          <li><SearchBox /></li>
                          <li>
                              <Link className='grey-text text-darken-2' to='/' >Acasă</Link>
                          </li>
                          <li>
                              <Link className='grey-text text-darken-2' to='/stiri' >Arhivă</Link>
                          </li>
                          <li>
                              <Link className='grey-text text-darken-2' to='/contact'>Contact</Link>
                          </li>
                      </ul>
                  </div>
                </div>
            </nav>
            <AdsLeaderboard position='large-top-leaderboard' googleads='false'/>
        </header>
    );
}

export default AppHeader;
