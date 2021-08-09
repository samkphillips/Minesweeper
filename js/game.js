console.log('JS is up')

// const testButton = document.querySelector('.test-button')

// testButton.addEventListener('click', () => {
//   console.log('Left click')
// })

// testButton.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
//   console.log('Right click')
// })

const BODY = document.querySelector('body')

class Cell {
  //fields:
  /*
  -cellElement: contains reference to html element this corresponds to
  -isMine: bool
  -isRevealed: bool
  -location: object with two fields: {x: x coord, y: y coord}
  --so the x coord would be referenced with like, cell.location.x
  */
  constructor(id) {
    this.id = id

    this.timesClicked = 0

    this.cellElement = document.createElement('div')

    this.cellElement.innerHTML = `<p>${this.id}</p>`

    //left click listener
    this.cellElement.addEventListener('click', (e) => {
      console.log(`My id is ${this.id}`)
      this.timesClicked++
      this.cellElement.innerHTML = `<p>${this.id} has been clicked: ${this.timesClicked}</p>`
    })

    //right click listener
    this.cellElement.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      console.log(`My id is ${this.id}`)
      this.timesClicked--
      this.cellElement.innerHTML = `<p>${this.id} has been clicked: ${this.timesClicked}</p>`
    })

    BODY.appendChild(this.cellElement)
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
  }
}

let testArr = [new Cell('A'), new Cell('B'), new Cell('C')]
