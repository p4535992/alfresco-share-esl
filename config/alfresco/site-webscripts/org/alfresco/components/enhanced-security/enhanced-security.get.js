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
function getNationalOwners()
{
   var nationalOwners = ['@@esc.nat.owner@@', ''];
   return nationalOwners;
}

function getDefaultNationalOwners()
{
  return '@@esc.nat.owner@@';
}

/**
 * Gets the Protective Markings.
 * Although we'll only be using the very bottom of this list, it
 * was felt that we should include all the values in the enumeration
 * in order to be more compliant with COSP02
 */
function getProtectiveMarkings()
{
   var protectiveMarkings = ['@@esc.marking.lowest@@', '@@esc.marking.lower@@', '@@esc.marking.medium@@', '@@esc.marking.higher@@', '@@esc.marking.highest@@'];
   return protectiveMarkings;
}

function getDefaultProtectiveMarking()
{
  return '@@esc.marking.higher@@';
}

/**
* The first part of this function sets up a number of arrays.  The values in the arrays
* are indexes into the results of a call to getClosedGroups().  The semantics of this list
* are that, if a user selects one closed group in the array, he isn't allowed to select any others.
*
* Note that many large combinations of exclusive values will adversley affect performance.  The below
* code assumes this feature will be used sparingly, with very few small lists of exclusive values, and
* does not optimise for the performance of large lists (let n=number of sets, x=number of markings and group
* selection is O(nx^2) assuming an invariant propensity for a group to be exclusive)
*/
function getExclusiveClosedMarkings()
{
  //These are array indexes into the results of getClosedGroups()
  var firstSet = [0, 1];
  //If you want more exclusive sets, just add:  var secondSet=[2,3,4,5,9] and so on
  var exclusiveSets = [firstSet]; //or [firstSet,secondSet] and so on

  return processExclusiveSets(getClosedGroups(), exclusiveSets);
}

function processExclusiveSets(groups, exclusiveSets)
{
  if (groups == null || exclusiveSets == null || exclusiveSets.length == 0 || groups.length == 0)
  {
    return [];
  }
  var returnVal = [];
  for (var sets = 0; sets < exclusiveSets.length; sets++)
  {
    var exclusiveSet = exclusiveSets[sets];
  	var processedSet = [];
  	for (var set = 0; set < exclusiveSet.length; set++)
  	{
  	  processedSet.push(groups[exclusiveSet[set]]);
  	}
  	returnVal.push(processedSet);
  }
  return returnVal;
}

/**
 * Gets the National Caveats.
 */
function getNationalCaveats()
{
   var nationalCaveats = [@@esc.nat.caveats.list@@];
   return nationalCaveats;
}

function getDefaultNationalCaveat()
{
  return '@@esc.nat.caveats.default@@';
}

/**
 * Gets the Closed Groups.
 */
function getClosedGroups()
{
   var closedGroups = [@@esc.closedgrouplist@@];
   return closedGroups;
}

/**
* Some Groups are not valid unless they are combined with another group.  It is invalid to have
* only lonely groups allocated to an item
*/
function getLonelyGroups()
{
  var retVal = [];
  retVal.push(getClosedGroups()[1]);
  return retVal;
}

function isValueInArray(value, array) {
  for (i = 0; i < array.length; i++)
  {
    if (array[i] == value)
    {
      return true;
    }
  }
  return false;
}

model.nationalOwners = getNationalOwners();
model.defNationalOwners = getDefaultNationalOwners();
model.protectiveMarkings = getProtectiveMarkings();
model.defProtectiveMarkings = getDefaultProtectiveMarking();
model.nationalCaveats = getNationalCaveats();
model.defNationalCaveats = getDefaultNationalCaveat();
model.closedGroups = getClosedGroups();
model.exclusiveClosedMarkings = getExclusiveClosedMarkings();
model.lonelyGroups = getLonelyGroups();
