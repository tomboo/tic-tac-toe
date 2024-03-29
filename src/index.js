// Tutorial: Intro to React
// https://reactjs.org/tutorial/tutorial.html
//
/*
  Here are some ideas for improvements that you could make to the tic-tac-toe game which are
  listed in order of increasing difficulty:

  1. Display the location for each move in the format (col, row) in the move history list.
  2. Bold the currently selected item in the move list.
  3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
  4. Add a toggle button that lets you sort the moves in either ascending or descending order.
  5. When someone wins, highlight the three squares that caused the win.
  6. When no one wins, display a message about the result being a draw.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square Component
function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight' : '');
  return (
    <button
      className={className}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// Board Component
class Board extends React.Component {
  renderSquare(i) {
    const winLine = this.props.winLine;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={winLine && winLine.includes(i)}
      />
    );
  }

  render() {
    // Use two loops to make the squares
    const boardSize = 3;
    let squares = [];
    for (let i = 0; i < boardSize; ++i) {
      let row = [];
      for (let j = 0; j < boardSize; ++j) {
        row.push(this.renderSquare(i * boardSize + j));
      }
      squares.push(<div key={i} className="board-row">{row}</div>);
    }
  
    return (
      <div>{squares}</div>
    );
  }
}

// Game Component
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          moveIndex: null                 // index of last move (0..8)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true     // move list order
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          moveIndex: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  handleSortToggle() {
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const stepNumber = this.state.stepNumber;
    const history = this.state.history;
    const current = history[stepNumber];
    const winInfo = calculateWinner(current.squares);
    const winner = winInfo.winner;
    const isAscending = this.state.isAscending;

    let moves = history.map((step, move) => {
      const moveIndex = step.moveIndex;
      const movePlayer = step.squares[moveIndex];
      const row = 1 + Math.floor(moveIndex / 3);
      const col = 1 + moveIndex % 3;

      const desc = move ?
        `Go to move #${move}: ${movePlayer} (${row}, ${col})` :
        'Go to game start';

      return (
        <li key={move}>
          {/* Bold the currently selected item */ }
          <button
            className={move === stepNumber ? 'move-list-item-selected' : ''}
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    // game status (winner, draw, or next player)
    let status;
    if (winner) {
      status = "Winner: " + winner;
    }
    else if (winInfo.isDraw) {
        status = "Draw";
    }
    else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    
    // sort move list (ascending [default], descending)
    if (!isAscending) {
      moves.reverse();
    }
  
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winLine={winInfo.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSortToggle()}>
            {isAscending ? 'descending' : 'ascending'}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // test for winner
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // winner
      return {
        winner: squares[a],
        line: lines[i],
        isDraw: false
      }
    }
  }

  // test for draw
  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = true;
      break;
    }
  }

  return {
    winner: null,
    line: null,
    isDraw: isDraw
  };
}
