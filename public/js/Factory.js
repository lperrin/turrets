"use strict"

var units = [Turret, Wall]
  , squareSide = 96

function Factory(playerId, cursor) {
  Factory.superclass.constructor.call(this)

  var self = this
  this.cursor = cursor
  this.playerId = playerId
  this.player = config.factory.players[playerId]
  this.contentSize = cc.sizeMake(squareSide*units.length, squareSide)

  this.energy = 30
  this.energyLbl = new cc.Label(this.energy.toString());
  this.energyLbl.position = cc.ccp(0, 48)
  this.addChild(this.energyLbl)

  units.forEach(function (u, i) {
    var unitFactory = new UnitFactory(u, self.player);
    unitFactory.position = cc.ccp(i*squareSide + 32, 0)
    self.addChild(unitFactory)
  });

  this.scheduleUpdate()
}

Factory.inherit(cc.Node, {
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
    this.cursor.replaceGrabbed(unit)
  },

  contains: function (loc) {
    return cc.rectContainsPoint(this.boundingBox, loc)
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
  drawing.position = new cc.Point(squareSide/2, squareSide/2)
  this.addChild(drawing)
  this.contentSize = drawing.contentSize
}

UnitFactory.inherit(cc.Node, {
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