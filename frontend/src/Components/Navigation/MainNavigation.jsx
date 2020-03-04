import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const MainNavigation = props => (
    <header className="main-navigation">
        <div className="main-navigation__logo">
            <h1>Epic Stories</h1>
        </div>
        <nav class="main-navigation__items">
            <ul>
                <li><NavLink to="/auth">Authenticate</NavLink></li>
                <li><NavLink to="/characters">My Characters</NavLink></li>
                <li><NavLink to="/stories">My Stories</NavLink></li>
            </ul>
        </nav>
    </header>
)

export default MainNavigation;