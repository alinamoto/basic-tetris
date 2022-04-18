document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from((document.querySelectorAll('.grid div')));
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'red',
    'orange',
    'purple',
    'green',
    'blue'
  ]

  //  The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [0, 1, 2, width+2],
    [1, width+1, width*2+1, width*2],
    [0, width, width+1, width+2]
  ]
  const zTetramino = [
    [width, width+1, 1, 2],
    [0, width, width+1, width*2+1],
    [width, width+1, 1, 2],
    [0, width, width+1, width*2+1]
  ]
  const tTetramino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [0, 1, 2, width+1],
    [1, width+1, width*2+1, width]
  ]
  const oTetramino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]
  const iTetramino = [
    [1, width+1, width*2+1, width*3+1],
    [0, 1, 2, 3],
    [2, width+2, width*2+2, width*3+2],
    [0, 1, 2, 3]
  ]

  const theTetraminoes = [lTetromino, zTetramino, tTetramino, oTetramino, iTetramino]

  let startingPosition = 4
  let randomShape = Math.floor(Math.random() * theTetraminoes.length)
  let randomRotation = Math.floor(Math.random() * tTetramino.length)
  let currentShape = theTetraminoes[randomShape][randomRotation]
  let currentRotation = 0


  //  draw the first rotation in the first Tetrominoes
  function draw() {
    currentShape.forEach(index => {
      squares[startingPosition + index].classList.add('tetromino')
      squares[startingPosition + index].style.backgroundColor = colors[randomShape]
    })
  }

  // undraw the Tetrominoes
  function undraw() {
    currentShape.forEach(index => {
      squares[startingPosition + index].classList.remove('tetromino')
      squares[startingPosition + index].style.backgroundColor = ''
    })
  }

  //  assing keys to move the Tetrominoes
  function control(e) {
    if (e.keyCode === 37) {
      console.log('Move left')
      moveLeft()
    } else if (e.keyCode === 39) {
      console.log('Move right')
      moveRight()
    } else if (e.keyCode === 38) {
      console.log('Move up / rotate')
      rotate()
    } else if (e.keyCode === 40) {
      console.log('Move down')
      moveDown()
    } else { console.log('The key you have pressed is not an arrow')
    }
  }
  document.addEventListener('keyup', control)

  // make the tetromino move down
  function moveDown() {
    undraw()
    startingPosition += width
    draw()
    freeze()

  }
  // freeze function
  function freeze() {
    if (currentShape.some(index => squares[startingPosition + index + width].classList.contains('taken'))) {
      currentShape.forEach (index => squares[startingPosition + index].classList.add ('taken'))
      //  start a new tetromino falling
      randomShape = nextRandom
      nextRandom = Math.floor(Math.random() * theTetraminoes.length)
      randomRotation = Math.floor(Math.random() * tTetramino.length)
      currentShape = theTetraminoes[randomShape][randomRotation]
      startingPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  //  move the tetromino left, unless is at the adge, or there is a blockage
  function moveLeft () {
    undraw()
    const isAtLeftEdge = currentShape.some(index => (startingPosition + index) % width === 0)

    if (!isAtLeftEdge) startingPosition -=1

    if (currentShape.some(index => squares[startingPosition + index].classList.contains('taken'))) {
      startingPosition +=1

      draw()
    }
  }

  // move the tetromino right, unless is at the adge, or there is a blockage
  function moveRight () {
    undraw()
    const isAtRightEdge = currentShape.some(index => (startingPosition + index) % width === width - 1)

    if (!isAtRightEdge) startingPosition += 1

    if (currentShape.some(index => squares[startingPosition + index].classList.contains('taken'))) {
      startingPosition -= 1
      draw()
    }
  }
  //  rotate the tetraminoes
  function rotate () {
    undraw()
    currentRotation++
    if (currentRotation === currentShape.length) {
      //  if the current rotation goes to 4, aka max, make it go to 0, to start
      currentRotation = 0
    }
    currentShape = theTetraminoes[randomShape][currentRotation]
    draw()
  }

  //  show up-next tetrominoes in the mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  //  the tetraminoes without rotation
  const upNextTetraminoes = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [displayWidth, displayWidth+1, 1, 2],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
  ]

  //  display the shape in the mini-grid display
  function displayShape () {
    //  remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetraminoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  //  add functionality to the button
  startBtn.addEventListener('click', ()=>{
    if (timerId) { // not null
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 600)
      nextRandom = Math.floor(Math.random() * theTetraminoes.length)
      displayShape()
    }
  })

  //  add score
  function addScore () {
    for (let i=0; i < 199; i += width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //  game over
  function gameOver() {
    if (currentShape.some(index => squares[startingPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game Over'
      clearInterval(timerId)
    }
  }

})
