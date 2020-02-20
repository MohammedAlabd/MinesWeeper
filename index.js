let minesMapArray = []
let numberOfOpendCells = 0
let numberOfNonMines = 0
let flagsNumber = 0
document.querySelector("#submit").addEventListener("click", makeGame)

function makeGame(event) {
  event.preventDefault()
  const rows = document.getElementById("inputHeight").value;
  const cells = document.getElementById("inputWidth").value;
  if(rows > 50 || cells > 50) return alert("its too much, pleas chose numbers below 50")
  flagsCounter(0)
  numberOfOpendCells = 0
  minesMapArray = createMinesMapArray(rows,cells)
  makeGrid(rows,cells)
  addOurNodsToTheArray()
}

function makeGrid(rows,cells){
  arrayOfListeners = []
  const table = document.querySelector("#pixelCanvas");
  table.innerHTML = ""
  for (let i = 0; i < rows; i++) {
    const colum = document.createElement('tr');
    table.appendChild(colum);
    for (let j = 0; j < cells; j++) {
      const row = document.createElement('td');
      colum.appendChild(row);
      let leftClickListener = clickEventListener(i, j)
      minesMapArray[i][j].leftClickListener = leftClickListener
      row.addEventListener('click', leftClickListener);
      row.addEventListener('contextmenu', event => event.preventDefault());
      let rightClickListener = flagIt(i,j)
      minesMapArray[i][j].rightClickListener = rightClickListener
      row.addEventListener('contextmenu', rightClickListener);
    }
  }
}

function createMinesMapArray(rows,cells){
  let array = buildRandomArray(rows,cells)
  return findMines(array)  
     
}

function renderTheNumbersOfMines(minesSum){
  document.querySelector("#number-of-mines").innerHTML = `The number of Mines is ${minesSum}`
  document.querySelector("#number-of-nonMines").innerHTML = `The number of Non-Mines cells is ${numberOfNonMines}`    
}

function buildRandomArray(rows,coloums){
  let minesSum = 0
  let array = []
  for (let index = 0; index < rows; index++) {
      let row = []
      for (let index2 = 0; index2 <coloums; index2++) {
          let isMine = Math.round(Math.random()-0.4)
          row.push(isMine)
          if (isMine) ++minesSum
      }
      array.push(row)
  }
  numberOfNonMines = (rows*coloums) - minesSum
  renderTheNumbersOfMines(minesSum)
  return array
  }

function findMines(array){
  return array.map((row,i)=>{
    return row.map((cell,j)=>{
      if (cell===1){
        return {
          "number" : 9,
          "x":i,
          "y":j,
          "isOpen" : false,
          "isFlaged" : false,
        }
      }
      else{
        const number = checkNighbours(i,j,array)
        return {
          "number" : number,
          "x":i,
          "y":j,
          "isOpen" : false,
          "isFlaged" : false,
        }
      }
    })
  })
}

function addOurNodsToTheArray (){
  let boardRowsArray = document.querySelectorAll("table tr")
  boardRowsArray.forEach((row,i)=>{
    row.querySelectorAll("td").forEach((node,j) => {
      minesMapArray[i][j].node = node      
    })
  }) 
}

  //checking the nighbours mins
  //"i" and "j" is the indexes of the targeted element
function checkNighbours(i,j,array){
  let sum = 0
  loopOverNeightbors(i,j,array,(s,d)=>{
    sum += array[s][d]
  })
  return sum
}
  

function clickEventListener(i, j) {
  return function() {
    let target = event.target
    const number = minesMapArray[i][j].number
    const isOpen = minesMapArray[i][j].isOpen
    if(!isOpen){
      if( number === 9){
        target.style.backgroundColor = 'red';
        GameOver()
      }else if(number === 0){
        openIt(i,j,target,true)
        newOpenNeighbors(i,j)
      }else{
        openIt(i,j,target,false)
      }
    }
    if (numberOfOpendCells === numberOfNonMines) alert("you win")
  }
}

function openIt(i,j,target,isZero = false){
    minesMapArray[i][j].isOpen = true
    numberOfOpendCells++
  renderCell(target,isZero,minesMapArray[i][j].number)
  removeEventListeners(target,i,j)
}

function loopOverNeightbors(i,j,array,callback) {
  for (let s = i-1; s <= i+1; s++) {
    if(s<0||s===array.length) continue
      
    for (let d = j-1; d <=j+1; d++) {
      if(d<0||d===array[i].length||(s===i&&d===j)) continue
      callback(s, d)
    }
  }
}

function renderCell(target, isZero= false , number){
  if (isZero){
    target.innerHTML = ""
    target.style.backgroundColor = "green"
  }else{
    target.innerHTML = number
  }
}

function newOpenNeighbors(i, j) {
  loopOverNeightbors(i,j,minesMapArray,function(s, d) {
    const isOpen = minesMapArray[s][d].isOpen
    if(!isOpen){
      const hasNoNeighboringMines = minesMapArray[s][d].number < 1  
      if(hasNoNeighboringMines){
        openIt(s,d,minesMapArray[s][d].node, true)
        newOpenNeighbors(s, d)
      }else{
        openIt(s,d,minesMapArray[s][d].node,false)
      }
    }
  })
}

function GameOver(){
  minesMapArray.forEach((row,i) => row.forEach((cell,j) => {
    cell.node.innerHTML = cell.number
    const isFlaged = cell.isFlaged 
    if (isFlaged) cell.node.style.backgroundColor = "orange"
    removeEventListeners(cell.node,i,j)
  }))
  alert("gameover")
}

function removeFlag(i,j) {
  const target = minesMapArray[i][j].node
  target.addEventListener("click",clickEventListener)
  minesMapArray[i][j].isFlaged = false
  target.removeChild(target.querySelector(".material-icons"))
  flagsCounter(-1)
}

function renderFlagInElement(element) {
  element.innerHTML = `<i class="material-icons">flag</i>`
}

function flagIt(i,j){
  return function(){
    let target = event.target
    const isFlaged = minesMapArray[i][j].isFlaged
    if(isFlaged){
      removeFlag(i,j)
    }else{
      renderFlagInElement(event.target)
      target.removeEventListener("click",clickEventListener)
      minesMapArray[i][j].isFlaged   = true
      flagsCounter(+1)
    }
  }
}

function removeEventListeners(target,i,j){
  target.removeEventListener("click",minesMapArray[i][j].leftClickListener)
  target.removeEventListener("contextmenu",minesMapArray[i][j].rightClickListener)
}



function flagsCounter(int){
  if(int === 0) flagsNumber = 0
  else flagsNumber += int
  document.querySelector("#number-of-flags").innerHTML = `The NUmber of Flags is ${flagsNumber}`
}


//TODO List
// 1- Add a flag when sombody clicks the right click button. --------- done -------------
// 2- remove the className. ----- done -----------
// 3- remove the date attributes. ------done------
// 4- fix the removeEventListeners fuction ------------ done ------------
// 5- add function to render the numbers of mines,non-mines. --------done-------


// I want to ask for 
// 1- 