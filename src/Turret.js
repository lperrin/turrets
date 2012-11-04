"use strict"

var cocos = require('cocos2d')
  , geo = require('geometry')
  , events = require('events')
  , util = require('util')
  , _ = require('./underscore')
  , config = require('./config')
  , Unit = require('./Unit')
  , Bullet = require('./Bullet')
  , Vector = require('./Vector')

function Turret(options) {
  Turret.superclass.constructor.call(this, _.extend({}, config.turret, options), Turret.Drawing)

  this.sinceLastShoot = 0

  var self = this
  events.addListener(this.statusBar, 'ready', function () {
    self.status = 'shooting'
  })

  this.scheduleUpdate()
}

Turret.inherit(Unit, {
  name: 'turret',

  update: function (dt) {
    switch(this.status) {
      case 'shooting':
        this.sinceLastShoot += dt

      if(this.sinceLastShoot >= config.turret.reload_time) {
        this.sinceLastShoot = 0
        this.shoot()
      }

      break
    }
  },

  shoot: function () {
    var dir = Vector.fromAngle(this.drawing.rotation)
      , bulletPos = dir.mult(48).add(this.position)

    this.parent.addChild(new Bullet(bulletPos, this.drawing.rotation))
  },

  mouseDown: function (loc) {
    Turret.superclass.mouseDown.call(this, loc)

    switch(this.status) {
      case 'shooting':
        this.status = 'rotating'
        this.mouseDrag(loc)
        break
    }
  },

  mouseDrag: function (loc) {
    Turret.superclass.mouseDrag.call(this, loc)

    switch(this.status) {
      case 'rotating':
        this.pointTo(loc)
        break
    }
  },

  mouseUp: function () {
    Turret.superclass.mouseUp.call(this)

    switch(this.status) {
      case 'rotating':
        this.status = 'shooting'
        break;
    }
  },

  distance: function (loc) {
    var sub = geo.ccpSub(loc, this.position)
    
    return Math.sqrt(sub.x*sub.x + sub.y*sub.y)
  },

  contains: function (loc) {
    return this.distance(loc) < 56
  }
})

function TurretDrawing(color, rotation) {
  TurretDrawing.superclass.constructor.call(this)

  this.color = color
  this.rotation = rotation
  this.contentSize = geo.sizeMake(96, 96)
}

TurretDrawing.inherit(cocos.nodes.Node, {
  draw: function (context, rect) {
    context.beginPath()
    context.fillStyle = this.color
    context.arc(0, 0, 24, 0, 2*Math.PI, false)
    context.fillRect(-10, 0, 20, 48)
    context.fill()
  }
})

Turret.Drawing = TurretDrawing

module.exports = Turret