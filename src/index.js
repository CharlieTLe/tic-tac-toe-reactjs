import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let squareClass = "square"
    if (props.winningSquare) {
        squareClass += " winner"
    }
    return (
        <button 
        className={squareClass}
        onClick={() => props.onClick()}>
        {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let winningSquare = false
        if (this.props.winner.includes(i)) {
            winningSquare = true
        }
        return (
            <Square key={i}
                    value={this.props.squares[i]} 
                    onClick={() => this.props.onClick(i)}
                    winningSquare={winningSquare}
            />
        );
         
    }
    
    render() {
        let rows = []
        let squares = []
        for (let i = 0; i < 9; i++) {
            squares.push(this.renderSquare(i))
            if ((i+1) % 3 === 0) {
                rows.push(<div key={i} className="board-row">{squares}</div>)
                squares = []
            }
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                index: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            orderDesc: true, 
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                index: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    toggleOrder() {
        this.setState({
            orderDesc: !this.state.orderDesc
        })
    }

    boldText(cond, text) {
        if (cond) {
            return <b>{text}</b>
        } 
        return text;
    }

    getMoves(reversed) {
        let ret = this.state.history.slice().map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start'

            let coord = ''
            if (step.index != null) {
                coord = '(' + Number.parseInt(step.index / 3, 10) + ',' + (step.index % 3) + ')'
            }

            let text = this.boldText(this.state.stepNumber === move, desc + ' ' + coord)
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{text}</button>
                </li>
            )
        })
        return reversed ? ret.reverse() : ret
    }

    render() {
        var history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = this.getMoves(!this.state.orderDesc)

        let status;
        let line = [];
        if (winner) {
            status = 'Winner: ' + winner.player;
            line = winner.line
        } else if (!current.squares.includes(null)) {
            status = 'Draw'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        xIsNext={this.state.xIsNext}
                        winner={line}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <button onClick={() => this.toggleOrder()}>Toggle order</button>
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
        return {player: squares[a], line: lines[i]};
      }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);