import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import NewsList from './NewsList';
import Client from './Client';
import urlFor from '../components/ImgBuilder';
import SerializeDate from '../serializers/SerializeDate';
import SerializeText from '../serializers/SerializeText';
import AdsLeaderboard from '../components/AdsLeaderboard';
import NewsListItem from './NewsListItem';

const LEAD_QUERY = '*[_id == $id][0].body[_type == "block"][0...12]{ "t": pt::text(@) }';

const normalize = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

const blocksToText = (blocks) =>
    (Array.isArray(blocks) ? blocks : [])
        .map(b => (b.children || []).map(c => c.text || '').join(''))
        .join(' ');

// First paragraphs of the main post's body, minus any that just repeat the excerpt
// (editors usually paste the chapeau as the opening paragraph too).
const useLeadParagraphs = (post) => {
    const [paragraphs, setParagraphs] = useState([]);
    const id = post && post._id;
    const excerpt = post && post.excerpt;

    useEffect(() => {
        if (!id) return undefined;
        let cancelled = false;
        setParagraphs([]);
        const excerptText = normalize(blocksToText(excerpt));
        Client.fetch(LEAD_QUERY, {id})
            .then(res => {
                if (cancelled || !Array.isArray(res)) return;
                setParagraphs(res
                    .map(b => (b.t || '').trim())
                    .filter(t => {
                        const n = normalize(t);
                        return n && !(excerptText && (n.includes(excerptText) || excerptText.includes(n)));
                    }));
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [id, excerpt]);

    return paragraphs;
};

// Fills whatever vertical space the column has left with body text, never more.
// The box is flex: 1 1 0 / min-height: 0, so it contributes nothing to the row
// height; we then snap the visible height to whole lines and fade the last one.
const LeadFill = ({paragraphs}) => {
    const boxRef = useRef(null);
    const [clipHeight, setClipHeight] = useState(0);

    useLayoutEffect(() => {
        const box = boxRef.current;
        if (!box || paragraphs.length === 0) return undefined;
        const measure = () => {
            const p = box.querySelector('p');
            if (!p) return;
            const cs = window.getComputedStyle(p);
            const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
            box.style.setProperty('--lh', lineHeight + 'px');
            const lines = Math.floor(box.clientHeight / lineHeight);
            setClipHeight(lines >= 2 ? Math.floor(lines * lineHeight) : 0);
        };
        measure();
        if (typeof ResizeObserver === 'undefined') return undefined;
        const ro = new ResizeObserver(measure);
        ro.observe(box);
        return () => ro.disconnect();
    }, [paragraphs]);

    return (
        <div className='main-story-fill' ref={boxRef} aria-hidden={clipHeight === 0}>
            <div className='main-story-fill-clip' style={{height: clipHeight}}>
                {paragraphs.map((t, i) => <p key={i}>{t}</p>)}
            </div>
        </div>
    );
};

const LatestNews = (props) => {
    // console.log(props)
    let pinnedPost = props.pinned;
    let mainPost = props.data[0]
    let nextPosts = props.data.slice(1);
    const leadParagraphs = useLeadParagraphs(mainPost);

        // console.log(pinnedPost.title)
    return (
        <div className='container'>
            <div className='row section flex'>
                <div className="col m12 l8 main-flex">
                    <div className='main-story'>
                        <Link className='link' to={'/stiri/' + mainPost.slug}>
                            <div className='main-story-body'>
                                <div className="featImg">
                                    <img className='responsive-img' width={900} height={470} fetchPriority='high' src={urlFor(mainPost.mainImage).width(900).height(470).fit('crop').crop('focalpoint').quality(30).url()} alt={mainPost.mainImage.alt || mainPost.title} />
                                </div>
                                <div>
                                    <span className='info grey lighten-3 deep-orange-text text-darken-1'>{SerializeDate(mainPost.publishedAt)} <span className='grey'>{mainPost.authorName}</span></span>
                                    <h3 className="left-align">
                                        {mainPost.title}
                                    </h3>
                                    <div className='main-story-excerpt'>
                                        
                                            <SerializeText body={mainPost.excerpt} id={mainPost._id} />

                                    </div>
                                </div>
                                <LeadFill paragraphs={leadParagraphs} />
                            </div>
                        </Link>
                    </div>
                    <div className='mid-lb'>
                        <AdsLeaderboard position='mid-leaderboard' googleads='true'/>
                    </div>
                </div>
                <div className="col m12 l4">

                {pinnedPost !== undefined &&
                <div className="pinnedPost">
                    <NewsListItem  title={pinnedPost.title} key={pinnedPost._id} slug={pinnedPost.slug} image={pinnedPost.mainImage} cat={pinnedPost.categ} author={pinnedPost.authorName} date={pinnedPost.publishedAt} hasImages={false} hasExcerpt={false} excerpt={pinnedPost.excerpt}/>
                </div>
                }

                    <NewsList list={nextPosts} images='false'/>
                </div>
            </div>
        </div>
        
    );
}     

export default LatestNews;
