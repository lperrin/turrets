module.exports = {
  turret: {
    cost: 10,
    reload_time: 1,
    hp: 50,
    build_duration: 3   
  },

  wall: {
    cost: 10,
    hp: 100,
    build_duration: 3
  },

  core: {
    hp: 500,
    build_duration: 1,
    stages: [{
      limit: 400,
      color: 'rgb(255, 255, 255)',
      radius: 48
    }, {
      limit: 250,
      color: 'rgb(200, 200, 200)',
      radius: 32
    }, {
      limit: 0,
      color: 'rgb(100, 100, 100)',
      radius: 16
    }]
  },

  factory: {
    regen_rate: 1,
    players: [{
      name: 'Red',
      color: 'rgb(255, 0, 0)',
      rotation: 90
    }, {
      name: 'Blue',
      color: 'rgb(0, 0, 255)',
      rotation: 270
    }]
  }
}