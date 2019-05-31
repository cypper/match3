/* global Phaser */

class Info extends Phaser.GameObjects.Container {
  constructor (scene, x, y, gameScene) {
    super(scene, x, y)

    this.gameScene = gameScene

    this.image = new Phaser.GameObjects.Image(scene, 0, 0, 'box').setOrigin(0, 0)
    this.text = new Phaser.GameObjects.Text(scene, 260, 100, '', {
      fontFamily: 'Fredoka One',
      color: '#baf3f6',
      fontSize: '16px',
      align: 'center'
    }).setOrigin(0.5)

    this.add(this.image)
    this.add(this.text)
  }

  setText (text) {
    this.text.setText(text)
  }
}

export default Info
