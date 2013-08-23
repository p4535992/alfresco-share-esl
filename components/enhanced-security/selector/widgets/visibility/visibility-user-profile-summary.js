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
    Alfresco.EnhancedSecurityVisibilityUserProfileSummary = function(htmlId)
    {
        /* Mandatory properties */
        this.name = 'Alfresco.EnhancedSecurityVisibilityUserProfileSummary';
        this.id = htmlId;

        /* Initialise prototype properties */
        this.widgets = {};
        this.modules = {};

        /* Register this component */
        Alfresco.util.ComponentManager.register(this);

        /* Load YUI Components */
        Alfresco.util.YUILoaderHelper.require(['json', 'connection', 'event'], this.onComponentsLoaded, this);

        return this;
    };

    Alfresco.EnhancedSecurityVisibilityUserProfileSummary.prototype =
        {
            /**
             * Object container for initialization options
             *
             * @property options
             * @type object
             */
            options: {},

            /**
             * Object container for storing YUI widget instances.
             *
             * @property widgets
             * @type object
             */
            widgets: null,

            /**
             * Object container for storing module instances.
             *
             * @property modules
             * @type object
             */
            modules: null,

            /**
             * The currently selected username
             */
            username: null,

            /**
             * Request counter to ensure we only service the latest ajax request
             */
            ajaxCounter: 0,

            // +++ PUBLIC EVENTS

            // +++ PUBLIC METHODS

            /**
             * Sets the display to the given user.
             *
             * @public
             * @method setUser
             * @param {Object}
             *            username the user's username
             */
            setUser: function(username)
            {
                this.username = username;

                this.showLoading(true);

                /* Send the Ajax request */
                Alfresco.util.Ajax.request(
                    {
                        url: Alfresco.constants.PROXY_URI + 'api/people/' + username,
                        responseContentType: Alfresco.util.Ajax.JSON,
                        successCallback: { fn: this.profileLoadSuccess, scope: this },
                        failureCallback: { fn: this.profileLoadFailure, scope: this },
                        object: ++this.ajaxCounter
                    });
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
            setOptions: function(obj)
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
            onComponentsLoaded: function()
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
            onReady: function()
            {
                var el = Dom.get(this.id);
            },

            // +++ PRIVATE METHODS

            profileLoadSuccess: function(response)
            {
            	// Only handle this response if it's from the latest request
            	if (response.config.object != this.ajaxCounter) {
            		return;
            	}

            	var profile = response.json;

            	Dom.get(this.id + '-profileName').innerHTML = $html(profile.firstName + ' ' + profile.lastName);
            	Dom.get(this.id + '-profileUserName').innerHTML = $html(profile.userName);

            	if (profile.jobtitle && (profile.jobtitle != '')) {
                	Dom.get(this.id + '-profileJobTitle').innerHTML = $html(profile.jobtitle);
                	Dom.removeClass(this.id + '-profileJobTitleRow', 'hidden');
            	} else {
                	Dom.addClass(this.id + '-profileJobTitleRow', 'hidden');
            	}

            	if (profile.organization && (profile.organization != '')) {
                	Dom.get(this.id + '-profileOrganisation').innerHTML = $html(profile.organization);
                	Dom.removeClass(this.id + '-profileOrganisationRow', 'hidden');
            	} else {
                	Dom.addClass(this.id + '-profileOrganisationRow', 'hidden');
            	}

            	if (profile.location && (profile.location != '')) {
                	Dom.get(this.id + '-profileLocation').innerHTML = $html(profile.location);
                	Dom.removeClass(this.id + '-profileLocationRow', 'hidden');
            	} else {
                	Dom.addClass(this.id + '-profileLocationRow', 'hidden');
            	}

            	if (profile.email && (profile.email != '')) {
                	Dom.get(this.id + '-profileEmail').innerHTML = '<a href=\"mailto:' + $html(profile.email) + '\">' + $html(profile.email) + '</a>';
                	Dom.removeClass(this.id + '-profileEmailRow', 'hidden');
            	} else {
                	Dom.addClass(this.id + '-profileEmailRow', 'hidden');
            	}

            	Dom.get(this.id + '-profileLink').setAttribute('href', Alfresco.constants.URL_PAGECONTEXT + 'user/' + escape(profile.userName) + '/profile');

                this.showLoading(false);

            	Dom.removeClass(this.id, 'hidden');

				Alfresco.util.Anim.pulse(this.id);
            },

            profileLoadFailure: function()
            {
            	Dom.addClass(this.id, 'hidden');

            	this.showLoading(false);

				Alfresco.util.PopupManager.displayPrompt({title: 'Error', text: 'There was an error retrieving the user profile.'});
            },

            showLoading: function(show)
            {
            	if (show) {
            		if (!Dom.get(this.id + '-loading')) {
            			Dom.get(this.id).innerHTML += '<div id=\"' + $html(this.id) + '-loading\" class=\"loading-overlay\"></div>';
            		}
            	} else {
            		var element = Dom.get(this.id + '-loading');

            		if (element) {
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
            _msg: function(messageId)
            {
                return Alfresco.util.message.call(this, messageId, 'Alfresco.EnhancedSecuritySelector',
                        Array.prototype.slice.call(arguments).slice(1));
            }
        };

})();
