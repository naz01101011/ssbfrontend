import React from 'react';
import { Link } from 'react-router-dom';

const li = { listStyleType: 'initial', margin: '0.5em 0' };

// Describes the personal data this website's code handles. Keep in sync with
// src/consent.js, src/components/ContactForm.js and the cookies page.
const PrivacyDetails = () => (
    <div className='section'>
        <h4>Date prelucrate prin acest site web</h4>
        <p>
            Această secțiune descrie, pe scurt, ce se întâmplă cu datele tale când
            folosești site-ul. Ea completează, nu înlocuiește, politica de mai jos.
        </p>

        <h5>Formularul de contact</h5>
        <p>
            Dacă trimiți un mesaj prin formularul de contact, numele, adresa de
            e-mail și textul mesajului sunt trimise, prin serviciul EmailJS, către
            adresa de e-mail a redacției, pentru a-ți putea răspunde. Scopul,
            temeiul și durata de stocare sunt cele de la secțiunea 5.1 de mai jos.
            Câmpurile completate nu sunt trimise nicăieri altundeva.
        </p>

        <h5>Statistici și publicitate – doar cu acordul tău</h5>
        <p>
            Dacă apeși „Accept” în bannerul de cookie-uri, se activează:
        </p>
        <ul style={{ marginLeft: '1em' }}>
            <li style={li}><b>Google Analytics</b> – statistici despre utilizarea site-ului;</li>
            <li style={li}><b>trafic.ro</b> – măsurarea audienței;</li>
            <li style={li}><b>Google AdSense</b> – afișarea de reclame.</li>
        </ul>
        <p>
            Aceste servicii primesc date tehnice despre vizita ta, precum adresa IP,
            identificatori ai browserului, paginile vizitate și informații despre
            dispozitiv, și își stabilesc propriile cookie-uri. Ele sunt furnizate de
            terți, care răspund de propria prelucrare și pot prelucra datele și în
            afara Spațiului Economic European; vezi{' '}
            <a href='https://policies.google.com/privacy' target='_blank' rel='noopener noreferrer'>
                politica de confidențialitate Google
            </a>
            {' '}și politica furnizorului trafic.ro. Temeiul este consimțământul tău.
            Dacă apeși „Refuz”, aceste servicii nu se încarcă.
        </p>

        <h5>Retragerea consimțământului</h5>
        <p>
            Îți poți retrage sau schimba oricând alegerea, la fel de simplu cum ai
            dat-o: din linkul „Setări cookies” din subsolul paginii sau din pagina{' '}
            <Link to='/cookies'>Politica de Cookies</Link>. Retragerea nu afectează
            legalitatea prelucrărilor făcute înainte de retragere.
        </p>

        <h5>Date tehnice necesare afișării paginii</h5>
        <p>
            Pentru a-ți livra pagina, furnizorii care găzduiesc site-ul și
            conținutul lui (inclusiv imaginile și iconițele) primesc adresa ta IP
            și datele tehnice standard ale solicitării, ca la orice site web.
            Acest lucru se întâmplă indiferent de alegerea ta privind cookie-urile.
        </p>

        <h5>Conturi de utilizator</h5>
        <p>
            Site-ul nu oferă conturi de utilizator, comentarii sau abonare prin
            formular; nu colectăm date de acest tip.
        </p>
    </div>
);

export default PrivacyDetails;
