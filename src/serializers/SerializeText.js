import React from 'react';

const SerializeText = (props) => {
    let blockList = [];
    Object.values(props.body).map(function(item) {
        Object.values(item.children).forEach((kid) => {
            let texts = kid.text.split(/\n\n/g);
            // console.log(texts)
            texts.forEach((kid, index) => {
                blockList.push({index, kid});
            })
            
        })

        return null;
    });
    // console.log(blockList)

    return (
        <div>
        {blockList.map(i => (
            <p className='' key={i.index + Math.random()}>{i.kid}</p>
        ))}
        </div>
    )
}

export default SerializeText;