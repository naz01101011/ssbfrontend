import React, { Component } from 'react';
import styles from './LatestNews.module.css';

// sanity.io http API used here, with GROQ as query lang
const API = 'https://w58sh5v7.api.sanity.io/v1/data/query/production?query=';
const DEFAULT_QUERY = '*[_type == "post"] | order(_createdAt desc) { _id, title }[0...6]';

class LatestNews extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hits: [],
            isLoading: false,
            error: null,
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch(API + DEFAULT_QUERY)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('A aparut o eroare...');
                }
            })
            .then(data => this.setState({ hits: data.result, isLoading: false })) // hits are assigned based on the structure of the returned json
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { hits, isLoading, error } = this.state;

        if (error) {
            return <p>{error.message}</p>;
        }

        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div className={styles.root}>
                <h2 className={styles.title}>Ultimele Stiri</h2>
                <ul>
                    {hits.map(hit =>
                        <li className={styles.article} key={hit._id}>
                            <a className={styles.link} href="#">{hit.title}</a>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

        


export default LatestNews;