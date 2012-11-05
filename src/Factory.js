"use strict"

var cocos = require('cocos2d')
  , geo = require('geometry')
  , config = require('./config')
  , Turret = require('./Turret')
  , Wall = require('./Wall')

var units = [Turret, Wall]
  , squareSide = 96

function Factory(playerId) {
  Factory.superclass.constructor.call(this)

  var self = this
  this.player = config.factory.players[playerId]
  this.contentSize = geo.sizeMake(squareSide*units.length, squareSide)

  this.energy = 30
  this.energyLbl = new cocos.nodes.Label(this.energy.toString());
  this.energyLbl.position = geo.ccp(0, 48)
  this.addChild(this.energyLbl)

  units.forEach(function (u, i) {
    var unitFactory = new UnitFactory(u, self.player);
    unitFactory.position = geo.ccp(i*squareSide + 32, 0)
    self.addChild(unitFactory)
  });

  this.scheduleUpdate()
}

Factory.inherit(cocos.nodes.Node, {
  update: function (dt) {
    this.energy += dt*config.factory.regen_rate
    this.energyLbl.string = Math.round(this.energy).toString()
  },

  mouseDown: function (loc) {
    var i = Math.floor((loc.x - this.position.x - 32)/squareSide) + 1
      , unitFactory = this.children[i]
      , unit = unitFactory.spawn()

    if(this.energy < unit.options.cost)
      return

    this.energy -= unit.options.cost
    unit.position = loc
    this.parent.addChild(unit)
    this.parent.replaceGrabbed(unit)
  },

  contains: function (loc) {
    return geo.rectContainsPoint(this.boundingBox, loc)
  }
})

function randomColor() {
  return 'rgb('
    + Math.round(Math.random()*255) + ','
    + Math.round(Math.random()*255) + ','
    + Math.round(Math.random()*255) + ')'
}

function UnitFactory(Unit, player) {
  UnitFactory.superclass.constructor.call(this)

  this.Unit = Unit
  this.player = player
  var drawing = new Unit.Drawing(player.color, 45)
  drawing.position = geo.ccp(squareSide/2, squareSide/2)
  this.addChild(drawing)
  this.contentSize = drawing.contentSize
}

UnitFactory.inherit(cocos.nodes.Node, {
  spawn: function() {
    return new this.Unit(this.player)
  },

  draw: function (context, rect) {
    context.beginPath()
    context.strokeStyle = 'rgb(80, 80, 80)'
    context.strokeRect(0, 0, squareSide, squareSide)
    context.fill()
  }
})

module.exports = Factory