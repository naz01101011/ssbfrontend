import React from 'react';
import {Link} from 'react-router-dom';


const AppHeader = (props) => {
    return (
        <header>
            <nav>
                <div className="nav-wrapper grey lighten-4">
                    <div className='container'>
                        <Link className="brand-logo deep-orange-text text-darken-1" to='/' >știri de <span>Sibiu</span></Link>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li>
                                <Link className='grey-text text-darken-2' to='/' >Acasă</Link>
                            </li>
                            <li>
                                <Link className='grey-text text-darken-2' to='/stiri' >Știri</Link>
                            </li>
                            <li>
                                <Link className='grey-text text-darken-2' to='/contact'>Contact</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>   
    );
}

export default AppHeader;