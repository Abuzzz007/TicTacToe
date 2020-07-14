import React from 'react';
import './styles/App.css';
import Home from './Pages/home';
import login from './Pages/login';
import Gamesing from './Pages/singleplayer';
import Gamemult from './Pages/multiplayer';
import Online from './Pages/online';
import io from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
    const[socket, setSocket] = React.useState(null);

    const setupSocket = () => {
        const user = localStorage.getItem('Username');
        if(user && !socket) {
            const newSocket = io('https://shrouded-taiga-23541.herokuapp.com/', {
              query: {
                Username: localStorage.getItem('Username'),
              },
            });

            newSocket.on('disconnect', () => {
                setSocket(null);
                setTimeout(setupSocket, 1000);
                console.log('Socket Disconnected');
            });

            newSocket.on('connect', () => {
                console.log('Socket Connected');
            });

            setSocket(newSocket);
        }
    };

    React.useEffect(() => {
        setupSocket();
        //eslint-disable-next-line
    }, []);

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/login' exact component={login} />
                    <Route path='/single' exact component={Gamesing} />
                    <Route path='/multi' exact component={Gamemult} />
                    <Route path='/online' exact render={() => <Online socket={socket}/>} />
                </Switch>
            </div>
        </Router>
    );
}
  
export default App;