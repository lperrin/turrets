"use strict"

var cocos = require('cocos2d')
  , geo = require('geometry')
  , util = require('util')
  , Health = require('./Health')
  , Bullet = require('./Bullet')
  , Vector = require('./Vector')

var hp = 10
  , buildingDuration = 3 // s

function Wall(color, angle) {
  Wall.superclass.constructor.call(this)

  this.status = 'placing'
  this.sinceLastShoot = 0
  this.sinceBuilding = 0
  this.drawing = new WallDrawing(color, angle)
  this.contentSize = this.drawing.contentSize
  this.addChild(this.drawing)

  this.health = new Health(hp)
  this.addChild(this.health)

  this.scheduleUpdate()
}

Wall.inherit(cocos.nodes.Node, {
  name: 'wall',

  update: function (dt) {

    switch(this.status) {
      case 'building':
        this.sinceBuilding += dt
        this.health.setHP(this.sinceBuilding*hp / buildingDuration)

        if(this.health.isMax())
          this.status = 'ready'

        break
    }
  },

  mouseDown: function (loc) {
    switch(this.status) {
      case 'ready':
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
        this.status = 'ready'
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

function WallDrawing(color, angle) {
  WallDrawing.superclass.constructor.call(this, hp)

  this.color = color
  this.rotation = angle
  this.contentSize = geo.sizeMake(96, 96)
}

WallDrawing.inherit(cocos.nodes.Node, {
  draw: function (context, rect) {
    context.beginPath()
    context.fillStyle = this.color
    context.fillRect(-48, -10, 96, 20)
    context.fill()    
  }
})

Wall.Drawing = WallDrawing

module.exports = Wall