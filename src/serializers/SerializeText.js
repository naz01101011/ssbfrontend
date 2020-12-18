import React from 'react';
import urlFor from '../components/ImgBuilder';

const SerializeText = (props) => {
    let blockList = [];
    console.log(props.body);
    Object.values(props.body).map(function(item) {
        if (item._type === "block") {
            let text_block = '';
            Object.values(item.children).forEach((kid) => {
                let texts = kid.text.split(/\n\n/g);
                if (kid.marks.length !== '0') {
                    switch(kid.marks[0]) {
                        case 'strong':
                            text_block += '<span>' + texts + '</span>';
                            break;
                        default:
                            text_block += texts;
                            break;
                    }
                } else {
                    text_block += texts;
                }
                
            })
            // console.log(text_block)
            blockList.push({text_block});
        } else if (item._type === "mainImage") {
            let img_src = urlFor(item.asset).width(900).fit('crop').crop('focalpoint').quality(60).url();
            let img_caption = item.caption;
            let img_alt = item.alt;
            blockList.push({img_src, img_caption, img_alt})
        }

        return null;
    });
    // console.log(blockList)

    const getContent = blockList => blockList.map(i => {
        if (!i.img_src) {
            return <p className='' key={Math.random()}>{i.text_block}</p>
        } else {
            return <img className='responsive-img' src={i.img_src} alt={i.img_alt} key={Math.random()}/>
        }
    })

    return (
        <div>{getContent(blockList)}</div>
    )
}

export default SerializeText;
