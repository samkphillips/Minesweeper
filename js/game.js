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
  constructor(id, xCoord, yCoord, parent) {
    this.id = id
    this.parent = parent

    this.cellElement = document.createElement('div')
    this.cellElement.className = 'cell'

    this.cellElement.innerHTML = `<p> </p>`

    this.isMine = false
    this.isRevealed = false
    this.isFlagged = false

    this.minesNearby = 0

    this.location = { x: xCoord, y: yCoord }

    //left click listener
    this.cellElement.addEventListener('click', (e) => {
      // console.log(
      //   `My id is ${this.id} and I am at ${this.location.x}, ${this.location.y}`
      // )
      //this.cellElement.className = 'cell a'

      //crude game logic just to check
      if (this.isMine) {
        this.cellElement.innerHTML = `<p>MINE</p>`
      } else {
        this.cellElement.style.backgroundColor = 'white'
        this.cellElement.innerHTML = `<p>${this.minesNearby}</p>`
      }
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

  reveal() {
    //if not a mine, reveal number
    //if it is a mine, game over
    //does nothing if trying to reveal a flagged cell
  }

  markFlag() {
    //marks cell with flag
  }
}

class Grid {
  constructor() {
    //maybe add board size variation later. for now:
    this.width = 8
    this.height = 10

    //initialize an array
    this.cells = [...Array(this.width)].map(() => Array(this.height))

    let cellCount = 0

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let c = new Cell(cellCount, x, y, this)
        this.cells[x][y] = c
        GRIDCONTAINER.appendChild(c.cellElement)
        cellCount++
      }
    }

    //loop to add some mines. Should add a way to tweak this later on, if difficulty is added
    for (let i = 0; i < 10; i++) {
      let newMine = this.cells[randInt(0, this.width)][randInt(0, this.height)]

      while (newMine.isMine) {
        //this is dumb but effective
        newMine = this.cells[randInt(0, this.width)][randInt(0, this.height)]
      }

      newMine.isMine = true
      //newMine.cellElement.innerHTML = `<p>MINE</p>`
    }

    this.updateGridCount()
  }

  getNeighbors(xCoord, yCoord) {
    //returns a list of all neighbors to a given cell location, but NOT the cell mentioned
    //i.e., the below pattern, it gives the Xs but not the O
    //XXX
    //XOX
    //XXX
    let neighbors = []

    //all these dumb conditionals ignore edges of grid
    if (xCoord > 0) {
      if (yCoord > 0) {
        neighbors.push(this.cells[xCoord - 1][yCoord - 1]) //top left
      }
      if (yCoord < this.height - 1) {
        neighbors.push(this.cells[xCoord - 1][yCoord + 1]) //bottom left
      }
      neighbors.push(this.cells[xCoord - 1][yCoord]) //mid left
    }

    if (xCoord < this.width - 1) {
      if (yCoord > 0) {
        neighbors.push(this.cells[xCoord + 1][yCoord - 1]) //top right
      }
      if (yCoord < this.height - 1) {
        neighbors.push(this.cells[xCoord + 1][yCoord + 1]) //bottom right
      }
      neighbors.push(this.cells[xCoord + 1][yCoord]) //mid right
    }

    if (yCoord > 0) {
      neighbors.push(this.cells[xCoord][yCoord - 1]) //top
    }
    if (yCoord < this.height - 1) {
      neighbors.push(this.cells[xCoord][yCoord + 1]) //bottom
    }

    return neighbors
  }

  updateGridCount() {
    //loops through all cells, updates count of neighbors as needed
    this.cells.forEach((r) => {
      r.forEach((c) => {
        if (c.isMine) {
          //c.cellElement.innerHTML = `<p>MINE</p>`
        } else {
          let neighbors = this.getNeighbors(c.location.x, c.location.y)
          let mineCount = 0
          neighbors.forEach((nC) => {
            if (nC.isMine) {
              mineCount++
            }
          })
          //c.cellElement.innerHTML = `<p>${mineCount}</p>`
          c.minesNearby = mineCount
        }
      })
    })
  }
}

//let testArr = [new Cell('A'), new Cell('B'), new Cell('C')]

let g = new Grid()

//some helper functions as a kindess to myself
function randInt(lower, upper) {
  //returns random integer between lower and upper. includes lower, excludes upper
  return Math.floor(Math.random() * (upper - lower) + lower)
}
