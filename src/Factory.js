"use strict"

var cocos = require('cocos2d')
  , geo = require('geometry')
  , Turret = require('./Turret')
  , Wall = require('./Wall')

var units = [Turret, Wall]
  , squareSide = 96

function Factory() {
  Factory.superclass.constructor.call(this)

  var self = this
  units.forEach(function (u, i) {
    var unitFactory = new UnitFactory(u);
    unitFactory.position = geo.ccp(i*squareSide, 0)
    self.addChild(unitFactory)
  });

  this.contentSize = geo.sizeMake(squareSide*units.length, squareSide)
}

Factory.inherit(cocos.nodes.Node, {
  mouseDown: function (loc) {
    var i = Math.floor((loc.x - this.position.x)/96)
    var unitFactory = this.children[i]
    var unit = unitFactory.spawn()

    unit.position = loc
    this.parent.spawn(unit)
    this.parent.replaceGrabbed(unit)
  },

  contains: function (loc) {
    return geo.rectContainsPoint(this.boundingBox, loc)
  },

  draw: function (context, rect) {
  }
})

function randomColor() {
  return 'rgb('
    + Math.round(Math.random()*255) + ','
    + Math.round(Math.random()*255) + ','
    + Math.round(Math.random()*255) + ')'
}

function UnitFactory(Unit) {
  UnitFactory.superclass.constructor.call(this)

  this.Unit = Unit
  var drawing = new Unit.Drawing(randomColor(), 45)
  drawing.position = geo.ccp(48, 48)
  this.addChild(drawing)
  this.contentSize = drawing.contentSize
}

UnitFactory.inherit(cocos.nodes.Node, {
  spawn: function() {
    return new this.Unit(randomColor(), Math.random() * 360)
  },

  draw: function (context, rect) {
    context.beginPath()
    context.strokeStyle = 'rgb(80, 80, 80)'
    context.strokeRect(0, 0, 96, 96)
    context.fill()
  }
})

module.exports = Factory