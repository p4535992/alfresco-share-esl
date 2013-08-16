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
     * Static EnhancedSecurityVisibilityUtils object.
     */
    Alfresco.EnhancedSecurityVisibilityUtils =
        {
            /**
             * The atomal mapping from atomal values to group names. Needs to be
             * manually updated to reflect the model values.
             */
            atomalMapping :
                {
                    "@@esc.atomal@@1" : "@@esc.atomal@@1",
                    "@@esc.atomal@@2" : "@@esc.atomal@@2"
                },
            
            /**
             * Used by both the visibility count and visibility list service calls to construct a url query string
             * referencing a particular security marking
             */
            createMarkingURLRequestString: function(securityMarking)
            {
            	/* Construct the marking to be sent to the service */
            	var requestMarking = "";

            	if (securityMarking.openGroups.length > 0)
            	{
            		requestMarking += "es_validOpenMarkings," + securityMarking.openGroups.join(",");
            	}

            	var closedGroups = securityMarking.closedGroups;
            	
                if (securityMarking.atomal != "") {
                    /*
                     * The atomal group name may be different from the atomal
                     * value, so we need to map it
                     */
                    if (!Alfresco.EnhancedSecurityVisibilityUtils.atomalMapping[securityMarking.atomal])
                    {
                            throw new Error("[Alfresco.EnhancedSecurityVisibilityUtils] Missing atomalMapping for "
                                            + securityMarking.atomal);
                    }

                    closedGroups.push(Alfresco.EnhancedSecurityVisibilityUtils.atomalMapping[securityMarking.atomal]);
                }            	
            	
            	if (closedGroups.length > 0)
            	{
            		if (requestMarking.length > 0) {
            			requestMarking += ";";
            		}

            		requestMarking += "es_validClosedMarkings," + closedGroups.join(",");
            	}

                if (securityMarking.organisations.length > 0)
                {
                        if (requestMarking.length > 0) {
                                requestMarking += ";";
                        }

                        requestMarking += "es_validOrganisations," + securityMarking.organisations.join(",");
                }

                return requestMarking;
            },

            getVisibilityCountForMarking : function(securityMarking, successCallback, failureCallback)
            {
            	
            	var requestMarking = this.createMarkingURLRequestString(securityMarking);
               
                /* Send the Ajax request */
                Alfresco.util.Ajax.request(
                    {
                        url : Alfresco.constants.PROXY_URI + "api/enhanced-security/visibility-count",
                        responseContentType : Alfresco.util.Ajax.JSON,
                        dataObj :
                            {
                                marking : requestMarking
                            },

                        successCallback :
                            {
                                fn : function(response)
                                {
                                    successCallback.fn.call(
                                            (typeof successCallback.scope == "object" ? successCallback.scope
                                                    : this), response.json.result, successCallback.obj);
                                }
                            },
                        failureCallback :
                            {
                                fn : function()
                                {
                                    failureCallback.fn.call(
                                            (typeof failureCallback.scope == "object" ? failureCallback.scope : this),
                                            failureCallback.obj);
                                }
                            }

                    });
            },
            

            /**
             * Tests if two security markings will always have the same
             * visibility (i.e the current logic is that only groups and atomal
             * affect the visibility so this function will return true if the
             * groups haven't changed, even if other parts of the marking have
             * changed).<br>
             * Note - if the logic behind the visibility of markings changes
             * then this function will also need to be updated to reflect that
             * 
             * @param marking1
             *            the first marking.
             * @param marking2
             *            the second marking.
             * @return true if the markings will always have the same
             *         visibility, false otherwise.
             */
            securityMarkingsHaveSameVisibility : function(marking1, marking2)
            {
                /* If there is an obvious difference, return false */
                if (!(marking1 && marking2 && (marking1.atomal == marking2.atomal)
                        && (marking1.openGroups.length == marking2.openGroups.length) && (marking1.closedGroups.length == marking2.closedGroups.length)
                        && (marking1.organisations.length == marking2.organisations.length)))
                {
                    return false;
                }

                /* Then check the groups */
                var openGroups1 = marking1.openGroups.concat().sort();
                var openGroups2 = marking2.openGroups.concat().sort();

                if (openGroups1.valueOf() != openGroups2.valueOf())
                {
                    return false;
                }

                var closedGroups1 = marking1.closedGroups.concat().sort();
                var closedGroups2 = marking2.closedGroups.concat().sort();

                if (closedGroups1.valueOf() != closedGroups2.valueOf())
                {
                    return false;
                }

                var organisations1 = marking1.organisations.concat().sort();
                var organisations2 = marking2.organisations.concat().sort();

                if (organisations1.valueOf() != organisations2.valueOf())
                {
                    return false;
                }

                return true;
            },

            /**
             * Creates a copy of a security marking.
             * 
             * @param securityMarking
             *            the security marking to copy.
             * @return the clone of the security marking.
             */
            cloneSecurityMarking : function(securityMarking)
            {
                var newMarking =
                    {
                        nod : securityMarking.nod,
                        classification : securityMarking.classification,
                        atomal : securityMarking.atomal,
                        freeform : securityMarking.freeform,
                        nationality : securityMarking.nationality,
                        openGroups : securityMarking.openGroups.concat( []),
                        closedGroups : securityMarking.closedGroups.concat( []),
                        organisations : securityMarking.organisations.concat( [])
                    };

                return newMarking;
            },
            
            /**
             * Returns true if everyone can see the current marking.
             * 
             * @method isVisibilityEveryone
             * @param securityMarking the security marking
             * @return true if everyone can see it, false otherwise
             */
            isMarkingVisibleToEveryone : function(securityMarking) {
            	// Assumes atomal has no effect on marking.
            	return ((securityMarking.openGroups.length == 0) && (securityMarking.closedGroups.length == 0) && (securityMarking.organisations.length == 0));
            },
            
            /**
             * Returns a string representation of the given security marking.
             * 
             * @param securityMarking the security marking.
             * @return the string representation.
             */
            securityMarkingToString : function(securityMarking)
            {
            	var output = [];
            	
            	if(securityMarking.nod) {
            		output.push(securityMarking.nod);
            	}
            	
            	if(securityMarking.classification) {
            		output.push(securityMarking.classification);
            	}
            	
            	if(securityMarking.atomal) {
            		output.push(securityMarking.atomal);
            	}

            	if(securityMarking.closedGroups.length > 0) {
            		output.push(securityMarking.closedGroups.join(" "));
            	}
            	
            	if(securityMarking.openGroups.length > 0) {
            		output.push(securityMarking.openGroups.join(" "));
            	}

                if(securityMarking.organisations.length > 0) {
                    output.push(securityMarking.organisations.join(" "));
                }

            	if(securityMarking.freeform) {
            		output.push(securityMarking.freeform);
            	}
            	
            	if(securityMarking.nationality) {
            		output.push(securityMarking.nationality);
            	}
            	
            	return output.join(" ");
            }
        };
})();
