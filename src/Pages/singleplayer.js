import React from 'react';
// import Board from '../Controllers/board';
// import calculateWinner from '../Controllers/calculateWinner';
import '../styles/player.css';

class Game extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     history: [{
  //       squares: Array(9).fill(null),
  //     }],
  //     stepNumber: 0,
  //     xIsNext: true,
  //   };
  // }

  // handleClick(i){
  //   const history = this.state.history.slice(0, this.state.stepNumber + 1);
  //   const current = history[history.length - 1];
  //   const squares = current.squares.slice();
  //   var winner;
  //   const win = calculateWinner(squares)
  //   if(win) {
  //     winner = win.winner;
  //   } else {
  //     winner = null;
  //   }
  //   if (winner || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({
  //     history: history.concat([{
  //       squares: squares,
  //     }]),
  //     stepNumber: history.length,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  // newgame() {
  //   this.setState({
  //     history: [{
  //       squares: Array(9).fill(null),
  //     }],
  //     stepNumber: 0,
  //     xIsNext: true,
  //   })
  // }

  // jumpTo(step) {
  //   this.setState({
  //     stepNumber: step,
  //     xIsNext: (step % 2) === 0,
  //   });
  // }

  render() {
    // const history = this.state.history;
    // const current = history[this.state.stepNumber];
    // var winner, winstatus;
    // const win = calculateWinner(current.squares)
    // if(win) {
    //   winner = win.winner;
    //   winstatus = win.winstatus;
    // } else {
    //   winner = null;
    //   winstatus = null; 
    // }
    // const moves = () => {
    //   if(this.state.history.length > 1) {
    //     const buttons = [];
    //     if(this.state.stepNumber > 0) {
    //       let title = (this.state.stepNumber - 1).toString();
    //       buttons.push(
    //         <div key='left'>
    //           <button id='left' title={'Move #' + title} onClick={() => this.jumpTo(this.state.stepNumber - 1)}></button>
    //         </div>
    //       );
    //     } else {
    //       buttons.push(<div key='left'></div>);
    //     }
    //     buttons.push(<span key='Move'>Move #{this.state.stepNumber}</span>);
    //     if(this.state.stepNumber < this.state.history.length - 1) {
    //       let title = (this.state.stepNumber + 1).toString();
    //       buttons.push(
    //         <div key='right'>
    //           <button id='right' title={'Move #' + title} onClick={() => this.jumpTo(this.state.stepNumber + 1)}></button>
    //         </div>
    //       );
    //     } else {
    //       buttons.push(<div key='right'></div>);
    //     }
    //     return (
    //       <div>
    //         <div id='New_Game_div' key='New_Game'>
    //           <button id='New_Game' onClick={() => this.newgame()}>New Game</button>
    //         </div>
    //         <div className='moves'>{buttons}</div>
    //       </div>
    //     );
    //   } else {
    //     return (null);
    //   }
    // }
    // let status;
    // if (winner === 'X' || winner === 'O') {
    //   status = 'Winner: ' + winner;
    // } else if (winner === 'D') {
    //   status = 'Draw';
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }
    // const gameclass = 'game-board win' + winstatus;
    return (
      <div className='game'>
        <span>In development <span role='img' aria-label='emoji'>😜</span></span> 
        {/* <div className={gameclass}>
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          <div className='status'>{status}</div>
          {moves()}
        </div> */}
      </div>
    );
  }
}

export default Game;