import React from 'react';
import { Link } from 'react-router-dom';

const logcheck = (props) => {
    const log = [];
    if(props.user) {
        log.push (
        <div key="log-info">Welcome, {props.user}</div>
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