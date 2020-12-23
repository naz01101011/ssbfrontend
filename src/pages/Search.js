import React, {useState, useEffect, useCallback} from 'react';
import SideBar from '../components/SideBar';
import Client from '../components/Client';
import NewsList from '../components/NewsList';
import {Link} from 'react-router-dom';

const Search = (props) => {
    let term = props.location.state.term

    const [loaded, setLoaded] = useState(false);
    const [results, setResults] = useState([]);

    const search = useCallback(() => {
        // console.log(term);
        let searchQuery = '*[_type == "post" && title match "*' + term + '*"] | order(publishedAt desc) { _id, title, publishedAt, "categ": categories[0]->title, "slug": slug.current}[0...20]'

        Client.fetch(searchQuery)
        .then(res => {
            setResults(res)
            setLoaded(true)
        })
    }, [term]);

    useEffect(() => {
        search();
    }, [search])

    return (
        <main className='container'>
            <div>
              <span><Link to='/'>Știri de Sibiu</Link> > Știri</span>
                <div>
                    <h3>Rezultate</h3>
                    <h6>Ai căutat termenul: "{term}"</h6>
                </div>
                <div className='row section'>
                    <div className='col s12 m8'>
                    {loaded ? (
                        <div>
                            <NewsList list={results} images='false'/>
                        </div>
                    ) : (
                        <div>
                            <h4 className='center'>Caut știrile...</h4>
                        </div>
                    )}
                    </div>
                    <div className='col s12 m4'>
                        <SideBar/>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Search;
