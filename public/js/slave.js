"use strict";

function TurretsSlave(socket) {
  TurretsSlave.superclass.constructor.call(this);

  this.socket = socket;
  this.isMouseEnabled = true;
}

TurretsSlave.inherit(cc.Layer, {
  mouseMoved: function (e) {
    this.socket.emit('mouseMoved', e.locationInCanvas.x, e.locationInCanvas.y);
  },

  mouseDown: function (e) {
    this.socket.emit('mouseDown', e.locationInCanvas.x, e.locationInCanvas.y);
  },

  mouseUp: function (e) {
    this.socket.emit('mouseUp', e.locationInCanvas.x, e.locationInCanvas.y);
  }
});

function main() {
  var director = cc.Director.sharedDirector,
      socket = io.connect('/');

  director.attachInView(document.getElementById('turrets'))

  var scene = new cc.Scene,
      turrets = new TurretsSlave(socket)

  scene.addChild(turrets)

  director.runWithScene(scene)
}

main();