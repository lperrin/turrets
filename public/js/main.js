"use strict"

function Turrets () {
  Turrets.superclass.constructor.call(this)

  this.isMouseEnabled = true

  this.red = new Cursor(config.factory.players[0])
  this.addChild(this.red)

  var factory0 = new Factory(0, this.red)
  factory0.position = cc.ccp(50, 50)
  this.addChild(factory0)

  var core0 = new Core()
  core0.position = cc.ccp(100, 400)
  this.addChild(core0)

  cc.addListener(core0.statusBar, 'destroy', function () {
    alert('Player Blue Wins !')
  });

  this.blue = new Cursor(config.factory.players[1])
  this.addChild(this.blue)

  var factory1 = new Factory(1, this.blue)
  factory1.position = cc.ccp(800, 630)
  this.addChild(factory1)

  var core1 = new Core()
  core1.position = cc.ccp(900, 400)
  this.addChild(core1)

  cc.addListener(core1.statusBar, 'destroy', function () {
    alert('Player Red Wins !')
  });
}

Turrets.inherit(cc.Layer, {
  mouseDown: function (e) {
    this.red.mouseDown(e.locationInCanvas)
  },

  mouseUp: function (e) {
    this.red.mouseUp(e.locationInCanvas)
  },

  mouseMoved: function (e) {
    this.red.mouseMoved(e.locationInCanvas)
  }
})

function main() {
  var director = cc.Director.sharedDirector
  director.attachInView(document.getElementById('turrets'))

  var scene = new cc.Scene,
      socket = io.connect('/'),
      turrets = new Turrets,
      blue = turrets.blue;

  scene.addChild(turrets)

  socket.emit('master');

  socket.on('mouseMoved', function (x, y) {
    blue.mouseMoved(cc.ccp(x, y))
  });

  socket.on('mouseDown', function (x, y) {
    blue.mouseDown(cc.ccp(x, y))
  });

  socket.on('mouseUp', function (x, y) {
    blue.mouseUp(cc.ccp(x, y))
  });

  director.runWithScene(scene)
}

main();