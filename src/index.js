import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button
      className="square"
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let board = [];

    for(let col = 0; col < 3; col++) {
      let cols = [];
      let index = 0;

      for(let row = 0; row < 3; row++) {
        index = (col * 3) + row;
        cols.push(this.renderSquare(index));
      }

      board.push(<div key={index} className="board-row">{cols}</div>);
    }

    return (
      <div>{board}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: Array(9).fill(null)},
      ],
      jumpNumber: null,
      moveNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.moveNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // make a copy

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{squares: squares}]),
      jumpNumber: null, // have to reset to null if next move after a jump
      moveNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(move) {
    this.setState({
      jumpNumber: move,
      moveNumber: move,
      xIsNext: (move % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.moveNumber];
    const winner = calculateWinner(current.squares);

    // step is {squares: [...]}
    // move is the index of history items
    //
    // when move = 0, step.squares is the initial array of nulls in the constructor
    // when move = 1, step.squares may be [null, null, "X", null, null, null, null, null, null]
    // when move = 2, step.squares may be [null, null, "X", null, "O", null, null, null, null]
    const moves = history.map((step, move) => {
      let desc;

      if (move) {
        const prevSquare = history[move - 1].squares;
        const currSquare = step.squares;

        let col, row;

        // is there an easier way to compare current with previous, maybe lodash?
        for (const [index, value] of currSquare.entries()) {
          if (value !== prevSquare[index]) {
            col = (index % 3) + 1;
            row = Math.floor(index / 3) + 1;
          }
        }

        desc = 'Go to move #' + move + ' (' + col + ', ' + row + ')';
      } else {
        desc = 'Go to game start';
      }

      return(
        <li key={move}>
          <button
            className={this.state.jumpNumber === move ? 'selected' : null}
            onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      )
    });


    let status;
    if (winner) {
      status = 'We have a winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

