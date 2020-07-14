import React from 'react';
import { Link } from 'react-router-dom';

const logcheck = () => {
    const log = [];
    if(localStorage.getItem('Username')) {
        log.push (
        <div key="log-info">Welcome, {localStorage.getItem('Username')}</div>
        )
    } else {
        log.push (
            <div key="log-info">
                <Link to='/login'>Login</Link>
            </div>
            )
    }
    return(log);
}

function Nav() {
    return(
        <div>
            <nav>
                <Link to='/'><h1>TicTacToe</h1></Link>
                {logcheck()}
            </nav>
        </div>
    );
} 

export default Nav;