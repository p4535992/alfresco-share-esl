/**
 * Note that there are two enhanced-security.lib.js files - onbe in share (this file) and one in alfresco.
 * The two files are similar, but not the same, so make sure you're editing the right one!
 */


/**
 * Given a set of closed markings, seperate out any atomal markings embedded inside
 * @param closedMarkings Array of closed markings
 * @return An object with two properties; "atomal" is the atomal value derived from the closed markings. "closedMarkings"
 * is the input set of closed markings with any atomal component removed
 */
function seperateAtomalFromClosedMarkings(closedArr)
{
    if (closedArr==null)
    {
        return { atomal: "", closedMarkings:[]};
    }
    var atomal="";
    var newClosed=[];
    for (var i=0; i < closedArr.length; i++)
    {
        if (closedArr[i]=="@@esc.atomal@@1" && atomal!="@@esc.atomal@@2")
        {
            atomal="@@esc.atomal@@1";
        }
        else if (closedArr[i]=="@@esc.atomal@@2")
        {
            atomal="@@esc.atomal@@2";
        }
        else {
            newClosed.push(closedArr[i]);
        }
    }
    return { atomal: atomal, closedMarkings: newClosed};
}
