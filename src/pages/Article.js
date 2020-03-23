import React, {useEffect, useState} from 'react';
import Client from '../components/Client'
import SerializeText from '../serializers/SerializeText'
import SerializeDate from '../serializers/SerializeDate'
import urlFor from '../components/ImgBuilder'
import SideBar from '../components/SideBar';

const Article = (props) => {
    const [hasError, setHasError] = useState(false);
    const [body, setBody] = useState('');
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [cat, setCat] = useState('');
    const [img, setImg] = useState({});
    const [loaded, setLoaded] = useState(false);

    

    useEffect(() => {

        const fetchData = () => {
            let slug = props.match.params.article_slug
            let query = '*[slug.current == "' + slug + '"]{ _id, title, mainImage, publishedAt, "categ": categories[0]->title, body}';
    
            Client.fetch(query)
            .then(res => {
                setTitle(res[0].title)
                setBody(res[0].body)
                setId(res[0]._id)
                setDate(SerializeDate(res[0].publishedAt))
                setCat(res[0].categ)
                setImg(res[0].mainImage)
                setLoaded(true);
            })
            .catch(err => {
                setHasError(true);
            })
        };

        fetchData();    
    }, [props]);

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
                        
                        <div className='row section'>
                            <div className='col s12 m8'>
                                {img ? (
                                    <img className='responsive-img' src={urlFor(img).width(900).height(450).fit('crop').crop('focalpoint').quality(60).url()} alt={img.alt} />
                                ) : (
                                    <span className='info grey lighten-4  grey-text text-darken-2'>Articol fără imagine</span>
                                ) }
                                
                                
                                <span className='info grey lighten-4  deep-orange-text text-darken-1'>{date} <span className='deep-orange darken-1'>{cat}</span></span>
                                
                                <SerializeText body={body} id={id} />
                            </div>
                            <div className='col s12 m4'>
                                <SideBar />
                            </div>
                        </div>
                    </div>
                ) : <h3>Aduc Stirea...</h3>}
                
            </div>
        )
    }
}

export default Article;