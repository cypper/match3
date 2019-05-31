/* global Phaser */

class MenuItem extends Phaser.GameObjects.Text {
  constructor (scene, x, y, text, onClick) {
    super(scene, x, y, text, {
      fontFamily: 'Fredoka One',
      color: '#bcf8f6',
      align: 'center',
      fontSize: 35
    })
    this.setOrigin(0.5)
    this.setScale(0.9)

    this.setInteractive()
      .on('pointerdown', onClick)
      .on('pointerover', () => {
        this.setScale(1)
      })
      .on('pointerout', () => {
        this.setScale(0.9)
      })
  }
}

export default MenuItem
