import React, {useState} from 'react';
import Emailjs from 'emailjs-com'

// EmailJS identifiers are public by design (they ship in the bundle); abuse is
// limited on the EmailJS side by their allowed-domain and rate settings.
const SERVICE_ID = 'gmail';
const TEMPLATE_ID = 'template_ahw9ywxD';
const USER_ID = 'user_CMx2Dfl5w57a4qX0mfJhl';

const COOLDOWN_MS = 30 * 1000;
const LAST_SENT_KEY = 'contactLastSent';

const lastSent = () => {
    try {
        return Number(localStorage.getItem(LAST_SENT_KEY)) || 0;
    } catch (e) {
        return 0;
    }
};

const markSent = () => {
    try {
        localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
    } catch (e) {
        // storage unavailable: the cooldown then only lasts for this page view
    }
};

const ContactForm = () => {

    const [msg, setMsg] = useState('');
    const [sending, setSending] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();
        const form = e.target;

        // Honeypot: real visitors never see or fill this field
        if (form.elements.website.value) {
            form.reset();
            setMsg('Mesajul a fost trimis cu succes!');
            return;
        }

        const wait = COOLDOWN_MS - (Date.now() - lastSent());
        if (wait > 0) {
            setMsg('Te rugăm să aștepți ' + Math.ceil(wait / 1000) + ' secunde înainte de a trimite un alt mesaj.');
            return;
        }

        setSending(true);
        setMsg('');
        Emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, USER_ID)
            .then(() => {
                markSent();
                setMsg('Mesajul a fost trimis cu succes!');
                form.reset();
            }, (error) => {
                setMsg(error.text || 'Mesajul nu a putut fi trimis. Încearcă din nou.');
            })
            .finally(() => setSending(false));
    }

    return (
        <div className='section'>
            <h4>Mesaj direct</h4>
            <form id='contactForm' className="input-field" onSubmit={sendEmail}>
                <input placeholder='Nume si Prenume' id="nume" type="text" className="validate" name='sender_name' maxLength={100} required/>
                <input placeholder='Adresa ta de email' id="email" type="email" className="validate" name='sender_email' maxLength={150} required/>
                <textarea placeholder='Mesajul tau' id="textarea" className="materialize-textarea" name='message' maxLength={5000} style={{minHeight: 200}} required/>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0}}/>
                <button className="btn waves-effect waves-light deep-orange darken-1" type="submit" name="action" disabled={sending}>{sending ? 'Se trimite...' : 'Trimite'}
                    <i className="material-icons right">send</i>
                </button>
            </form>
            <blockquote aria-live="polite">{msg}</blockquote>
        </div>
    )
}

export default ContactForm;
