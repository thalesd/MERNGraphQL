import React from 'react';

import Backdrop from '../Backdrop/Backdrop';

import './Modal.css';

const modal = (props) => {
    if (props.isOpen)
        return (
            <React.Fragment>
                <Backdrop/>
                <div className="modal">
                    <header className="modal__header">{props.title}</header>
                    <section className="modal__content">
                        <h1>
                            {props.children}
                        </h1>
                    </section>
                    {props.renderActions && <section className="modal__actions">
                        {props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button>}
                        {props.canConfirm && <button className="btn" onClick={props.onConfirm}>Confirm</button>}
                    </section>}
                </div>
            </React.Fragment>
        )
    else return <div style={{ display: "none" }}></div>
}

export default modal;