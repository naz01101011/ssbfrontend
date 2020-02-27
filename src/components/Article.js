import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import SerializeText from '../serializers/SerializeText'

const Article = (props) => {
    const [hasError, setHasError] = useState(false);
    const [slug, setSlug] = useState('');
    const [body, setBody] = useState('');
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [loaded, setLoaded] = useState(false);

    const API = 'https://w58sh5v7.apicdn.sanity.io/v1/data/query/production?query=';

    const fetchData = (q) => {
      Axios.get(API + q)
        .then(res => {
            // console.log(res);
            // setBody(res.data.result);
            setTitle(res.data.result[0].title)
            setBody(res.data.result[0].body)
            setId(res.data.result[0]._id)
            setLoaded(true);
        })
        .catch(err => {
            // console.log('Error:');
            // console.log(err);
            setHasError(true);
        })
    }

    const handleArticle = () => {
        let slug = props.match.params.article_slug
        setSlug(slug);
        let query = '*[slug.current == "' + slug + '"]';
        fetchData(query);
    }

    useEffect(() => {
        handleArticle();    
    }, [])

    if (hasError) {
        return (
            <div className='container section'>
                <h3>Error</h3>
            </div>
        )    
    } else {
        return (
            <div className='container section'>
                {loaded ? (
                    <div>  
                        <h3>{title}</h3>
                        <SerializeText body={body} id={id} />
                    </div>
                ) : <h3>Aduc Stirea...</h3>}
                
            </div>
        )
    }
}

export default Article;