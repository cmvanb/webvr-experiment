/* global AFRAME, THREE */

/**
 * Item container.
 */
AFRAME.registerComponent('item-container', 
{
    schema: {
        itemType: {
            type: 'string'
        },
        startingAmount: {
            type: 'number'
        },
        maxAmount: {
            type: 'number'
        }
    },

    getAmountContainedPercentage: function ()
    {
        return this._amountContained / this.data.maxAmount;
    },

    init: function () 
    {
        this._amountContained = this.data.startingAmount;
    },

    play: function () 
    {
    },

    pause: function () 
    {
    },

    tick: function (time, timeDelta) 
    {
    },

    add: function (amount)
    {
        this._amountContained += amount;

        if (this._amountContained >= this.data.maxAmount)
        {
            this._amountContained = this.data.maxAmount;
        }
    },

    remove: function (amount)
    {
        this._amountContained -= amount;

        if (this._amountContained <= 0)
        {
            this._amountContained = 0;
        }
    }
});
