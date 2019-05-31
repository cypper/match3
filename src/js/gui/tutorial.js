/* global Phaser */

import config from '../config.js'

class Tutorial extends Phaser.GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, x, y)

    const image = new Phaser.GameObjects.Image(scene, config.gameWidth / 2 + 25, 200, 'hand')
    image.setScale(0.8)

    scene.add.tween({
      targets: [image],
      ease: 'Sine.easeInOut',
      duration: 1000,
      delay: 0,
      x: {
        getStart: () => config.gameWidth / 2 + 20,
        getEnd: () => config.gameWidth / 2 + 90
      },
      repeat: -1,
      yoyo: true
    })

    const textStyle = {
      fontFamily: 'Fredoka One',
      color: '#74777b',
      fontSize: '15px',
      align: 'left'
    }

    const scoreHint = new Phaser.GameObjects.Text(
      scene, 35, 80, `This is your score.
One donut equals 10 points.
Collect enough donuts
to finish a level`,
      textStyle
    )
    const timerHint = new Phaser.GameObjects.Text(
      scene, config.gameWidth - 170, 80, `This is timer.
If time would be out
you will lose`,
      textStyle
    )
    const infoHint = new Phaser.GameObjects.Text(
      scene, config.gameWidth / 2 - 130, config.gameHeight - 180, `This is your info board.
You can see here: level name, score goal, level time.
Also you would see here the status of the game`,
      textStyle
    )

    this.add(scoreHint)
    this.add(timerHint)
    this.add(infoHint)
    this.add(image)
  }
}

export default Tutorial
