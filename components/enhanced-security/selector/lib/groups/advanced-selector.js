/**
 * EnhancedSecuritySelectorGroupsAdvancedSelector ent.
 * 
 * ent provides the advanced group selector.
 * 
 * @namespace Alfresco
 * @class EnhancedSecuritySelectorGroupsAdvancedSelector
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
     * EnhancedSecuritySelectorGroupsAdvancedSelector constructor.
     * 
     * @param {String}
     *            htmlId The HTML id of the parent element
     * @return {Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector} The new
     *         instance
     * @constructor
     */
    Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector = function(htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector";
        this.id = htmlId;

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};

        this.controller = new Alfresco.EnhancedSecuritySelectorAdvancedController(htmlId);

        this.controller.setOptions(
            {
                validationCallback :
                    {
                        fn : this.validationStateChanged,
                        scope : this
                    }
            });

        /* Initialise the events */
        this.controller.onGroupsUpdated.subscribe(this.onGroupsUpdatedHandler, this, this);

        YAHOO.Bubbling.on("enhancedSecuritySelector.onGroupsLoaded", this.groupsLoaded, this);
        YAHOO.Bubbling.on("enhancedSecuritySelector.onGroupsLoadFailure", this.groupsLoadFailure, this);
        YAHOO.Bubbling.on("enhancedSecuritySelector.onGroupSave", this.proceedWithSave, this);

        
        this.onTriggerVisibilityClick = new YAHOO.util.CustomEvent("onTriggerVisibilityClick", this);

        /* Register this event */
        Alfresco.util.ComponentManager.register(this);

        /* Load YUI events */
        Alfresco.util.YUILoaderHelper
                .require( [ "json", "connection", "event", "button" ], this.onContentsLoaded, this);

        var parent = Alfresco.util.ComponentManager.findFirst("Alfresco.EnhancedSecuritySelector");
        if (parent != null)
        {
            this.parent = controller;
            parent.advancedSelector = this;
        }

        this.parentGroups = {};

        return this;
    };

    Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector.prototype =
        {
            /**
             * Object container for initialization options
             * 
             * @property options
             * @type object
             */
            options :
                {
                    /**
                     * The marking with which to maintain the users selection
                     */
                    currentMarking : null,

                    /**
                     * Space separated string of recently used groups
                     */
                    recentGroups : "",

                    /**
                     * Space separated list of the parent item's groups.
                     */
                    parentGroups : null,

                    /**
                     * The parent item's open groups
                     */
                    parentOpenGroups : null,

                    /**
                     * The parent item's closed groups
                     */
                    parentClosedGroups : null,

                    /**
                     * Callback method for when the save button is clicked
                     * Function will be called with one parameter: the groups
                     * string (space separated)
                     */
                    saveCallback :
                        {
                            fn : function(groups)
                            {
                            },
                            scope : this
                        },

                    /**
                     * Callback method for when the cancel button is clicked
                     * Function will be called with no parameters
                     */
                    cancelCallback :
                        {
                            fn : function()
                            {
                            },
                            scope : this
                        },
                        
                    /**
                     * If set to true the marking will be ignored and the selector will be
                     * blanked (i.e. nothing selected) when it is displayed
                     */
                    startBlank : false
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
             * The controller object
             * 
             * @property controller
             * @type Alfresco.EnhancedSecuritySelectorAdvancedController
             */
            controller : null,

            /**
             * The list of groups to display
             * 
             * @property groups
             * @type string
             */
            groups : null,

            /**
             * The parent item's groups
             */
            parentGroups : null,

            /**
             * Whether the user interface has been initialised
             * 
             * @property uiInitialiased
             */
            uiInitialiased : false,

            /**
             * Whether to show the dialog when the groups are loaded
             * 
             * @property displayDialogOnGroupLoad
             */
            displayDialogOnGroupLoad : false,

            /**
             * Whether to show the dialog when the children (list boxes) have been rendered
             * 
             * @property displayDialogOnChildrenRendered
             */
            displayDialogOnChildrenRendered : false,

            /**
             * Whether this dialog is currently displayed
             */
            isVisible : false,

            /**
             * Reference to an enhanced security selector controller
             */
            parent : null,
            
            /**
             * Count of the number of children which haven't been rendered
             */
            unrenderedChildren : 0,
            
            // +++ PUBLIC EVENTS

            /**
			 * Event fired when the visibility drill-down button is clicked
			 * 
			 * @property onTriggerVisibilityClick
			 */
            onTriggerVisibilityClick : null,

            /**
             * Set multiple initialization options at once.
             * 
             * @method setOptions
             * @param obj
             *            {object} Object literal specifying a set of options
             * @return {Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector}
             *         returns 'this' for method chaining
             */
            setOptions : function(obj)
            {
                this.options = YAHOO.lang.merge(this.options, obj);
                return this;
            },

            /**
             * Set messages for this ent.
             * 
             * @method setMessages
             * @param obj
             *            {object} Object literal specifying a set of messages
             * @return {Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector}
             *         returns 'this' for method chaining
             */
            setMessages : function(obj)
            {
                Alfresco.util.addMessages(obj, this.name);
                this.controller.setMessages(obj);

                return this;
            },

            /**
             * Fired by YUILoaderHelper when required ent script files have been
             * loaded into the browser.
             * 
             * @method onContentsLoaded
             */
            onContentsLoaded : function()
            {
                Event.onContentReady(this.id, this.onReady, this, true);
            },

            /**
             * Fired by YUI when parent element is available for scripting. ent
             * initialisation, including instantiation of YUI widgets and event
             * listener binding.
             * 
             * @method onReady
             */
            onReady : function()
            {
                this.widgets.singleGroupSelectors = [];
                this.widgets.saveButton = Alfresco.util.createYUIButton(this, "saveButton", this.saveClicked,
                    {
                        value : "save"
                    });
                this.widgets.cancelButton = Alfresco.util.createYUIButton(this, "cancelButton", this.cancelClicked,
                    {
                        value : "cancel"
                    });

                this.widgets.visibilityCount = Alfresco.util.ComponentManager.get(this.id + "-visibilityCount");
                
                this.widgets.visibilityCount.onTriggerVisibilityClick.subscribe(function() {
                	this.onTriggerVisibilityClick.fire(this.options.currentMarking);
                }, this, true);
            },

            // +++ PUBLIC METHODS

            /**
             * Displays the dialog
             * 
             * @method show
             */
            show : function()
            {
                if (!this.uiInitialiased)
                {
                    if (this.groups)
                    {
                        this.initUi();
                        this.displayDialogOnChildrenRendered = true;
                        return;
                    }
                    else
                    {
                        if (this.displayDialogOnGroupLoad)
                        {
                            return;
                        }
                        else
                        {
                            this.displayDialogOnGroupLoad = true;
                            this.showLoadingMessage();
                            YAHOO.Bubbling.fire("enhancedSecuritySelector.loadGroups");
                            return;
                        }
                    }
                }

                // Create the panel
                if (!this.widgets.panel)
                {
                    this.widgets.panel = Alfresco.util.createYUIPanel(this.id,
                        {
                            close : false
                        });

					/* resize panel to fit however many group list boxes we have */
		
					var numBoxes = 0;
					var groupListBoxes = Dom.getElementsByClassName("group-list-outer");
					if (groupListBoxes)
					{
						numBoxes = groupListBoxes.length;
					}
		
					if (numBoxes <= 1)
					{
						Dom.addClass(this.id, "columns1");
					}
					else if (numBoxes == 2)
					{
						Dom.addClass(this.id, "columns2");
					}
					else if (numBoxes == 3)
					{
						Dom.addClass(this.id, "columns3");
					}
					else if (numBoxes == 4)
					{
						Dom.addClass(this.id, "columns4");
					}
					else 
					{
						Dom.addClass(this.id, "columnsmorethan4");
					}
					
                    YAHOO.util.Dom.removeClass(this.id, "hidden");
                }

                this.hideLoadingMessage();

                this.isVisible = true;

                if(this.options.startBlank) {
                    this.setToBlank();
                } else {
                    this.resetGroups();
                }
                
                this.controller.handleParentMarking();

                this.securityMarkingChanged();

                this.widgets.panel.show();

                var firstInput = YAHOO.util.Selector.query("input", this.id, true);

                if (firstInput)
                {
                    firstInput.focus();
                }
                
                //In order to avoid showing two visibility counts and to prevent a UI issue in firefox, hide the existing visibility
                //counter to make it look as if it has 'moved' into the panel
                var containers=YAHOO.util.Selector.query('div.visibility-container'); //Should only be one but in a for loop as a guard
                for (var i=0; i < containers.length; i++)
                {
                	containers[i].style.visibility='hidden';
                }

                Event.addListener(this.id + "_mask", "click", this.cancelClicked, this, true);
            },

            /**
             * Hides the dialog
             * 
             * @public
             * @method hide
             */
            hide : function()
            {
            	//'move' the visibility indicator back to where it was
                var containers=YAHOO.util.Selector.query('div.visibility-container'); //Should only be one but in a for loop as a guard
                for (var i=0; i < containers.length; i++)
                {
                	containers[i].style.visibility='';
                } 
                this.isVisible = false;
                this.widgets.panel.hide();
            },

            /**
             * Updates the security marking
             * 
             * @public
             * @method setSecurityMarking
             * @param securityMarking
             */
            setSecurityMarking : function(securityMarking)
            {
                this.options.currentMarking = securityMarking;

                this.securityMarkingChanged();
            },

            /**
             * Called when the security marking has been changed. This will
             * update all the child widgets
             * 
             * @private
             * @method securityMarkingChanged
             */
            securityMarkingChanged : function()
            {
                /* Only update the visibility if we're visible */
                if (this.isVisible && this.widgets.visibilityCount && this.options.currentMarking)
                {
                    this.widgets.visibilityCount.setSecurityMarking(this.options.currentMarking);
                }
            },

            /**
             * Called when the button with ID specified by the option
             * "saveButtonId" is clicked
             * 
             * @private
             * @method saveClicked
             */
            saveClicked : function()
            {
                
                // We don't want to warn the user when they have not changed the number of organisations from the original marking
                // i.e. if they updated a resource with a single organisation already on it.
            	if (this.options.currentMarking.organisations.length===1 && this.controller.parentOrganisations.length !== 1)
            	{
            		Alfresco.util.PopupManager.displayPrompt(
               	         {
               	            title: 'Confirm Organisation',
               	            text: 'You have only selected one organisation.\n\nIf you choose to continue, the item will only\nbe visible to your organisation.',
               	            buttons: [
               	            {
               	               text: 'Continue', 
               	               handler: function()
               	               {
               	            	  YAHOO.Bubbling.fire("enhancedSecuritySelector.onGroupSave");
               	            	  this.destroy();
               	               },
               	               isDefault: false
               	            },
               	            {
               	               text: 'Back', 
               	               handler: function()
               	               {
               	                  this.destroy();
               	               },
               	               isDefault: true
               	            }
               	            ]
               	         }
               	    );         
            	}
            	else
            	{
 	                YAHOO.Bubbling.fire("enhancedSecuritySelector.onGroupSave");
            	}
            	
            },

            proceedWithSave: function()
            {
            	this.options["saveCallback"].fn.call(this.options["saveCallback"].scope, this.controller.getGroups());
            	this.hide();
            },
            
            /**
             * Called when the button with ID specified by the option
             * "cancelButtonId" is clicked
             * 
             * @private
             * @method cancelClicked
             */
            cancelClicked : function()
            {
                this.options["cancelCallback"].fn.call(this.options["cancelCallback"].scope);
                this.controller.options.messageBox.clearMessages();
                this.hide();
            },

            /**
             * Sets the parent item open groups to the specified groups
             * 
             * @param groups
             *            the array or group strings
             */
            setParentOpenGroups : function(groups)
            {
                this.controller.setParentOpenGroups(groups);
            },

            /**
             * Sets the parent item closed groups to the specified groups
             * 
             * @param groups
             *            the array or group strings
             */
            setParentClosedGroups : function(groups)
            {
                this.controller.setParentClosedGroups(groups);
            },

            /**
             * Sets the parent item organisations to the specified groups
             * 
             * @param groups
             *            the array or group strings
             */
            setParentOrganisations : function(groups)
            {
                this.controller.setParentOrganisations(groups);
            },

            /**
             * Called if the groups load failed
             * 
             * @private
             * @method groupsLoadFailure
             */
            groupsLoadFailure : function()
            {
                this.hideLoadingMessage();

                if (this.widgets.panel)
                {
                    this.widgets.panel.hide();
                }

                this.displayDialogOnGroupLoad = false;

                Alfresco.util.PopupManager.displayPrompt(
                    {
                        title : this._msg("groups.loading-failed.title"),
                        text : this._msg("groups.loading-failed")
                    });
            },

            /**
             * Shows a loading message
             * 
             * @private
             * @method showLoadingMessage
             */
            showLoadingMessage : function()
            {
                // show a wait message
                this.widgets.loadingMessage = new YAHOO.widget.Panel("message",
                    {
                        modal : false,
                        visible : false,
                        close : false,
                        draggable : false
                    });

                this.widgets.loadingMessage.setBody("<span class='wait'>" + $html(this._msg("groups.loading"))
                        + "</span>");

                this.widgets.loadingMessage.render(document.body);
                this.widgets.loadingMessage.center();
                this.widgets.loadingMessage.show();
            },

            /**
             * Hides the loading message
             * 
             * @private
             * @method hideLoadingMessage
             */
            hideLoadingMessage : function()
            {
                if (this.widgets.loadingMessage)
                {
                    this.widgets.loadingMessage.destroy();
                    this.widgets.loadingMessage = null;
                }
            },

            /**
             * Called when the groups list has been loaded.
             * 
             * Populate the set of open groups, and the users set of open groups
             * in the controller as this will be used for validation.
             * 
             * @private
             * @method groupsLoaded
             */
            groupsLoaded : function(layer, params)
            {
                this.groups = params[1].groups;

                for (i in this.groups.constraints)
                {
                    if (this.isOpenLogic(this.groups.constraints[i].constraintName))
                    {
                        for (j in this.groups.constraints[i].markings)
                        {
                            this.controller.options.openMarkings.push(this.groups.constraints[i].markings[j].name);

                            if (this.groups.constraints[i].markings[j].hasAccess)
                            {
                                this.controller.options.usersOpenGroups
                                        .push(this.groups.constraints[i].markings[j].name);
                            }
                        }
                    } else if (this.isOrganisations(this.groups.constraints[i].constraintName))
                    {
                        for (j in this.groups.constraints[i].markings)
                        {
                            this.controller.options.organisations.push(this.groups.constraints[i].markings[j].name);

                            if (this.groups.constraints[i].markings[j].hasAccess)
                            {
                                this.controller.options.usersOrganisations
                                        .push(this.groups.constraints[i].markings[j].name);
                            }
                        }
                    }

                }

                if (this.displayDialogOnGroupLoad)
                {
                    this.show();
                }
            },

            /**
             * Builds the user interface
             * 
             * @private
             * @method initUi
             */
            initUi : function()
            {
                var groups = this.groups;

                var groupsDiv = document.getElementById(this.id + "-groups");

                // Go through each of the priority constraints first
                var i;

                for (i in groups.constraints)
                {
                    if (groups.constraints[i].displayPriority == "High")
                    {
                        this.appendConstraint(groups.constraints[i], groupsDiv);
                    }
                }

                // Then go through the other constraints (which weren't in the
                // priority constraints)
                for (i in groups.constraints)
                {
                    if (groups.constraints[i].displayPriority != "High")
                    {
                        this.appendConstraint(groups.constraints[i], groupsDiv);
                    }
                }

                // Create the text selector
//                this.controller.createTextGroupSelector(this.id + "-groupTextBox");

                // Get a list of all the groups and all the groups the user has
                // got
                var userGroups = [];

                for (i in groups.constraints)
                {
                    for (j in groups.constraints[i].markings)
                    {
                        if (groups.constraints[i].markings[j].hasAccess)
                        {
                            userGroups.push(groups.constraints[i].markings[j].name);
                        }
                    }
                }

                this.controller.createMessageBox(this.id + "-validationMessages");

                this.uiInitialiased = true;
            },

            /**
             * Is the given constraint an open constraint. As the code evolves,
             * it will derive this value from the model but for now the open
             * group constraint name is hard-coded
             * 
             * @method isOpenLogic
             * @param constraintName
             *            Name of the constraint
             * @return True if the given constraint uses Open (ie. OR) logic
             */
            isOpenLogic : function(constraintName)
            {
                return (constraintName == "es_validOpenMarkings");
            },

            /**
             * Is the given constraint an open constraint. As the code evolves,
             * it will derive this value from the model but for now the open
             * group constraint name is hard-coded
             * 
             * @method isOpenLogic
             * @param constraintName
             *            Name of the constraint
             * @return True if the given constraint uses Open (ie. OR) logic
             */
            isOrganisations : function(constraintName)
            {
                return (constraintName == "es_validOrganisations");
            },

            /**
             * Creates the "open groups" or "closed groups" page sections
             * 
             * @private
             * @method appendConstraint
             */
            appendConstraint : function(constraint, parentElement)
            {
                // If we don't have any markings, do nothing
                if (!constraint.markings)
                {
                    return;
                }

                var canSeeOneMarking = false;
                // If we do have some markings, but can't see any of them, do
                // nothing
                for ( var i in constraint.markings)
                {
                    if (constraint.markings[i].hasAccess)
                    {
                        canSeeOneMarking = true;
                        break;
                    }
                }
                if (!canSeeOneMarking)
                {
                    return;
                }

                // By this point, we know that we have some markings that we can
                // see, so we can start rendering the list

                // Create the container div
                var outerDiv = document.createElement("div");
                Dom.addClass(outerDiv, "constraint");
                Dom.addClass(outerDiv, constraint.constraintName);

                // Go through the group list and work out what groups we have
                var groupTypes = {};

                var marking;

                for ( var i in constraint.markings)
                {
                    marking = constraint.markings[i];

                    // See if this is a new group type
                    if (groupTypes[marking.type])
                    {
                        groupTypes[marking.type].groups.push(marking);
                    }
                    else
                    {
                        groupTypes[marking.type] =
                            {
                                id : marking.type,
                                title : marking.type,
                                groups : [ marking ]
                            };
                    }
                }

                parentElement.appendChild(outerDiv);

                var title;

                // Then create our group list boxes
                for ( var groupTypeId in groupTypes)
                {
                    title = groupTypes[groupTypeId].title;
                    this.createGroupList(groupTypes[groupTypeId].id, title, groupTypes[groupTypeId].groups, outerDiv,
                            constraint);
                }
            },

            /**
             * Creates a selectable list of groups
             * 
             * @private
             * @method createGroupList
             */
            createGroupList : function(id, title, markings, parentElement, constraint)
            {
                // Create the container div
                 var outerDiv = document.createElement("div");
                Dom.addClass(outerDiv, "group-list-outer");
                outerDiv.setAttribute("id", this.id + "groupLists-" + id);
 
                // The list container
                var listDivId = this.id + "groupLists-" + id;

              
                parentElement.appendChild(outerDiv);

                if(this.isOrganisations(constraint.constraintName)) {
                    this.createSelectorForGroupType(title, markings, listDivId, "organisations");
                } else if(this.isOpenLogic(constraint.constraintName)) {
                    this.createSelectorForGroupType(title, markings, listDivId, "open");
                } else {
                    this.createSelectorForGroupType(title, markings, listDivId, "closed");
                }
            },

            /**
             * Handler which is called when the groups have been changed
             */
            onGroupsUpdatedHandler : function(type, args, obj)
            {
                var groups = args[0];

                if (this.options.currentMarking)
                {
                    this.options.currentMarking.openGroups = groups.open;
                    this.options.currentMarking.closedGroups = groups.closed;
                    this.options.currentMarking.organisations = groups.organisations;

                    this.securityMarkingChanged();
                }
            },

            /**
             * Resets the selected groups to the initial value
             * 
             * @private
             * @method resetGroups
             */
            resetGroups : function()
            {
                this.controller.setGroups(this.options.currentMarking.openGroups.concat(
                        this.options.currentMarking.closedGroups, this.options.currentMarking.organisations).join(" "));
                
                this.controller.showAllGroups();
            },
            
            /**
             * Resets this group selector to a blank state (i.e. where
             * nothing is selected at all)
             */
            setToBlank : function()
            {
                this.controller.reset();
                
                this.controller.showAllGroups();
            },

            /**
             * Called when the validation state of the underlying controller
             * changes
             * 
             * @method validationStateChanged
             * @param isValid
             *            <code>true</code> if the current group is valid,
             *            <code>false</code> otherwise
             */
            validationStateChanged : function(isValid)
            {
                if (this.widgets && this.widgets.saveButton)
                {
                    this.widgets.saveButton.set("disabled", !isValid);
                }

                if (this.widgets && this.widgets.visibilityCount)
                {
                    this.widgets.visibilityCount.setCountObfuscated(!isValid);
                }
            },

            /**
             * Convenience method to create and register an
             * Alfresco.EnhancedSecuritySelectorAdvancedSingleGroupSelector. This is
             * the recommend way of creating instances of
             * Alfresco.EnhancedSecuritySelectorAdvancedSingleGroupSelector.
             * 
             * @param groupType
             *                Human readable String defining the name of the group
             *                type the selector to be created will manage
             * @param markings
             *                The markings associated with the groupType
             * @param htmlid
             *                The htmlId of a component (usually a div or span) into
             *                which to render the HTML elements comprising this
             *                selector
             * @param groupLogic
             *  	 		  
             * @method createSelectorForGroupType
             */
            createSelectorForGroupType : function(groupType, markings, htmlId,
                    groupLogic)
            {
                var selector;
                
                var groupsSimple = [];
                for ( var i in markings)
                {
                    groupsSimple[groupsSimple.length] = markings[i].name;
                }
                
                var groupsInType = groupsSimple.join(" ");

                if (groupLogic == "organisations") {
                    selector = new Alfresco.EnhancedSecuritySelectorAdvancedOrganisationSelector(
                            htmlId);
                    selector.setOptions({
                        groupsString : groupsInType,
                        groupsDetailArray : markings,
                        title : groupType,
                        renderedCallback : { fn: this.childRendered, scope: this }
                    });
                } else {
                    selector = new Alfresco.EnhancedSecuritySelectorAdvancedSingleGroupSelector(
                            htmlId);
                    selector.setOptions({
                        groupsString : groupsInType,
                        title : groupType,
                        groupsDetailArray : markings,
                        renderedCallback : { fn: this.childRendered, scope: this }
                    });
                }


                ++this.unrenderedChildren;
                
                Alfresco.util.copyMessages(this.name, selector.name);

                this.controller.registerSingleGroupSelector(selector);
            },
            
            /**
             * Called when a child element has been rendered.
             * When they all have we can display the dialog!
             * 
             * @method childRendered
             */
            childRendered : function()
            {
                --this.unrenderedChildren;
                
                if((this.unrenderedChildren == 0) && this.displayDialogOnChildrenRendered) {
                    this.displayDialogOnChildrenRendered = false;
                    this.show();
                }
            },

            /**
             * Gets a custom message
             * 
             * @method _msg
             * @param messageId
             *            {string} The messageId to retrieve
             * @return {string} The custom message
             * @private
             */
            _msg : function(messageId)
            {
                return Alfresco.util.message.call(this, messageId,
                        "Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector", Array.prototype.slice
                                .call(arguments).slice(1));
            }
        };

    /**
     * A "static" method to find the singleton object from the ent Manager and
     * show it.
     * 
     * @param options
     *            the options to use to display the dialog The following options
     *            may be set: { saveCallback: function(groupsList),
     *            cancelCallback: function(), }
     */
    Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector.show = function(options)
    {
        var instance = Alfresco.util.ComponentManager
                .findFirst("Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector");

        instance.setOptions(options);

        instance.show();
    };
})();
