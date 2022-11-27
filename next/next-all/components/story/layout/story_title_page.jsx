import styles from "./story_title_page.module.css"

import React from 'react';

export function StoryTitlePage({story}) {
    let header = story.elements[0];
    console.log("header", header)
    return <div className="story_title_page">
        <div><img width="180" src={header.illustrationUrl} alt={"title image"} />
            <div className="story_title_page_title">{header.title}</div>
        </div>
        <div><button className="button">Start Story</button></div>
    </div>
}