"use strict"

function Cursor(options) {
  Cursor.superclass.constructor.call(this)

  this.grabbed = null
  this.playerId = options.id
  this.options = options
}

Cursor.inherit(cc.Layer, {
  draw: function (context, rect) {
    context.beginPath()
    context.fillStyle = this.options.color
    context.arc(0, 0, 6, 0, 2*Math.PI, false)
    context.fill()
  },

  contains: function () {
    return false
  },

mouseDown: function (loc) {
    var self = this
    this.position = loc
    this.parent.children.some(function (unit) {
      if(unit.playerId !== self.playerId || !unit.contains(loc))
        return false

      self.grabbed = unit

      if(unit.mouseDown)
        unit.mouseDown(loc)

      return true
    })
  },

  mouseUp: function (loc) {
    this.position = loc

    if(this.grabbed) {
      if(this.grabbed.mouseUp)
        this.grabbed.mouseUp()

      this.grabbed = null
    }
  },

  mouseMoved: function (loc) {
    this.position = loc

    if(this.grabbed && this.grabbed.mouseDrag)
      this.grabbed.mouseDrag(loc)
  },

  replaceGrabbed: function (node, loc) {
    if(this.grabbed && this.grabbed.mouseUp)
      this.grabbed.mouseUp()

    this.grabbed = node

    if(this.grabbed.mouseDown)
      this.grabbed.mouseDown(loc)
  }
})