/*
 * By installing or using this file, you are confirming on behalf of the entity
 * subscribed to the SugarCRM Inc. product ("Company") that Company is bound by
 * the SugarCRM Inc. Master Subscription Agreement (“MSA”), which is viewable at:
 * http://www.sugarcrm.com/master-subscription-agreement
 *
 * If Company is not bound by the MSA, then by installing or using this file
 * you are agreeing unconditionally that Company will be bound by the MSA and
 * certifying that you have authority to bind Company accordingly.
 *
 * Copyright  2004-2013 SugarCRM Inc.  All rights reserved.
 */

({
    extendsFrom: 'RelateField',
    minChars: 1,
    allow_single_deselect: false,
    events: {
        'click .btn[name=add]': 'addItem',
        'click .btn[name=remove]': 'removeItem',
        'click .btn[name=primary]': 'setPrimaryItem',
        'change input.select2': 'inputChanged'
    },
    plugins: ['QuickSearchFilter', 'EllipsisInline', 'Tooltip'],
    initialize: function (options) {
        app.view.invokeParent(this, {type: 'field', name: 'relate', method: 'initialize', args:[options]});

        this.model.on("change:team_name_type", this.appendTeam, this);
    },
    /**
     * Changes default behavior when doing inline editing on a List view.  We want to
     * load 'list' template instead of 'edit' template because this keeps the teamset widget
     * read-only during inline editing. See SP-1197.
     * @override
     * @private
     */
    _loadTemplate: function() {
        app.view.invokeParent(this, {type: 'field', name: 'relate', method: '_loadTemplate'});
        //If we're loading edit template on List view
        if (this.view.action === 'list' && this.tplName === 'edit') {
            //Switch to detail template instead
            this.template = app.template.getField(this.type, 'list', this.module, this.tplName) ||
                app.template.empty;
            this.tplName = 'list';
        }
    },
    _render: function () {
        var self = this;
        this._super('_render');

        if (this.tplName === 'edit') {
            this.$(this.fieldTag).each(function (index, el) {
                var plugin = $(el).data("select2");
                // If there is a plugin but no team index, set it
                if (!_.isUndefined(plugin) && _.isUndefined(plugin.setTeamIndex)) {
                    plugin.setTeamIndex = function () {
                        self.currentIndex = $(this).data("index");
                    };
                    plugin.opts.element.on("open", plugin.setTeamIndex);
                }
            });
        }
    },
    /**
     * Called to update value when a selection is made from options view dialog
     * @param model New value for teamset
     */
    setValue: function (model) {
        if (!model) {
            return;
        }
        var index = this.currentIndex,
            team = this.value;
        team[index || 0].id = model.id;
        team[index || 0].name = model.value;
        this._updateAndTriggerChange(team);
    },
    format: function (value) {
        if (this.model.isNew() && (_.isEmpty(value) || this.model.get(this.name) != value)) {
            //load the default team setting that is specified in the user profile settings
            if (_.isEmpty(value)) {
                value = app.utils.deepCopy(app.user.getPreference("default_teams"));
            }
            this.model.set(this.name, value);
        }
        value = app.utils.deepCopy(value);
        if (!_.isArray(value)) {
            value = [
                {
                    name: value
                }
            ];
        }
        if (this.view.action === 'list') {
            //Display primary team in list view
            var primaryTeam = _.find(value, function (team) {
                return team.primary;
            });
            // If there is no primary team discovered return an empty string
            return !_.isUndefined(primaryTeam) && !_.isUndefined(primaryTeam.name) ? primaryTeam.name : "";
        }
        // Place the add button as needed
        if (_.isArray(value) && value.length > 0) {
            _.each(value, function (team) {
                delete team.remove_button;
                delete team.add_button;
            });
            value[value.length - 1].add_button = true;
            // number of valid teams
            var numTeams = _.filter(value, function (team) {
                return !_.isUndefined(team.id);
            }).length;
            // Show remove button for all unset combos and only set combos if there are more than one
            _.each(value, function (team) {
                if (_.isUndefined(team.id) || numTeams > 1) {
                    team.remove_button = true;
                }
            });
        }
        return value;
    },
    addTeam: function () {
        this.value.push({});
        this._updateAndTriggerChange(this.value);
    },
    removeTeam: function (index) {
        // Do not remove last team.
        if (index === 0 && this.value.length === 1) {
            return;
        }
        //Pick first team to be Primary if we're removing Primary team
        var removed = this.value.splice(index, 1);
        if (removed && removed.length > 0 && removed[0].primary) {
            this.setPrimary(0);
        }
        this._updateAndTriggerChange(this.value);
    },
    appendTeam: function () {
        var appendTeam = this.model.get("team_name_type");
        if (appendTeam !== "1") {
            var primaryTeam = _.find(this.value, function (team) {
                return team.primary;
            }, this);
            if (_.isEmpty(primaryTeam)) {
                this.setPrimary(0);
            }
        }
    },
    setPrimary: function (index) {
        var previousPrimary = null,
            appendTeam = this.model.get("team_name_type");
        _.each(this.value, function (team, i) {
            if (team.primary && appendTeam === "1") {
                previousPrimary = i;
            }
            team.primary = false;
        });
        //If this team is set, then allow it to turn primary
        if (previousPrimary !== index && this.value[index].name) {
            this.value[index].primary = true;
        }
        this._updateAndTriggerChange(this.value);
        return (this.value[index]) ? this.value[index].primary : false;
    },
    //Forcing change event since backbone isn't picking up on changes within an object within the array.
    inputChanged: function (evt) {
        this._updateAndTriggerChange(this.value);
    },
    /**
     * Forcing change event on value update since backbone isn't picking up on changes within an object within the array.
     * @param value New value for teamset field
     * @private
     */
    _updateAndTriggerChange: function (value) {
        // SP-1437: No Warning message when update with Team field only
        // http://stackoverflow.com/questions/17221680/backbone-model-changedattributes-not-showing-all-changes
        this.model.unset(this.name, {silent: true}).set(this.name, value);//force changedAttributes
        this.model.trigger("change");
    },
    addItem: _.debounce(function (evt) {
        var index = $(evt.currentTarget).data('index');
        //Only allow adding a Team when ones been selected (SP-534)
        if (!index || this.value[index].id) {
            this.addTeam();
        }
    }, 0),
    removeItem: _.debounce(function (evt) {
        var index = $(evt.currentTarget).data('index');
        if (_.isNumber(index)) {
            this.removeTeam(index);
        }
    }, 0),
    setPrimaryItem: _.debounce(function (evt) {
        var index = $(evt.currentTarget).data('index');

        //Don't allow setting to primary until user's selected an actual team (SP-530)
        if (!this.value[index] || !this.value[index].id) {
            return;
        }
        this.$(".btn[name=primary]").removeClass("active");
        if (this.setPrimary(index)) {
            this.$(".btn[name=primary][data-index=" + index + "]").addClass("active");
        }
    }, 0)
})
