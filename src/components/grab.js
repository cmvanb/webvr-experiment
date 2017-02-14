/* global AFRAME */

/**
* Handles events coming from the hand-controls.
* Determines if the entity is grabbed or released.
* Updates its position to move along the controller.
*/
AFRAME.registerComponent('grab', {
  init: function () {
    this.GRABBED_STATE = 'grabbed';
    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.onGripOpen = this.onGripOpen.bind(this);
    this.onGripClose = this.onGripClose.bind(this);

      this.onThumbUp = this.onThumbUp(this);
  },

  play: function () {
    var el = this.el;
    el.addEventListener('hit',       this.onHit);
    el.addEventListener('gripclose', this.onGripClose);
    el.addEventListener('gripopen',  this.onGripOpen);

    /*
    var el = this.el;
    el.addEventListener('gripdown', this.onGripDown);
    el.addEventListener('gripup', this.onGripUp);
    el.addEventListener('trackpaddown', this.onTrackpadDown);
    el.addEventListener('trackpadup', this.onTrackpadUp);
    el.addEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
    el.addEventListener('trackpadtouchend', this.onTrackpadTouchEnd);
    el.addEventListener('triggerdown', this.onTriggerDown);
    el.addEventListener('triggerup', this.onTriggerUp);
    el.addEventListener('triggertouchstart', this.onTriggerTouchStart);
    el.addEventListener('triggertouchend', this.onTriggerTouchEnd);
    el.addEventListener('griptouchstart', this.onGripTouchStart);
    el.addEventListener('griptouchend', this.onGripTouchEnd);
    el.addEventListener('thumbstickdown', this.onThumbstickDown);
    el.addEventListener('thumbstickup', this.onThumbstickUp);
    el.addEventListener('Atouchstart', this.onAorXTouchStart);
    el.addEventListener('Atouchend', this.onAorXTouchEnd);
    el.addEventListener('Btouchstart', this.onBorYTouchStart);
    el.addEventListener('Btouchend', this.onBorYTouchEnd);
    el.addEventListener('Xtouchstart', this.onAorXTouchStart);
    el.addEventListener('Xtouchend', this.onAorXTouchEnd);
    el.addEventListener('Ytouchstart', this.onBorYTouchStart);
    el.addEventListener('Ytouchend', this.onBorYTouchEnd);
    el.addEventListener('surfacetouchstart', this.onSurfaceTouchStart);
    el.addEventListener('surfacetouchend', this.onSurfaceTouchEnd);
*/
    el.addEventListener('thumbup',  this.onThumbUp);
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('hit',       this.onHit);
    el.removeEventListener('gripclose', this.onGripClose);
    el.removeEventListener('gripopen',  this.onGripOpen);

    el.removeEventListener('thumbup',  this.onThumbUp);
  },

  onGripClose: function (evt) {
    this.grabbing = true;
    delete this.previousPosition;

        console.log("onGripClose");
  },

  onGripOpen: function (evt) {
    var hitEl = this.hitEl;
    this.grabbing = false;
    if (!hitEl) { return; }
    hitEl.removeState(this.GRABBED_STATE);
    this.hitEl = undefined;

        console.log("onGripOpen");
  },

    onThumbUp: function (evt)
    {
        //onGripOpen(evt);
/*
        var newEl = document.createElement('a-entity'); 

        newEl.class = "cube";
        newEl.mixin = "cube";
        newEl.position = this.el.getAttribute('position');
        
        document.querySelector('a-scene').appendChild(newEl);

        console.log("HELLO WORLD");
        console.log(newEl);
        */
    },

    onTrackpadTouchStart: function (evt)
    {
        console.log("onTrackpadTouchStart");
    },

    onHit: function (evt) {
    var hitEl = evt.detail.el;
    // If the element is already grabbed (it could be grabbed by another controller).
    // If the hand is not grabbing the element does not stick.
    // If we're already grabbing something you can't grab again.
    if (!hitEl || hitEl.is(this.GRABBED_STATE) || !this.grabbing || this.hitEl) { return; }
    hitEl.addState(this.GRABBED_STATE);
    this.hitEl = hitEl;
  },

  tick: function () {
    var hitEl = this.hitEl;
    var position;
    if (!hitEl) { return; }
    this.updateDelta();
    position = hitEl.getAttribute('position');
    hitEl.setAttribute('position', {
      x: position.x + this.deltaPosition.x,
      y: position.y + this.deltaPosition.y,
      z: position.z + this.deltaPosition.z
    });
  },

  updateDelta: function () {
    var currentPosition = this.el.getAttribute('position');
    var previousPosition = this.previousPosition || currentPosition;
    var deltaPosition = {
      x: currentPosition.x - previousPosition.x,
      y: currentPosition.y - previousPosition.y,
      z: currentPosition.z - previousPosition.z
    };
    this.previousPosition = currentPosition;
    this.deltaPosition = deltaPosition;
  }
});
