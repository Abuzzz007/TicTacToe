import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/nav.css';
import user from '../Images/user.png';

const logcheck = (props) => {
    const log = [];
    if(props.user) {
        log.push (
            <div key='log-info'>
                <Link to='/login'>
                    <img src={user} alt={user}/>
                    <h2>{props.user}</h2>
                </Link>
            </div>
        );
    } else {
        log.push (
            <div key='log-info'>
                <Link to='/login'>
                    <h2>Login</h2>
                </Link>
            </div>
        );
    }
    return(log);
}

function Nav(props) {
    return(
        <div>
            <nav>
                <Link to='/'><h1>TicTacToe</h1></Link>
                {logcheck(props)}
            </nav>
        </div>
    );
} 

export default Nav;