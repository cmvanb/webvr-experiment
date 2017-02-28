/* global AFRAME, THREE */

/**
 * Bucket view.
 */
AFRAME.registerComponent('bucket-view', 
{
    schema: {
    },

    BUCKET_FILL_HEIGHT: 0.32,

    BUCKET_FILL_RADIUS: 0.133,

    init: function () 
    {
        // References.
        this._itemContainer = this.el.components['item-container'];

        // Events.
        this.onAddedItem = this.onAddedItem.bind(this);

        // Create the bucket fill entity.
        this._bucketFillEntity = document.createElement('a-entity');

        this._bucketFillEntity.setAttribute(
            'id', 
            'bucket-fill-entity');
        this._bucketFillEntity.setAttribute(
            'geometry', 
            'primitive: cylinder; height: ' + this.BUCKET_FILL_HEIGHT 
                + '; radius: ' + this.BUCKET_FILL_RADIUS);
        this._bucketFillEntity.setAttribute(
            'material', 
            'color: #ffdd11');
        this._bucketFillEntity.setAttribute(
            'visible', 
            'true');
        this._bucketFillEntity.setAttribute(
            'copy-transform', 
            'target: #bucket-physics; positionOffset: 0 0 0');

        this.el.sceneEl.appendChild(this._bucketFillEntity);

        // Update the view.
        var percentage = this._itemContainer.getAmountContainedPercentage();

        this.updateView(percentage);
    },

    play: function () 
    {
        this.el.addEventListener('addedItem', this.onAddedItem);
    },

    pause: function () 
    {
        this.el.removeEventListener('addedItem', this.onAddedItem);
    },

    tick: function (time, timeDelta) 
    {
    },

    onAddedItem: function(itemType, amount)
    {
        console.log('onAddedItem: ' + amount + 'x ' + itemType);

        var percentage = this._itemContainer.getAmountContainedPercentage();

        this.updateView(percentage);
    },

    updateView: function(percentage)
    {
        var height = percentage * this.BUCKET_FILL_HEIGHT;

        this._bucketFillEntity.setAttribute(
            'geometry', 
            'primitive: cylinder; height: ' + height + '; radius: ' 
                + this.BUCKET_FILL_RADIUS);

        var yOffset = (1.0 - percentage) * -0.5 * this.BUCKET_FILL_HEIGHT;

        this._bucketFillEntity.setAttribute(
            'copy-transform', 
            'target: #bucket-physics; positionOffset: 0 ' + yOffset + ' 0');
    }
});
