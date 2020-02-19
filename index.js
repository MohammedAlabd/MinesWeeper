let co = document.getElementById('colorPicker');
let rows = document.getElementById("inputHeight");
let cell = document.getElementById("inputWidth");
let boardArray = []
let numberOfOpendCells = 0
let numberOfNonMines = 0
let flagsNumber = 0
document.querySelector("#submit").addEventListener("click", makeGrid)

function makeGrid(event) {
  event.preventDefault()
  array = buildRandomArray(rows.value,cell.value)
  array = findMines(array)
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
      row.addEventListener('click', clickEvent);
      row.addEventListener('contextmenu', event => event.preventDefault());
      row.addEventListener('contextmenu', flagIt);
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
  

function clickEvent(event) {
  let target = event.target
  let i =parseInt(target.attributes.x.value)
  let j =parseInt(target.attributes.y.value)
  if(target.className === "9"){
    target.style.backgroundColor = 'red';
    GameOver()
    alert("gameover")
  }else if(target.className === "0" && target.attributes.opend.value === "0"){
    opendCellsCounter(target)
    openIt(target,true)
    openNighbours(i,j)

  }else{
    if(target.attributes.opend.value === "0"){
      opendCellsCounter(target)
      openIt(target)
    }
  }
  if (numberOfOpendCells === numberOfNonMines) alert("you win")
}

function openIt(target,IsZero = false){
  if(IsZero){
    target.innerHTML = ""
    target.style.backgroundColor = 'green';
  }else{
    target.innerHTML = target.className
  }
  removeEventListeners(target)
}

function opendCellsCounter(target){
  if (target.attributes.opend.value === "0"){
    target.attributes.opend.value = "1"
    numberOfOpendCells++
  }
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
        let target = boardArray[s][d]
        if(d<0||d===boardArray[0].length||(s===i&&d===j)) continue
        if(target.className === "0" && target.attributes.opend.value === "0" ){
          nibArrays.push(target)
          openIt(target,true)
          opendCellsCounter(target)
          
        }else if(target.attributes.opend.value === "0" && target.className != "0" ){
          openIt(target)
          opendCellsCounter(target)
        }
      }
    }
  }
  if (numberOfOpendCells === numberOfNonMines) alert("you win")
}

function GameOver(){
  boardArray.forEach(row => row.forEach(cell => {
    cell.innerHTML = cell.className
    removeEventListeners(cell)
  }))
}

function flagIt(event){
  let target = event.target
  if(target.innerHTML === "flag"){
    target.parentNode.addEventListener("click",clickEvent)
    target.parentNode.removeChild(target)
    flagsCounter(-1)
  }else if(target.innerHTML){
    target.removeChild(target.querySelector(".material-icons"))
    target.addEventListener("click",clickEvent)
    flagsCounter(-1)
  }else{
    event.target.innerHTML = `<i class="material-icons">flag</i>`
    target.removeEventListener("click",clickEvent)
    flagsCounter(+1)
  }
}

function removeEventListeners(target){
  target.removeEventListener("click",clickEvent)
  target.removeEventListener("contextmenu",flagIt)
}



function flagsCounter(int){
  flagsNumber += int
  document.querySelector("#number-of-flags").innerHTML = `The NUmber of Flags is ${flagsNumber}`
}


//TODO List
// 1- Add a flag when sombody clicks the right click button.--------- done -------------
// 2- remove the className


// I want to ask for 
// 1- is it better to make the open it function checking if its comming from openNighbours or not?
// 2- 