import React from 'react';

import classes from  '../css/TagElement.module.css'

export const TagElement = (props) => {

    const style = {
        width: props.width + '%',
        height: props.height + '%',
        top: props.top + '%',
        left: props.left + '%',
        pointerEvents: props.pointerEvent,
    }

    const handleClick = () => {
        switch(props.action_type){
            case 'link':
                window.open(props.url, '_blank');
                break;
            case 'popup':
                props.displayPopup(props.id, props.video);
                break;
            default:
                console.log(props.action_type);
                break;
        }
    }

    return (
        <div className={classes.tag} style={style} onClick={() => handleClick()}>{props.title}</div>
    )
}