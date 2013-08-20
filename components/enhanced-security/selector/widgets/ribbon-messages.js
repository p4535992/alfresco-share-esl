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
     *                htmlId The HTML id of the parent element
     * @return {Alfresco.EnhancedSecuritySingleValueSelector} The new instance
     * @constructor
     */
    Alfresco.EnhancedSecurityRibbonMessages = function(htmlId)
    {
        /* Mandatory properties */
        this.name = "Alfresco.EnhancedSecurityRibbonMessages";
        this.id = htmlId;

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};
        this.messages = [];

        /* Initialise the events */
        this.onMessagesChange = new YAHOO.util.CustomEvent(
                "onTriggerVisibilityClick", this);

        /* Register this component */
        Alfresco.util.ComponentManager.register(this);

        /* Load YUI Components */
        Alfresco.util.YUILoaderHelper.require(
                [ "json", "connection", "event" ], this.onComponentsLoaded,
                this);

        return this;
    };

    // +++ Static properties

    Alfresco.EnhancedSecurityRibbonMessages.prototype = {
        /**
         * Object container for initialization options
         * 
         * @property options
         * @type object
         */
        options : {
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
         * The array of messages
         * 
         * @property messages
         * @type array
         */
        messages : null,

        /**
         * The div which will be used to show/hide the element
         * 
         * @private
         * @property clippingDiv
         * @type element
         */
        clippingDiv : null,

        /**
         * The slider animation.
         * 
         * @private
         * @property slideAnim
         * @type YAHOO.util.Anim
         */
        slideAnim : null,

        // +++ PUBLIC EVENTS

        // +++ PUBLIC METHODS

        /**
         * Set multiple initialization options at once.
         * 
         * @method setOptions
         * @param obj
         *                {object} Object literal specifying a set of options
         * @return {Alfresco.EnhancedSecuritySingleValueSelector} returns 'this'
         *         for method chaining
         */
        setOptions : function(obj)
        {
            this.options = YAHOO.lang.merge(this.options, obj);

            return this;
        },

        /**
         * Fired by YUILoaderHelper when required component script files have
         * been loaded into the browser.
         * 
         * @method onComponentsLoaded
         */
        onComponentsLoaded : function()
        {
            Event.onContentReady(this.id, this.onReady, this, true);
        },

        /**
         * Adds a message to the message box. Will display the message box if
         * it's not already displayed. If a message with the same id already
         * exists then it will be overwritten with this new message.
         * 
         * @method addMessage
         * @param messageType
         *                {string} one of "info", "warn" or "error".
         * @param messageId
         *                {string} a unique id for this message. This can be
         *                used to remove the message later on.
         * @param message
         *                {string} the message to display.
         */
        addMessage : function(messageId, messageType, message)
        {
            var oldMessageKey = this.getMessageArrayKey(messageId);

            if ((oldMessageKey >= 0)
                    && (this.messages[oldMessageKey].type == messageType)
                    && (this.messages[oldMessageKey].text == message)) {
                // We don't need to do anything
                return;
            }

            if (oldMessageKey >= 0) {
                this.deleteMessageFromList(oldMessageKey);
                this.removeMessageDisplay(messageId);
            }

            var message = {
                id : messageId,
                type : messageType,
                text : message
            };

            this.messages.push(message);

            this.addMessageDisplay(message);
        },

        /**
         * Removes a message from the message box.
         * 
         * @method removeMessage
         * @param messageId
         *                {string} the id of the message to remove.
         */
        removeMessage : function(messageId)
        {
            var messageKey = this.getMessageArrayKey(messageId);

            if (-1 == messageKey) {
                return;
            }

            this.deleteMessageFromList(messageKey);
            this.removeMessageDisplay(messageId);
        },

        /**
         * Fired by YUI when parent element is available for scripting.
         * Component initialisation, including instantiation of YUI widgets and
         * event listener binding.
         * 
         * @method onReady
         */
        onReady : function()
        {
            this.clippingDiv = document.createElement("div");
            Dom.setStyle(this.clippingDiv, "height", "0px");
            Dom.setStyle(this.clippingDiv, "overflow", "hidden");
            Dom.addClass(this.clippingDiv, "enhanced-security-ribbon-messages");

            Dom.removeClass(this.id, "enhanced-security-ribbon-messages");

            var thisEl = Dom.get(this.id);

            thisEl.parentNode.replaceChild(this.clippingDiv, thisEl);

            this.clippingDiv.appendChild(thisEl);

            Dom.removeClass(this.id, "hidden");
        },

        /**
         * Resets the display to whatever size it should be without any
         * animation.
         */
        resetDisplay : function()
        {
            Dom.setStyle(this.clippingDiv, "height", "auto");
        },
        
        /**
         * Removes all the messages from the list without an animation
         */
        removeAllMessages : function()
        {
            if (this.slideAnim) {
                this.slideAnim.stop(false);
                this.slideAnim = null;
            }
            
            this.messages = [];
            
            var ul = Dom.get(this.id + "-list");

            while (ul.hasChildNodes())
            {
                ul.removeChild(ul.firstChild);
            }
            
            Dom.setStyle(this.clippingDiv, "height", 0);
        },

        // +++ PRIVATE METHODS

        /**
         * Gets the key in the messages array for a certain message.
         * 
         * @private
         */
        getMessageArrayKey : function(messageId)
        {
            for ( var i in this.messages) {
                if (this.messages[i].id == messageId) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * Adds a message to the display list.
         * 
         * @private
         */
        addMessageDisplay : function(message)
        {
            var id = this.id + "-messages-" + message.id;

            var ul = Dom.get(this.id + "-list");

            // Create the new list item
            var li = document.createElement("li");
            li.setAttribute("id", id);
            Dom.addClass(li, message.type + "-message");
            li.appendChild(document.createTextNode(message.text));

            ul.appendChild(li);

            // If we're already animating, then stop
            if (this.slideAnim) {
                this.slideAnim.stop(false);
            }

            // Gets the current size of the clipping div and the size of the
            // list (which will be the destination size)
            var startSize = Dom.getRegion(this.clippingDiv);
            var listSize = Dom.getRegion(this.id);

            // Set up and run the animation
            this.slideAnim = new YAHOO.util.Anim(this.clippingDiv);
            this.slideAnim.attributes.height = {
                from : startSize.bottom - startSize.top,
                to : listSize.bottom - listSize.top
            };
            this.slideAnim.duration = 0.3;
            this.slideAnim.method = YAHOO.util.Easing.easeOut;
            this.slideAnim.onComplete.subscribe(function()
            {
                this.slideAnim = null;
            }, this, true);

            this.slideAnim.animate();
        },

        /**
         * Removes a message form the display list.
         * 
         * @private
         * @param messageId
         */
        removeMessageDisplay : function(messageId)
        {
            var id = this.id + "-messages-" + messageId;

            var li = Dom.get(id);

            // If we're already animating, then stop
            if (this.slideAnim) {
                this.slideAnim.stop(false);
            }

            // Get the size of the clipping div (which will be the start size)
            // and the size of the list (not necessarily the same)
            var startSize = Dom.getRegion(this.clippingDiv);
            var listSize = Dom.getRegion(this.id);

            // If we are removing the last item then the end size will be zero,
            // otherwise it will be the height of the list minus the height of
            // the item we are removing
            var endSize = 0;

            if (this.messages.length > 0) {
                var sizeToRemove = Dom.getRegion(li);

                endSize = listSize.bottom - listSize.top - sizeToRemove.bottom
                        + sizeToRemove.top;
            }

            // Set up and run the animation
            this.slideAnim = new YAHOO.util.Anim(this.clippingDiv);
            this.slideAnim.attributes.height = {
                from : startSize.bottom - startSize.top,
                to : endSize
            };
            this.slideAnim.duration = 0.3;
            this.slideAnim.method = YAHOO.util.Easing.easeOut;
            this.slideAnim.onComplete.subscribe(function()
            {
                this.slideAnim = null;
                li.parentNode.removeChild(li);
            }, this, true);

            this.slideAnim.animate();
        },

        /**
         * Removes a message from the array of messages by copying the array.
         * 
         * @private
         * @param messageKey
         */
        deleteMessageFromList : function(messageKey)
        {
            var newArray = [];

            for ( var i in this.messages) {
                if (i != messageKey) {
                    newArray.push(this.messages[i]);
                }
            }

            this.messages = newArray;
        },
        
        /**
         * Returns the count of each type of message which is being displayed
         * 
         * @return object with a property for each type count
         */
        getMessageTypeCounts : function()
        {
            var counts = {
                    info : 0,
                    warn : 0,
                    error : 0
            };
            
            for(var i in this.messages) {
                ++counts[this.messages[i].type];
            }
            
            return counts;
        },

        /**
         * Gets a custom message
         * 
         * @method _msg
         * @param messageId
         *                {string} The messageId to retrieve
         * @return {string} The custom message
         * @private
         */
        _msg : function(messageId)
        {
            return Alfresco.util.message.call(this, messageId,
                    "Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector",
                    Array.prototype.slice.call(arguments).slice(1));
        }
    };

})();
