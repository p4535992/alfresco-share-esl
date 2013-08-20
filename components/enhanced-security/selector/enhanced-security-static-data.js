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
     * @param {String}
     *            htmlId The HTML id of the parent element - not really used
     *            here, but included for consistency
     * @return {Alfresco.Alfresco.EnhancedSecurityStaticData} The new instance
     * @constructor
     */
    Alfresco.EnhancedSecurityStaticData = function(htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.Alfresco.EnhancedSecurityStaticData";
        this.id = htmlId;

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};

        /* Register this component */
        Alfresco.util.ComponentManager.register(this);

        /* Load YUI Components */
        Alfresco.util.YUILoaderHelper.require( [ "json", "connection", "event", "button", "bubbling" ],
                this.onComponentsLoaded, this);

        return this;
    };

    Alfresco.EnhancedSecurityStaticData.getConstants = function()
    {
        var instance = window.eslConstants;
        if (instance == null)
        {
            instance = new Alfresco.EnhancedSecurityStaticData('theStaticData');
            window.eslConstants = instance;
        }
        return instance;

    };

    Alfresco.EnhancedSecurityStaticData.prototype =
        {
            /**
             * Object container for initialization options
             * 
             * @property options
             * @type object
             */
            options :
                {

                    enumerations : null,

                    defaults : null
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

            dataLoaded : false,

            /**
             * Set multiple initialization options at once.
             * 
             * @method setOptions
             * @param obj
             *            {object} Object literal specifying a set of options
             * @return {Alfresco.EnhancedSecurityStaticData} returns 'this' for
             *         method chaining
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
             * @return {Alfresco.EnhancedSecurityStaticData} returns 'this' for
             *         method chaining
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
            },

            /**
             * Retrieve the enumerations object, loading the data first if
             * needed
             * 
             * @return An object with properties "nod", "classification",
             *         "atomal" and "nationalityCaveats". Each propery's value
             *         is an array of strings indicating allowable values for
             *         that property
             * @method getEnumerations
             */
            getEnumerations : function()
            {
                if (!this.dataLoaded)
                {
                    this.loadData();
                }
                return this.options.enumerations;
            },

            /**
             * Retrieve the default value for a given property, loading the data
             * first if needed
             * 
             * @param propertyName -
             *            the name of the property to retrieve the default value
             *            for. Valid values are: "nod", "classification",
             *            "atomal" and "nationalityCaveats". Any other value
             *            will generate an error.
             * @return String indicating the default value, which is guaranteed
             *         to present in getEnumerations() at the time this call was
             *         made
             * @method getDefault
             */
            getDefault : function(propertyName)
            {
                if (!this.dataLoaded)
                {
                    this.loadData();
                }
                var property = this.options.enumerations[propertyName];

                if (property == null)
                {
                    throw new Error("The property " + propertyName + " is not managed by this object");
                }
                var index = this.options.defaults[propertyName];
                return property[index];
            },

            /**
             * Load, or re-load, the data for this object. As the product
             * matures, this data will be derived from the Alfresco data model
             * via an AJAX call to a webscript, but it is currently hard-coded
             * into this object.
             * 
             * @method loadData
             */
            loadData : function()
            {
                var data = new Object();
                data.nod = [ "UK", "" ];
                data.classification = [ "@@esc.marking.lowest@@","@@esc.marking.lower@@","@@esc.marking.medium@@","@@esc.marking.higher@@","@@esc.marking.highest@@" ];
                data.atomal = [ "", "@@esc.atomal@@1", "@@esc.atomal@@2" ];
                data.nationality = [ "UK EYES ONLY", "NATO EYES ONLY", "UK/NATO EYES ONLY", "" ];
                this.options.enumerations = data;

                var defaults = new Object();
                defaults.nod = 0;
                defaults.classification = 2;
                defaults.atomal = 0;
                defaults.nationality = 0;
                this.options.defaults = defaults;
                this.dataLoaded = true;
            },

            /**
             * PRIVATE FUNCTIONS
             */

            /**
             * Gets a custom message
             * 
             * @method _msg
             * @param messageId
             *            {string} The messageId to retrieve
             * @return {string} The custom message
             * @private
             */
            _msg : function EnhancedSecurityStaticData_msg(messageId)
            {
                return Alfresco.util.message.call(this, messageId, "Alfresco.EnhancedSecurityStaticData",
                        Array.prototype.slice.call(arguments).slice(1));
            }
        };
})();
