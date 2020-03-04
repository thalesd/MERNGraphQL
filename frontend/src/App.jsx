import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import AuthPage from './pages/Auth';
import RegisterPage from './pages/Register';
import CharactersPage from './pages/Characters';
import StoriesPage from './pages/Stories';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/register" component={RegisterPage}></Route>
        <Route path="/auth" component={AuthPage}></Route>
        <Route path="/characters" component={CharactersPage}></Route>
        <Route path="/stories" component={StoriesPage}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
