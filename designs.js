let co = document.getElementById('colorPicker');
let rows = document.getElementById("inputHeight");
let cell = document.getElementById("inputWidth");
let boardArray = []
let numberOfOpendCells = 0
let numberOfNonMines = 0
document.querySelector("#submit").addEventListener("click", makeGrid)

function findMines(array){
  //defining a new array for the result and other one for the row that we are working on
  let resuatArray = []
  let rowArray = []
  //itrate on the array elemnts inside the big array ore the sourc input
  array.forEach((row,i)=>{
      //using map to make a new array "new row" that will hold our solution
      rowArray = row.map((e,j)=>{
          //if its mine return 9
          if (e===1){return 9}
          //if its not mine go count the number of nighburs and return thes nubmer and we will do that by calling a new function
          else{return checkNighbours(i,j,array)}
      })
      //push that new row into my resultArray and start from again for a new row "new array elemnt"
      resuatArray.push(rowArray)
  })
  //yeahhhhhh we did it ;)
  return resuatArray
  }
  
  
  //checking the nighbours mins
  //"i" and "j" is the indexes of the targeted element
  function checkNighbours(i,j,array){
      let sum = 0
      //i will make a loop start form "i-1" to "i+1" to travers to the rows "the row above the elemet 'i-1'" and "the row below yhe elemnt 'i+1'" and the arrow of the elemnt itself "i"
      for (let s = i-1; s <= i+1; s++) {
          if(s<0||s===array.length) continue
          
          //inside this loop i have tho othe one wich is from "j-1" to "j+1" to check the elements
          for (let d = j-1; d <=j+1; d++) {
              if(d<0||d===array[0].length) continue
              sum +=array[s][d]
              //the sum of those 8 elemnt will present the number of nighbours mins
          }
      }
      return sum
  }
   //build an random array
  function buildRandomArray(rows,coloums){
      let minesSum = 0
      let array = []
      for (let index = 0; index < rows; index++) {
          let row = []
          for (let index2 = 0; index2 <coloums; index2++) {
              let isMine = Math.round(Math.random()-0.4)
              row.push(isMine)
              if (isMine === 1) ++ minesSum
          }
          array.push(row)
      }
      numberOfNonMines = (rows*coloums) - minesSum
      document.querySelector("#number-of-mines").innerHTML = `The number of Mines is ${minesSum}`
      document.querySelector("#number-of-nonMines").innerHTML = `The number of Non-Mines cells is ${numberOfNonMines}`    
      return array
  }
  


function makeGrid(event) {
  array = buildRandomArray(rows.value,cell.value)
  array = findMines(array)
  event.preventDefault()
  numberOfOpendCells = 0
  const table = document.querySelector("#pixelCanvas");
  table.innerHTML = ""
  for (let i = 0; i < rows.value; i++) {
    const colum = document.createElement('tr');
    table.appendChild(colum);
    for (let j = 0; j < cell.value; j++) {
      const row = document.createElement('td');
      colum.appendChild(row);
      row.className = array[i][j]
      row.addEventListener('click', openIt);
      row.setAttribute("x",i)
      row.setAttribute("y",j)
      row.setAttribute("opend","0")
    }
  }

  //make an array for the cells of board
  let boardRowsArray = document.querySelectorAll("table tr")
  boardArray = []
  for (let index = 0; index < boardRowsArray.length; index++) { 
    let array = boardRowsArray[index].querySelectorAll("td")
    boardArray.push(array)
  } 
}

function openIt(event) {
  let target = event.target
  let i =parseInt(target.attributes.x.value)
  let j =parseInt(target.attributes.y.value)
  // isMine(target)
  if(target.className === "9"){
    target.style.backgroundColor = 'red';
    openAll()
    alert("gameover")
  }else if(target.className === "0" && target.attributes.opend.value === "0"){
    ifNotOpenThenCount(target)
    target.style.backgroundColor = 'green';
    openNighbours(i,j)

  }else{
    if(target.attributes.opend.value === "0"){
      ifNotOpenThenCount(target)
      target.innerHTML = target.className
    }
  }
  if (numberOfOpendCells === numberOfNonMines) alert("you win")
}


function openNighbours(i,j){
  let nibArrays = [boardArray[i][j]]
  for (let index = 0; index < nibArrays.length; index++) {
    let target = nibArrays[index];
    let i =parseInt(target.attributes.x.value)
    let j =parseInt(target.attributes.y.value)
  
    for (let s = i-1; s <= i+1; s++) {
      if(s<0||s===boardArray.length) continue
      
      for (let d = j-1; d <=j+1; d++) {
        if(d<0||d===boardArray[0].length||(s===i&&d===j)) continue
        if(boardArray[s][d].className === "0" && boardArray[s][d].attributes.opend.value === "0" ){
          nibArrays.push(boardArray[s][d])
          boardArray[s][d].style.backgroundColor = 'green'
          ifNotOpenThenCount(boardArray[s][d])
          
        }else if(boardArray[s][d].attributes.opend.value === "0" && boardArray[s][d].className != "0" ){
          boardArray[s][d].innerHTML = boardArray[s][d].className
          ifNotOpenThenCount(boardArray[s][d])
        }
      }
    }
  }
  if (numberOfOpendCells === numberOfNonMines) alert("you win")
}

function ifNotOpenThenCount(target){
  if (target.attributes.opend.value === "0"){
    target.attributes.opend.value = "1"
    numberOfOpendCells++
  }
}

function openAll(){
  boardArray.forEach(row => row.forEach(cell => cell.innerHTML = cell.className))
}

// function isMine(target){
  // if(target.className === "9"){
    // target.style.backgroundColor = 'red';
    // openAll()
    // alert("gameover")
  // }else if(target.className === "0" && target.attributes.opend.value === "0"){
    // ifNotOpenThenCount(target)
    // target.style.backgroundColor = 'green';
    // openNighbours(i,j)
    // if (numberOfOpendCells === numberOfNonMines) alert("you win")
  // }else{
    // if(target.attributes.opend.value === "0"){
      // ifNotOpenThenCount(target)
      // target.innerHTML = target.className
      // if (numberOfOpendCells === numberOfNonMines) alert("you win")
    // }
  // }
// }
