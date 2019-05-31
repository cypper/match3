/* global Phaser */

import config from '../config.js'

class GridItem extends Phaser.GameObjects.Container {
  constructor (scene, x, y, itemId, onClick, onOut) {
    const itemConfig = config.gridItems[itemId]
    super(scene, x, y)

    this.image = new Phaser.GameObjects.Image(scene, 0, 0, itemConfig.texture)
    this.image.setInteractive()
      .on('pointerdown', onClick.bind(null, this))
      .on('pointerout', onOut.bind(null, this))

    this.shadow = new Phaser.GameObjects.Image(scene, 5, 5, itemConfig.texture)
    this.shadow.setTint('#fff')
    this.shadow.setAlpha(0.6)

    this.add(this.shadow)
    this.add(this.image)

    this.id = Math.round(Math.random() * 1000000000000)
    this.itemId = itemId
  }
}

export default GridItem
