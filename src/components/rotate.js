/* global AFRAME, THREE */

/**
 * Rotates an entity.
 */
AFRAME.registerComponent('rotate', 
{
    schema: {
        speed: {
            type: 'number'
        }
    },

    init: function () 
    {
    },

    play: function () 
    {
    },

    pause: function () 
    {
    },

    tick: function (time, timeDelta) 
    {
        var rotationDelta = this.data.speed * (timeDelta / 1000);

        this.el.object3D.rotation.x += rotationDelta;
        this.el.object3D.rotation.y += rotationDelta;
        this.el.object3D.rotation.z += rotationDelta;
    }
});
