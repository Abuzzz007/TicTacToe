import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import Board from '../Controllers/board';
import Chat from '../Controllers/chat';
import calculateWinner from '../Controllers/calculateWinner';
import makeToast from '../Controllers/Toast';
import Loading from '../Controllers/loading';
import '../styles/online.css';

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
            messages: [],
            JoinroomModal: false,
            CreateroomModal: false,
            ChatModal: false,
            XorO: '',
            move: true
        }
        this.RoomCleanup = this.RoomCleanup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.JoinRoom = this.JoinRoom.bind(this);
    }

    //for form
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    //random 5 digit number for room creation
    RandomRoom() {
        return Math.floor(Math.random() * (90000) + 10000);
        // return 1;
    }

    //for room creation
    CreateRoom() {
        const RoomId = this.RandomRoom();
        this.props.socket.emit('createRoom', {RoomId});
        this.props.socket.on('createRoomconf', ({conf}) => {
            if(conf) {
                this.setState({RoomId: RoomId});
                this.props.socket.off('createRoomconf');
                this.props.socket.on('Partnername2', ({username}) => {
                    makeToast(username + ' joined');
                    this.setState({username2: username});
                    this.props.socket.emit('Partnername1', {RoomId, username: this.state.username1});
                    this.props.socket.off('Partnername2');
                    this.setState({CreateroomModal: false});
                });
            } else {
                this.props.socket.off('createRoomconf');
                this.CreateRoom();
            }
        });
        this.setState({XorO: 'X'});
    }

    //for joining room
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
                    makeToast(username + ' joined');
                    this.setState({username2: username});
                    this.setState({JoinroomModal: false});
                });
            } else {
                makeToast('Enter valid room id');
                this.props.socket.off('joinRoomconf');
            }
        });
        this.setState({
            XorO: 'O',
            move: false
        });
    }
    

    //for leaving room while leaving page
    RoomCleanup() {
        if(this.state.RoomId) {
            const RoomId = this.state.RoomId;
            this.props.socket.emit('leaveRoom', {RoomId});
            this.setState({RoomId: null});
        }
    }

    //to emit new move through socket
    updatesquare(squares) {
        this.props.socket.emit('Room_move', {
            RoomId: this.state.RoomId,
            squares: squares
        });
    }

    //listening for new moves
    getnewmove() {
        this.props.socket.on('newMove', ({squares}) => {
            if(squares !== this.state.squares) {
                this.setState({
                    squares: squares,
                    move: !this.state.move
                });
            }
        });
    }

    //Game handling
    handleClick(i){
        const squares = this.state.squares.slice();
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
        if(squares !== this.state.squares) {
            this.updatesquare(squares);
        }
    }

    //listening for other user leaving room
    leftroom() {
        this.props.socket.on('leftroom', () => {
            makeToast(this.state.username2 + ' has left the room');
        });
    }

    //for starting new game
    newgame() {
        this.props.socket.on('newGame', () => {
            this.setState({
                squares: Array(9).fill(null),
                XorO: this.state.XorO === 'X' ? 'O' : 'X'
            });
        });
    }

    //listening for newmessages
    newmessage() {
        this.props.socket.on('newMessage', (message) => {
            const messages = [message,...this.state.messages];
            this.setState({messages: messages});
            if(message.username === this.state.username2) {
                makeToast(message.username + ' send a chat');
            }
        });
    }

    componentDidMount() {
        this.getnewmove();
        this.leftroom();
        this.newgame();
        this.newmessage();
        window.addEventListener('beforeunload', this.RoomCleanup);
    }

    componentWillUnmount() {
        this.RoomCleanup();
        window.removeEventListener('beforeunload', this.RoomCleanup);
    }    

    render() {
        var winner, winstatus;
        const win = calculateWinner(this.state.squares);
        if(win) {
            winner = win.winner;
            winstatus = win.winstatus;
        } else {
            winner = null;
            winstatus = null; 
        }
        const gameclass = 'game-board game-board-online win' + winstatus;

        const handlewinner = () => {
            let winner_title;
            if (winner === this.state.XorO) {
                winner_title = 'You\'ve Won!';
            } else if (winner === 'D') {
                winner_title = 'Draw match';
            } else {
                winner_title = 'You\'ve Lost...';
            }

            return(
                <Modal 
                    isOpen={true}
                    contentLabel='Newgame'
                    className='Modal winModal'
                    overlayClassName={winner === this.state.XorO ? 'ModalOverlay winModalOv wonModal' : 'ModalOverlay winModalOv'}
                >
                    <div className='Modaldiv'>
                        <div className='windiv'>
                            <div className='wintitle'><h1>{winner_title}</h1></div>
                            <div className='rematch'>Want a rematch?</div>
                        </div>
                        <button onClick={() => this.props.socket.emit('Newgame', {RoomId: this.state.RoomId})}>New Game</button>
                    </div>
                </Modal>
            );
        }

        if(!this.state.RoomId) {
            return(
                <div className='Online'>
                    <button className='btn' onClick={() => {
                        this.CreateRoom();
                        this.setState({CreateroomModal: true});
                        }}>Create Room</button>
                    <button className='btn' onClick={() => this.setState({JoinroomModal: true})}>Join Room</button>
                    <Modal 
                        isOpen={this.state.JoinroomModal}
                        contentLabel='JoinRoom'
                        className='Modal joinModal'
                        overlayClassName='ModalOverlay'
                    >
                        <div className='Modaldiv'>
                            <form onSubmit={this.JoinRoom}>
                                <label>
                                    Room id:
                                    <input type='text' placeholder='Room id' value={this.state.value} onChange={this.handleChange} />
                                </label>
                                <button type='submit'>Join</button>
                            </form>
                            <button onClick={() => this.setState({JoinroomModal: false})}>Close</button>
                        </div>
                    </Modal>
                </div>
            );
        } else if(!this.state.username2) {
            return(
                <div className='Online'>
                    <Modal
                        isOpen={this.state.CreateroomModal}
                        contentLabel='CreateRoom'
                        className='Modal createModal'
                        overlayClassName='ModalOverlay'
                    >
                        <div className='Modaldiv'>
                            Room id: {this.state.RoomId}
                            <Loading />
                            Waiting for other players...
                            <button onClick={() => this.RoomCleanup()}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            );
        } else {
            return(
                <div className='Online-game'>
                    <div className='Players'>
                        {this.state.username1} <span>VS</span> {this.state.username2}
                    </div>
                    <div className='gameplayer'>{winner ? '' : this.state.move ? 'Your move' : 'Opponent\'s move'}</div>
                    <div className={gameclass} >
                        <Board 
                            squares={this.state.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                    <button className='btn' onClick={() => this.setState({ChatModal: true})}>Chat</button>
                    <Modal
                        isOpen={this.state.ChatModal}
                        contentLabel='Chat'
                        onRequestClose={() => this.setState({ChatModal: false})}
                        className='Modal chatModal'
                        overlayClassName='ModalOverlay'
                    >
                        <h1>Chats</h1>
                        <button onClick={() => this.setState({ChatModal: false})} id='Close-btn'>X</button>
                        <div className='Modaldiv'>
                            <Chat 
                                RoomId={this.state.RoomId}
                                username1={this.state.username1}
                                username2={this.state.username2}
                                messages={this.state.messages}
                                socket={this.props.socket}
                            />
                        </div>
                    </Modal>
                    {winner ? handlewinner(winner) : ''}
                </div>
            );
        }
    }
}

function online(props) {
    if(!localStorage.getItem('Username')) {
        makeToast('Please login first');
        return (
            <Redirect to='/login' />
        )
    } else if(props.socket) {
        return(
            <Online socket={props.socket} />
        )
    } else {
        return(
            <Loading />
        );
    }
}

export default withRouter(online);