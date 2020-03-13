import React from 'react';

import './Modal.css';

const modal = (props) => {
    if (props.isOpen)
        return (<div className="modal">
            <header className="modal__header">{props.title}</header>
            <section className="modal__content">
                <h1>
                    {props.children}
                </h1>
            </section>
            {props.renderActions && <section className="modal__actions">
                {props.canCancel && <button className="btn">Cancel</button>}
                {props.canConfirm && <button className="btn">Confirm</button>}
            </section>}
        </div>)
    else return <span style={{display: "none"}}></span>
}

export default modal;