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
    Alfresco.EnhancedSecurityLogic = {
            /**
             * Returns true if the given groups satisfy the atomal requirement
             *
             * @param groupDetails the set of group details loaded fomr the server
             * @param atomal string the atomal value
             * @param groups array
             * @return {Boolean}
             */
            doGroupsSatisfyAtomal: function(groupDetails, atomal, groups) {
                var enums = Alfresco.EnhancedSecurityStaticData.getConstants().getEnumerations();

                var atomals = enums.atomal;

                var i, j, k, constraint, group;

                if (!atomal || (atomal == atomals[0])) {
                    return true;
                } else {
                    if (groups.open && (groups.open.length > 0)) {
                        return true;
                    }

                    for (i in groupDetails.constraints) {
                        constraint = groupDetails.constraints[i];

                        if ((constraint.constraintName == 'es_validClosedMarkings')
                                || ((atomal == atomals[1]) && (constraint.constraintName == 'es_validOrganisations'))) {
                            for (j in groups) {
                                group = groups[j];
                                k = Alfresco.EnhancedSecurityLogic.arrayIndexOfProperty(groups[j], constraint.markings, 'name');

                                if (k == -1) {
                                    continue;
                                }

                                // If it's a closed marking and not a "Group" then it doesn't satisfy any atomal
                                // "Groups" here is hardcoded, which we may want to replace with configuration in future
                                if ((constraint.constraintName == 'es_validClosedMarkings') && (constraint.markings[k].type != 'Groups')) {
                                    continue;
                                }

                                return true;
                            }
                        }
                    }
                }

                return false;
            },

            arrayIndexOfProperty: function(needle, haystack, property) {
                for (var i in haystack) {
                    if (haystack[i][property] == needle) {
                        return i;
                    }
                }

                return -1;
            }
    };
})();
