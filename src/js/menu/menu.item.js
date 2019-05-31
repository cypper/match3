/* global Phaser */

class MenuItem extends Phaser.GameObjects.Text {
  constructor (scene, x, y, text, onClick) {
    super(scene, x, y, text, {
      color: '#baf3f6',
      align: 'center',
      fontStyle: 'bold',
      fontSize: 30
    })

    this.setInteractive()
      .on('pointerdown', onClick)
      .on('pointerover', () => {
        this.setScale(1.1)
      })
      .on('pointerout', () => {
        this.setScale(1)
      })
  }
}

export default MenuItem
