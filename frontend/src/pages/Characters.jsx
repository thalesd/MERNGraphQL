import React, { Component } from 'react';

import Modal from '../Components/Modal/Modal';
import Switch from '../Components/Switch/Switch';
import CharacterList from '../Components/Characters/CharacterList/CharacterList';

import AuthContext from '../context/auth-context';

import './Characters.css';

class CharacterPage extends Component {
    state = {
        isModalOpen: false,
        creatingCharacter: true,
        hasPowers: false,
        createdCharacters: []
    }

    constructor(props) {
        super(props);

        this.nameElRef = React.createRef();
        this.powerDescElRef = React.createRef();
        this.ageElRef = React.createRef();
        this.birthDateElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchCharacters();
    }

    static contextType = AuthContext;

    openModalHandler = () => {
        this.setState({ isModalOpen: true });
    }

    handleModalCancel = () => {
        this.setState({ isModalOpen: false });
    }

    handleCreateCharacter = () => {
        this.setState({ creatingCharacter: true });

        let name = this.nameElRef.current.value;
        let hasPowers = this.state.hasPowers;
        let powerDescription = this.powerDescElRef.current.value;
        let age = +this.ageElRef.current.value;
        let birthDate = this.birthDateElRef.current.value;

        if (name.trim().length == 0) return this.setState({ creatingCharacter: false });

        if (birthDate.trim().length > 0) birthDate = new Date(birthDate).toISOString();

        const character = { name, hasPowers, powerDescription, age, birthDate };

        const requestBody = {
            query: `
                mutation {
                    createCharacter(characterInput: {
                        name: "${character.name}"
                        hasPowers: ${character.hasPowers}
                        powerDescription: "${character.powerDescription}"
                        age: ${character.age}
                        birthDate: "${character.birthDate}"
                    }){
                        name
                        hasPowers
                        powerDescription
                        creator {
                            email
                            createdCharacters {
                                name
                                hasPowers
                                powerDescription
                                birthDate
                            }
                        }
                    }
                }
            `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                this.setState({ creatingCharacter: false });
                this.setState({ isModalOpen: false });
                this.fetchCharacters();
            })
            .catch(res => {
                this.setState({ creatingCharacter: false });
                console.log(res);
            })

    }

    handleSwitchHasPowers = () => {
        this.setState({ hasPowers: !this.state.hasPowers });
    }

    fetchCharacters = () => {
        const requestBody = {
            query: `
                query {
                    characters{
                        _id
                        name
                        hasPowers
                        powerDescription
                        age
                        birthDate
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                this.setState({ creatingCharacter: false });
                this.setState({ isModalOpen: false });

                return res.json();
            })
            .then(({ data }) => {
                console.log('then', data.characters);
                this.setState({ createdCharacters: data.characters })
            })
            .catch(res => {
                this.setState({ creatingCharacter: false });
                console.log('catch', res);
            })
    }

    render() {
        return (<React.Fragment>
            <Modal
                isOpen={this.state.isModalOpen}
                title="Create Character"
                renderActions={true}
                canConfirm={true}
                onConfirm={this.handleCreateCharacter}
                canCancel={true}
                onCancel={this.handleModalCancel}>
                <div className="form-control">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" ref={this.nameElRef}></input>
                </div>
                <Switch elementId={"hasPowers"}
                    title={"Has Powers"}
                    checked={this.state.hasPowers}
                    onSwitch={this.handleSwitchHasPowers}
                />
                <div className="form-control">
                    <label htmlFor="powerDescription">Power Description</label>
                    <textarea id="powerDescription" rows="3" disabled={!this.state.hasPowers} ref={this.powerDescElRef}></textarea>
                </div>
                <div className="form-control">
                    <label htmlFor="age">Age</label>
                    <input type="number" id="age" ref={this.ageElRef}></input>
                </div>
                <div className="form-control">
                    <label htmlFor="birthDate">Date of Birth</label>
                    <input type="date" id="birthDate" ref={this.birthDateElRef}></input>
                </div>
            </Modal>
            <div className="characters-control">
                <h1>My Characters</h1>
                <p>Create awesome characters to add to your stories!</p>
                <CharacterList characters={this.state.createdCharacters} />
                <button className="btn" onClick={this.openModalHandler}>Create Character</button>
            </div>
            
        </React.Fragment>
        )
    }
}

export default CharacterPage;