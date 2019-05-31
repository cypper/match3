/* global Phaser */

import config from '../config.js'

class MenuScene extends Phaser.Scene {
  constructor () {
    super('MenuScene')
  }

  init () {
  }

  preload () {
  }

  create () {
    this.add.image(0, 0, 'background').setOrigin(0, 0)
    this.scene.launch('GameScene')
    this.scene.launch('GUIScene')

    this.guiScene = this.scene.get('GUIScene')
    this.gameScene = this.scene.get('GameScene')

    this.add.image(
      config.gameWidth / 2,
      120,
      'logo'
    )

    this.play = this.add.image(config.gameWidth / 2, config.gameHeight / 2, 'playButton')
    this.play.setInteractive()
      .on('pointerdown', () => {
        this.scene.sendToBack('MenuScene')
        this.scene.pause()
        this.gameScene.beginGame()
      })
      .on('pointerover', () => {
        this.play.setScale(1.1)
      })
      .on('pointerout', () => {
        this.play.setScale(1)
      })

    this.scene.bringToTop('MenuScene')
  }

  update () {

  }
}

export default MenuScene
