import React, {useEffect, useState} from 'react';
import Client from '../components/Client';
import NewsList from '../components/NewsList';
import SideBar from '../components/SideBar';

const Stiri = () => {

    const query = '*[_type == "post"] | order(publishedAt desc) { _id, title, publishedAt, "categ": categories[0]->title, "slug": slug.current}[0...20]';

    const [archive, setArchive] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const fetchData = () => {
        Client.fetch(query)
            .then(res => {
                setArchive(res)
                setLoaded(true)
            })
    }

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <div className='container'>
            {loaded ? (
            <div>
                <h3 className='center'>Lista știrilor din Sibiu</h3>
                <div className='row section'>
                    <div className='col s12 m8'>
                        <NewsList list={archive} images='false'/>
                    </div>
                    <div className='col s12 m4'>
                        <SideBar />
                    </div>
                </div>
            </div>
            ) : (
                <div>
                    <h4 className='center'>Aduc din arhivă...</h4>
                </div>
            )}
        </div>
    )
}

export default Stiri;