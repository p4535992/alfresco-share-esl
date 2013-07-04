/**
 * EnhancedSecurityVisibilityDrillDown component.
 * 
 * Component provides the visibility count.
 * 
 * @namespace Alfresco
 * @class EnhancedSecurityVisibilityDrillDown
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
     * EnhancedSecuritySingleValueSelector constructor.
     * 
     * @param {String}
     *            htmlId The HTML id of the parent element
     * @return {Alfresco.EnhancedSecuritySingleValueSelector} The new instance
     * @constructor
     */
    Alfresco.EnhancedSecurityVisibilityDrillDown = function(htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecurityVisibilityDrillDown";
        this.id = htmlId;

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};

        /* Register this component */
        Alfresco.util.ComponentManager.register(this);

        /* Load YUI Components */
        Alfresco.util.YUILoaderHelper.require( [ "json", "connection", "event", "tabview" ], this.onComponentsLoaded, this);

        return this;
    };

    // +++ Static properties

    Alfresco.EnhancedSecurityVisibilityDrillDown.prototype =
        {
            /**
             * Object container for initialization options
             * 
             * @property options
             * @type object
             */
            options : {},

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
             * Whether this dialog is currently displayed
             */
            isVisible : false,

            // +++ PUBLIC EVENTS

            // +++ PUBLIC METHODS

            /**
             * Sets the security marking. Will trigger the update, via ajax, of
             * the visibility.
             * 
             * @public
             * @method setSecurityMarking
             * @param {Object}
             *            securityMarking the security marking
             */
            setSecurityMarking : function(securityMarking)
            {
                this.currentMarking = securityMarking;
                
                Dom.get(this.id + "-markingLabel").innerHTML = $html(Alfresco.EnhancedSecurityVisibilityUtils.securityMarkingToString(securityMarking));

                // If the marking is visible to everyone then we won't bother updating the sub-component's markings.
                // We may have to remove this and make the sub-components handle this situation better in the future  
                if(Alfresco.EnhancedSecurityVisibilityUtils.isMarkingVisibleToEveryone(this.currentMarking)) {
                	return;
            	}

                if(this.widgets.visibilityUserList) {
                	this.widgets.visibilityUserList.setSecurityMarking(securityMarking);
                }
                
                if(this.widgets.visibilitySingleUserDetails) {
                	this.widgets.visibilitySingleUserDetails.setSecurityMarking(securityMarking);
                }
            },

            /**
             * Set multiple initialization options at once.
             * 
             * @method setOptions
             * @param obj
             *            {object} Object literal specifying a set of options
             * @return {Alfresco.EnhancedSecuritySingleValueSelector} returns
             *         'this' for method chaining
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
             *            {object} Object literal specifying a set of messages
             * @return {Alfresco.EnhancedSecurityVisibilityDrillDown} returns 'this'
             *         for method chaining
             */
            setMessages : function(obj)
            {
                Alfresco.util.addMessages(obj, this.name);

                return this;
            },

            /**
             * Fired by YUILoaderHelper when required component script files
             * have been loaded into the browser.
             * 
             * @method onComponentsLoaded
             */
            onComponentsLoaded : function()
            {
                Event.onContentReady(this.id, this.onReady, this, true);
            },

            /**
             * Fired by YUI when parent element is available for scripting.
             * Component initialisation, including instantiation of YUI widgets
             * and event listener binding.
             * 
             * @method onReady
             */
            onReady : function()
            {
                var el = Dom.get(this.id);
                
                this.widgets.tabs = new YAHOO.widget.TabView(this.id + "-tabView");
                
                this.widgets.closeButton = Alfresco.util.createYUIButton(this, "closeButton", this.hide,
                        {
                            value : "close"
                        });
                
                this.widgets.visibilityUserList = Alfresco.util.ComponentManager.get(this.id + "-visibilityUserList");
                
                this.widgets.visibilityUserList.onDataLoaded.subscribe(function(event, data) {
                	this.updateVisibilityCountDisplay(data[0].results.length);
                }, this, true);
                
                this.widgets.visibilitySingleUserDetails = Alfresco.util.ComponentManager.get(this.id + "-visibilitySingleUserDetails");
            },
            
            /**
             * Displays the dialog
             * 
             * @method show
             */
            show : function()
            {
            	// If the marking is visible to everyone then we can't show the breakdown
            	if(Alfresco.EnhancedSecurityVisibilityUtils.isMarkingVisibleToEveryone(this.currentMarking)) {
            		Alfresco.util.PopupManager.displayPrompt({
            			title: this._msg("visibility.cannot-view-everyone.title"),
            			text: this._msg("visibility.cannot-view-everyone.message")
            		});
            		
            		return;
            	}
            	
                // Create the panel
                if (!this.widgets.panel)
                {
                    this.widgets.panel = Alfresco.util.createYUIPanel(this.id,
                        {
                            close : false
                        });

                    YAHOO.util.Dom.removeClass(this.id, "hidden");
                }

                this.isVisible = true;   
                this.widgets.panel.show();
                
                Event.addListener(this.id + "_mask", "click", this.hide, this, true); 
            },

            /**
             * Hides the dialog
             * 
             * @public
             * @method hide
             */
            hide : function()
            {
                this.isVisible = false;
                this.widgets.panel.hide();
            },


            // +++ PRIVATE METHODS

            /**
             * Updates the visibility count 
             */
            updateVisibilityCountDisplay : function(visibilityCount) {
            	var property;
            	
            	if(visibilityCount == 0) {
            		property = "visibility.drill-down-count.none";
            	} else if(visibilityCount == 1) {
            		property = "visibility.drill-down-count.one";
            	} else {
            		property = "visibility.drill-down-count";
            	}
            	
        		Dom.get(this.id + "-countLabel").innerHTML = $html(this._msg(property, visibilityCount));
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
                return Alfresco.util.message.call(this, messageId, "Alfresco.EnhancedSecurityVisibilityDrillDown",
                        Array.prototype.slice.call(arguments).slice(1));
            }
        };

})();
