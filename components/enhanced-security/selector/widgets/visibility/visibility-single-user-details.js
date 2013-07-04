/**
 * EnhancedSecurityVisibilitySingleUserDetails component.
 * 
 * Component which provides a visibility breakdown and profile details for a single user.
 * 
 * @namespace Alfresco
 * @class EnhancedSecurityVisibilitySingleUserDetails
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
    Alfresco.EnhancedSecurityVisibilitySingleUserDetails = function(htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecurityVisibilitySingleUserDetails";
        this.id = htmlId;

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};

        /* Register this component */
        Alfresco.util.ComponentManager.register(this);

        /* Load YUI Components */
        Alfresco.util.YUILoaderHelper.require( [ "json", "connection", "event" ], this.onComponentsLoaded, this);

        return this;
    };

    Alfresco.EnhancedSecurityVisibilitySingleUserDetails.prototype =
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
             * The current security marking
             */
            currentMarking : null,
            
            /**
             * The currently selected username
             */
            username : null,

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

                if(this.widgets.visibilitySearchResult) {
                	this.widgets.visibilitySearchResult.setSecurityMarking(securityMarking);
                }
            },

            /**
             * Sets the display to the given user.
             * 
             * @public
             * @method setUser
             * @param {Object}
             *            username the user's username
             */
            setUser : function(username)
            {
            	if(username == this.username) {
            		return;
            	}
            	
                this.username = username;
                
                if(this.widgets.visibilitySearchInput) {
                	this.widgets.visibilitySearchInput.setUser(username);
                }
                
                if(this.widgets.visibilitySearchResult) {
                	this.widgets.visibilitySearchResult.setUser(username);
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
                
                this.widgets.visibilitySearchInput = Alfresco.util.ComponentManager.get(this.id + "-visibilitySearchInput");
                this.widgets.visibilitySearchResult = Alfresco.util.ComponentManager.get(this.id + "-visibilitySearchResult");
                
                this.widgets.visibilitySearchInput.onUserChange.subscribe(function(type, args) {
                	this.setUser(args[0]);
                }, this, true);
            },

            // +++ PRIVATE METHODS
            
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
                return Alfresco.util.message.call(this, messageId, "Alfresco.EnhancedSecuritySelector",
                        Array.prototype.slice.call(arguments).slice(1));
            }
        };

})();
