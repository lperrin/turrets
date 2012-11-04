"use strict"

var cocos = require('cocos2d')
  , geo = require('geometry')
  , util = require('util')
  , Health = require('./Health')
  , Bullet = require('./Bullet')
  , Vector = require('./Vector')

var reloadTime = 1 // s
  , hp = 5
  , buildingDuration = 3 // s

function Turret(color, angle) {
  Turret.superclass.constructor.call(this)

  this.status = 'placing'
  this.sinceLastShoot = 0
  this.sinceBuilding = 0
  this.drawing = new TurretDrawing(color, angle)
  this.contentSize = this.drawing.contentSize
  this.addChild(this.drawing)

  this.health = new Health(hp)
  this.addChild(this.health)

  this.scheduleUpdate()
}

Turret.inherit(cocos.nodes.Node, {
  name: 'turret',

  update: function (dt) {
    switch(this.status) {
      case 'shooting':
        this.sinceLastShoot += dt

      if(this.sinceLastShoot >= reloadTime) {
        this.sinceLastShoot = 0
        this.shoot()
      }

      break

      case 'building':
        this.sinceBuilding += dt
        this.health.setHP(this.sinceBuilding*hp / buildingDuration)

        if(this.health.isMax())
          this.status = 'shooting'

        break
    }
  },

  shoot: function () {
    var dir = Vector.fromAngle(this.drawing.rotation)
      , bulletPos = dir.mult(48).add(this.position)

    this.parent.addChild(new Bullet(bulletPos, this.drawing.rotation))
  },

  mouseDown: function (loc) {
    switch(this.status) {
      case 'shooting':
        this.status = 'rotating'
        this.mouseDrag(loc)
        break

      case 'building':
        this.status = 'placing'
        this.mouseDrag(loc)
        break
    }
  },

  mouseDrag: function (loc) {
    switch(this.status) {
      case 'rotating':
        this.pointTo(loc)
        break

      case 'placing':
        this.moveTo(loc)
        break
    }
  },

  mouseUp: function () {
    switch(this.status) {
      case 'rotating':
        this.status = 'shooting'
        break;

      case 'placing':
        this.status = 'building'
        break
    }
  },

  pointTo: function (loc) {
    var sub = geo.ccpSub(loc, this.position),
        angle = Math.atan2(-sub.y, sub.x) * 180 / Math.PI + 90

    this.drawing.rotation = angle
  },

  moveTo: function (loc) {
    this.position = loc
  },

  distance: function (loc) {
    var sub = geo.ccpSub(loc, this.position)
    
    return Math.sqrt(sub.x*sub.x + sub.y*sub.y)
  },

  contains: function (loc) {
    return this.distance(loc) < 56
  },

  hit: function(dmg) {
    if(!this.health)
      return

    this.health.hit(dmg)

    if(this.health.hp <= 0) {
      this.parent.removeChild(this)
      this.health = null
    }      
  }
})

function TurretDrawing(color, angle) {
  TurretDrawing.superclass.constructor.call(this, hp)

  this.color = color
  this.rotation = angle
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