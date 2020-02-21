let minesMapArray = [];
let numberOfOpenedCells = 0;
let numberOfNonMines = 0;
let flagsNumber = 0;
document.querySelector("#submit").addEventListener("click", makeGame);

function makeGame(event) {
  event.preventDefault();
  const rows = document.getElementById("inputHeight").value;
  const columns = document.getElementById("inputWidth").value;
  if (rows > 50 || columns > 50)
    return alert("its too much, pleas chose numbers below 50");
  renderFlagsNumber(0);
  numberOfOpenedCells = 0;
  minesMapArray = createMinesMapArray(rows, columns);
  makeGrid(rows, columns);
}

function makeGrid(rows, columns) {

  const table = document.querySelector("#pixelCanvas");
  table.innerHTML = "";
  for (let i = 0; i < rows; i++) {
    const column = document.createElement("tr");
    table.appendChild(column);
    for (let j = 0; j < columns; j++) {
      const node = document.createElement("td");
      column.appendChild(node);
      minesMapArray[i][j].node = node;
      addEventListeners(node, i, j);
    }
  }
}

function createMinesMapArray(rows, columns) {
  let initializeMinesMapArray = buildRandomArray(rows, columns);
  return findMines(initializeMinesMapArray);
}

function buildRandomArray(rows, columns) {
  let minesSum = 0;
  let initializeMinesMapArray = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      let isMine = Math.round(Math.random() - 0.4);
      row.push(isMine);
      if (isMine) ++minesSum;
    }
    initializeMinesMapArray.push(row);
  }
  numberOfNonMines = rows * columns - minesSum;
  renderTheNumbersOfMines(minesSum);
  return initializeMinesMapArray;
}

function renderTheNumbersOfMines(minesSum) {
  document.querySelector("#number-of-mines").innerHTML = `The number of Mines is ${minesSum}`;
  document.querySelector("#number-of-nonMines").innerHTML = `The number of Non-Mines cells is ${numberOfNonMines}`;
}

function findMines(initializeMinesMapArray) {
  return initializeMinesMapArray.map((row, i) => {
    return row.map((cell, j) => {
      if (cell === 1) {
        return {
          content: "*",
          isOpen: false,
          isFlagged: false
        };
      } else {
        const content = findTheSurroundingMines(i, j, initializeMinesMapArray);
        return {
          content: content,
          isOpen: false,
          isFlagged: false
        };
      }
    });
  });
}

function findTheSurroundingMines(i, j, array) {
  let sum = 0;
  loopOverNeighbors(i, j, array, (s, d) => {
    sum += array[s][d];
  });
  return sum;
}

function addEventListeners(node, i, j) {
  let leftClickListener = clickEventListener(i, j); //make the function which is will be in the listener
  minesMapArray[i][j].leftClickListener = leftClickListener; //store it in the map
  node.addEventListener("click", leftClickListener); //add the eventListener

  node.addEventListener("contextmenu", event => event.preventDefault());

  let rightClickListener = flagIt(i, j); //make the function which is will be in the listener
  minesMapArray[i][j].rightClickListener = rightClickListener; //store it in the map
  node.addEventListener("contextmenu", rightClickListener); //add the eventListener
}

function removeEventListeners(target, i, j) {
  target.removeEventListener("click", minesMapArray[i][j].leftClickListener);
  target.removeEventListener("contextmenu",minesMapArray[i][j].rightClickListener);
}

function clickEventListener(i, j) {
  return function() {
    let targetNode = minesMapArray[i][j].node;
    const content = minesMapArray[i][j].content;
    const isOpen = minesMapArray[i][j].isOpen;
    if (!isOpen) {
      if (content === "*") {
        targetNode.style.backgroundColor = "red";
        openAll();
        alert("Game Over");
      } else if (content === 0) {
        openIt(i, j, targetNode, true);
        openNeighbors(i, j);
      } else {
        openIt(i, j, targetNode, false);
      }
    }
    if (numberOfOpenedCells === numberOfNonMines) {
      openAll();
      alert("you win");
    }
  };
}

function flagIt(i, j) {
  return function() {
    let targetNode = minesMapArray[i][j].node;
    const isFlagged = minesMapArray[i][j].isFlagged;
    if (!isFlagged) {
      renderFlagInElement(targetNode);
      targetNode.removeEventListener(
        "click",
        minesMapArray[i][j].leftClickListener
      );
      minesMapArray[i][j].isFlagged = true;
      renderFlagsNumber(+1);
    } else {
      removeFlag(i, j);
    }
  };
}

function renderFlagsNumber(number) {
  if (number === 0) flagsNumber = 0;
  else flagsNumber += number;
  document.querySelector(
    "#number-of-flags"
  ).innerHTML = `The NUmber of Flags is ${flagsNumber}`;
}

function openIt(i, j, targetNode, isZero = false) {
  minesMapArray[i][j].isOpen = true;
  numberOfOpenedCells++;
  if (isZero) {
    renderCell(targetNode, "", "green");
  } else {
    renderCell(targetNode, minesMapArray[i][j].content);
  }
  removeEventListeners(targetNode, i, j);
}

function loopOverNeighbors(rowIndex, columnIndex, array, callback) {
  for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
    if (i < 0 || i === array.length) continue; //make sure not to take a zero index and not to cross the boundaries

    for (let j = columnIndex - 1; j <= columnIndex + 1; j++) {
      const isSameAsItself = i === rowIndex && j === columnIndex;
      if (j < 0 || j === array[rowIndex].length || isSameAsItself) continue; //make sure not to take a zero index and not to cross the boundaries
      callback(i, j);
    }
  }
}

function renderCell(targetNode, content, backgroundColor = null) {
  if (backgroundColor) {
    targetNode.style.backgroundColor = backgroundColor;
  }
  targetNode.innerHTML = content;
}

function openNeighbors(i, j) {
  loopOverNeighbors(i, j, minesMapArray, function(s, d) {
    const isOpen = minesMapArray[s][d].isOpen;
    if (!isOpen) {
      const hasNoNeighboringMines = minesMapArray[s][d].content < 1;
      if (hasNoNeighboringMines) {
        openIt(s, d, minesMapArray[s][d].node, true);
        openNeighbors(s, d);
      } else {
        openIt(s, d, minesMapArray[s][d].node, false);
      }
    }
  });
}

function openAll() {
  minesMapArray.forEach((row, i) =>
    row.forEach((targetElementObject, j) => {
      targetElementObject.node.innerHTML = targetElementObject.content;
      const isFlagged = targetElementObject.isFlagged;
      if (isFlagged) targetElementObject.node.style.backgroundColor = "orange";
      removeEventListeners(targetElementObject.node, i, j);
    })
  );
}

function removeFlag(i, j) {
  const targetNode = minesMapArray[i][j].node;
  targetNode.addEventListener("click", minesMapArray[i][j].leftClickListener);
  minesMapArray[i][j].isFlagged = false;
  targetNode.removeChild(targetNode.querySelector(".material-icons"));
  renderFlagsNumber(-1);
}

function renderFlagInElement(element) {
  element.innerHTML = `<i class="material-icons">flag</i>`;
}

//TODO List
// 1- Add a flag when somebody clicks the right click button. --------- done -------------
// 2- remove the className. ----- done -----------
// 3- remove the date attributes. ------done------
// 4- fix the removeEventListeners function. ------------ done ------------
// 5- add function to render the numbers of mines,non-mines. --------done-------
// 6- rename all target, node, cell to "targetNode".  -------- done -------
// 7- remove the left-click event listener from flagIt function.   -------- done -----
// 8- add some designing like shadows and border radios.

// I want to ask for
// 1-
