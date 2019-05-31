/* global Phaser */

import '@babel/polyfill'

import config from './config.js'
import BootScene from './scenes/boot.scene.js'
import MenuScene from './scenes/menu.scene.js'
import GameScene from './scenes/game.scene.js'
import GUIScene from './scenes/gui.scene.js'

const phaserConfig = {
  type: Phaser.AUTO,
  width: config.gameWidth,
  height: config.gameHeight,
  scene: [BootScene, MenuScene, GameScene, GUIScene]
}

const game = new Phaser.Game(phaserConfig)
