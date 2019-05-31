/* global Phaser */

import config from '../config.js'
import Score from '../gui/score.js'
import Timer from '../gui/timer.js'
import Info from '../gui/info.js'
import Music from '../gui/music.js'
import Tutorial from '../gui/tutorial.js'
import LevelMenu from '../menu/level.menu.js'

class GUIScene extends Phaser.Scene {
  constructor () {
    super('GUIScene')
  }

  init () {
    this.score = 0
  }

  preload () {
  }

  create () {
    this.gameScene = this.scene.get('GameScene')

    this.score = new Score(this, 0, 0, this.gameScene)
    this.score.setScale(0.8)
    this.add.existing(this.score)

    this.timer = new Timer(this, config.gameWidth - 200, 0, this.gameScene)
    this.timer.setScale(0.8)
    this.add.existing(this.timer)

    this.info = new Info(this, config.gameWidth / 2 - 200, config.gameHeight - 150, this.gameScene)
    this.info.setScale(0.8)
    this.add.existing(this.info)

    this.music = new Music(this, config.gameWidth - 100, config.gameHeight - 100, this.gameScene)
    this.add.existing(this.music)
  }

  update () {
    this.timer.update()
  }

  levelWin () {
    this.stopLevel()
    this.levelMenu = new LevelMenu(this, config.gameWidth / 2 - 250, 0, [
      {
        text: 'Next level',
        onClick: () => {
          this.levelMenu.destroy()
          this.gameScene.events.emit('next-level')
        }
      },
      {
        text: 'Restart',
        onClick: () => {
          this.levelMenu.destroy()
          this.gameScene.events.emit('restart-level')
        }
      },
      {
        text: 'Main menu',
        onClick: () => {
          this.levelMenu.destroy()
          this.gameScene.events.emit('main-menu')
        }
      }
    ])
    this.add.existing(this.levelMenu)
  }

  startLevel (level, scoreReach, time) {
    this.info.setText(`Level: ${level}\nScore: ${scoreReach}\nTime: ${time} sec`)
    this.timer.startTimer(time)
    this.score.setScore(0, scoreReach)
  }

  stopLevel () {
    this.timer.stopTimer()
  }

  gameWin () {
    this.stopLevel()
    this.info.setText(`You have won the game`)
    const image = new Phaser.GameObjects.Image(
      this,
      config.gameWidth / 2,
      config.gameHeight - 200,
      'logo'
    )
    image.setScale(0.7)
    this.add.existing(image)

    this.levelMenu = new LevelMenu(this, config.gameWidth / 2 - 250, 0, [
      {
        text: 'Main menu',
        onClick: () => {
          image.destroy()
          this.levelMenu.destroy()
          this.gameScene.events.emit('main-menu')
        }
      }
    ])
    this.add.existing(this.levelMenu)
  }

  gameOver () {
    this.stopLevel()
    this.info.setText(`You lost`)
    const image = new Phaser.GameObjects.Image(
      this,
      config.gameWidth / 2,
      config.gameHeight - 200,
      'timeout'
    )
    this.add.existing(image)

    this.levelMenu = new LevelMenu(this, config.gameWidth / 2 - 250, 0, [
      {
        text: 'Main menu',
        onClick: () => {
          image.destroy()
          this.levelMenu.destroy()
          this.gameScene.events.emit('main-menu')
        }
      }
    ])
    this.add.existing(this.levelMenu)
  }

  showTutorial () {
    this.tutorial = new Tutorial(this, 0, 0)
    this.add.existing(this.tutorial)
  }

  hideTutorial () {
    this.tutorial.destroy()
  }
}

export default GUIScene
