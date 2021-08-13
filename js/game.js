//
const BODY = document.querySelector('body')
const GRIDCONTAINER = document.querySelector('.grid-container')
const RESETBUTTON = document.querySelector('.reset-button')
const DIFFICULTYSELECT = document.querySelector('.difficulty-select')
const MINESDISPLAY = document.querySelector('.mines-display')

const sizeOfCells = 30 //size in pixels of image used for the cell sprites

let gameActive = false

class Cell {
  constructor(id, xCoord, yCoord, parent) {
    this.id = id
    this.parent = parent

    this.cellElement = document.createElement('div')
    this.cellElement.className = 'cell'

    this.isMine = false
    this.isRevealed = false
    this.isFlagged = false

    this.minesNearby = 0

    this.location = { x: xCoord, y: yCoord }

    //left click listener
    this.cellElement.addEventListener('click', (e) => {
      if (gameActive) {
        if (!this.isFlagged) {
          this.reveal()
        }
      }
    })

    //right click listener
    this.cellElement.addEventListener('contextmenu', (e) => {
      e.preventDefault()

      if (gameActive) {
        if (!this.isRevealed) {
          if (this.isFlagged) {
            this.unMarkFlag()
          } else {
            this.markFlag()
          }
        }
      }
    })
  }

  reveal() {
    //if not a mine, reveal number
    //if it is a mine, game over
    if (this.isMine) {
      this.parent.lose()
      this.cellElement.className = 'cell killer-mine'
    } else {
      this.isRevealed = true
      this.cellElement.className = `cell reveal-${this.minesNearby}`

      if (this.parent.checkWin()) {
        this.parent.win()
      }
    }
  }

  markFlag() {
    //marks cell with flag
    this.isFlagged = true
    this.cellElement.className = 'cell flagged'
    this.parent.updateFlagCount()
  }

  unMarkFlag() {
    //removes flag
    this.isFlagged = false
    this.cellElement.className = 'cell'
    this.parent.updateFlagCount()
  }
}

class Grid {
  constructor(w, h, mines) {
    //maybe add board size variation later. for now:
    this.width = w
    this.height = h

    //size grid container
    GRIDCONTAINER.style.width = `${this.width * sizeOfCells}px`
    GRIDCONTAINER.style.height = `${this.height * sizeOfCells}px`
    GRIDCONTAINER.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`
    GRIDCONTAINER.style.gridTemplateRows = `repeat(${this.height}, 1fr)`

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

    //loop to add some mines
    this.startingMines = mines

    for (let i = 0; i < mines; i++) {
      let newMine = this.cells[randInt(0, this.width)][randInt(0, this.height)]

      while (newMine.isMine) {
        //this is dumb but effective
        newMine = this.cells[randInt(0, this.width)][randInt(0, this.height)]
      }

      newMine.isMine = true
    }

    this.updateGridCount()
    this.updateFlagCount()

    gameActive = true
  }

  getNeighbors(xCoord, yCoord) {
    //returns a list of all neighbors to a given cell location, but NOT the cell mentioned
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
        if (!c.isMine) {
          let neighbors = this.getNeighbors(c.location.x, c.location.y)
          let mineCount = 0
          neighbors.forEach((nC) => {
            if (nC.isMine) {
              mineCount++
            }
          })
          c.minesNearby = mineCount
        }
      })
    })
  }

  updateFlagCount() {
    let flagsPlaced = 0

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.cells[x][y].isFlagged) {
          flagsPlaced++
        }
      }
    }

    let flagsRemaining = this.startingMines - flagsPlaced

    MINESDISPLAY.innerHTML = `: ${flagsRemaining}`
  }

  checkWin() {
    //checks for a win!
    //loops through all cells and confirms all non-mine cells are revealed
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let c = this.cells[x][y]

        if (!c.isRevealed && !c.isMine) {
          return false
        }
      }
    }

    return true
  }

  win() {
    //display a win, end game, etc.
    MINESDISPLAY.innerHTML = ' You Win!'
    gameActive = false
  }

  lose() {
    //display a loss, end game, etc.
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let c = this.cells[x][y]
        if (c.isFlagged && !c.isMine) {
          c.cellElement.className = 'cell incorrect-flag'
        } else if (!c.isFlagged && c.isMine) {
          c.cellElement.className = 'cell mine'
        }
      }
    }

    gameActive = false
  }
}

//make the grid! Gets the ball rolling.
let g = new Grid(10, 8, 10) //easy

//reset stuff
const gameReset = function () {
  GRIDCONTAINER.innerHTML = ''

  switch (DIFFICULTYSELECT.value) {
    case 'easy':
      g = new Grid(10, 8, 10)
      break
    case 'medium':
      g = new Grid(18, 14, 40)
      break
    case 'hard':
      g = new Grid(24, 20, 99)
      break
    case 'stress-test':
      g = new Grid(200, 180, 8000)
      break
    default:
      g = new Grid(10, 8, 10)
  }
}

RESETBUTTON.addEventListener('click', gameReset)

//some helper functions as a kindess to myself
function randInt(lower, upper) {
  //returns random integer between lower and upper. includes lower, excludes upper
  return Math.floor(Math.random() * (upper - lower) + lower)
}
