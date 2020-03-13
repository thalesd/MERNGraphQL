import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import MainNavigation from './Components/Navigation/MainNavigation';

import AuthPage from './pages/Auth';
import RegisterPage from './pages/Register';
import CharactersPage from './pages/Characters';
import StoriesPage from './pages/Stories';
import AuthContext from './context/auth-context';

class App extends React.Component {
  state = {
    token: null,
    userId: null
  }

  login = (userId, token, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  }

  logout = () => {
    this.setState({ token: null, userId: null });
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Route path="/auth" component={AuthPage}></Route>}
                {this.state.token && <Route path="/characters" component={CharactersPage}></Route>}
                {this.state.token && <Route path="/stories" component={StoriesPage}></Route>}

                {!this.state.token && <Redirect to="/auth" />}
                {this.state.token && <Redirect to="/characters" />}
                {this.state.token && <Redirect from="/auth" to="/characters" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
