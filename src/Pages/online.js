import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import Board from '../Controllers/board';
import calculateWinner from '../Controllers/calculateWinner';
import makeToast from '../Controllers/Toast';

Modal.setAppElement('#root');

class Online extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            squares: Array(9).fill(null),
            RoomId: null,
            username1: localStorage.getItem('Username'),
            username2: '',
            showModal1: false,
            showModal2: false,
            XorO: '',
            move: true
        }
        this.RoomCleanup = this.RoomCleanup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.JoinRoom = this.JoinRoom.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    JoinRoom(event) {
        event.preventDefault();
        const RoomId = this.state.value;
        const username = this.state.username1;
        this.props.socket.emit('joinRoom', {RoomId, username});
        this.props.socket.on('joinRoomconf', ({conf}) => {
            if(conf) {
                this.setState({RoomId: RoomId});
                this.props.socket.off('joinRoomconf');
                this.props.socket.on('Partnername1', ({username}) => {
                    makeToast('',username + ' joined');
                    this.setState({
                        username2: this.state.username1,
                        username1: username
                    });
                    this.getnewmove();
                });
            } else {
                makeToast('','Enter valid room id');
                this.props.socket.off('joinRoomconf');
            }
        });
        this.setState({
            XorO: 'O',
            move: false
        });
    }

    RandomRoom() {
        return Math.floor(Math.random() * (90000) + 10000);
        // return 12345;
    }

    CreateRoom() {
        const RoomId = this.RandomRoom();
        this.props.socket.emit('createRoom', {RoomId});
        this.props.socket.on('createRoomconf', ({conf}) => {
            if(conf) {
                this.setState({RoomId: RoomId});
                this.props.socket.off('createRoomconf');
                this.props.socket.on('Partnername2', ({username}) => {
                    makeToast('',username + ' joined');
                    this.setState({username2: username});
                    this.props.socket.emit('Partnername1', {RoomId, username: this.state.username1});
                    this.props.socket.off('Partnername2');
                    this.getnewmove();
                });
            } else {
                this.props.socket.off('createRoomconf');
                this.CreateRoom();
            }
        });
        this.setState({XorO: 'X'});
    }

    RoomCleanup() {
        if(this.state.RoomId) {
            const RoomId = this.state.RoomId;
            this.props.socket.emit('leaveRoom', {RoomId});
            this.setState({RoomId: null});
        }
    }

    updatesquare() {
        this.props.socket.emit('Room_move', {
            RoomId: this.state.RoomId,
            squares: this.state.squares
        });
    }

    getnewmove() {
        this.props.socket.on('newMove', ({squares}) => {
            this.setState({
                squares: squares,
                move: !this.state.move
            });
        });
    }

    //Game handling
    handleClick(i){
        const squares = this.state.squares;
        var winner;
        const win = calculateWinner(squares);
        if(win) {
            winner = win.winner;
        } else {
            winner = null;
        }
        if(winner || squares[i] || !this.state.move) {
            return;
        }
        squares[i] = this.state.XorO;
        this.setState({squares: squares});
        this.updatesquare();
      }

    componentDidMount() {
        window.addEventListener('beforeunload', this.RoomCleanup);
    }

    componentWillUnmount() {
        this.RoomCleanup();
        window.removeEventListener('beforeunload', this.RoomCleanup);
    }    

    render() {
        console.log(this.state);
        var winner, winstatus;
        const win = calculateWinner(this.state.squares);
        if(win) {
            winner = win.winner;
            winstatus = win.winstatus;
        } else {
            winner = null;
            winstatus = null; 
        }
        const gameclass = "game-board win" + winstatus;

        if(!this.state.RoomId) {
            return(
                <div className="Online">
                    <button onClick={() => {
                        this.CreateRoom();
                        this.setState({showModal2: true});
                        }}>Create Room</button>
                    <button onClick={() => this.setState({showModal1: true})}>Join Room</button>
                    <Modal isOpen={this.state.showModal1}contentLabel="JoinRoom">
                        <form onSubmit={this.JoinRoom}>
                            <label>
                                Room id:
                                <input type="text" placeholder="Room id" value={this.state.value} onChange={this.handleChange} />
                            </label>
                            <button type="submit">Join</button>
                        </form>
                        <button onClick={() => this.setState({showModal1: false})}>Close</button>
                    </Modal>
                </div>
            );
        } else if(!this.state.username2) {
            return(
                <div className="Online">
                    <Modal isOpen={this.state.showModal2}contentLabel="CreateRoom">
                        <div>
                        Room id: {this.state.RoomId} waiting for other players...
                        <div className="loadingicon">LoadingIcon</div>
                        </div>
                    </Modal>
                </div>
            );
        } else {
            return(
                <div className="Online">
                    Room id: {this.state.RoomId}
                    Winner: {winner}   Player1: {this.state.username1}   player2: {this.state.username2}
                    <div className={gameclass}>
                        <Board 
                            squares={this.state.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                </div>
            );
        }
    }
}

function online(props) {
    if(!localStorage.getItem('Username')) {
        makeToast('','Please login first');
        return (
            <Redirect to='/login' />
        )
    } else {
        return(
            <Online socket={props.socket} />
        )
    }
}

export default withRouter(online);