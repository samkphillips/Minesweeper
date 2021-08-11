//
const BODY = document.querySelector('body')
const GRIDCONTAINER = document.querySelector('.grid-container')

class Cell {
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

      this.reveal()
    })

    //right click listener
    this.cellElement.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      // console.log(
      //   `My id is ${this.id} and I am at ${this.location.x}, ${this.location.y}`
      // )
      this.markFlag()
    })
  }

  reveal() {
    //if not a mine, reveal number
    //if it is a mine, game over
    //does nothing if trying to reveal a flagged cell

    // if minesNearby === 0, we need to flood-reveal.
    // I guess that might need to live in the parent Grid,
    // so that this can just call it and not have to worry
    // about excessively recurring or anything??
    // Buncha different ways I could write that.

    //crude game logic just to check
    if (this.isMine) {
      this.cellElement.innerHTML = `<p>MINE</p>`
    } else {
      this.cellElement.style.backgroundColor = 'white'
      this.cellElement.innerHTML = `<p>${this.minesNearby}</p>`
    }

    //this.parent.checkWin()
  }

  markFlag() {
    //marks cell with flag
    this.cellElement.className = 'cell b'
    this.cellElement.innerHTML = `<p>flag</p>`
  }
}

class Grid {
  constructor() {
    //maybe add board size variation later. for now:
    this.width = 8
    this.height = 10

    //initialize an array, this feels hacky but works??? So whatever
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

  checkWin() {
    //checks for a win!
    //loops through all cells and confirms all non-mine cells are revealed
  }
}

let g = new Grid()

// I think all I need to add the ability to reset is to:
// --dereference that Grid
// --clear GRIDCONTAINER
// --initialize a new Grid object.
// Might even be able to roll difficulty options straight into that reset function.
// Should double check how garbage collection works in JS, don't wanna have a memory leak

//some helper functions as a kindess to myself
function randInt(lower, upper) {
  //returns random integer between lower and upper. includes lower, excludes upper
  return Math.floor(Math.random() * (upper - lower) + lower)
}
