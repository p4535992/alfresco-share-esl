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
function getNodMarkings()
{
    return [ "", "@@esc.nat.owner@@" ];
}

function getClassificationMarkings()
{
    return [ "@@esc.marking.lowest@@","@@esc.marking.lower@@","@@esc.marking.medium@@","@@esc.marking.higher@@","@@esc.marking.highest@@" ];
}

function getAtomalMarkings()
{
    return [ "", "@@esc.atomal@@1", "@@esc.atomal@@2"];
}

function hasGroups()
{
    // Check to see if the current user has any groups (open or closed)
    var hasGroups = false;
    var conn = remote.connect("alfresco");

    // The repo rmuserconstraints script without arguments will return the
    // set of open and closed markings the user has
    var result = conn.get("/api/rma/admin/rmuserconstraints");

    if (result.status == 200)
    {
        var groups = eval('(' + result + ')').allowedValues;

        hasGroups=false;
        
        for (var i=0; i < groups.length; i++)
        {
        	if (groups[i]!="@@esc.atomal@@1" && groups[i]!="@@esc.atomal@@2")
        	{
        		hasGroups=true;
        		break;
        	}
        }
        
        
    }
    else
    {
        throw new Error("Unable to assert group marking status");
    }

    return hasGroups;
}

model.enhancedMarkings = new Object();
model.enhancedMarkings.nod = getNodMarkings();
model.enhancedMarkings.classification = getClassificationMarkings();
model.enhancedMarkings.atomal = getAtomalMarkings();

model.enhancedMarkings.nationality =
    {
        /* The list of values to show */
        valueList : [ @@esc.nat.caveats.parts@@ ],

        /*
         * This value will always have to be selected if one of the other values
         * is selected
         */
        forcedValue : "UK",

        /* The suffix to append to the string */
        suffix : " EYES ONLY",

        /* The separator for the values */
        separator : "/"
    };

/**
 * Determines whether each of the edit buttons will be shown on the edit ribbon
 */
model.showMarkingEditor =
    {
        nod : true,
        classification : true,
        atomal : true,
        groups : true,
        freeform : true,
        nationality : true
    };

// If we are on the wiki Main Page, then we will hide the atomal and groups
// editors
if ((page.url.templateArgs.pageid == "wiki-page") && (page.url.args.title.match(new RegExp("Main_Page", "i"))))
{
    model.showMarkingEditor.atomal = false;
    model.showMarkingEditor.groups = false;
}

// If the user doesn't have any groups then hide the groups editor
if (!hasGroups())
{
    model.showMarkingEditor.groups = false;
}
