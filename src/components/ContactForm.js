import React, {useState} from 'react';
import Emailjs from 'emailjs-com'

const ContactForm = () => {
    
    const [msg, setMsg] = useState('');
    
    const sendEmail = (e) => {
        e.preventDefault();
        const form = e.target;

        Emailjs.sendForm('gmail', 'template_ahw9ywxD', form, 'user_CMx2Dfl5w57a4qX0mfJhl')
            .then(() => {
                setMsg('Mesajul a fost trimis cu succes!');
                form.reset();
            }, (error) => {
                setMsg(error.text || 'Mesajul nu a putut fi trimis. Încearcă din nou.');
            });
    }

    return (
        <div className='section'>
            <h4>Mesaj direct</h4>
            <form id='contactForm' className="input-field" onSubmit={sendEmail}>
                <input placeholder='Nume si Prenume' id="nume" type="text" className="validate" name='sender_name' required/>
                <input placeholder='Adresa ta de email' id="email" type="text" className="validate" name='sender_email' required/>
                <textarea placeholder='Mesajul tau' id="textarea" className="materialize-textarea" name='message' style={{minHeight: 200}} required/>
                <button className="btn waves-effect waves-light deep-orange darken-1" type="submit" name="action">Trimite
                    <i className="material-icons right">send</i>
                </button>
            </form>
            <blockquote>{msg}</blockquote>
        </div>
    )
}

export default ContactForm;