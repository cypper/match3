/* global Phaser */

import config from '../config.js'
import Grid from '../grid/grid.js'

class GameScene extends Phaser.Scene {
  constructor () {
    super('GameScene')
  }

  init () {
  }

  preload () {
  }

  create () {
    this.add.image(0, 0, 'background').setOrigin(0, 0)
    this.guiScene = this.scene.get('GUIScene')
    this.menuScene = this.scene.get('MenuScene')
    this.music = this.sound.add('music', { loop: true })
    this.music.play()

    this.currentLevel = 0

    this.events.on('main-menu', (index, id) => {
      this.currentLevel = 0
      this.menuScene.scene.bringToTop('MenuScene')
      this.menuScene.scene.resume()
    })

    this.events.on('restart-level', (index, id) => {
      this.restartLevel()
    })

    this.events.on('next-level', (index, id) => {
      this.nextLevel()
    })

    this.events.on('item-removed', (index, id) => {
      this.guiScene.score.addScore(10)
    })

    this.events.on('score-reached', () => {
      this.levelWin()
    })

    this.events.on('timeout', () => {
      this.gameOver()
    })

    this.events.on('mute-music', () => {
      this.muteMusic()
    })

    this.events.on('unmute-music', () => {
      this.unmuteMusic()
    })
  }

  unmuteMusic () {
    this.music.setMute(false)
    this.guiScene.music.musicOn()
  }

  muteMusic () {
    this.music.setMute(true)
    this.guiScene.music.musicOff()
  }

  async beginGame () {
    await this.startLevel(this.currentLevel)
  }

  async levelWin () {
    await this.cameraShake()
    const levelConfig = config.levels[this.currentLevel + 1]

    if (config.levels[this.currentLevel].name === 'tutorial') {
      this.guiScene.hideTutorial()
    }

    if (!levelConfig) {
      await this.gameWin()
    } else {
      this.scene.pause()
      this.guiScene.levelWin()
    }
  }

  async restartLevel () {
    await this.startLevel(this.currentLevel)
  }

  async nextLevel () {
    this.currentLevel++
    const levelConfig = config.levels[this.currentLevel]

    if (!levelConfig) {
      await this.gameWin()
    } else {
      await this.startLevel(this.currentLevel)
    }
  }

  async startLevel (level) {
    this.scene.resume()
    this.stopLevel()
    const levelConfig = config.levels[level]
    const gridConfig = levelConfig.grid
    this.guiScene.startLevel(levelConfig.name, levelConfig.scoreReach, levelConfig.time)

    const gridX = (config.gameWidth / 2) - (gridConfig.rowLength * gridConfig.itemWidth) / 2
    this.grid = new Grid(this, gridX, 100, gridConfig)
    this.add.existing(this.grid)

    await this.grid.flushGrid()
    this.grid.canMove = true

    if (levelConfig.name === 'tutorial') {
      this.guiScene.showTutorial()
    }
  }

  stopLevel () {
    if (this.grid) {
      this.grid.destroy()
      this.grid = null
    }
  }

  async gameWin () {
    await this.cameraShake()
    this.guiScene.gameWin()
    this.scene.pause()
  }

  async gameOver () {
    await this.cameraShake()
    this.guiScene.gameOver()
    this.scene.pause()
  }

  async cameraShake () {
    this.cameras.cameras[0].shake(500, 0.01, 0.01)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  update () {

  }
}

export default GameScene
