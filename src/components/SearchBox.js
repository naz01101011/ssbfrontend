import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';

const SearchBox = () => {
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState('');

    const search = (e) => {
        e.preventDefault();
        // console.log(searchTerm)
        history.push({
            pathname: '/search',
            state: {term: searchTerm}
        });
        setSearchTerm('');
    }

    return (
        <div className="">
            <form id="search-site"  action='search' onSubmit={search}>
                <input placeholder='Caută știri' type="search" onChange={event => setSearchTerm(event.target.value)} value={searchTerm} required />             
                <button type="submit" className='waves-effect waves-teal btn-flat'>
                    <i className="material-icons deep-orange-text text-darken-1" >search</i>
                </button>

            </form>
        </div>
    );
}


export default SearchBox;