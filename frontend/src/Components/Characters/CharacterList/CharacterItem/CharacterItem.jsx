import React from 'react';

import './CharacterItem.css';

const CharacterItem = props => (
    <li className="characters__list-item">
        {props.name}
    </li>
);

export default CharacterItem;