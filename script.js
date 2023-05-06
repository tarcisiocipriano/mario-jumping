const uiEl = document.querySelector('.ui')
const btnStart = document.querySelector('.btn-start')
const marioEl = document.querySelector('.mario')
const pipeEl = document.querySelector('.pipe')
const cloudsEl = document.querySelector('.clouds')

const themeSound = document.getElementById('theme-sound')
themeSound.volume = .7

const jumpSound = document.getElementById('jump-sound')
jumpSound.volume = 0.05

const dieSound = document.getElementById('die-sound')
dieSound.volume = 0.3

let score = 0

class Mario {
  constructor(element) {
    this.element = element
    this.isAlive = true
    this.element.addEventListener('animationend', e => {
      if (e.animationName === 'mario--jump') {
        element.classList.remove('mario--jump')
      }
    })
  }

  die() {
    this.isAlive = false
    this.element.style.bottom = `${this.getY()}px`
    this.element.classList.remove('mario--jump')
    this.element.src = './imgs/mario-dead.png'
    this.element.classList.add('mario--dead')
  }

  run() {
    this.isAlive = true
    this.element.style.bottom = ''
    this.element.classList.remove('mario--dead')
    this.element.src = './imgs/mario-run.gif'
  }

  jump() {
    this.element.classList.add('mario--jump')
  }

  getY() {
    return +window.getComputedStyle(this.element).bottom.replace('px', '')
  }
}

class Pipe {
  constructor(element) {
    this.element = element
    this.element.addEventListener('animationiteration', e => {
      if (e.animationName === 'pipe--animation') {
        score++
        updateScore()
      }
    })
  }

  move() {
    this.element.classList.add('pipe--animation')
  }

  stop() {
    this.element.style.left = `${this.getX()}px`
    this.element.classList.remove('pipe--animation')
  }

  getX() {
    return this.element.offsetLeft
  }

  reset() {
    this.element.style.left = ''
  }
}

class Clouds {
  constructor(element) {
    this.element = element
  }

  move() {
    this.element.classList.add('clouds--animation')
  }

  stop() {
    this.element.style.left = `${this.element.offsetLeft}px`
    this.element.classList.remove('clouds--animation')
  }

  reset() {
    this.element.style.left = ''
  }
}

class GameInterface {
  constructor(element) {
    this.element = element
    this.buttonElement = element.querySelector('.btn-start')
    this.scoreElement = element.querySelector('.score')
  }

  hideButton() {
    this.buttonElement.style.display = 'none'
  }

  showButton() {
    this.buttonElement.style.display = ''
  }

  hideScore() {
    this.scoreElement.style.display = 'none'
  }

  showScore() {
    this.scoreElement.style.display = ''
  }

  updateScore() {
    this.scoreElement.innerText = score
  }
}

const ui = new GameInterface(uiEl)
const mario = new Mario(marioEl)
const pipe = new Pipe(pipeEl)
const clouds = new Clouds(cloudsEl)

btnStart.addEventListener('click', function () {
  startGame()

  const loop = setInterval(function () {
    if (pipe.getX() <= 120 && pipe.getX() > 0 && mario.getY() <= 80) {
      gameOver()
      clearInterval(loop)
    }
  }, 10)
})

function startGame() {
  themeSound.play()
  ui.hideButton()
  ui.showScore()
  resetGame()
  startAnimations()
}

function startAnimations() {
  pipe.move()
  clouds.move()
  mario.run()
}

function resetGame() {
  clouds.reset()
  pipe.reset()
  resetScore()
}

function updateScore() {
  ui.updateScore()
}

function resetScore() {
  score = 0
  ui.updateScore()
}

function gameOver() {
  themeSound.pause()
  dieSound.play()
  ui.showButton()
  mario.die()
  pipe.stop()
  clouds.stop()
  ui.showButton()
}

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space' && mario.isAlive) {
    jumpSound.currentTime = 0
    jumpSound.play()
    mario.jump()
  }
})
