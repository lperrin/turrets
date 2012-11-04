"use strict"  // Use strict JavaScript mode

// Pull in the modules we're going to use
var cocos  = require('cocos2d')   // Import the cocos2d module
  , nodes  = cocos.nodes          // Convenient access to 'nodes'
  , events = require('events')    // Import the events module
  , geo    = require('geometry')  // Import the geometry module
  , ccp    = geo.ccp              // Short hand to create points

// Convenient access to some constructors
var Layer    = nodes.Layer
  , Scene    = nodes.Scene
  , Label    = nodes.Label
  , Director = cocos.Director

var Factory = require('./Factory')

/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function Turrets () {
    // You must always call the super class constructor
    Turrets.superclass.constructor.call(this)

    this.isMouseEnabled = true

    var factory = new Factory()
    factory.position = ccp(100, 100)
    this.addChild(factory)
}

// Inherit from cocos.nodes.Layer
Turrets.inherit(Layer, {
  units: [],

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
  },

  removeChild: function(unit) {
    Turrets.superclass.removeChild.call(this, unit);

    var index = this.units.indexOf(unit);
    if(index >= 0)
      this.units.splice(index, 1);
  },

  spawn: function (unit) {
    this.addChild(unit)
    this.units.push(unit)
  }
})

/**
 * Entry point for the application
 */
function main () {
    // Initialise application

    // Get director singleton
    var director = Director.sharedDirector

    // Wait for the director to finish preloading our assets
    events.addListener(director, 'ready', function (director) {
        // Create a scene and layer
        var scene = new Scene()
          , layer = new Turrets()

        // Add our layer to the scene
        scene.addChild(layer)

        // Run the scene
        director.replaceScene(scene)

        director.displayFPS = true
    })

    // Preload our assets
    director.runPreloadScene()
}


exports.main = main