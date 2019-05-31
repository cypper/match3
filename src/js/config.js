export default {
  gameWidth: 1000,
  gameHeight: 800,
  images: {
    item1: './assets/images/game/gem-01.png',
    item2: './assets/images/game/gem-02.png',
    item3: './assets/images/game/gem-03.png',
    item4: './assets/images/game/gem-04.png',
    item5: './assets/images/game/gem-05.png',
    item6: './assets/images/game/gem-06.png',
    background: './assets/images/backgrounds/background.jpg',
    playButton: 'assets/images/btn-play.png',
    score: 'assets/images/bg-score.png',
    logo: 'assets/images/donuts_logo.png',
    music: 'assets/images/btn-sfx.png',
    timer: 'assets/images/bg-timer.png',
    hand: 'assets/images/game/hand.png',
    timeout: 'assets/images/text-timeup.png'
  },
  sounds: {
    music: ['assets/audio/background.mp3']
  },
  levels: [
    {
      name: 'tutorial',
      grid: {
        rowLength: 3,
        colLength: 3,
        itemWidth: 80,
        itemHeight: 80,
        itemScale: 0.9,
        values: [
          'item3', 'item1', 'item2',
          'item3', 'item5', 'item1',
          'item4', 'item6', 'item1'
        ]
      },
      scoreReach: 30,
      time: 1500
    },
    {
      name: '1',
      grid: {
        rowLength: 5,
        colLength: 5,
        itemWidth: 80,
        itemHeight: 80,
        itemScale: 0.9
      },
      scoreReach: 200,
      time: 130
    },
    {
      name: '2',
      grid: {
        rowLength: 5,
        colLength: 6,
        itemWidth: 80,
        itemHeight: 80,
        itemScale: 0.9
      },
      scoreReach: 350,
      time: 120
    },
    {
      name: '3',
      grid: {
        rowLength: 6,
        colLength: 6,
        itemWidth: 80,
        itemHeight: 80,
        itemScale: 0.9
      },
      scoreReach: 500,
      time: 100
    },
    {
      name: '4',
      grid: {
        rowLength: 7,
        colLength: 6,
        itemWidth: 80,
        itemHeight: 80,
        itemScale: 0.9
      },
      scoreReach: 700,
      time: 90
    },
    {
      name: '5',
      grid: {
        rowLength: 8,
        colLength: 6,
        itemWidth: 80,
        itemHeight: 80,
        itemScale: 0.9
      },
      scoreReach: 900,
      time: 80
    },
    {
      name: '6',
      grid: {
        rowLength: 9,
        colLength: 6,
        itemWidth: 80,
        itemHeight: 80,
        itemScale: 0.9
      },
      scoreReach: 1100,
      time: 80
    },
    {
      name: '7',
      grid: {
        rowLength: 12,
        colLength: 6,
        itemWidth: 80,
        itemHeight: 80,
        itemScale: 0.9
      },
      scoreReach: 1500,
      time: 60
    }
  ],
  gridItems: {
    item1: { texture: 'item1' },
    item2: { texture: 'item2' },
    item3: { texture: 'item3' },
    item4: { texture: 'item4' },
    item5: { texture: 'item5' },
    item6: { texture: 'item6' }
  }
}
