"use strict"

var cocos = require('cocos2d')
  , geo = require('geometry')

function Health(maxHealth) {
  Health.superclass.constructor.call(this)

  this.maxHealth = maxHealth
  this.hp = 0
  this.contentSize = geo.sizeMake(96, 5)
}

Health.inherit(cocos.nodes.Node, {
  hit: function (damage) {
    this.hp -= damage
  },

  setHP: function (hp) {
    this.hp = Math.min(hp, this.maxHealth)
  },

  isMax: function () {
    return this.hp === this.maxHealth
  },

  draw: function (context, rect) {
    var hpWidth = this.contentSize.width * (this.hp/this.maxHealth)
    context.beginPath()
    context.fillStyle = 'rgba(0, 255, 0, 0.5)'
    context.fillRect(-48, -48, hpWidth, 5)
    context.fill()

    context.beginPath()
    context.fillStyle = 'rgba(255, 0, 0, 0.5)'
    context.fillRect(-48 + hpWidth, -48, this.contentSize.width - hpWidth, 5)
    context.fill()
  }
})

module.exports = Health