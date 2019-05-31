/* global Phaser */

class Timer extends Phaser.GameObjects.Container {
  constructor (scene, x, y, gameScene) {
    super(scene, x, y)

    this.gameScene = gameScene

    this.image = new Phaser.GameObjects.Image(scene, 0, 0, 'timer').setOrigin(0, 0).setScale(0.5)
    this.text = new Phaser.GameObjects.Text(scene, 130, 50, this.getTime(), {
      color: '#baf3f6',
      fontSize: '30px',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5)

    this.add(this.image)
    this.add(this.text)
  }

  async startTimer (time) {
    this.startTime = +new Date()
    this.endTime = this.startTime + time * 1000
    this.timeout = false

    await new Promise(async resolve => {
      while (!this.timeout) {
        await this._delaySecond()
        if (this.getDifference() < 0) {
          this.gameScene.events.emit('timeout')
          this.timeout = true
          resolve()
          break
        }
      }
    })
  }

  stopTimer () {
    this.timeout = true
  }

  update () {
    this.text.setText(this.getTime())
  }

  getDifference () {
    if (this.endTime) {
      return new Date(this.endTime - +new Date())
    } else {
      return new Date(0)
    }
  }

  getTime () {
    if (this.timeout) {
      return '--:--'
    } else {
      const difference = this.getDifference()
      return `${('0' + difference.getUTCMinutes()).slice(-2)}:${('0' + difference.getUTCSeconds()).slice(-2)}`
    }
  }

  _delaySecond () {
    return new Promise(resolve => setTimeout(resolve, 1000))
  }
}

export default Timer
