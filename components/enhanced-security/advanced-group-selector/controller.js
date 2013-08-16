/*
 * Copyright (C) 2008-2010 Surevine Limited.
 * 
 * Although intended for deployment and use alongside Alfresco this module should
 * be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
 * http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/
(function()
{
    /**
     * YUI Library aliases
     */
    var Dom = YAHOO.util.Dom, Event = YAHOO.util.Event, Element = YAHOO.util.Element;

    /**
     * Alfresco Slingshot aliases
     */
    var $html = Alfresco.util.encodeHTML;

    /**
     * EnhancedSecuritySelectorAdvancedController constructor.
     * 
     * @param {String}
     *                htmlId The HTML id of the parent div or span
     * @return {Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector} The new
     *         instance
     * @constructor
     */
    Alfresco.EnhancedSecuritySelectorAdvancedController = function()
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecuritySelectorAdvancedController";

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};

        this.onGroupsUpdated = new YAHOO.util.CustomEvent("onGroupsUpdated",
                this);

        return this;
    };

    Alfresco.EnhancedSecuritySelectorAdvancedController.prototype = {
        /**
         * Object container for initialization options
         * 
         * @property options
         * @type object
         */
        options : {

            /**
             * Javascript wrapper for the textBox edit control
             */
            advancedGroupEditBox : null,

            /**
             * Array of EnhancedSecuritySelectorAdvancedSingleGroupSelector
             * objects representing registered single group selectors
             */
            advancedGroupListSelectors : [],

            /**
             * Array of group filters that have been registered with this
             * controller
             */
            groupFilters : [],

            /**
             * List of valid states for Atomal type attributes - there must be
             * three states, with the first state indicating a null state.
             */
            atomalStates : Alfresco.EnhancedSecurityStaticData.getConstants()
                    .getEnumerations().atomal,

            /**
             * Message box registered with this component
             */
            messageBox : null,

            /**
             * Callback for when the validation state is updated
             */
            validationCallback : {
                fn : function(isValid)
                {
                },
                scope : this
            },

            /**
             * Array to hold the open groups that the user has been assigned.
             */
            usersOpenGroups : [],

            /**
             * Array to hold the organisations that the user has been assigned.
             */
            usersOrganisations : [],

            /**
             * Array to hold the list of groups which the parent item has
             */
            parentGroups : [],

            /**
             * Array to hold the set of open markings
             */
            openMarkings : [],

            /**
             * Array to hold the set of organisations
             */
            organisations : []
        },

        /**
         * Object container for storing YUI widget instances.
         * 
         * @property widgets
         * @type object
         */
        widgets : null,

        /**
         * Object container for storing module instances.
         * 
         * @property modules
         * @type object
         */
        modules : null,

        /**
         * The parent item's open groups
         * 
         * @private
         * @property parentOpenGroups
         * @type array
         */
        parentOpenGroups : null,

        /**
         * The parent item's closed groups
         * 
         * @private
         * @property parentClosedGroups
         * @type array
         */
        parentClosedGroups : null,

        /**
         * The parent item's organisations
         * 
         * @private
         * @property parentOrganisations
         * @type array
         */
        parentOrganisations : null,

        /**
         * Simple semaphores to reduce the likelihood of both callbacks firing
         * at once, which would achieve unknown, but probably undesirable,
         * effects
         */
        listCallbacksEnabled : true,

        textCallbacksEnabled : true,

        /**
         * Caches whether the last validation status was true or false
         */
        currentValidationStatus : true,

        /**
         * Event which is triggered when the groups are updated
         */
        onGroupsUpdated : null,

        /**
         * The current atomal state of this selector
         */
        atomalState : Alfresco.EnhancedSecurityStaticData.getConstants()
                .getDefault("atomal"),

        messageIds : new Array(),

        /**
         * Set multiple initialisation options at once.
         * 
         * @method setOptions
         * @param obj
         *                {object} Object literal specifying a set of options
         * @return {Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector}
         *         returns 'this' for method chaining
         */
        setOptions : function(obj)
        {
            this.options = YAHOO.lang.merge(this.options, obj);
            return this;
        },

        /**
         * Set messages for this component.
         * 
         * @method setMessages
         * @param obj
         *                {object} Object literal specifying a set of messages
         * @return {Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector}
         *         returns 'this' for method chaining
         */
        setMessages : function(obj)
        {
            Alfresco.util.addMessages(obj, this.name);
            return this;
        },

        /**
         * Set the atomal state of this selector to the specified value,
         * assuming that the specified value is an allowed atomal state (see
         * this.options.atomalStates)
         * 
         * @param atomal
         *                Case sensitive (ie. all-uppercase) atomal state
         * @method setAtomalState
         */
        setAtomalState : function(atomal)
        {
            if (!this.valueIsInArray(atomal, this.options.atomalStates)
                    && atomal != "") {
                throw new Error("State " + atomal
                        + " is invalid - must be one of "
                        + this.options.atomalStates);
            }
            this.atomalState = atomal;
            this.validate();
        },

        /**
         * Set the open groups for the parent marking
         * 
         * @param groups
         *                the space separated groups string
         */
        setParentOpenGroups : function(groups)
        {
            this.parentOpenGroups = groups;
        },

        /**
         * Set the closed groups for the parent marking
         * 
         * @param groups
         *                the space separated groups string
         */
        setParentClosedGroups : function(groups)
        {
            this.parentClosedGroups = groups;
        },

        /**
         * Set the organisations for the parent marking
         * 
         * @param groups
         *                the space separated groups string
         */
        setParentOrganisations : function(groups)
        {
            this.parentOrganisations = groups;
        },
        
        /**
         * Resets all the selectors back to a blank state
         */
        reset : function()
        {
           for(var i in this.options.advancedGroupListSelectors) {
               this.options.advancedGroupListSelectors[i].reset();
           } 
           
           this.validate();
        },

        /**
         * Callback to add or remove a single group. This method assumes that
         * advancedGroupEditBox is not null.
         * 
         * @param source
         *                The source of the callback
         * @param group
         *                String indicating the name of the group that has been
         *                selected
         * @param added
         *                If true, add the group, if false, remove it
         * @method singleGroupCallback
         */
        singleGroupCallback : function(source, group, added)
        {
            if (this.listCallbacksEnabled) {
                this.textCallbacksEnabled = false;
                try {
                    if (this.options.advancedGroupEditBox) {
                        if (added) {
                            this.options.advancedGroupEditBox.addGroups(group);
                        } else {
                            this.options.advancedGroupEditBox
                                    .removeGroups(group);
                        }
                    }
                    this.groupsUpdated();
                    this.validate();

                } finally {
                    this.textCallbacksEnabled = true;
                }

            }
        },

        /**
         * Change focus to the controller to run validation for when no groups
         * have been selected.
         * 
         * @method noGroupsSpecifiedCallback
         */
        noGroupsSpecifiedCallback : function()
        {
            this.validate();
        },

        /**
         * Callback method fired by a text box selector to indicate that it has
         * been updated, and so all list box entries should be cleared. This
         * will then usually be followed by calls to textBoxGroupChange to add
         * in any groups left selected in the text box
         * 
         * @method clearAllListGroups
         */
        clearAllListGroups : function()
        {
            if (this.textCallbacksEnabled) {
                this.listCallbacksEnabled = false;

                try {
                    var lists = this.options.advancedGroupListSelectors;

                    for ( var i = 0; i < lists.length; i++) {
                        lists[i].clear();
                    }

                    this.validate();
                } finally {
                    this.listCallbacksEnabled = true;
                }
            }
        },

        /**
         * Register an existing list box (aka single group) selector with the
         * controller. Registering a list box sets the appropriate callbacks,
         * injects a reference of this controller into the selector (for use
         * within the callback just set) and updates the allowable values of the
         * text box selector, if one has been registered with this controller
         * (if not, then the allowable values from any registered list box
         * selectors will be pushed into the text box selector when it is
         * registered)
         * 
         * @param singleGroupSelector
         *                An instance of
         *                Alfresco.EnhancedSecuritySelectorAdvancedSingleGroupSelector
         *                to register with this controller
         * @method registerSingleGroupSelector
         */
        registerSingleGroupSelector : function(singleGroupSelector)
        {
            this.options.advancedGroupListSelectors.push(singleGroupSelector);
            singleGroupSelector.setOptions({
                updateCallback : {
                    fn : this.singleGroupCallback,
                    scope : this
                },
                hasSelectionCallback : {
                    fn : this.validate,
                    scope : this
                },
                controller : this
            });

            if (this.options.advancedGroupEditBox != null) {
                this.options.advancedGroupEditBox
                        .addAllowableValues(singleGroupSelector.options.groupsString);
            }

            this.validate();
        },

        /**
         * The validation callback
         */
        validationCallback : function(isValid)
        {
            if (isValid != this.currentValidationStatus) {
                this.currentValidationStatus = isValid;

                this.options.validationCallback.fn.call(
                        this.options.validationCallback.scope, isValid);
            }
        },

        /**
         * Register a message box with this component and inject a reference to
         * this component into the message box
         */
        registerMessageBox : function(messageBox)
        {
            this.options.messageBox = messageBox;
            messageBox.setOptions({
                controller : this
            });
        },

        /**
         * Convenience method to create and register
         * anAlfresco.EnhancedSecurityMessageBox. This is the recommend way of
         * creating instances of Alfresco.EnhancedSecurityMessageBox.
         * 
         * @param htmlid
         *                The htmlId of a component (usually a div or span) into
         *                which to render the HTML elements comprising this
         *                selector
         * @method createMessageBox
         */
        createMessageBox : function(htmlId)
        {
            var messageBox = new Alfresco.EnhancedSecurityMessageBox(htmlId);
            this.registerMessageBox(messageBox);
        },

        /**
         * Reset the implications of any previous calls to
         * displayOnlyTheseGroups, delegating to the list box selectors to
         * perform the actual work
         * 
         * @method showAllGroups
         */
        showAllGroups : function()
        {
            var lists = this.options.advancedGroupListSelectors;

            for ( var i = 0; i < lists.length; i++) {
                if(lists[i].isOrganisations()) {
                    if (!this.parentOrganisations || this.parentOrganisations.length == 0) {
                    /* If there are no parent groups, show all the groups */
                        lists[i].showAllGroups();
                    } else {
                        /* Otherwise restrict it to the parent's open groups */
                        lists[i].filterGroups(this.parentOrganisations.join(" "));
                    }
                } else if(lists[i].isOpenGroup()) {
                    if (!this.parentOpenGroups || this.parentOpenGroups.length == 0) {
                    /* If there are no parent groups, show all the groups */
                        lists[i].showAllGroups();
                    } else {
                        /* Otherwise restrict it to the parent's open groups */
                        lists[i].filterGroups(this.parentOpenGroups.join(" "));
                    }
                } else if(lists[i].forceSingleSelection()) {
                    // Only one can be selected - if there is already one selected then hide all the others
                    // otherwise show them all
                    var found = false;
                    
                    for(var j in this.parentClosedGroups) {
                        if(lists[i].supportsGroup(this.parentClosedGroups[j])) {
                            lists[i].filterGroups(this.parentClosedGroups.join(" "));
                            found = true;
                            break;
                        }
                    }
                    
                    if(!found) {
                        lists[i].showAllGroups();
                    }
                } else {
                    lists[i].showAllGroups();
                }
            }
        },

        /**
         * Display only the specified groups, if they exist. Does not affect
         * which groups are valid or not, just which groups are displayed in
         * check boxes. Delegates to the list box selectors to actually perform
         * the filter
         * 
         * @param groups
         *                Space separated list of groups - hide any group not in
         *                this list. If an element of this list does not
         *                represent a valid group, that element is silently
         *                ignored
         * @method displayOnlyTheseGroups
         */
        displayOnlyTheseGroups : function(groups)
        {
            var lists = this.options.advancedGroupListSelectors;

            var ogFilteredGroups = this
                    .filterGroupStringForParentOpenGroups(groups);
            var organisationFilteredGroups = this
                    .filterGroupStringForParentOrganisations(groups);

            for ( var i = 0; i < lists.length; i++) {
                if (lists[i].isOrganisations()) {
                    lists[i].filterGroups(organisationFilteredGroups);
                } else if (lists[i].isOpenGroup()) {
                    lists[i].filterGroups(ogFilteredGroups);
                } else {
                    lists[i].filterGroups(groups);
                }
            }
        },

        /**
         * Filters a space-separated list of groups according to the parent's
         * open groups in the following way:
         * <ul>
         * <li>If the item has no parent item, all groups are allowed</li>
         * <li>If the parent item has no open groups then all groups are
         * allowed</li>
         * <li>If the parent item has open groups, then only those open groups
         * will be allowed</li>
         * </ul>
         * 
         * Note: This method currently uses a regular expression. If the parent
         * open groups contains a special regex character then this may well
         * break.
         * 
         * @private
         * @method filterGroupStringForParentOpenGroups
         * @param groups
         *                the space separated list of groups to filter
         */
        filterGroupStringForParentOpenGroups : function(groups)
        {
            if (!this.parentOpenGroups || this.parentOpenGroups.length == 0) {
                return groups;
            }

            var i, j, parentGroup, output = [];

            var splitGroups = groups.split(" ");

            for (i in this.parentOpenGroups) {
                parentGroup = this.parentOpenGroups[i];

                for (j in splitGroups) {
                    if (splitGroups[j] == "") {
                        continue;
                    }

                    if (parentGroup == splitGroups[j]) {
                        output.push(parentGroup);
                        break;
                    }
                }
            }

            return output.join(" ");
        },
        
        /**
         * Filters a space-separated list of groups according to the parent's
         * organisations in the following way:
         * <ul>
         * <li>If the item has no parent item, all organisations are allowed</li>
         * <li>If the parent item has organisations, then only those organisations
         * will be allowed</li>
         * </ul>
         * 
         * Note: This method currently uses a regular expression. If the parent
         * organisations contains a special regex character then this may well
         * break.
         * 
         * @private
         * @method filterGroupStringForParentOrganisations
         * @param groups
         *                the space separated list of groups to filter
         */
        filterGroupStringForParentOrganisations : function(groups)
        {
            if (!this.parentOrganisations || this.parentOrganisations.length == 0) {
                return groups;
            }

            var i, j, parentGroup, output = [];

            var splitGroups = groups.split(" ");

            for (i in this.parentOrganisations) {
                parentGroup = this.parentOrganisations[i];

                for (j in splitGroups) {
                    if (splitGroups[j] == "") {
                        continue;
                    }

                    if (parentGroup == splitGroups[j]) {
                        output.push(parentGroup);
                        break;
                    }
                }
            }

            return output.join(" ");
        },

        /**
         * Retrieve a space seperated list of all the groups managed by
         * components registered with this controller
         * 
         * @method getAllGroupsFromLists
         */
        getAllGroupsFromLists : function()
        {
            var lists = this.options.advancedGroupListSelectors;
            var groups = "";

            for ( var i = 0; i < lists.length; i++) {
                groups += " " + lists[i].options.groupsString;
                groups = YAHOO.lang.trim(groups);
            }
            return groups;
        },

        /**
         * Called when the groups have changed
         */
        groupsUpdated : function()
        {
            var groups = {
                open : [],
                closed : [],
                organisations: []
            };
            
            if(this.parentOpenGroups) {
                groups.open = this.parentOpenGroups;
            }
            
            var lists = this.options.advancedGroupListSelectors;

            for ( var i = 0; i < lists.length; i++) {
                if(lists[i].isOrganisations()) {
                    if(!lists[i].areAllSelected()) {
                        groups.organisations = groups.organisations.concat(lists[i]
                        .getSelectedGroups());
                    }
                } else if (lists[i].isOpenGroup()) {
                    groups.open = groups.open.concat(lists[i]
                            .getSelectedGroups());
                } else {
                    groups.closed = groups.closed.concat(lists[i]
                            .getSelectedGroups());
                }
            }

            this.validate();
            this.onGroupsUpdated.fire(groups);
        },

        /**
         * Is the given value in the given array?
         * 
         * @method valueIsInArray
         */
        valueIsInArray : function(value, arr)
        {
            for ( var i = 0; i < arr.length; i++) {
                if (arr[i] == value) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Carries out validation and updates the messages and calls the
         * validation callback appropriately
         */
        validate : function()
        {
            var validation = this.getValidation();

            if (this.options.messageBox) {
                this.options.messageBox.setMessages(validation.messages);
            }

            this.validationCallback(validation.valid);
        },

        /**
         * Validate the current form and return a series of warning and/or error
         * messages. This checks that the atomal status is valid, and that the
         * groups entered into the textbox are valid.
         * 
         * @return An array of validation objects. A validation object has two
         *         properties: "message" is a string to present to the user
         *         informing them of why validation has failed. "warning" is a
         *         boolean that, if true, indicates that the user can choose to
         *         ignore the validation error without causing the system to
         *         fail. If false, then the user cannot save their marking until
         *         the validation failure has been resolved.
         * @method validate
         */
        getValidation : function()
        {
            var result = {
                valid : true,
                messages : []
            };

            // If we are editing an item, add a helpful message
            if((this.parentClosedGroups != "") || (this.parentOpenGroups != "") || (this.parentOrganisations != "")) {
                result.messages.push({
                    id : "infoParentGroups",
                    message : this._msg("info.parent-groups"),
                    type : "info"
                });
            }
            
            // Check that something has been selected for all selectors
            for ( var i in this.options.advancedGroupListSelectors) {
                var selector = this.options.advancedGroupListSelectors[i];
                if (!selector.hasSelection()) {
                    result.valid = false;
                    result.messages
                            .push({
                                id : "needsSelectionFromAllGroups",
                                message : this
                                        ._msg(
                                                "error.needs-selection-from-all-groups",
                                                this.options.advancedGroupListSelectors.length),
                                type : "info"
                            });
                    break;
                }
            }

            // Check that at least one group is selected if atomal is set
            // If the parent item has legacy open groups then we let that count too.
            if ((this.atomalState != this.options.atomalStates[0])
                    && (!this.parentOpenGroups || (this.parentOpenGroups.length == 0))) {
                var found = false;

                for ( var i in this.options.advancedGroupListSelectors) {
                    var selector = this.options.advancedGroupListSelectors[i];

                    if (selector.countsTowardsAtomal(this.atomalState)
                            && (selector.getNumberOfSelectedGroups() > 0)
                            && (!selector.allSelectedMeansNone() || !selector
                                    .areAllSelected())) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    if (this.atomalState == this.options.atomalStates[1]) {
                        message = this._msg(
                                "error.atomal-without-groups-or-organisations",
                                [ this.atomalState ]);
                    } else {
                        message = this._msg("error.atomal-without-groups-must",
                                [ this.atomalState ]);
                    }
                    result.valid = false;
                    result.messages.push({
                        message : message,
                        type : "error"
                    });
                }
            }

            // Check that the user has selected at least their own organisation
            for ( var i in this.options.advancedGroupListSelectors) {
                var selector = this.options.advancedGroupListSelectors[i];

                if (selector.isOrganisations() && selector.hasSelection()) {
                    var selectedGroups = selector.getSelectedGroups();
                    var found = false;

                    for ( var i in selectedGroups) {
                        if (this.userCanAccessOrganisation(selectedGroups[i])) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        result.valid = false;
                        result.messages
                                .push({
                                    message : this
                                            ._msg("error.needs-access-to-an-organisation"),
                                    type : "error"
                                });
                    }
                }
            }

            return result;
        },

        /**
         * Is the given group an open group?
         * 
         * @param group
         *                Name of a group to check
         * @return True if the specified group is an open group, false if it is
         *         a closed group or doesn't exist
         */
        isGroupOpenGroup : function(group)
        {
            for (selector in this.options.advancedGroupListSelectors) {
                if (this.options.advancedGroupListSelectors[selector]
                        .isOpenGroup()
                        && this.options.advancedGroupListSelectors[selector]
                                .supportsGroup(group)) {
                    return true;
                }
            }
        },

        /**
         * Checks the selector to make sure that there is an open group if the
         * existing item has an open group
         * 
         * @return
         */
        checkParentOpenGroupLogic : function()
        {
            this.options.messageBox.removeMessage("parentNeedsOpenGroup");
            // If we're in edit mode, and the parent item had at least one
            // Open Group, we need to have at least one
            // open group
            var selector = Alfresco.util.ComponentManager
                    .findFirst('Alfresco.EnhancedSecuritySelector');
            // If we have a parent marking and the parent marking has at
            // least one open group...
            if (selector.hasParentMarking()
                    && selector.getParentMarking().openGroups.length > 0) {
                // ...Go through every group selector until we find a ticked
                // box in an open selector
                var foundOpenGroup = false;
                var selectors = Alfresco.util.ComponentManager
                        .find({
                            name : 'Alfresco.EnhancedSecuritySelectorAdvancedSingleGroupSelector'
                        });
                for ( var i = 0; i < selectors.length; i++) {
                    if (selectors[i].isOpenGroup()
                            && selectors[i].getNumberOfSelectedGroups() > 0) {
                        foundOpenGroup = true;
                        break;
                    }
                }
                // If we haven't ticked any open groups, add the error
                if (!foundOpenGroup) {
                    this.messageIds["parentNeedsOpenGroup"] = "parentNeedsOpenGroup";
                    this.options.messageBox.addMessage(this
                            ._msg("error.needs-an-open-group"),
                            "parentNeedsOpenGroup", "error");
                }

                this.validate();
            }
        },

        /**
         * Overwrites the current group string.
         * 
         * @method setGroups
         * @param groups
         *                The space separated list of groups
         */
        setGroups : function(groups)
        {
            groups = groups.toUpperCase().split(" ");

            for ( var i in this.options.advancedGroupListSelectors) {
                var selector = this.options.advancedGroupListSelectors[i];

                selector.clear();

                for ( var j in groups) {
                    selector.selectGroupByName(groups[j], true);
                }
                
                if(selector.allSelectedMeansNone() && (selector.getNumberOfSelectedGroups() == 0)) {
                    selector.selectAll();
                }
            }

            this.validate();
        },

        /**
         * Returns <code>true</code> if the user has access to the given
         * organisation.
         * 
         * @return boolean
         */
        userCanAccessOrganisation : function(groupName)
        {
            return Alfresco.util.arrayContains(this.options.usersOrganisations,
                    groupName);
        },

        /**
         * Gets the current group string
         * 
         * @return the space separated list of groups
         */
        getGroups : function()
        {
            groups = [];

            // We don't have a selector for open groups so pass the
            // parent open groups through )if there are any)
            if(this.parentOpenGroups) {
                groups = groups.concat(this.parentOpenGroups);
            }
            
            for ( var i in this.options.advancedGroupListSelectors) {
                var selector = this.options.advancedGroupListSelectors[i];

                // If all organisations are selected then we send back no
                // organisations
                if ((selector.options.title != "Organisations")
                        || !selector.areAllSelected()) {
                    groups = groups.concat(selector.getSelectedGroups());
                }
            }
            
            groups.sort();

            return groups.join(" ");
        },

        /**
         * "Stick" any closed groups in the supplied list, making them
         * irremovable by the user
         * 
         * @param stickyGroups
         *                Array of groups. If the list includes any open
         *                markings, these are to be ignored silently - only
         *                valid closed groups will be processed
         * @method stickGroups
         */
        stickGroups : function(stickyGroups)
        {
            // Only process closed groups
            var newList = [];
            for ( var i = 0; i < stickyGroups.length; i++) {
                if (!(this.isGroupOpenGroup(stickyGroups[i]))) {
                    newList.push(stickyGroups[i]);
                }
            }
            var newStickyGroups = newList.join(" ");

            for ( var i = 0; i < this.options.advancedGroupListSelectors.length; i++) {
                this.options.advancedGroupListSelectors[i]
                        .stickGroups(newStickyGroups);
            }
        },
        
        /**
         * Sets up everything according to the parent marking (i.e. sticking/hiding groups
         * as appropriate)
         */
        handleParentMarking : function()
        {
            if(this.parentClosedGroups && this.parentClosedGroups.length > 0) {
                this.stickGroups(this.parentClosedGroups);
            } else {
                this.stickGroups([]);
            }
            
            this.showAllGroups();
        },

        /**
         * PRIVATE FUNCTIONS
         */

        /**
         * Gets a custom message
         * 
         * @method _msg
         * @param messageId
         *                {string} The messageId to retrieve
         * @return {string} The custom message
         * @private
         */
        _msg : function(messageId)
        {
            return Alfresco.util.message.call(this, messageId,
                    "Alfresco.EnhancedSecuritySelectorAdvancedController",
                    Array.prototype.slice.call(arguments).slice(1));
        }
    };

})();
