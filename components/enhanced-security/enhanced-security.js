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
//Set the available ESLs for a child item to that of it's parent
//This function will fail unless a parent ESL is rendered on the screen
function setESLToParent()
{

    // Set a flag to prevent the user from removing the last open group from the
    // item
    YAHOO.util.Selector.query('input[id$=openGroupMode]')[0].value = 'edit';

    // If we've got multiple parents, select the furthest down, as this is
    // probably our parent, and the most tightly secured
    // Work out the number of parents by counting the number of eslRenderNods
    var parentIndex = YAHOO.util.Selector.query('div span.eslRenderNod').length - 1;

    // Set the simple selectors and text boxes
    var parentNod = YAHOO.lang.trim(YAHOO.util.Selector.query('div span.eslRenderNod')[parentIndex].innerHTML);
    var parentPM = YAHOO.lang.trim(YAHOO.util.Selector.query('div span.eslRenderPM')[parentIndex].innerHTML);
    var parentFreeForm = YAHOO.lang.trim(YAHOO.util.Selector.query('div span.eslRenderFreeForm')[parentIndex].innerHTML);
    var parentEyes = YAHOO.lang.trim(YAHOO.util.Selector.query('div span.eslRenderEyes')[parentIndex].innerHTML);

    YAHOO.util.Selector.query('select[id$=eslNationalOwner]')[0].value = parentNod;
    YAHOO.util.Selector.query('select[id$=eslProtectiveMarking]')[0].value = parentPM;
    YAHOO.util.Selector.query('input[id$=eslCaveats]')[0].value = parentFreeForm;
    YAHOO.util.Selector.query('select[id$=eslNationalCaveats]')[0].value = parentEyes;

}

function hideSubmitIfCantSeeItem(idPrefix)
{
    showSubmitButton(idPrefix);
}

function showSubmitButton()
{
    var realButtons = YAHOO.util.Selector.query('span.eslSubmitContainer');
    var dummyButtons = YAHOO.util.Selector.query('span.eslSubmitForbiddenContainer');
    
    var i;
    
    // Hide the real buttons
    for (i = 0; i < realButtons.length; i++)
    {
        realButtons[i].style.cssText = "";
    }
    // Show the dummy buttons
    for (i = 0; i < dummyButtons.length; i++)
    {
        dummyButtons[i].style.cssText = "display:none;";
    }
}

function refineESLUI()
{
    // Only process ESL selection logic if we have an ESL Selector on the page
    if (YAHOO.util.Selector.query('div.eslInline').length > 0)
    {
        showSubmitButton();
    }
}

function forceCaveatPattern(element)
{
    var beforeValue = element.value;
    afterValue = beforeValue.toUpperCase();
    afterValue = afterValue.replace(/[^a-zA-Z ]+/g, '');
    element.value = afterValue;
}

// Add an endsWith to String to make above code a bit more readable
String.prototype.endsWith = function(str)
{
    var lastIndex = this.lastIndexOf(str);
    return ((lastIndex != -1) && (lastIndex + str.length == this.length));
}

// IE6 Support for trim() function
if (!('trim' in String.prototype))
{
    String.prototype.trim = function()
    {
        return this.replace(/^\s+|\s+$/g, "");
    };
}

// 'Main' logic
refineESLUI();
