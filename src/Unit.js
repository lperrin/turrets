"use strict"

var cocos = require('cocos2d')
  , geo = require('geometry')
  , events = require('events')
  , StatusBar = require('./StatusBar')

function Unit(options, Drawing) {
  var self = this

  Unit.superclass.constructor.call(this)

  this.status = 'placing'

  this.drawing = new Drawing(options.color, options.rotation, this)
  this.contentSize = this.drawing.contentSize
  this.addChild(this.drawing)

  this.statusBar = new StatusBar(options, this.contentSize)
  this.addChild(this.statusBar)

  events.addListener(this.statusBar, 'destroy', function () {
    self.parent.removeChild(self)
  })
}

Unit.inherit(cocos.nodes.Node, {
  mouseDown: function (loc) {
    switch(this.status) {
      case 'building':
        this.status = 'placing'
        this.statusBar.place()
        this.mouseDrag(loc)
        break
    }
  },

  mouseDrag: function (loc) {
    switch(this.status) {
      case 'placing':
        this.moveTo(loc)
        break
    }
  },

  mouseUp: function () {
    switch(this.status) {
      case 'placing':
        this.status = 'building'
        this.statusBar.build()
        break 
    }
  },

  hit: function (dmg) {
    this.statusBar.hit(dmg)
  },

  moveTo: function (loc) {
    this.position = loc
  },

  pointTo: function (loc) {
    var sub = geo.ccpSub(loc, this.position),
        rotation = Math.atan2(-sub.y, sub.x) * 180 / Math.PI + 90

    this.drawing.rotation = rotation
  },

  distance: function (loc) {
    var sub = geo.ccpSub(loc, this.position)

    return Math.sqrt(sub.x*sub.x + sub.y*sub.y)
  },

  collide: function (loc) {
    return this.contains(loc)
  }
})

module.exports = Unit