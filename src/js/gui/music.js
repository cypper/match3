/* global Phaser */

class Music extends Phaser.GameObjects.Container {
  constructor (scene, x, y, gameScene) {
    super(scene, x, y)

    this.gameScene = gameScene
    this.mute = false
    this.image = new Phaser.GameObjects.Image(scene, 0, 0, 'music').setOrigin(0, 0).setScale(0.5)
    this.add(this.image)

    this.image.setInteractive().on('pointerdown', () => {
      if (!this.music) return

      if (this.music.isPlaying) {
        this.pauseMusic()
        this.mute = true
      } else {
        this.resumeMusic()
        this.mute = false
      }
    })
  }

  playSelectMusic () {
    if (!this.selectMusic) this.selectMusic = this.gameScene.sound.add('select')
    if (!this.selectMusic.isPlaying && !this.mute) this.selectMusic.play()
  }

  playKillMusic () {
    if (!this.killMusic) this.killMusic = this.gameScene.sound.add('kill')
    if (!this.killMusic.isPlaying && !this.mute) this.killMusic.play()
  }

  startMusic () {
    if (!this.music) {
      this.music = this.gameScene.sound.add('music', { loop: true })
      this.music.play()
    }
  }

  resumeMusic () {
    this.music.resume()
    this.image.clearTint()
  }

  pauseMusic () {
    this.music.pause()
    this.image.setTint('#aaaaaa')
  }
}

export default Music
