import React from 'react';
import {Link} from 'react-router-dom';
import SideBar from '../components/SideBar';
import ContactForm from '../components/ContactForm';
import Helmet from 'react-helmet';

const Contact = () => {
    
    return (
        <main className='container'>
            <Helmet>
                    <title>Contact Stiri de Sibiu</title>
                    <meta name="description" content="Contacteaza-ne in legatura cu orice nelamurire, sugestie sau intrebare." />
                    <meta name="keywords" content="stiri sibiu contact email telefon" />
                    <link rel="canonical" href="https://www.stiridesibiu.ro/contact" />
            </Helmet>
            <div className='section'>
                <span><Link to='/'>Știri de Sibiu</Link> > Contact</span>
                <h3>Contactează-ne aici</h3>
                <div className='row'>
                    <div className='col s12 m8'>
                        <ContactForm />
                        <h4>Email</h4>
                        <p>redactie@stiridesibiu.ro</p>
                        <h4>Telefon</h4>
                        <p>0746 773 513</p>
                    </div>
                    <div className='col s12 m4'>
                        <SideBar />
                    </div>
                </div>
            </div>
            
        </main>
    )
}

export default Contact;
