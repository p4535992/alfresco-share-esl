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
     * EnhancedSecurityNationalityMarkingSelector constructor.
     * 
     * @param {String}
     *            htmlId The HTML id of the parent element
     * @return {Alfresco.EnhancedSecurityNationalityMarkingSelector} The new
     *         instance
     * @constructor
     */
    Alfresco.EnhancedSecurityNationalityMarkingSelector = function(htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecurityNationalityMarkingSelector";
        this.id = htmlId;

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};

        /* Register this component */
        Alfresco.util.ComponentManager.register(this);

        /* Load YUI Components */
        Alfresco.util.YUILoaderHelper.require( [ "event", "button" ], this.onComponentsLoaded, this);

        return this;
    };

    Alfresco.EnhancedSecurityNationalityMarkingSelector.prototype =
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
                     * This value will always have to be selected if one of the
                     * other values is selected
                     */
                    forcedValue : null,

                    /**
                     * The suffix to append to the string
                     */
                    suffix : "",

                    /**
                     * The separator for the values
                     */
                    separator : "/",

                    /**
                     * The list of recent markings. Array of strings.
                     * 
                     * @type array
                     */
                    recentMarkings : [],

                    /**
                     * The string value to set the selector to
                     * 
                     * @type string
                     */
                    currentValue : "",

                    /**
                     * The list of options to pass to the panel
                     */
                    panelOptions :
                        {
                            close : false,
                            width : "auto",
                            modal : true,
                            constraintoviewport : true,
                            fixedcenter : false
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
             * Simple flag to stop recursive calls to onCheckboxChanged() when
             * the buttons become programatically checked/unchecked as the
             * forced value logic is carried out.
             * 
             * @property checkboxChangeEventEnabled
             */
            checkboxChangeEventEnabled : true,

            /**
             * Set multiple initialization options at once.
             * 
             * @method setOptions
             * @param obj
             *            {object} Object literal specifying a set of options
             * @return {Alfresco.EnhancedSecurityNationalityMarkingSelector}
             *         returns 'this' for method chaining
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
             * @return {Alfresco.EnhancedSecurityNationalityMarkingSelector}
             *         returns 'this' for method chaining
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
                var checkboxes = YAHOO.util.Selector.query("#" + this.id + "-valueList input");

                this.widgets.checkboxButtons = {};

                var i, j, checkboxElement, labelElements, label, value;

                for (i in checkboxes)
                {
                    checkboxElement = checkboxes[i];

                    value = checkboxElement.value;

                    /* First get the content of the label(s) and hide them */
                    labelElements = YAHOO.util.Selector.query("label[for=\"" + checkboxElement.getAttribute("id")
                            + "\"]");

                    label = null;

                    /* Ought to handle multiple labels just in case */
                    for (j in labelElements)
                    {
                        label = labelElements[j].firstChild.nodeValue;
                        labelElements[j].parentNode.removeChild(labelElements[j]);
                    }

                    if (label == null)
                    {
                        label = value;
                    }

                    this.widgets.checkboxButtons[value] = Alfresco.util.createYUIButton(this, "value-" + value, null,
                        {
                            label : label,
                            type : "checkbox"
                        });

                    this.widgets.checkboxButtons[value].addListener("checkedChange", this.onCheckboxChanged, value,
                            this);
                }

                this.widgets.saveButton = Alfresco.util.createYUIButton(this, "saveButton", this.saveClicked);
                this.widgets.cancelButton = Alfresco.util.createYUIButton(this, "cancelButton", this.cancelClicked);
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

                this.resetValues();

                this.widgets.panel.show();

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
             * Called when the button with ID specified by the option
             * "saveButtonId" is clicked
             * 
             * @private
             * @method saveClicked
             */
            saveClicked : function()
            {
                this.options["saveCallback"].fn.call(this.options["saveCallback"].scope, this.getMarkingString());
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
             * Event handler called when a checkbox is changed
             * 
             * @method onCheckboxChanged
             * @param args
             *            the event arguments
             * @param value
             *            the value which has been changed
             */
            onCheckboxChanged : function(args, value)
            {
                if (this.checkboxChangeEventEnabled)
                {
                    this.checkboxChangeEventEnabled = false;

                    try
                    {
                        this.onValueSelected(value, args.newValue);
                    }
                    finally
                    {
                        this.checkboxChangeEventEnabled = true;
                    }
                }
            },

            /**
             * Resets the ui to the initial options values
             * 
             * @private
             * @method resetValues
             */
            resetValues : function()
            {
                try
                {
                    this.setMarkingString(this.options.currentValue);
                }
                catch (e)
                {
                    /*
                     * We will ignore any invalid markings - it will start with
                     * a clean sheet
                     */
                }
                this.updateMarkingDisplay();
            },

            /**
             * Updates options.currentValue with the current marking and updates
             * the display. Should be called whenever the marking has changed.
             * 
             * @method markingChanged
             * @private
             */
            markingChanged : function()
            {
                this.options.currentValue = this.getMarkingString();
                this.updateMarkingDisplay();
            },

            /**
             * Updates the current marking display
             * 
             * @method updatupdateMarkingDisplay
             * @private
             */
            updateMarkingDisplay : function()
            {
                var el = Dom.get(this.id + "-currentMarking");

                if (this.options.currentValue == "")
                {
                    el.innerHTML = $html(this._msg("control.nationality.none"));
                }
                else
                {
                    /*
                     * Pad the separator with emulated zero-width spaces to
                     * allow the word wrap to act as expected in all browsers.
                     * Note: the separator is not escaped for the regex. If a
                     * regex control character is used for the separator then
                     * this code will break. Javascript doesn't have a built in
                     * RegEx escape method :(
                     */
                    el.innerHTML = $html(this.options.currentValue).replace(
                            new RegExp("(" + this.options.separator + ")", "g"),
                            '<span class="zwsp"> </span>$1<span class="zwsp"> </span>');
                }
            },

            /**
             * Gets the marking string from the checkboxes.
             * 
             * @method getMarkingString
             * @private
             */
            getMarkingString : function()
            {
                var selectedValues = this.getSelectedValues();

                if (selectedValues.length == 0)
                {
                    return "";
                }

                var retVal = selectedValues.join(this.options.separator);

                if (this.options.suffix)
                {
                    retVal += this.options.suffix;
                }

                return retVal;
            },

            /**
             * Sets the current state of the dialog to match a given marking
             * string. Unrecognised values will be ignored.
             * 
             * @method setMarkingString
             * @param value
             *            string the marking string to set the selector to.
             * @throws Error
             *             if the the marking string doesn't contain the correct
             *             suffix
             */
            setMarkingString : function(value)
            {
                value = YAHOO.lang.trim(value);

                /* Deselect all the values */
                this.setAllValuesSelected(false);

                if (value == "")
                {
                    return;
                }

                /*
                 * I would do this with a regular expression, but javascript
                 * doesn't have an escape function so I'll do it manually
                 */
                var indexOfSuffix = value.indexOf(this.options.suffix);

                if (indexOfSuffix < 0)
                {
                    alert("not found " + indexOfSuffix);
                    throw new Error(value + " doesn't contain " + this.options.suffix);
                }

                var valuesString = value.substring(0, indexOfSuffix);

                var values = valuesString.split(this.options.separator);

                for ( var i in values)
                {
                    try
                    {
                        this.setValueSelected(values[i], true);
                    }
                    catch (e)
                    {
                        /* Ignore any unrecognised values */
                    }
                }
            },

            /**
             * Selects/deselects a given value
             * 
             * @method setValueSelected
             * @param value
             *            string the value to select/deselect.
             * @param selected
             *            boolean whether to select/delselect the value.
             */
            setValueSelected : function(value, selected)
            {
                var checkbox = this.widgets.checkboxButtons[value];

                if (!checkbox)
                {
                    throw new Error(value + " is not a valid value");
                }

                checkbox.set("checked", selected);

                this.onValueSelected(value, selected);
            },

            /**
             * Called after a value has been selected. Implements the forced
             * value logic.
             * 
             * @method setValueSelected
             * @private
             */
            onValueSelected : function(value, selected)
            {
                var checkbox = this.widgets.checkboxButtons[value];

                if (!checkbox)
                {
                    throw new Error(value + " is not a valid value");
                }

                if (this.options.forcedValue)
                {
                    if (value == this.options.forcedValue)
                    {
                        /*
                         * If the forced value is deselected then we need to
                         * deselect all the values
                         */
                        if (!selected)
                        {
                            this.setAllValuesSelected(false);
                        }
                    }
                    else
                    {
                        /*
                         * If a non-forced value is selected then we need to
                         * select the forced value too
                         */
                        if (selected)
                        {
                            if (!this.widgets.checkboxButtons[this.options.forcedValue].get("checked"))
                            {
                                this.widgets.checkboxButtons[this.options.forcedValue].set("checked", true);
                            }
                        }
                    }
                }

                this.markingChanged();

            },

            /**
             * Gets whether a value is selected.
             * 
             * @method isValueSelected
             * @param value
             *            string the value to interrogate.
             * @return boolean whether the value is selected.
             */
            isValueSelected : function(value)
            {
                var checkbox = this.widgets.checkboxButtons[value];

                if (!checkbox)
                {
                    throw new Error(value + " is not a valid value");
                }

                return checkbox.get("checked");
            },

            /**
             * Get selected values
             * 
             * @method getSelectedValues
             * @return array selected value strings.
             */
            getSelectedValues : function()
            {
                var checkboxButton;

                var selectedValues = [];

                for ( var value in this.widgets.checkboxButtons)
                {
                    if (this.widgets.checkboxButtons[value].get("checked"))
                    {
                        selectedValues.push(value);
                    }
                }

                return selectedValues;
            },

            /**
             * Select/deselect all values
             * 
             * @method setAllValuesSelected
             * @param selected
             *            boolean whether to select or deselect all the values.
             */
            setAllValuesSelected : function(selected)
            {
                for ( var value in this.widgets.checkboxButtons)
                {
                    this.widgets.checkboxButtons[value].set("checked", selected);
                }

                this.markingChanged();
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
                        "Alfresco.EnhancedSecurityNationalityMarkingSelector", Array.prototype.slice.call(arguments)
                                .slice(1));
            }
        };

    /**
     * A "static" method to find the singleton object from the Component Manager
     * and show it.
     * 
     * @param options
     *            the options to use to display the dialog
     */
    Alfresco.EnhancedSecurityNationalityMarkingSelector.show = function(options)
    {
        var instance = Alfresco.util.ComponentManager.findFirst("Alfresco.EnhancedSecurityNationalityMarkingSelector");

        instance.setOptions(options);

        instance.show();
    };
})();
