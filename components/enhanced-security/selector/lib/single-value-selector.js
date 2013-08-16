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
     * EnhancedSecuritySingleValueSelector constructor.
     * 
     * @param {String}
     *            htmlId The HTML id of the parent element
     * @return {Alfresco.EnhancedSecuritySingleValueSelector} The new instance
     * @constructor
     */
    Alfresco.EnhancedSecuritySingleValueSelector = function(htmlId, selectorName)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecuritySingleValueSelector";
        this.id = htmlId;
        this.selectorName = selectorName;

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

    Alfresco.EnhancedSecuritySingleValueSelector.prototype =
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
                     * The list of options to pass to the panel
                     */
                    panelOptions :
                        {
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
             * The controller object
             * 
             * @property controller
             * @type Alfresco.EnhancedSecuritySelectorAdvancedController
             */
            controller : null,

            /**
             * Name of the control
             * 
             * @property selectorName
             */
            selectorName : "",

            /**
             * Value of each button, stored because converting a button to a YUI
             * button wipes out the value attribute
             * 
             * @property buttonValues
             */
            buttonValues : null,

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
             * @return {Alfresco.EnhancedSecuritySingleValueSelector} returns
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
                if (!this.widgets.buttons)
                {
                    this.widgets.buttons = new Array();
                }

                if (!this.buttonValues)
                {
                    this.buttonValues = new Array();
                }

                var buttons = Dom.getElementsByClassName(this.selectorName + "MarkingButton");

                for ( var x in buttons)
                {
                    this.buttonValues[x] = buttons[x].attributes['value'].value;

                    var id = buttons[x].id.replace(this.id + '-', "");

                    var button = Alfresco.util.createYUIButton(this, id, null,
                        {
                            onclick :
                                {
                                    fn : this.buttonClicked,
                                    obj : this.buttonValues[x],
                                    scope : this
                                }
                        });

                    this.widgets.buttons.push(button);
                }

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

                if (!this.widgets.panel)
                {
                    this.widgets.panel = Alfresco.util.createYUIPanel(this.id, this.options.panelOptions);

                    YAHOO.util.Dom.removeClass(this.id, "hidden");

                    this.resizeButtons();
                }

                this.resetValues();

                this.widgets.panel.show();

                Event.addListener(this.id + "_mask", "click", this.cancelClicked, this, true);

                this.highlightButton(this.options.currentValue);

            },

            /**
             * Highlight the button representing the current value
             * 
             * @private
             * @method highlightButton
             */
            highlightButton : function(value)
            {
                for ( var x in this.buttonValues)
                {
                    if (this.buttonValues[x] == value)
                    {
                        this.widgets.buttons[x].get("element").firstChild.firstChild.focus();
                        this.widgets.buttons[x].addClass("yui-checkbox-button-checked");
                    }
                    else
                    {
                        this.widgets.buttons[x].removeClass("yui-checkbox-button-checked");
                    }
                }
            },

            /**
             * change the buttons to all be the same width
             * 
             * @private
             * @method resizeButtons
             */
            resizeButtons : function()
            {
                var maxWidth = 0;

                for (x in this.widgets.buttons)
                {
                    var actualButton = this.widgets.buttons[x].get("element").firstChild.firstChild;
                    var buttonRegion = Dom.getRegion(actualButton);
                    maxWidth = Math.max(maxWidth, buttonRegion.right - buttonRegion.left);
                }

                var titleElement = Dom.get(this.id + "-title-span");
                var titleRegion = Dom.getRegion(titleElement);
                maxWidth = Math.max(maxWidth, titleRegion.right - titleRegion.left);

                for (x in this.widgets.buttons)
                {
                    var actualButton = this.widgets.buttons[x].get("element").firstChild.firstChild;
                    actualButton.style.width = maxWidth + "px";
                }
            },

            /**
             * Called when a selection button is clicked
             * 
             * @private
             * @method buttonClicked
             */
            buttonClicked : function(e, value)
            {
                this.options["saveCallback"].fn.call(this.options["saveCallback"].scope, this.selectorName, value);
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
                this.hide();
            },

            /**
             * Hide the panel
             * 
             * @method hide
             */
            hide : function()
            {
                this.widgets.panel.hide();
            },

            /**
             * Resets the ui to the initial options values
             * 
             * @private
             * @method resetGroups
             */
            resetValues : function()
            {
                // TODO
            },

            /**
             * Go through all of the options in this selector, making them
             * invisible (hence unselectable) until a target level is reached.
             * The assumption here is that the ordering of the buttons within
             * the HTML is equal to the ordering of the markings in terms of
             * sensitivity
             * 
             * @param level
             *            Hide all markings lower than this level. The level
             *            must exactly, case sensitivley, match the value of one
             *            of the buttons managed by this control.
             * @return
             */
            setMinimumLevel : function(level)
            {
                if(!this.widgets.buttons)
                {
                    return;
                }
                
                var i, foundLevel = false;

                for ( i = 0; i < this.widgets.buttons.length; i++)
                {
                    var value = this.buttonValues[i];
                    if (value == level)
                    {
                        foundLevel = true;
                    }

                    if (foundLevel)
                    {
                        this.widgets.buttons[i].set("disabled", false);
                    }
                    else
                    {
                        this.widgets.buttons[i].set("disabled", true);
                    }
                }
                
                /* If we haven't found the value then enable all the buttons */
                if(!foundLevel)
                {
                    for ( i = 0; i < this.widgets.buttons.length; i++)
                    {
                        this.widgets.buttons[i].set("disabled", false);
                    }
                }
            },

            /**
             * Show all the available options, undoing any previous calls to
             * setMinimumLevel
             */
            showAllOptions : function()
            {
                var invisibleElements = YAHOO.util.Selector.query("button.eslInvisible", this.id);
                for ( var i = 0; i < invisibleElements.length; i++)
                {
                    this.widgets.buttons[i].set("disabled", false);
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
                return Alfresco.util.message.call(this, messageId, "Alfresco.EnhancedSecuritySingleValueSelector",
                        Array.prototype.slice.call(arguments).slice(1));
            }
        };

})();
