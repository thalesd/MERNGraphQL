import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const MainNavigation = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <header className="main-navigation">
                    <div className="main-navigation__logo">
                        <h1>Epic Stories</h1>
                    </div>
                    <nav className="main-navigation__items">
                        <ul>
                            {!context.token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
                            {context.token && <li><NavLink to="/characters">My Characters</NavLink></li>}
                            {context.token && <li><NavLink to="/stories">My Stories</NavLink></li>}
                            {context.token && <li><button onClick={context.logout}>Logout</button></li>}
                        </ul>
                    </nav>
                </header>)
        }}
    </AuthContext.Consumer>
)

export default MainNavigation;