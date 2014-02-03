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
    extendsFrom: 'HeaderpaneView',
    /**
     * {@inheritDoc}
     *
     * Override the title to pass the context with the server info.
     */
    _renderHtml: function() {
        var title = this.title || this.module;
        this.title = app.lang.get(title, this.module, app.metadata.getServerInfo());

        app.view.View.prototype._renderHtml.call(this);
    }
})
