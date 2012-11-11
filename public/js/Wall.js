"use strict"

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
  this.contentSize = cc.sizeMake(96, 96)
}

WallDrawing.inherit(cc.Node, {
  draw: function (context, rect) {
    context.beginPath()
    context.fillStyle = this.color
    context.fillRect(-48, -10, 96, 20)
    context.fill()    
  }
})

Wall.Drawing = WallDrawing