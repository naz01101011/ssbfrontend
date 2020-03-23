import React from 'react';
import {Link} from 'react-router-dom';

const AppFooter = () => {
    return (
        <footer className='page-footer grey lighten-4'>
            <div className='container'>
                <div className='row'>
                    <div className='col s12 m6'>
                        <Link className='deep-orange-text text-darken-1' to='/' >știri de <b>Sibiu</b></Link>
                        <ul className="">
                            <li>
                                <Link className='grey-text text-darken-2' to='/' >Stiri</Link>
                            </li>
                            <li>
                                <Link className='grey-text text-darken-2' to='/contact'>Contact</Link>
                            </li>
                        </ul>
                    </div>
                    <div className='col s12 m6'>
                        <h6 className='deep-orange-text'>Contactează-ne la</h6>
                        <span className='grey-text text-darken-2'><b>E-mail:</b> redactie@stiridesibiu.ro</span>
                        <br />
                        <span className='grey-text text-darken-2'><b>Telefon:</b> 0746.773.513</span>
                    </div>
                </div>
            </div>
            <div className='footer-copyright'>
                <div className='container deep-orange-text'>
                    © 2020 Stiri de Sibiu 
                    <a className='grey-text text-darken-2 right' href='/sitemap.xml'>Harta Siteului</a>
                </div>
            </div>
        </footer>
    )
}

export default AppFooter;