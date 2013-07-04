/**
 * EnhancedSecurityLogic
 *
 * Static classes to encapsulate some of the business logic 
 * 
 * @namespace Alfresco
 * @class EnhancedSecurityLogic
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
             * @returns {Boolean}
             */
            doGroupsSatisfyAtomal : function(groupDetails, atomal, groups) {
                var enums = Alfresco.EnhancedSecurityStaticData.getConstants().getEnumerations();
                
                var atomals = enums.atomal;
                
                var i, j, k, constraint, group;
                
                if(!atomal || (atomal == atomals[0])) {
                    return true;
                } else {
                    if(groups.open && (groups.open.length > 0)) {
                        return true;
                    }
                    
                    for(i in groupDetails.constraints) {
                        constraint = groupDetails.constraints[i];
                        
                        if((constraint.constraintName == "es_validClosedMarkings")
                                || ((atomal == atomals[1]) && (constraint.constraintName == "es_validOrganisations"))) {
                            for(j in groups) {
                                group = groups[j];
                                k = Alfresco.EnhancedSecurityLogic.arrayIndexOfProperty(groups[j], constraint.markings, "name");
                                
                                if(k == -1) {
                                    continue;
                                }
                                
                                // If it's a closed marking and not a "Group" then it doesn't satisfy any atomal
                                // TODO "Groups" here is hardcoded and terrible
                                if((constraint.constraintName == "es_validClosedMarkings") && (constraint.markings[k].type != "Groups")) {
                                    continue;
                                }
                                
                                return true;
                            }
                        }
                    }
                }
                
                return false;
            },
            
            arrayIndexOfProperty : function(needle, haystack, property) {
                for(var i in haystack) {
                    if(haystack[i][property] == needle) {
                        return i;
                    }
                }
                
                return -1;
            }
    };
})();