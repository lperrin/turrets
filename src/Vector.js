"use strict"

var geo = require('geometry')

function Vector(x, y) {
  Vector.superclass.constructor.call(this, x, y)
}

Vector.inherit(geo.Point, {
  mult: function (scale) {
    return new Vector(this.x * scale, this.y * scale)
  },

  add: function (vec) {
    return new Vector(this.x + vec.x, this.y + vec.y)
  }
})

Vector.fromAngle = function (angle) {
  var rad = angle * Math.PI/180

  return new Vector(
    Math.sin(rad),
    Math.cos(rad)
  )
}

Vector.fromPoint = function (point) {
  return new Vector(point.x, point.y)
}

module.exports = Vector