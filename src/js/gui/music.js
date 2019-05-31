/* global Phaser */

class Music extends Phaser.GameObjects.Container {
  constructor (scene, x, y, gameScene) {
    super(scene, x, y)

    this.gameScene = gameScene
    this.playing = true
    this.image = new Phaser.GameObjects.Image(scene, 0, 0, 'music').setOrigin(0, 0).setScale(0.5)
    this.add(this.image)

    this.image.setInteractive().on('pointerdown', () => {
      if (this.playing) {
        this.gameScene.events.emit('mute-music')
      } else {
        this.gameScene.events.emit('unmute-music')
      }
    })
  }

  musicOn () {
    this.playing = true
    this.image.clearTint()
  }

  musicOff () {
    this.playing = false
    this.image.setTint('#aaaaaa')
  }
}

export default Music
