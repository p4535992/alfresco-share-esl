<#--
    Renders the hidden Enhanced Security Label input fields used for form submission
    @param htmlid (String) the id to use.
-->

<#macro renderESL htmlid ogColumns yuiGridType>
    <input type="hidden" id="${htmlid}-eslOpenGroupsHidden" name="eslOpenGroupsHidden" value=""/>
    <input type="hidden" id="${htmlid}-eslClosedGroupsHidden" name="eslClosedGroupsHidden" value=""/>
    <input type="hidden" id="${htmlid}-eslOrganisationsHidden" name="eslOrganisationsHidden" value=""/>
    <input type="hidden" id="${htmlid}-esl-hidden-nod" name="eslNationalOwner" value=""/>
    <input type="hidden" id="${htmlid}-esl-hidden-classification" name="eslProtectiveMarking" value=""/>
    <input type="hidden" id="${htmlid}-esl-hidden-atomal" name="eslAtomal" value=""/>
    <input type="hidden" id="${htmlid}-esl-hidden-freeform" name="eslCaveats" value=""/>
    <input type="hidden" id="${htmlid}-esl-hidden-nationality" name="eslNationalCaveats" value=""/>
</#macro>