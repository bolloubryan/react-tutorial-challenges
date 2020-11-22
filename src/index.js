import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  var buttonid = "button"+String(props.id)
  return(
    <button 
    className="square"
    id={buttonid}
    onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return ( 
    <Square 
    id={i}
    value={this.props.squares[i]} 
    onClick={() => this.props.onClick(i)}
    />
    );
  }

  render() {
    //3. Rewrite Board to use two loops to make the squares instead of hardcoding them. Still getting Key error no issues
    var items = []
    var fill = []
    var counter = 0;
    for (var i=0; i<3;i++){
      for (var j=0; j<3; j++){
        fill.push(this.renderSquare(counter))
        counter += 1;
      }
      items.push(<div className="board-row">{fill}</div>)
      fill = []
    }
    return (
      <div>
        {items}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      coordinate: [],
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const cord = this.state.coordinate.slice(0, this.state.stepNumber); 
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
     //1 Display the location for each move in the format (col, row) in the move history list.
    switch (i){
      case 0:
        cord.push("1,1")
        break;
       case 1:
        cord.push("1,2")
        break;
       case 2:
        cord.push("1,3")
        break;
       case 3:
        cord.push("2,1")
        break;
       case 4:
        cord.push("2,2")
        break;
       case 5:
        cord.push("2,3")
        break;
       case 6:
        cord.push("3,1")
        break;
       case 7:
        cord.push("3,2")
        break;
       case 8:
        cord.push("3,3")
        break;
      default:
        break;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      coordinate:cord,

    });
   };

  jumpTo(step){
    clearHighlight()
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
    //2. Bold the currently selected item in the move list.
    for(var i=0; i<this.state.history.length;i++){
      document.getElementById('b'+String(i)).style.fontWeight = "normal"; 
      if (i === step){
        document.getElementById('b'+String(i)).style.fontWeight = "bold"; 
      }
    }
  }

  //4, Add a toggle button that lets you sort the moves in either ascending or descending order.
  sortList() {
    var childs = document.getElementById("steps").childNodes
    var reversedchilds = [].slice.call(childs, 0).reverse()
    var stepsol = document.getElementById("steps")
    stepsol.innerHTML ="";
      for(var i=0; i<reversedchilds.length;i++){
        stepsol.appendChild(reversedchilds[i])
      }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move)=> {
    const desc = move ?
      'Go to move #'+ move+' ('+this.state.coordinate[move-1]+')':
      'Go to game start';
      return (
        <li id={move} key={move}>
          <button id={'b'+String(move)} onClick={()=>this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner){
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: '+(this.state.xIsNext ? 'X':'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onClick={(i)=>this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button id="sorter" onClick={()=>this.sortList()}>Sort Steps</button>
          <ol id="steps">{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner (squares) {
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
  for (let i=0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 5 When someone wins, highlight the three squares that caused the win.
      for (let k=0; k<lines[i].length;k++){
      document.getElementById("button"+String(lines[i][k])).style.backgroundColor="#4CAF50"
      }
      return squares[a];
    } else {
      if (!squares.includes(null)){
        // 6 When no one wins, display a message about the result being a draw.
        return ("Is no one, you DRAWED.")
      }
    }
  }
  return null;
}

// 5 When someone wins, highlight the three squares that caused the win.
function clearHighlight (){
  for (let i=0;i<9;i++){
    if(document.getElementById("button"+String(i)).getAttribute("style")) {
      document.getElementById("button"+String(i)).style.backgroundColor=""
    }
}
}