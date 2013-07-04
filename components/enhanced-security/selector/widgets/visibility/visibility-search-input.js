/**
 * EnhancedSecurityVisibilitySearchInput component.
 * 
 * Component provides the user input for the visilibity search.
 * 
 * @namespace Alfresco
 * @class EnhancedSecurityVisibilitySearchInput
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
    Alfresco.EnhancedSecurityVisibilitySearchInput = function(htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecurityVisibilitySearchInput";
        this.id = htmlId;

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};

        /* Initialise the events */
        this.onUserChange = new YAHOO.util.CustomEvent("onUserChange", this);

        /* Register this component */
        Alfresco.util.ComponentManager.register(this);

        /* Load YUI Components */
        Alfresco.util.YUILoaderHelper.require( [ "json", "connection", "event", "datasource", "autocomplete" ], this.onComponentsLoaded, this);

        return this;
    };

    // +++ Static properties

    Alfresco.EnhancedSecurityVisibilitySearchInput.prototype =
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
			 * The currently selected username
			 */
            username : null,

            // +++ PUBLIC EVENTS

            onUserChange : null,
            
            // +++ PUBLIC METHODS

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
                
                this.widgets.searchText = Dom.get(this.id + "-searchText");

                var peopleSearchDataSource = new YAHOO.util.DataSource(Alfresco.constants.PROXY_URI + "enhanced-security/visibility-drill-down-user-search"); 
                peopleSearchDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON; 
                peopleSearchDataSource.connXhrMode = "queueRequests"; 
                peopleSearchDataSource.responseSchema = { 
    					resultsList: "people", 
    					fields: ["userName","lastName","firstName"]
    			};
                
                this.widgets.autocomplete = new YAHOO.widget.AutoComplete(this.id + "-searchText", this.id + "-autocompleteResults", peopleSearchDataSource);
                this.widgets.autocomplete.minQueryLength = 1;
                this.widgets.autocomplete.resultTypeList = false;

                var expandFunction = function(el) {
                	if(!this.widgets.autocomplete.isContainerOpen()) {
                		this.widgets.autocomplete.expandContainer();
                	}
                };
                
                Event.addListener(this.widgets.searchText, "click", expandFunction, this, true);
                Event.addListener(this.widgets.searchText, "focus", expandFunction, this, true);
                
                var thisObj = this;	// Keep a handle to "this"
                
                this.widgets.autocomplete.formatResult = function(oResultData, sQuery, sResultMatch) {
                	var regEx = new RegExp("(" + sQuery + ")", "gi");

                	var tmp = [
                	           "<span class=\"autocomplete-result\">",
                	           thisObj.formatAutocompleteField(oResultData.firstName, regEx),
                	           " ",
                	           thisObj.formatAutocompleteField(oResultData.lastName, regEx),
                	           " <span class=\"username\">(",
                	           thisObj.formatAutocompleteField(oResultData.userName, regEx),
                	           ")</span></span>"
                	           ];

                	return tmp.join("");
                };
                
                this.widgets.autocomplete.itemSelectEvent.subscribe(this.itemSelected, this, true);
            },
            
            // +++ PRIVATE METHODS

            itemSelected : function(type, data) {
            	this.onUserChange.fire(data[2].userName);
            },
            
            formatAutocompleteField : function(text, regEx) {
            	return $html(text).replace(regEx, "<span class=\"term-match\">$1</span>");
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
