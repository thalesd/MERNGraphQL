import React, { Component } from 'react';

import Modal from '../Components/Modal/Modal';

import './Characters.css';

class CharacterPage extends Component {
    state = {
        isModalOpen: false
    }

    openModalHandler = () => {
        this.setState({isModalOpen: true});
    }

    render() {
        return (<React.Fragment>
            <Modal
                isOpen={this.state.isModalOpen}
                title="Create Character"
                renderActions={true}
                canConfirm={true}
                canCancel={true}>
                    Modal Content
            </Modal>
            <div className="characters-control">
                <h1>My Characters</h1>
                <p>Create awesome characters to add in your stories!</p>
                <div>
                    CharactersList
            </div>
                <button className="btn" onClick={this.openModalHandler}>Create Character</button>
            </div>
        </React.Fragment>
        )
    }
}

export default CharacterPage;