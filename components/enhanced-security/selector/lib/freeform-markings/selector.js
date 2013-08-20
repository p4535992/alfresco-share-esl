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
     * EnhancedSecurityFreeformMarkingsSelector constructor.
     * 
     * @param {String}
     *            htmlId The HTML id of the parent element
     * @return {Alfresco.EnhancedSecurityFreeformMarkingsSelector} The new instance
     * @constructor
     */
    Alfresco.EnhancedSecurityFreeformMarkingsSelector = function(htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecurityFreeformMarkingsSelector";
        this.id = htmlId;

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};

        /* Register this component */
        Alfresco.util.ComponentManager.register(this);

        /* Load YUI Components */
        Alfresco.util.YUILoaderHelper.require( [ "json", "connection", "event", "button" ], this.onComponentsLoaded,
                this);

        return this;
    };

    Alfresco.EnhancedSecurityFreeformMarkingsSelector.prototype =
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
                     * The list of recent markings. Array of strings.
                     * @type array
                     */
                    recentMarkings : [],
                    
                    /**
                     * The string value to set the selector to
                     * @type string
                     */
                    currentValue : "",

                    /**
                     * The list of options to pass to the panel
                     */
                    panelOptions : {
                        close : false,
                        width : "auto",
                        modal : true,
                        constraintoviewport : true
                    },

                    /**
                     * Callback method for when one of the buttons is clicked
                     * Function will be called with one parameter: the value
                     * string
                     */
                    saveCallback :
                        {
                            fn : function(value)
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
                        }
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
             * Whether the user interface has been initialised
             * 
             * @property uiInitialiased
             */
            uiInitialiased : false,

            /**
             * Set multiple initialization options at once.
             * 
             * @method setOptions
             * @param obj
             *            {object} Object literal specifying a set of options
             * @return {Alfresco.EnhancedSecurityFreeformMarkingsSelector} returns
             *         'this' for method chaining
             */
            setOptions : function(obj)
            {
                if (obj.panelOptions)
                {
                    var panelOptions = this.options.panelOptions;
                }

                this.options = YAHOO.lang.merge(this.options, obj);

                if (obj.panelOptions)
                {
                    this.options.panelOptions = YAHOO.lang.merge(panelOptions, obj.panelOptions);
                }
                return this;
            },

            /**
             * Set messages for this component.
             * 
             * @method setMessages
             * @param obj
             *            {object} Object literal specifying a set of messages
             * @return {Alfresco.EnhancedSecurityFreeformMarkingsSelector} returns
             *         'this' for method chaining
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
                this.widgets.textBox = Dom.get(this.id + '-textBox');
                
                Event.addListener(this.widgets.textBox, "keydown", this.keydown, this, true);
                Event.addListener(this.widgets.textBox, "change", this.sanitiseMarking, this, true);
                
                this.widgets.saveButton = Alfresco.util.createYUIButton(this, "saveButton", this.saveClicked,
                        {
                            value : "save"
                        });
                this.widgets.cancelButton = Alfresco.util.createYUIButton(this, "cancelButton", this.cancelClicked,
                    {
                        value : "cancel"
                    });
            },

            /**
             * Displays the dialog
             * 
             * @method show
             */
            show : function(options)
            {
                if (options)
                {
                    this.setOptions(options);
                }

                if (!this.uiInitialiased)
                {
                    this.initUi();
                }

                if (!this.widgets.panel)
                {
                    this.widgets.panel = Alfresco.util.createYUIPanel(this.id, this.options.panelOptions);

                    YAHOO.util.Dom.removeClass(this.id, "hidden");
                }

                // Set the initial textbox value and validate
                this.widgets.textBox.value = this.options.currentValue;
                this.sanitiseMarking();

                // show the panel
                this.widgets.panel.show();
                
                // focus textbox and select all text in it
                this.widgets.textBox.focus();
                this.widgets.textBox.select();
                
                Event.addListener(this.id + "_mask", "click", this.cancelClicked, this, true);
            },

            /**
             * Builds the user interface
             * 
             * @private
             * @method initUi
             */
            initUi : function()
            {
                this.uiInitialiased = true;
            },
            
            /**
             * Re-formats the text in the text box according to the following rules:
             * <ul>
             * <li>The string is capitalised</li>
             * <li>Whitespace on either end of the string is removed<li>
             * <li>All chunks of whitespace are compressed into single spaces<li>
             * <li>Only letters A-Z are permitted</li>
             * </ul>
             * 
             * @method sanitiseGroups
             */
            sanitiseMarking : function()
            {
                if (!this.widgets.textBox)
                {
                    return;
                }
                
                var value = this.widgets.textBox.value;
                
                // Trim, replace multiple whitespace and capitalise
                value = YAHOO.lang.trim(value.toUpperCase()).replace(/\s+/g, " ").replace(/[^A-Z ]/g, "");
                
                this.widgets.textBox.value = value;
            },
            
            /**
             * Called when a key is pressed in the textbox
             * 
             * @private
             * @method keydown
             */
            keydown : function(e)
            {
                var key = e.keyCode;
                
                // enter submits the dialog
                if (key == 13)
                {
                    this.saveClicked();
                    return;
                }
                
                // spaces and all control codes are allowed
                if (key <= 46)
                {
                    return;
                }
                
                // letters are allowed
                if (key >= 65 && key <= 90)
                {
                    return;
                }
                
                // everything else is not allowed
                YAHOO.util.Event.stopEvent(e);
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
                this.sanitiseMarking();
                this.options["saveCallback"].fn.call(this.options["saveCallback"].scope, this.widgets.textBox.value);
                this.widgets.panel.hide();
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
                this.widgets.panel.hide();
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
                return Alfresco.util.message.call(this, messageId, "Alfresco.EnhancedSecurityFreeformMarkingsSelector",
                        Array.prototype.slice.call(arguments).slice(1));
            }
        };

    /**
     * A "static" method to find the singleton object from the Component Manager
     * and show it.
     * 
     * @param options
     *            the options to use to display the dialog
     */
    Alfresco.EnhancedSecurityFreeformMarkingsSelector.show = function(options)
    {
        var instance = Alfresco.util.ComponentManager
                .findFirst("Alfresco.EnhancedSecurityFreeformMarkingsSelector");

        instance.setOptions(options);

        instance.show();
    };
})();
