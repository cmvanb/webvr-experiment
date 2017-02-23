/* global AFRAME */

/**
* Handles events coming from the hand-controls.
* Determines if the entity is grabbed or released.
* Updates its position to move along the controller.
*/
AFRAME.registerComponent('grab', 
{
    init: function () 
    {
        this.GRABBED_STATE = 'grabbed';

        // Bind event handlers
        this.onHit = this.onHit.bind(this);

        this.onMenuUp = this.onMenuUp.bind(this);
        this.onMenuDown = this.onMenuDown.bind(this);

        this.onTriggerUp = this.onTriggerUp.bind(this);
        this.onTriggerDown = this.onTriggerDown.bind(this);

        this.onTrackpadUp = this.onTrackpadUp.bind(this);
        this.onTrackpadDown = this.onTrackpadDown.bind(this);

        this.onGripUp = this.onGripUp.bind(this);
        this.onGripDown = this.onGripDown.bind(this);

        this.onTrackpadMoved = this.onTrackpadMoved.bind(this);
    },

    play: function () 
    {
        var el = this.el;

        el.addEventListener('hit', this.onHit);

        el.addEventListener('menuup', this.onMenuUp);
        el.addEventListener('menudown', this.onMenuDown);

        el.addEventListener('triggerup', this.onTriggerUp);
        el.addEventListener('triggerdown', this.onTriggerDown);

        el.addEventListener('trackpadup', this.onTrackpadUp);
        el.addEventListener('trackpaddown', this.onTrackpadDown);

        el.addEventListener('gripup', this.onGripUp);
        el.addEventListener('gripdown', this.onGripDown);

        el.addEventListener('trackpadmoved', this.onTrackpadMoved);
    },

    pause: function () 
    {
        var el = this.el;

        el.removeEventListener('hit', this.onHit);

        el.removeEventListener('menuup', this.onMenuUp);
        el.removeEventListener('menudown', this.onMenuDown);

        el.removeEventListener('triggerup', this.onTriggerUp);
        el.removeEventListener('triggerdown', this.onTriggerDown);

        el.removeEventListener('trackpadup', this.onTrackpadUp);
        el.removeEventListener('trackpaddown', this.onTrackpadDown);

        el.removeEventListener('gripup', this.onGripUp);
        el.removeEventListener('gripdown', this.onGripDown);

        el.removeEventListener('trackpadmoved', this.onTrackpadMoved);
    },

    onGripClose: function (evt) 
    {
        this.grabbing = true;

        delete this.previousPosition;

        console.log("onGripClose");
    },

    onGripOpen: function (evt) 
    {
        var hitEl = this.hitEl;

        this.grabbing = false;

        console.log("onGripOpen");

        if (!hitEl) 
        { 
            return; 
        }

        hitEl.removeState(this.GRABBED_STATE);

        var hitElBody = hitEl.body;

        if (hitElBody)
        {
            hitElBody.mass = 5;
            hitElBody.velocity.x = this.deltaPosition.x * 100;
            hitElBody.velocity.y = this.deltaPosition.y * 100;
            hitElBody.velocity.z = this.deltaPosition.z * 100;
        }

        this.hitEl = undefined;
    },

    onMenuDown: function (evt)
    {
        console.log("onMenuDown");
    },

    onMenuUp: function (evt)
    {
        console.log("onMenuUp");
    },

    onTriggerDown: function (evt)
    {
        console.log("onTriggerDown");

        this.onGripClose(evt);
    },

    onTriggerUp: function (evt)
    {
        console.log("onTriggerUp");

        this.onGripOpen(evt);
    },

    onTrackpadDown: function (evt)
    {
        console.log("onTrackpadDown");
    },

    onTrackpadUp: function (evt)
    {
        console.log("onTrackpadUp");
    },

    onGripDown: function (evt)
    {
        console.log("onGripDown");
    },

    onGripUp: function (evt)
    {
        console.log("onGripUp");
    },

    onTrackpadMoved: function (evt)
    {
        //console.log("onTrackpadMoved: " + evt.detail.x + ", " + evt.detail.y);
        //console.log(evt.detail);
        console.log(evt);
    },

    onHit: function (evt) 
    {
        var hitEl = evt.detail.el;

        // If the element is already grabbed (it could be grabbed by another controller).
        // If the hand is not grabbing the element does not stick.
        // If we're already grabbing something you can't grab again.
        if (!hitEl 
            || hitEl.is(this.GRABBED_STATE) 
            || !this.grabbing 
            || this.hitEl) 
        { 
            return; 
        }

        hitEl.addState(this.GRABBED_STATE);

        this.hitEl = hitEl;

        /*
        var force, 
            pStart = new THREE.Vector3().copy(this.el.getAttribute('position'));

        // Compute direction of force, normalize, then scale.
        force = hitEl.body.position.vsub(pStart);
        force.normalize();
        hitEl.body.applyImpulse(force, hitEl.body.position);
        */
    },

    tick: function () 
    {
        var hitEl = this.hitEl;

        var position;

        if (!hitEl) 
        { 
            return; 
        }

        this.updateDelta();

        var hitElBody = hitEl.body;

        if (hitElBody)
        {
            position = hitElBody.position;

            hitElBody.velocity.x = hitElBody.velocity.y = hitElBody.velocity.z = 0;
            hitElBody.angularVelocity.x = hitElBody.angularVelocity.y = hitElBody.angularVelocity.z = 0;
            hitElBody.mass = 0;
            hitElBody.position.x = position.x + this.deltaPosition.x;
            hitElBody.position.y = position.y + this.deltaPosition.y;
            hitElBody.position.z = position.z + this.deltaPosition.z;
        }
        else
        {
            position = hitEl.getAttribute('position');

            hitEl.setAttribute('position', {
                x: position.x + this.deltaPosition.x,
                y: position.y + this.deltaPosition.y,
                z: position.z + this.deltaPosition.z
            });
        }
    },

    updateDelta: function () 
    {
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
