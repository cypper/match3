/* global Phaser */

class Score extends Phaser.GameObjects.Container {
  constructor (scene, x, y, gameScene) {
    super(scene, x, y)

    this.score = 0
    this.scoreReach = 0
    this.isScoreReached = false
    this.gameScene = gameScene

    this.image = new Phaser.GameObjects.Image(scene, 0, 0, 'score').setOrigin(0, 0).setScale(0.5)
    this.text = new Phaser.GameObjects.Text(scene, 130, 50, this.score, {
      color: '#baf3f6',
      fontSize: '30px',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5)

    this.add(this.image)
    this.add(this.text)
  }

  addScore (value) {
    this.score += value
    this.text.setText(this.score)

    if (this.score >= this.scoreReach && !this.isScoreReached) {
      this.gameScene.events.emit('score-reached')
      this.isScoreReached = true
    }
  }

  setScore (value, scoreReach) {
    this.scoreReach = scoreReach
    this.isScoreReached = false
    this.score = value
    this.text.setText(this.score)
  }
}

export default Score
