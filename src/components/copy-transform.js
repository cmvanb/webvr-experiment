/* global AFRAME, THREE */

/**
 * Copies another entity's position and rotation.
 */
AFRAME.registerComponent('copy-transform', 
{
    schema: {
        target: {
            type: 'selector'
        },
        positionOffset: {
            type: 'vec3'
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
        /*var currentPosition = this.el.getAttribute('position');

        this.el.object3D.rotation.setFromVector3({ x: 0, y: 0, z: 0 });

        this.el.setAttribute('position', {
            x: currentPosition.x + this.data.positionOffset.x,
            y: currentPosition.y + this.data.positionOffset.y,
            z: currentPosition.z + this.data.positionOffset.z
        });

*/
        // ROTATION
        var targetRotation = this.data.target.object3D.rotation;

        this.el.object3D.rotation.setFromVector3(targetRotation);

        // POSITIONAL OFFSET
        var matrix = new THREE.Matrix4();

        matrix.extractRotation(this.el.object3D.matrix);

        var positionOffset = new THREE.Vector3(this.data.positionOffset.x, this.data.positionOffset.y, this.data.positionOffset.z);

        positionOffset.applyMatrix4(matrix);

        // POSITION
        var targetPosition = this.data.target.object3D.position;

        this.el.setAttribute('position', {
            x: targetPosition.x + positionOffset.x,
            y: targetPosition.y + positionOffset.y,
            z: targetPosition.z + positionOffset.z
        });

/*

        this.el.setAttribute('rotation', {
            x: targetRotation.x,
            y: targetRotation.y,
            z: targetRotation.z,
        });
*/
    }
});
