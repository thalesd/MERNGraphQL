import React, { Component } from 'react';
import CharacterItem from './CharacterItem/CharacterItem';
import './CharacterList.css';

const CharacterList = props => (
    <ul className="characters__list">
        {props.characters.map((char, i) => (
            <CharacterItem key={char._id} name={char.name}/>
        ))}
    </ul>
)

export default CharacterList;