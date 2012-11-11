"use strict"

function Core(options) {
  Core.superclass.constructor.call(this, _.extend({}, config.core, options), Core.Drawing)
  this.mouseUp()
}

Core.inherit(Unit, {
  name: 'core',

  contains: function (loc) {
    var self = this
      , dist = this.distance(loc)

    return config.core.stages.some(function (stage) {
      return stage.limit <= self.statusBar.hp && dist < stage.radius
    })
  }
})

function CoreDrawing(color, rotation, core) {  
  CoreDrawing.superclass.constructor.call(this)

  this.core = core
  this.contentSize = cc.sizeMake(96, 96)
}

CoreDrawing.inherit(cc.Node, {
  draw: function (context, rect) {
    var self = this

    context.beginPath()
    config.core.stages.forEach(function (stage) {
      if(self.core.statusBar.hp >= stage.limit) {
        context.fillStyle = stage.color
        context.arc(0, 0, stage.radius, 0, 2*Math.PI, false)
      }
    })
    context.fill()
  }
})

Core.Drawing = CoreDrawing