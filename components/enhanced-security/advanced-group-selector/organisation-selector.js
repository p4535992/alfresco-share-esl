/**
 * EnhancedSecuritySelectorGroupsAdvancedSelector component.
 * 
 * Component provides the advanced group selector for a single group type.
 * 
 * To add a selector for a single group type to an enclosing div or span with an
 * ID of "container", you might make the following call:
 * 
 * new
 * Alfresco.EnhancedSecuritySelectorAdvancedOrganisationSelector('foo').setOptions( {
 * groupsString: "OG01 OG02 OG03 OG04 OG05", title: "Category A Groups",
 * updateCallback: { fn: function() { }, scope: this });
 * 
 * Alternatively, an instance of this class can be created from a
 * Alfresco.EnhancedSecuritySelectorAdvancedController with the following code:
 * 
 * controller.createSelectorForGroupType("Category A Groups", "OG01 OG02 OG03
 * OG04 OG05", "foo");
 * 
 * This method has the advantage of automatically registering the object created
 * with the controller
 * 
 * @namespace Alfresco
 * @class EnhancedSecuritySelectorAdvancedOrganisationSelector
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
     * EnhancedSecuritySelectorAdvancedOrganisationSelector constructor.
     * 
     * @namespace Alfresco
     * @class EnhancedSecuritySelectorAdvancedOrganisationSelector
     * @param {String}
     *                htmlId The HTML id of the parent div or span
     * @return {Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector} The new
     *         instance
     * @constructor
     */
    Alfresco.EnhancedSecuritySelectorAdvancedOrganisationSelector = function(
            htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecuritySelectorAdvancedOrganisationSelector";

        // Do not allow IDs with double quotes as this presents an XSS vector.
        // Other theoretically invalid HtmlIds will be processed OK
        if (!htmlId.indexOf('"') == -1) {
            throw new Error("HTML Id " + htmlId
                    + " cannot contain double quote marks");
        }

        this.id = htmlId;

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};

        /* Register this component */
        Alfresco.util.ComponentManager.register(this);

        /* Load YUI Components */
        Alfresco.util.YUILoaderHelper.require([ "json", "connection", "event",
                "button" ], this.onComponentsLoaded, this);

        return this;
    };

    YAHOO
            .extend(
                    Alfresco.EnhancedSecuritySelectorAdvancedOrganisationSelector,
                    Alfresco.EnhancedSecuritySelectorAdvancedSingleGroupSelector,
                    {

                        /**
                         * Fired by YUI when parent element is available for
                         * scripting. Component initialisation, including
                         * instantiation of YUI widgets and event listener
                         * binding.
                         * 
                         * @method onReady
                         */
                        onReady : function()
                        {
                            var parent = Dom.get(this.id);
                            this.addElements(parent);

                            this.widgets.allButton = Alfresco.util
                                    .createYUIButton(this, "all-button",
                                            this.allClicked);

                            this.widgets.mineButton = Alfresco.util
                                    .createYUIButton(this, "some-button",
                                            this.mineButtonClicked);

                            this.showTitle(this.options.title);
                            this.showOptions(this.options.groupsDetailArray);

                            this.stickGroups(this.stickyGroups);
                            
                            this.options.renderedCallback.fn.call(this.options.renderedCallback.scope);
                        },

                        /**
                         * Called by onReady, this method renders the basic
                         * structure of the component, without any data or event
                         * listeners, into the specified parent element
                         * 
                         * @param parent
                         *                {div/span} A container, which should
                         *                be a div or a span, into which to
                         *                insert HTML
                         * @method addElements
                         */
                        addElements : function(parent)
                        {
                            var id = this.id;
                            parent.innerHTML += '<h4 id="'
                                    + $html(id)
                                    + '-label" class="markingName"> </h4>'
                                    + '<div id="'
                                    + $html(id)
                                    + '-buttons-container" class="markingButtonContainer"><button value="None" id="'
                                    + $html(id)
                                    + '-all-button" class="markingButton allButton" name="allButton">'
                                    + $html(this._msg(
                                            "single-group-selector.button.all",
                                            this.options.title))
                                    + '</button>'
                                    + '</div>'
                                    + '<ul id="'
                                    + $html(id)
                                    + '-list-container" class="markingListContainer axs listbox aria-multiselectable">'
                                    + '</ul>'
                                    + '<div class="markingButtonContainer">'
                                    + '<button value="Some" id="'
                                    + $html(id)
                                    + '-some-button" class="markingButton someButton" name="someButton">'
                                    + $html(this
                                            ._msg(
                                                    "single-group-selector.button.mine",
                                                    this.options.title.replace(/s$/,'')))
                                    + '</button>' + '</div>';
                        },

                        /**
                         * Is this selector selecting values from an open group?
                         * The organisations work under an open group logic so
                         * this always returns <code>true</code>
                         * 
                         * @return boolean
                         */
                        isOpenGroup : function()
                        {
                            return true;
                        },

                        /**
                         * Is this selector selecting values from an organisation?
                         * This is the organisation selector so always returns true!
                         * 
                         * @return boolean
                         */
                        isOrganisations : function()
                        {
                            return true;
                        },

                        allClicked : function(e)
                        {
                            Alfresco.EnhancedSecuritySelectorAdvancedOrganisationSelector.superclass.allClicked
                                    .call(this, e);
                        },

                        /**
                         * Action method called
                         * 
                         * @param e
                         */
                        mineButtonClicked : function(e)
                        {
                            this.selectOnlyUsersGroups();
                        },

                        /**
                         * Selects only the groups the user has access to.
                         */
                        selectOnlyUsersGroups : function()
                        {
                            // Get all groups
                            var groups = YAHOO.util.Selector.query('ul[id='
                                    + this.id
                                    + '-list-container] li:not(.invisible) a');

                            for ( var i = 0; i < groups.length; i++) {
                                var groupName = groups[i].firstChild.nodeValue;

                                if (this.options.controller
                                        .userCanAccessOrganisation(groupName)) {
                                    this.selectGroup(groups[i]);
                                } else {
                                    this.deSelectGroup(groups[i]);
                                }
                            }
                        },

                        /**
                         * Prevent them from being unset - this code assumes
                         * they have already been set.
                         * 
                         * @param groups
                         *                Space seperated list of sticky groups.
                         * @method stickGroups
                         */
                        stickGroups : function(groups)
                        {
                            this.stickyGroups = groups;

                            var i;

                            var stuckGroups = YAHOO.util.Selector
                                    .query('ul[id=' + this.id
                                            + '-list-container] li a.stuck');

                            for (i in stuckGroups) {
                                Dom.removeClass(stuckGroups[i], "stuck");
                                Event.addListener(stuckGroups[i], 'click',
                                        this.onGroupClick, this, true);
                            }

                            // If we've got any sticky groups, and this isn't an
                            // open
                            // group...
                            if (this.stickyGroups != null
                                    && !(this.isOpenGroup())) {
                                // Stick down any sticky groups
                                var groupsArr = this.stickyGroups.split(" ");
                                for (i = 0; i < groupsArr.length; i++) {
                                    var anchor = YAHOO.util.Selector
                                            .query('li[id=' + this.id
                                                    + '-list-container-'
                                                    + escape(groupsArr[i])
                                                    + '] a');
                                    Dom.addClass(anchor, "stuck");
                                    Event.removeListener(anchor, 'click',
                                            this.onGroupClick, this, true);
                                    Event.addListener(anchor, "click",
                                            function(evt)
                                            {
                                                Event.stopEvent(evt);
                                            });
                                }
                            }
                        },

                        /**
                         * {@inheritDoc}
                         * @override
                         */
                        allSelectedMeansNone : function()
                        {
                            return true;
                        },
                        
                        /**
                         * {@inheritDoc}
                         * @override
                         */
                        countsTowardsAtomal : function(atomalValue)
                        {
                            // TODO This all feels really wrong
                            return atomalValue == this.options.controller.options.atomalStates[1];
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
                            return Alfresco.util.message
                                    .call(
                                            this,
                                            messageId,
                                            "Alfresco.EnhancedSecuritySelectorAdvancedOrganisationSelector",
                                            Array.prototype.slice.call(
                                                    arguments).slice(1));
                        }
                    });

})();