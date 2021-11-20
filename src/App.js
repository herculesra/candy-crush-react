import { useEffect, useState } from "react";
import blueCandy from './images/blue-candy.png';
import greenCandy from './images/green-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import redCandy from './images/red-candy.png';
import yellowCandy from './images/yellow-candy.png';
import blank from './images/blank.png';

const width = 8;
const candyColors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy
]

const App = () => {

  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];

      if (columnOfThree.every( square => currentColorArrangement[square] === decidedColor)) {
        columnOfThree.forEach( square => currentColorArrangement[square] = blank); //cleaning the image with blank
        return true;
      }
    }
  }

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];

      if (columnOfFour.every( square => currentColorArrangement[square] === decidedColor)) {
        columnOfFour.forEach( square => currentColorArrangement[square] = blank); //cleaning the image with blank
        return true;
      }
    }
  }

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];

      if (notValid.includes(i)) continue

      if (rowOfThree.every( square => currentColorArrangement[square] === decidedColor)) {
        rowOfThree.forEach( square => currentColorArrangement[square] = blank); //cleaning the image with blank
        return true;
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 38, 39, 46, 47, 53, 54, 55, 62, 63, 64];

      if (notValid.includes(i)) continue

      if (rowOfFour.every( square => currentColorArrangement[square] === decidedColor)) {
        rowOfFour.forEach( square => currentColorArrangement[square] = blank); //cleaning the image with blank
        return true;
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);

        if(isFirstRow && currentColorArrangement[i] === blank) {
          let randomNumber = Math.floor(Math.random() * candyColors.length);
          currentColorArrangement[i] = candyColors[randomNumber];
        }

        if ((currentColorArrangement[i + width]) === blank) {
          currentColorArrangement[i + width] = currentColorArrangement[i];
          currentColorArrangement[i] = blank;
        }
    }
  }

  const dragStart = (e) => {
    console.log('drag start')
    setSquareBeingDragged(e.target);
  }

  const dragDrop = (e) => {
    console.log('drag dragDrop')
    setSquareBeingReplaced(e.target);
  }

  const dragEnd = (e) => {
    console.log('drag dragEnd')
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));
    
    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');

    const validMoves = [
      squareBeingDraggedId -1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isColumOfFour = checkForColumnOfFour();
    const isColumOfThree = checkForColumnOfThree();
    const isRowOfFour = checkForRowOfFour();
    const isRowOfThree = checkForRowOfThree();

    if(squareBeingDraggedId &&
      validMove &&
      (isRowOfThree || isRowOfFour || isColumOfFour || isColumOfThree)) {
        setSquareBeingDragged(null);
        setSquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  }

  const createBoard = () => {

    const randomColorArrangement = [];

    for (let i = 0; i < width * width; i++){

      const randomNumberFrom0To5 = Math.floor(Math.random() * candyColors.length);
      const randomColor = candyColors[randomNumberFrom0To5];
      randomColorArrangement.push(randomColor);
    }

    setCurrentColorArrangement(randomColorArrangement);

  }


  useEffect(() => {
    createBoard();
  },[]);

  useEffect(() => {

    const timer = setInterval(() => {
      checkForColumnOfThree();
      checkForColumnOfFour();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement])
    }, 100);

    return () => clearInterval(timer);
  }, [checkForColumnOfFour, checkForColumnOfThree, checkForRowOfThree, checkForRowOfFour, moveIntoSquareBelow, currentColorArrangement]);
  
  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img 
            key={index}
            // style={{backgroundColor : candyColors}}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
