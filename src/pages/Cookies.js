import React, {useEffect, useState} from 'react';
import Client from '../components/Client'
import BlockContent from '@sanity/block-content-to-react';
import {Link} from 'react-router-dom';

const Cookies = (props) => {
    const [hasError, setHasError] = useState(false);
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        const fetchData = () => {
            let slug = "politica-de-cookies"
            let query = '*[slug.current == "' + slug + '"]{ _id, title, body}';
     
            Client.fetch(query)
            .then(res => {
                setTitle(res[0].title)
                setBody(res[0].body)
                //setId(res[0]._id)
                setLoaded(true);
            })
            .catch(err => {
                setHasError(true);
            })
        };

        fetchData();    
    }, [props]);

    const serializers = {
        list: props => (
            <ul style={{marginLeft:'1em'}}>{props.children}</ul>
        ),
        listItem: props => (
            <li style={{listStyleType:'initial', marginTop:'0.5em', marginBottom:'0.5em'}}>{props.children}</li>
        ),
	    marks: {
            strong: props => (
                <span style={{fontWeight:'bold'}}>{props.children}</span>
            ),
            link: props => (
                <a href={props.mark.href} target='_blank' rel='noopener noreferrer'>{props.children}</a>
            ),
            
        }
        
    }

    if (hasError) {
        return (
            <div className='container section'>
                <h3>Error</h3>
            </div>
        )    
    } else {
        return (
            <main className='container section'>
                {loaded ? (
                    <div>  
                      <span><Link to='/'>Știri de Sibiu</Link> > Cookies</span>
                        <h3>{title}</h3>
                        
                        <div className='row section'>
                            <div className='col s12'>
                                <BlockContent blocks={body} serializers={serializers}/>
                            </div>
                        </div>
                    </div>
                ) : <h3>Aduc continutul...</h3>}
                
            </main>
        )
    }
}

export default Cookies;
