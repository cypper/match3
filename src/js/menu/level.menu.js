/* global Phaser */

import MenuItem from './menu.item.js'

class LevelMenu extends Phaser.GameObjects.Container {
  constructor (scene, x, y, items) {
    super(scene, x, y)
    this.menuItems = []

    this.image = new Phaser.GameObjects.Image(scene, 0, 0, 'box')
      .setOrigin(0, 0)
      .setScale(1, 2)
    this.add(this.image)

    for (const { text, onClick } of items) {
      this.addMenuItem(text, onClick)
    }
  }

  addMenuItem (text, onClick) {
    const menuItem = new MenuItem(this.scene, 250, 160 + this.menuItems.length * 40, text, onClick)
    this.menuItems.push(menuItem)
    this.add(menuItem)
  }
}

export default LevelMenu
