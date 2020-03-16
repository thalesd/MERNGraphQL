import React from 'react';

import './Switch.css';

const switchComponent = (props) => {
    return <div className="switch__component">
        <label className="title" htmlFor={props.elementId}>{props.title}</label>
        <input className="switch" type="checkbox" id={props.elementId} checked={props.checked} onChange={props.onSwitch}></input>
        <label htmlFor={props.elementId}></label>
    </div>
}

export default switchComponent;