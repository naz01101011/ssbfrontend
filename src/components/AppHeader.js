import React from 'react';
import {Link} from 'react-router-dom';


const AppHeader = (props) => {
    return (
        <header>
            <div className='container'>
                <nav>
                    <div className="nav-wrapper pink darken-4">
                        <a className="brand-logo left">SSB</a>
                        <ul id="nav-mobile" className="right">
                            <li>
                                <Link  to='/' >Stiri</Link>
                            </li>
                            <li>
                                <Link to='/contact'>Contact</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>   
    );
}

export default AppHeader;