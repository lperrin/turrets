"use strict"

var cocos  = require('cocos2d')
  , nodes  = cocos.nodes
  , events = require('events')
  , geo    = require('geometry')
  , ccp    = geo.ccp

var Layer    = nodes.Layer
  , Scene    = nodes.Scene
  , Label    = nodes.Label
  , Director = cocos.Director

var Factory = require('./Factory')
  , Core = require('./Core')

function Turrets () {
  Turrets.superclass.constructor.call(this)

  this.isMouseEnabled = true

  var factory0 = new Factory(0)
  factory0.position = ccp(50, 50)
  this.addChild(factory0)

  var core0 = new Core()
  core0.position = ccp(100, 400)
  this.addChild(core0)

  events.addListener(core0.statusBar, 'destroy', function () {
    alert('Player Blue Wins !')
  });

  var factory1 = new Factory(1)
  factory1.position = ccp(800, 630)
  this.addChild(factory1)

  var core1 = new Core()
  core1.position = ccp(900, 400)
  this.addChild(core1)

  events.addListener(core1.statusBar, 'destroy', function () {
    alert('Player Red Wins !')
  });
}

Turrets.inherit(Layer, {
  grabbed: null,

  mouseDown: function (e) {
    var self = this
    this.children.some(function (t) {
      if(!t.contains(e.locationInCanvas))
        return false

      self.grabbed = t

      if(t.mouseDown)
        t.mouseDown(e.locationInCanvas)

      return true
    })
  },

  mouseUp: function () {
    if(this.grabbed) {
      if(this.grabbed.mouseUp)
        this.grabbed.mouseUp()

      this.grabbed = null
    }
  },

  mouseMoved: function (e) {
    if(this.grabbed && this.grabbed.mouseDrag)
      this.grabbed.mouseDrag(e.locationInCanvas)
  },

  replaceGrabbed: function (node, loc) {
    if(this.grabbed && this.grabbed.mouseUp)
      this.grabbed.mouseUp()

    this.grabbed = node

    if(this.grabbed.mouseDown)
      this.grabbed.mouseDown(loc)
  }
})

function main () {
  var director = Director.sharedDirector

  events.addListener(director, 'ready', function (director) {
      var scene = new Scene()
        , layer = new Turrets()

      scene.addChild(layer)
      director.replaceScene(scene)
      //director.displayFPS = true
  })

  director.runPreloadScene()
}


exports.main = main
