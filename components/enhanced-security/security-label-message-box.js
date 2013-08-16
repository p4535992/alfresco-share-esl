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
     * EnhancedSecurityMessageBox constructor.
     * 
     * @param {String}
     *            htmlId The HTML id of the parent div or span
     * @return {Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector} The new
     *         instance
     * @constructor
     */
    Alfresco.EnhancedSecurityMessageBox = function(htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecurityMessageBox";

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

    Alfresco.EnhancedSecurityMessageBox.prototype =
        {
            /**
             * Object container for initialization options
             * 
             * @property options
             * @type object
             */
            options :
                {
                    controller : null
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
             * A count of the error messages
             */
            errorMessageCount : 0,

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
             * Set messages for this component.
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
             * 
             * Component initialisation, including instantiation of YUI widgets
             * and event listener binding.
             * 
             * @method onReady
             */
            onReady : function()
            {

            },

            /**
             * Add a message to the message box by inserting a child div
             * containing the message
             * 
             * @param message
             *            The message to be displayed
             * @param id
             *            An ID for this message that should be retained by the
             *            caller if they wish to remove the message in future
             * @param warning
             *            If "warn", use a css class to indicate that the message
             *            should be rendered as a warning. If "info", render an info message.
             *            If neither use a cssclass to indicate that the message should be rendered
             *            as an error
             * @method addMessage
             */
            addMessage : function(message, id, type)
            {
                if (!this.hasMessage(id))
                {
                    var container = Dom.get(this.id);
                    var newMessage = document.createElement('div');
                    var textContent = document.createTextNode(message);
                    newMessage.appendChild(textContent);
                    newMessage.setAttribute('id', this.id + '-message-' + id);
                    container.appendChild(newMessage);

                    if (type=="warn")
                    {
                        Dom.addClass(newMessage, 'messageWarning');
                    }
                    else if (type=="info")
                    {
                        Dom.addClass(newMessage, 'messageInfo');
                    }
                    else
                    {  
                        Dom.addClass(newMessage, 'messageError');
                        
                        /* Increment the error message count */
                        ++this.errorMessageCount;
                    }
                }

            },

            /**
             * Remove the message with the given ID. If the indicated message
             * does not exist, this method will fail silently
             * 
             * @param id
             *            ID of the message (not an HTML ID) of the message to
             *            remove, which must exactly match that passed into the
             *            addMessage method when the message was created.
             * @method removeMessage
             */
            removeMessage : function(id)
            {
                var elementToRemove = YAHOO.util.Selector.query("div[id=" + this.id + "-message-" + id + "]")[0];
                if (elementToRemove != null)
                {
                    if(Dom.hasClass(elementToRemove, 'messageError'))
                    {
                        --this.errorMessageCount;
                    }
                    Dom.get(this.id).removeChild(elementToRemove);
                }
            },

            /**
             * Removes every message managed by this message box, and is faster
             * than calling removeMessage individually on each item
             * 
             * @method clearMessages
             */
            clearMessages : function()
            {
                var elementsToRemove = YAHOO.util.Selector.query("div[id=" + this.id + "] div");
                var container = Dom.get(this.id);
                for ( var i = 0; i < elementsToRemove.length; i++)
                {
                    container.removeChild(elementsToRemove[i]);
                }
                this.errorMessageCount = 0;
            },
            
            /**
             * Resets the message display and displays the given set of messages
             * 
             * @param messages the array of messages, each containing "id", "message" and "type"
             */
            setMessages : function(messages)
            {
                this.clearMessages();
                
                for(var i in messages)
                {
                    this.addMessage(messages[i].message, messages[i].id, messages[i].type);
                }
            },

            /**
             * Is this message box currently displaying the message with the
             * given ID?
             * 
             * @return true if a message with the given ID is being rendered at
             *         present, false otherwise
             * @method hasMessage
             */
            hasMessage : function(id)
            {
                return YAHOO.util.Selector.query("div[id=" + this.id + "-message-" + id + "]").length > 0;
            },
            
            /**
             * Returns true if this message box contains any error messages
             * 
             * @return true if this contains one or more error level messages
             * @method hasErrorMessage
             */
            hasErrorMessage : function()
            {
                return this.errorMessageCount > 0;
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
            _msg : function(messageId)
            {
                return Alfresco.util.message.call(this, messageId, "Alfresco.EnhancedSecurityMessageBox",
                        Array.prototype.slice.call(arguments).slice(1));
            }
        };

})();
