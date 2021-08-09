//
const BODY = document.querySelector('body')
const GRIDCONTAINER = document.querySelector('.grid-container')

class Cell {
  //fields:
  /*
  -cellElement: contains reference to html element this corresponds to
  -isMine: bool
  -isRevealed: bool
  -location: object with two fields: {x: x coord, y: y coord}
  --so the x coord would be referenced with like, cell.location.x
  */
  constructor(id, xCoord, yCoord) {
    this.id = id

    this.cellElement = document.createElement('div')
    this.cellElement.className = 'cell'

    this.cellElement.innerHTML = `<p>${this.id}</p>`

    this.location = { x: xCoord, y: yCoord }

    //left click listener
    this.cellElement.addEventListener('click', (e) => {
      console.log(
        `My id is ${this.id} and I am at ${this.location.x}, ${this.location.y}`
      )
      this.cellElement.className = 'cell a'
    })

    //right click listener
    this.cellElement.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      console.log(
        `My id is ${this.id} and I am at ${this.location.x}, ${this.location.y}`
      )
      this.cellElement.className = 'cell b'
    })
  }

  isMine() {
    //return true if this cell is a mine, false if not
  }

  reveal() {
    //if not a mine, reveal number
    //if it is a mine, game over
  }

  isRevealed() {
    //return true if revealed, false otherwise
  }

  markFlag() {
    //marks cell with flag
  }

  isFlagged() {
    //return true if flagged, false otherwise
  }
}

class Grid {
  constructor() {
    //generate the board
    //fill it with cells

    let cellCount = 0

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 8; x++) {
        let c = new Cell(cellCount, x, y)
        GRIDCONTAINER.appendChild(c.cellElement)
        cellCount++
      }
    }
  }
}

//let testArr = [new Cell('A'), new Cell('B'), new Cell('C')]

let g = new Grid()
