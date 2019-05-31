/* global Phaser */

import config from '../config.js'

class BootScene extends Phaser.Scene {
  constructor () {
    super('BootScene')
  }

  init () {

  }

  preload () {
    this.cameras.main.setBackgroundColor('#f9df88')
    const progressBarX = config.gameWidth / 2 - 160
    const progressBarY = config.gameHeight / 2 - 25
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0xf29c83, 0.5)
    progressBox.fillRect(progressBarX, progressBarY, 320, 50)

    this.load.on('progress', (value) => {
      progressBar.clear()
      progressBar.fillStyle(0xf29c83, 1)
      progressBar.fillRect(progressBarX + 10, progressBarY + 10, 300 * value, 30)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
    })

    for (const key in config.images) {
      this.load.image(key, config.images[key])
    }

    for (const key in config.sounds) {
      this.load.audio(key, config.sounds[key])
    }
  }

  create () {
    this.scene.start('MenuScene')
  }

  update () {

  }
}

export default BootScene
