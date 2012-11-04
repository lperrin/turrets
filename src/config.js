module.exports = {
  "turret": {
    "cost": 10,
    "reload_time": 1,
    "hp": 50,
    "build_duration": 3   
  },

  "wall": {
    "cost": 10,
    "hp": 100,
    "build_duration": 3 
  },

  "core": {
    "hp": 500,
    "build_duration": 0
  },

  "factory": {
    "regen_rate": 1,
    "players": [{
      "name": "Red", 
      "color": "rgb(255, 0, 0)",
      "rotation": 90
    }, {
      "name": "Blue",
      "color": "rgb(0, 0, 255)",
      "rotation": 270
    }]
  }
}