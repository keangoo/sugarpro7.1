/*
 * By installing or using this file, you are confirming on behalf of the entity
 * subscribed to the SugarCRM Inc. product ("Company") that Company is bound by
 * the SugarCRM Inc. Master Subscription Agreement ("MSA"), which is viewable at:
 * http://www.sugarcrm.com/master-subscription-agreement
 *
 * If Company is not bound by the MSA, then by installing or using this file
 * you are agreeing unconditionally that Company will be bound by the MSA and
 * certifying that you have authority to bind Company accordingly.
 *
 * Copyright  2004-2013 SugarCRM Inc.  All rights reserved.
 */
({
    /**
     * {@inheritDoc}
     *
     * This field doesn't support `showNoData`.
     */
    showNoData: false,

    events: {
        'click [data-event="list:follow:fire"]': 'toggleFollowing'
    },

    extendsFrom: 'RowactionField',

    initialize: function(options) {
        app.view.invokeParent(this, {type: 'field', name: 'rowaction', method: 'initialize', args:[options]});
        this.format();
    },
    bindDataChange: function() {
        if (this.model) {
            this.model.on("change:following", this.resetLabel, this);
        }

        // when the record is marked as favorite, it is subsequently followed by the current user (on server-side)
        // need to sync the client-side model, so an event is fired on the context from the favorite field upon success
        // set following on the model so we don't have to make a server request to get the latest value
        this.model.on("favorite:active", function() {
            this.model.set("following", true);
        }, this);
    },
    /**
     * Set current label and value since the follow button relates to the following
     *
     * @param value
     */
    format: function(value) {
        value = this.model.get("following");

        //For record view, the label should be diffent from other views
        //It also needs to have mouseover handlers for updating text
        if(this.tplName === "detail") {
            var label = value ? "LBL_FOLLOWING" : "LBL_FOLLOW";
            this.label = app.lang.get(label, this.module);
        } else {
            var label = value ? "LBL_UNFOLLOW" : "LBL_FOLLOW";
            this.label = app.lang.get(label, this.module);
        }
        return value;
    },
    /**
     * Reset label and triggers "show" handler to update parent controller dom
     */
    resetLabel: function() {
        this.render();
        //It should trigger the handler "show" to update parent controller
        //i.e. actiondropdown
        this.trigger("show");
    },
    unbindDom: function() {
        this.$("[data-hover=true]").off();
        app.view.invokeParent(this, {type: 'field', name: 'rowaction', method: 'unbindDom'});
    },
    _render: function () {
        var module, mouseoverText, mouseoverClass, self = this;

        module = app.metadata.getModule(this.model.module);
        if (!module.activityStreamEnabled) {
            this.hide();
        } else {
            app.view.invokeParent(this, {type: 'field', name: 'rowaction', method: '_render'});

            if (this.tplName !== "detail") {
                return;
            }

            if (this.model.get("following")) {
                mouseoverText = app.lang.get("LBL_UNFOLLOW");
                mouseoverClass = "label-important";
            } else {
                mouseoverText = app.lang.get("LBL_FOLLOW");
                mouseoverClass = "label-success";
            }

            this.$("[data-hover=true]").on("mouseover",function () {
                $(this).text(mouseoverText).attr("class", "label").addClass(mouseoverClass);
            }).on("mouseout", function () {
                    var kls = self.model.get("following") ? "label-success" : "";
                    $(this).text(self.label).attr("class", "label").addClass(kls);
                });
        }
    },
    /**
     * Call REST API for subscribe and unsubscribe
     *
     * @param Window.Event
     */
    toggleFollowing: function(e) {
        var isFollowing = this.model.get("following");

        if(!_.isUndefined(isFollowing)) {
            var options = {
                alerts: false
            };
            if (this.model.follow(!isFollowing, options) === false) {
                app.logger.error('Unable to follow "' + this.model.module + '" record "' + this.model.id);
                return;
            }
        }
    }
})
