import React, { Component } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
    state = {
        isLoginForm: true
    }

    static contextType = AuthContext;

    constructor(props){
        super(props);

        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    submitHandler = (event) => {
        event.preventDefault();

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }

        let requestGraphqlQuery = {};

        if(!this.state.isLoginForm){
            requestGraphqlQuery = {
                query: `
                    mutation {
                        createUser(userInput: {
                            email: "${email}"
                            password: "${password}"
                        }){
                            _id
                            email
                        }
                    }
                `
            }
        }
        else {
            requestGraphqlQuery = {
                query: `
                    query {
                        login(email: "${email}", password: "${password}") {
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `
            }
        }

        //send request
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestGraphqlQuery),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if(this.state.isLoginForm){
                const {userId, token, tokenExpiration} = resData.data.login;
                this.context.login(userId, token, tokenExpiration);
            }
        })
        .catch(err => {
            console.log(err);
        });
        console.log(email, password);
    }

    switchModeHandler = (event) => {
        this.setState({
            isLoginForm: !this.state.isLoginForm
        })
    }

    render() {
        return <div>
            <form className="auth-form" onSubmit={this.submitHandler}>
                <h1 className="form-title">Auth Page</h1>
                <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" ref={this.emailEl}></input>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl}></input>
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchModeHandler}>{this.state.isLoginForm ? "Sign-Up" : "Log In"}</button>
                </div>
            </form>
        </div>
    }
}

export default AuthPage;