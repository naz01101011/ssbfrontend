import React from 'react';
import {Link} from 'react-router-dom';
import SideBar from '../components/SideBar';
import ContactForm from '../components/ContactForm';

const Contact = () => {
    
    return (
        <main className='container'>
            <div className='section'>
                <span><Link to='/'>Știri de Sibiu</Link> > Contact</span>
                <h3>Contactează-ne aici</h3>
                <div className='row'>
                    <div className='col s12 m8'>
                        <ContactForm />
                        <h4>Email</h4>
                        <p>0746 773 513</p>
                        <h4>Telefon</h4>
                        <p>stiridesibiu@gmail.com</p>
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
