"use strict"

var cocos = require('cocos2d')
  , geo = require('geometry')
  , util = require('util')
  , _ = require('./underscore')
  , config = require('./config')
  , Unit = require('./Unit')
  , Vector = require('./Vector')

function Wall(options) {
  Wall.superclass.constructor.call(this, _.extend({}, config.wall, options), Wall.Drawing)
}

Wall.inherit(Unit, {
  name: 'wall',

  contains: function (loc) {
    return this.distance(loc) < 56
  }
})

function WallDrawing(color, rotation) {
  WallDrawing.superclass.constructor.call(this)

  this.color = color
  this.rotation = rotation
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