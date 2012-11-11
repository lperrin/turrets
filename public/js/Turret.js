"use strict"

function Turret(options) {
  Turret.superclass.constructor.call(this, _.extend({}, config.turret, options), Turret.Drawing)

  this.sinceLastShoot = 0
  this.scheduleUpdate()
}

Turret.inherit(Unit, {
  name: 'turret',

  update: function (dt) {
    switch(this.status) {
      case 'active':
        this.sinceLastShoot += dt

      if(this.sinceLastShoot >= config.turret.reload_time) {
        this.sinceLastShoot = 0
        this.shoot()
      }

      break
    }
  },

  shoot: function () {
    var dir = Vector.fromAngle(this.drawing.rotation)
      , bulletPos = dir.mult(48).add(this.position)

    this.parent.addChild(new Bullet(bulletPos, this.drawing.rotation))
  },

  mouseDown: function (loc) {
    Turret.superclass.mouseDown.call(this, loc)

    switch(this.status) {
      case 'active':
        this.status = 'rotating'
        this.mouseDrag(loc)
        break
    }
  },

  mouseDrag: function (loc) {
    Turret.superclass.mouseDrag.call(this, loc)

    switch(this.status) {
      case 'rotating':
        this.pointTo(loc)
        break
    }
  },

  mouseUp: function () {
    Turret.superclass.mouseUp.call(this)

    switch(this.status) {
      case 'rotating':
        this.status = 'active'
        break;
    }
  },

  contains: function (loc) {
    return this.distance(loc) < 56
  }
})

function TurretDrawing(color, rotation) {
  TurretDrawing.superclass.constructor.call(this)

  this.color = color
  this.rotation = rotation
  this.contentSize = cc.sizeMake(96, 96)
}

TurretDrawing.inherit(cc.Node, {
  draw: function (context, rect) {
    context.beginPath()
    context.fillStyle = this.color
    context.arc(0, 0, 24, 0, 2*Math.PI, false)
    context.fillRect(-10, 0, 20, 48)
    context.fill()
  }
})

Turret.Drawing = TurretDrawing