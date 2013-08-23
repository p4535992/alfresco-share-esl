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
(function() {
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
	Alfresco.EnhancedSecurityVisibilityUserList = function(htmlId) {
		/* Mandatory properties */
		this.name = 'Alfresco.EnhancedSecurityVisibilityUserList';
		this.id = htmlId;

		/* Initialise prototype properties */
		this.widgets = {};
		this.modules = {};

		/* Initialise the events */
		this.onUserSelected = new YAHOO.util.CustomEvent('onUserSelected', this);
		this.onDataLoaded = new YAHOO.util.CustomEvent('onDataLoaded', this);

		/* Register this component */
		Alfresco.util.ComponentManager.register(this);

		/* Load YUI Components */
		Alfresco.util.YUILoaderHelper.require(
				['json', 'connection', 'event', 'datasource', 'datatable', 'paginator'], this.onComponentsLoaded,
				this);

		return this;
	};

	// +++ Static properties

	Alfresco.EnhancedSecurityVisibilityUserList.prototype = {
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
		 * Flag to denote whether the visibility is currently loading
		 *
		 * @private
		 * @property loading
		 * @type boolean
		 */
		loading: false,

		/**
		 * Counter which is incremented every time there is an ajax request
		 *
		 * @private
		 * @property ajaxCounter
		 * @type int
		 */
		ajaxCounter: 0,

		/**
		 * Used to keep track of what the current marking is so that we can
		 * ignore multiple calls for the same marking
		 *
		 * @private
		 * @property currentMarking
		 * @type object
		 */
		currentMarking: null,

		// +++ PUBLIC EVENTS

		/**
		 * Event fired when a user is selected in the list
		 *
		 * @property onUserSelected
		 * @type YAHOO.Event.CustomEvent
		 */
		onUserSelected: null,

		/**
		 * Event fired when the data has been loaded into the table
		 *
		 * @property onDataLoaded
		 * @type YAHOO.Event.CustomEvent
		 */
		onDataLoaded: null,

		// +++ PUBLIC METHODS

		/**
		 * Sets the security marking. Will trigger the update, via ajax, of the
		 * visibility count.
		 *
		 * @public
		 * @method setSecurityMarking
		 * @param {Object}
		 *            securityMarking the security marking
		 */
		setSecurityMarking: function(securityMarking) {
			if (Alfresco.EnhancedSecurityVisibilityUtils
					.securityMarkingsHaveSameVisibility(this.currentMarking,
							securityMarking)) {
				return;
			}

			this.currentMarking = Alfresco.EnhancedSecurityVisibilityUtils
					.cloneSecurityMarking(securityMarking);
		        this.loadAndDisplayUserList();
                },

		/**
		 * Set multiple initialization options at once.
		 *
		 * @method setOptions
		 * @param obj
		 *            {object} Object literal specifying a set of options
		 * @return {Alfresco.EnhancedSecuritySingleValueSelector} returns 'this'
		 *         for method chaining
		 */
		setOptions: function(obj) {
			this.options = YAHOO.lang.merge(this.options, obj);

			return this;
		},

		/**
		 * Set messages for this component.
		 *
		 * @method setMessages
		 * @param obj
		 *            {object} Object literal specifying a set of messages
		 * @return {Alfresco.EnhancedSecurityVisibilityUserList} returns 'this'
		 *         for method chaining
		 */
		setMessages: function(obj) {
			Alfresco.util.addMessages(obj, this.name);

			return this;
		},

		/**
		 * Fired by YUILoaderHelper when required component script files have
		 * been loaded into the browser.
		 *
		 * @method onComponentsLoaded
		 */
		onComponentsLoaded: function() {
			Event.onContentReady(this.id, this.onReady, this, true);
		},

		/**
		 * Fired by YUI when parent element is available for scripting.
		 * Component initialisation, including instantiation of YUI widgets and
		 * event listener binding.
		 *
		 * @method onReady
		 */
		onReady: function() {
			var el = Dom.get(this.id);

			Event.addListener(this.id, 'mouseover', this.showTooltip, this,
					true);
			Event
					.addListener(this.id, 'mouseout', this.hideTooltip, this,
							true);
		},

		/**
		 * Called from onReady to populate and render the list of users
		 */
		loadAndDisplayUserList: function()
		{
			if (this.currentMarking == null) {
				return;
			}
			if ((this.currentMarking.openGroups.length == 0)
					&& (this.currentMarking.closedGroups.length == 0)
					&& this.currentMarking.organisations.length == 0) {

				//We shouldn't be able to open this window if everyone can see the marking, so we should treat this as a special case
				this.displayEveryoneCanSeeWarning();
				return;
			}

			var myColumnDefs = [
			                    {key: 'sid', sortable: true, resizeable: true, label: 'Username', formatter: this.profileLinkFormatter},
			                    {key: 'fullName', sortable: true, resizeable: true, label: 'Full Name', formatter: this.profileLinkFormatter},
			                    {key: 'org', sortable: true, resizeable: true, label: 'Organisation', formatter: this.profileLinkFormatter}
			                    ];

			var securityMarkingQuery = Alfresco.EnhancedSecurityVisibilityUtils.createMarkingURLRequestString(this.currentMarking);

			var myDataSource = new YAHOO.util.DataSource('/share/proxy/alfresco/api/enhanced-security/visibility-list?marking=');
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
			myDataSource.connXhrMode = 'queueRequests';
			myDataSource.responseSchema = {
					resultsList: 'authoritiesAllowedAccess',
					fields: ['sid', 'fullName', 'org']
			};

			// Fire the onDataLoaded event when the datasource response has been parsed into JSON
			myDataSource.subscribe('responseParseEvent', function(args) {
				this.onDataLoaded.fire(args.response);
			}, this, true);

			var oConfigs = {
					paginator: new YAHOO.widget.Paginator({
						rowsPerPage: 20
					}),
					initialRequest: securityMarkingQuery,
					sortedBy: {
				        key: 'sid',
				        dir: YAHOO.widget.DataTable.CLASS_ASC
				    }
			};

			var myDataTable = new YAHOO.widget.DataTable(this.id,
					myColumnDefs, myDataSource, oConfigs);
		},

		/**
		 * YUI formatter to render sids and full names as links to a user's profile
		 */
		profileLinkFormatter: function(elCell, oRecord, oColumn, sData)
		{
			elCell.innerHTML = "<a href='/share/page/user/" + oRecord.getData('sid') + "/profile' target='spaceProfileWindow'>" + sData + '</a>';
		},

		/**
		 * We should never ever get here so this function probably doesn't have to be any more polished than this
		 */
		displayEveryoneCanSeeWarning: function()
		{
			alert('An error has occured - the item you are viewing can be seen by all users and so this screen should not be displayed');
			this.displayLoadingFailed();
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
		_msg: function(messageId) {
			return Alfresco.util.message.call(this, messageId,
					'Alfresco.EnhancedSecuritySingleValueSelector',
					Array.prototype.slice.call(arguments).slice(1));
		}
	};

})();
