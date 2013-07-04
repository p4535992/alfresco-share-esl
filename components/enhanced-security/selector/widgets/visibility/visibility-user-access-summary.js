/**
 * EnhancedSecurityVisibilityUserAccessSummary component.
 * 
 * Component provides the user visibility breakdown for a user.
 * 
 * @namespace Alfresco
 * @class EnhancedSecurityVisibilityUserAccessSummary
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
    Alfresco.EnhancedSecurityVisibilityUserAccessSummary = function(htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecurityVisibilityUserAccessSummary";
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

    Alfresco.EnhancedSecurityVisibilityUserAccessSummary.prototype =
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
                
                this.loadData();
            },

            /**
             * Sets the display to the given user.
             * 
             * @public
             * @method setUser
             * @param {Object}
             * username the user's username
             */
            setUser : function(username)
            {
                this.username = username;
                
                this.loadData();
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
            },

            // +++ PRIVATE METHODS

            loadData : function() 
            {
            	if((this.currentMarking == null) || (this.username == null)) {
            		return;
            	}
            	
				var requestMarking =  Alfresco.EnhancedSecurityVisibilityUtils.createMarkingURLRequestString( this.currentMarking);

				this.showLoading(true);
				
                Alfresco.util.Ajax.request(
                    {
                        url : Alfresco.constants.PROXY_URI + "api/enhanced-security/visibility-report.html",
                        dataObj:{marking:requestMarking,userName:this.username},
                        successCallback : { fn: this.userAccessSummmaryLoadSuccess, scope: this},
                        failureCallback : { fn: this.userAccessSummmaryLoadFailure, scope: this}
                    });
            },
            
            userAccessSummmaryLoadSuccess : function( response)
            {
				YAHOO.util.Dom.get(this.id + '-user-security-summary-placeholder').innerHTML = response.serverResponse.responseText;

				this.showLoading(false);
            	
				Alfresco.util.Anim.pulse(this.id);
			},

            userAccessSummmaryLoadFailure : function( response)
            {
            	// Only handle this response if it's from the latest request
            	if(response.config.object != this.ajaxCounter) {
            		return;
            	}
            	YAHOO.util.Dom.get(this.id + '-user-security-summary-placeholder').innerHTML = "There was an error retrieving the user security summary.";

				this.showLoading(false);
			},
            
            showLoading : function(show)
            {
            	if(show) {
            		if(!Dom.get(this.id + "-loading")) {
            			Dom.get(this.id).innerHTML += "<div id=\"" + $html(this.id) + "-loading\" class=\"loading-overlay\"></div>";
            		}
            	} else {
            		var element = Dom.get(this.id + "-loading");
            		
            		if(element) {
            			element.parentNode.removeChild(element);
            		}
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
                return Alfresco.util.message.call(this, messageId, "Alfresco.EnhancedSecuritySelector",
                        Array.prototype.slice.call(arguments).slice(1));
            }
        };

})();
