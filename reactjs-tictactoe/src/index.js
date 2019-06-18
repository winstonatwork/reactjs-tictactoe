import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    //constructor(props) {
    //    super(props);

    //    this.state = {
    //        squares: Array(9).fill(null),
    //        //default, X goes first.
    //        xIsNext: true,
    //        winner: null
    //    };
    //}

    renderSquare(i) {
        return (<Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            currentStepNumber: 0,
            winner: null
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.currentStepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (this.state.winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            //using concat for immutability 
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
            currentStepNumber: history.length,
            winner: calculateWinner(squares)
        });
    }

    jumpTo(stepNumber) {
        this.setState({
            currentStepNumber: stepNumber,
            xIsNext: (stepNumber % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];

        this.state.winner = calculateWinner(current.squares);

        //UPDATE HISTORY LIST
        const moves = history.map((step, moveNumber) => {
            const desc = moveNumber ?
                'Go to move # ' + moveNumber :
                'Go to game start';
            return (
                <li key={moveNumber} >
                    <button onClick={() => this.jumpTo(moveNumber)}>{desc}</button>
                </li>
            );
        });

        //UPDATE STATUS
        let status;
        if (this.state.winner) {
            status = 'Winner: ' + this.state.winner;
        }
        else {
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

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


// HELPERS

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