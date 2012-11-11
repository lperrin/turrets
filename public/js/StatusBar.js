"use strict"

function StatusBar(options, size) {
  StatusBar.superclass.constructor.call(this)

  this.status = 'placing'
  this.buildingTime = options.build_duration || 0
  this.maxHP = options.hp || 100
  this.sinceBuilding = 0
  this.hp = this.maxHP
  this.contentSize = size

  this.scheduleUpdate()
}

StatusBar.inherit(cc.Node, {
  build: function () {
    if(this.status === 'placing') {
      this.status = 'building'
      this.sinceBuilding = 0
    }
  },

  place: function () {
    if(this.status === 'building')
      this.status = 'placing'
  },

  update: function (dt) {
    if(this.status !== 'building')
      return

    this.sinceBuilding += dt

    if(this.sinceBuilding >= this.buildingTime) {
      this.status = 'ready'
      cc.trigger(this, 'ready')
    }
  },

  hit: function (damage) {
    this.hp = Math.max(this.hp - damage, 0)

    if(this.hp === 0) {
      this.status = 'destroyed'
      cc.trigger(this, 'destroy')
    }
  },

  isMax: function () {
    return this.hp === this.maxHP
  },

  draw: function (context, rect) {
    switch(this.status) {
      case 'building':
        this.drawBar(this.sinceBuilding, this.buildingTime, 'blue', context)
        break

      case 'ready':
        this.drawBar(this.hp, this.maxHP, 'green', context)
        break
    }      
  },

  drawBar: function (value, max, color, context) {
    var width = this.contentSize.width
      , height = this.contentSize.height
      , split = width * (value/max)

    context.beginPath()
    context.fillStyle = color
    context.fillRect(-width/2, -height/2, split, 5)
    context.fill()

    context.beginPath()
    context.fillStyle = 'rgba(255, 0, 0, 0.5)'
    context.fillRect(-width/2 + split, -height/2, width - split, 5)
    context.fill()
  }
})