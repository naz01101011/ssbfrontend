import React from 'react';
import { reopenConsent } from '../consent';

// Describes what the code in this repository actually does with cookies and
// third-party scripts. Keep in sync with src/consent.js and src/App.js.
const CookieDetails = () => (
    <div className='section'>
        <h4>Ce se încarcă pe acest site și când</h4>
        <p>
            Cookie-urile și scripturile de statistică și publicitate se activează
            <b> doar după ce apeși „Accept”</b> în bannerul de cookie-uri. Dacă apeși
            „Refuz”, ele nu se încarcă, iar site-ul poate fi citit în continuare
            integral. Alegerea ta este salvată pentru 1 an.
        </p>

        <h5>Întotdeauna active (strict necesare)</h5>
        <ul style={{ marginLeft: '1em' }}>
            <li style={{ listStyleType: 'initial', margin: '0.5em 0' }}>
                <b>CookieConsent</b> – cookie al site-ului nostru, salvează alegerea
                ta („Accept” sau „Refuz”). Durată: 365 de zile.
            </li>
            <li style={{ listStyleType: 'initial', margin: '0.5em 0' }}>
                <b>contactLastSent</b> – înregistrare în spațiul de stocare local al
                browserului (nu este cookie), folosită doar pe pagina de contact
                pentru a limita trimiterea repetată de mesaje. Conține doar ora
                ultimului mesaj trimis.
            </li>
        </ul>

        <h5>Active doar după „Accept”</h5>
        <ul style={{ marginLeft: '1em' }}>
            <li style={{ listStyleType: 'initial', margin: '0.5em 0' }}>
                <b>Google Analytics</b> (Google) – statistici despre utilizarea
                site-ului: paginile vizitate, durata vizitei, proveniența vizitatorilor.
            </li>
            <li style={{ listStyleType: 'initial', margin: '0.5em 0' }}>
                <b>trafic.ro</b> – măsurarea audienței și clasamentele site-urilor
                din România.
            </li>
            <li style={{ listStyleType: 'initial', margin: '0.5em 0' }}>
                <b>Google AdSense</b> (Google) – afișarea de reclame. Poate seta
                cookie-uri proprii pentru a limita frecvența reclamelor și pentru
                măsurarea performanței lor.
            </li>
        </ul>
        <p>
            Aceste servicii sunt operate de terți, care își stabilesc propriile
            cookie-uri și politici de confidențialitate. Fără „Accept”, reclamele
            Google nu se afișează; reclamele proprii publicate direct pe site
            rămân vizibile.
        </p>

        <h5>Resurse încărcate de pe servere externe, fără cookie-uri</h5>
        <p>
            Pentru a afișa pagina sunt încărcate, indiferent de alegerea ta,
            imagini și date de la Sanity (cdn.sanity.io), iconițele de la Google
            Fonts și sigla trafic.ro din subsolul paginii. Serverele respective
            primesc adresa ta IP, ca la orice resursă încărcată dintr-un alt
            domeniu.
        </p>

        <h5>Îți poți schimba oricând alegerea</h5>
        <p>
            Folosește linkul „Setări cookies” din subsolul paginii sau butonul de
            mai jos. Pagina se reîncarcă, iar bannerul apare din nou.
        </p>
        <button className='btn waves-effect waves-light deep-orange darken-1' type='button' onClick={reopenConsent}>
            Modifică alegerea
        </button>
    </div>
);

export default CookieDetails;
