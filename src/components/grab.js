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

        this.onTriggerChanged = this.onTriggerChanged.bind(this);
        this.onTrackpadChanged = this.onTrackpadChanged.bind(this);
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

        el.addEventListener('triggerchanged', this.onTriggerChanged);
        el.addEventListener('trackpadchanged', this.onTrackpadChanged);
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

        el.removeEventListener('triggerchanged', this.onTriggerChanged);
        el.removeEventListener('trackpadchanged', this.onTrackpadChanged);
    },

    onGripClose: function (evt) 
    {
        this.grabbing = true;

        delete this.previousPosition;
        delete this.previousRotation;

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
            hitElBody.velocity.x = this.deltaPosition.x * 100;
            hitElBody.velocity.y = this.deltaPosition.y * 100;
            hitElBody.velocity.z = this.deltaPosition.z * 100;

            // TODO: Use the body's actual mass, not magic number 5.
            hitElBody.mass = 5;

            // TODO: Consider adding angular velocity.
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

    onTriggerChanged: function (evt)
    {
        console.log("onTriggerChanged");
        console.log(evt);
    },

    onTrackpadChanged: function (evt)
    {
        console.log("onTrackpadChanged");
        console.log(evt);
    },

    onHit: function (evt) 
    {
        var hitEl = evt.detail.el;

        // If the element is already grabbed (it could be grabbed by another 
        // controller).
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
    },

    tick: function () 
    {
        var hitEl = this.hitEl;

        var position, rotation, quaternion;

        if (!hitEl) 
        { 
            return; 
        }

        this.updateDelta();

        var hitElBody = hitEl.body;

        if (hitElBody)
        {
            hitElBody.position.x += this.deltaPosition.x;
            hitElBody.position.y += this.deltaPosition.y;
            hitElBody.position.z += this.deltaPosition.z;

            rotation = new THREE.Euler(0, 0, 0, 'XZY');
            //rotation = new THREE.Euler(0, 0, 0, 'YXZ');
            //rotation = new THREE.Euler(0, 0, 0, 'YZX');
            //rotation = new THREE.Euler(0, 0, 0, 'ZXY');

            rotation.setFromQuaternion(hitElBody.quaternion);

            rotation.x += THREE.Math.degToRad(this.deltaRotation.x);
            rotation.y += THREE.Math.degToRad(this.deltaRotation.y);
            rotation.z += THREE.Math.degToRad(this.deltaRotation.z);

            quaternion = new THREE.Quaternion();

            quaternion.setFromEuler(rotation);

            hitElBody.quaternion.w = quaternion.w;
            hitElBody.quaternion.x = quaternion.x;
            hitElBody.quaternion.y = quaternion.y;
            hitElBody.quaternion.z = quaternion.z;

            console.log('-------------------------------');
            console.log(this.deltaRotation);
            console.log(rotation);
            console.log(quaternion);
            console.log(hitElBody.quaternion);

            hitElBody.mass = 0;
            hitElBody.velocity.x = hitElBody.velocity.y = hitElBody.velocity.z = 0;
            hitElBody.angularVelocity.x = hitElBody.angularVelocity.y = hitElBody.angularVelocity.z = 0;
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
        // Position.
        var currentPosition = this.el.getAttribute('position');

        var previousPosition = this.previousPosition || currentPosition;

        var deltaPosition = {
            x: currentPosition.x - previousPosition.x,
            y: currentPosition.y - previousPosition.y,
            z: currentPosition.z - previousPosition.z
        };

        this.previousPosition = currentPosition;
        this.deltaPosition = deltaPosition;

        // Rotation.
        //var currentRotation = this.el.object3D.rotation;
        var currentRotation = this.el.getAttribute('rotation');

        var previousRotation = this.previousRotation || currentRotation;

        var deltaRotation = {
            x: currentRotation.x - previousRotation.x,
            y: currentRotation.y - previousRotation.y,
            z: currentRotation.z - previousRotation.z
        };

        this.previousRotation = currentRotation;
        this.deltaRotation = deltaRotation;
    }
});
