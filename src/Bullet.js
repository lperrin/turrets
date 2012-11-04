"use strict"

var cocos = require('cocos2d')
  , geo = require('geometry')
  , util = require('util')
  , Vector = require('./Vector')

var velocity = 800
  , damage = 10

function Bullet(position, angle) {
  Bullet.superclass.constructor.call(this)

  this.contentSize = geo.sizeMake(12, 12)
  this.position = position
  this.angle = angle
  this.ttl = 10

  this.scheduleUpdate()
}

Bullet.inherit(cocos.nodes.Node, {
  update: function (dt) {
    var pos = Vector.fromPoint(this.position)
      , dir = Vector.fromAngle(this.angle)

    this.position = pos.add(dir.mult(dt).mult(velocity))
    this.ttl -= dt

    if(this.ttl <= 0) {
      this.parent.removeChild(this)

      return
    }

    if(this.position.x > 1024
      || this.position.x < 0
      || this.position.y > 768
      || this.position.y < 0) {
      this.parent.removeChild(this)

      return 
    }

    this.testTurretCollision()
  },

  testTurretCollision: function () {
    var self = this
    this.parent.children.some(function (t) {
      if(t.collide && t.collide(self.position)) {
        t.hit(damage)
        self.parent.removeChild(self)

        return true
      }
    })
  },

  draw: function (context, rect) {
    context.beginPath()
    context.fillStyle = 'white'
    context.arc(0, 0, 6, 0, 2*Math.PI, false)
    context.fill()
  },

  contains: function () {
    return false
  }
})

module.exports = Bullet