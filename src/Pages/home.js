import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

function Home(){
    return (
        <div className='Home'>
            <Link to='/login'><button>Login</button></Link>
            <Link to='/single'><button>Singleplayer</button></Link>
            <Link to='/multi'><button>Multiplayer</button></Link>
            <Link to='/online'><button>Play Online</button></Link>
        </div>
    );
}

export default Home;