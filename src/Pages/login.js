import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import '../styles/login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            logged: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.Login = this.Login.bind(this);
        this.Logout = this.Logout.bind(this);
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    Login(event) {
        this.setState({logged: true});
        event.preventDefault();
        localStorage.setItem('Username',this.state.value);
        this.props.setUser(this.state.value);
        this.props.setupSocket(this.state.value);
    }

    Logout() {
        this.setState({value: '', logged: true});
        localStorage.removeItem('Username');
        this.props.setUser(null);
        this.props.setupSocket(null);
    }

    render() {
        if(!localStorage.getItem('Username')) {
            return (
                <div className="Login">
                    <form onSubmit={this.Login}>
                        <label>
                            Name:
                            <input type="text" placeholder="Username" value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                </div>
            )
        } else {
            return (
                <div className="Login">
                    <div>You've logged in...</div>
                    <Link to='/'><button>Go to Home</button></Link>
                    <button onClick={this.Logout}>Logout</button>
                </div>
            )
        }
    }
}

export default withRouter(Login);