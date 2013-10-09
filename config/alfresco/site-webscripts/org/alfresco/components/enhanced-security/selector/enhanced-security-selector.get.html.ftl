<#--
    Copyright (C) 2008-2010 Surevine Limited.
      
    Although intended for deployment and use alongside Alfresco this module should
    be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
    http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
    
    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
-->
<#import "widgets/visibility-count.lib.ftl" as visibilityCount />
<#import "widgets/ribbon-messages.ftl" as ribbonMessages />

<#import "lib/single-value-selector.ftl" as singleValueSelector />
<@singleValueSelector.renderBodySingleValueSelector htmlId=args.htmlid inputName="nod" />
<@singleValueSelector.renderBodySingleValueSelector htmlId=args.htmlid inputName="classification" />
<@singleValueSelector.renderBodySingleValueSelector htmlId=args.htmlid inputName="atomal" />

<#import "lib/groups/advanced-selector.ftl" as advancedSelector />
<@advancedSelector.renderBodyAdvancedGroupSelector htmlId=args.htmlid />

<#import "lib/freeform-markings/selector.ftl" as freeFormMarkingSelector />
<@freeFormMarkingSelector.renderBodyFreeformMarkingsSelector htmlId=args.htmlid />

<#import "lib/nationality/selector.ftl" as nationalityMarkingSelector />
<@nationalityMarkingSelector.renderBodyNationalityMarkingSelector htmlId=args.htmlid />

<#import "widgets/visibility/visibility-drill-down.ftl" as visibilityDrillDown />
<@visibilityDrillDown.renderBodyVisibilityDrillDown htmlId=args.htmlid />
	
<#-- Begin HTML Content-->
<div id="${args.htmlid}-enhancedSecuritySelectorOuter" class="ESLSelector">
	<div id="${args.htmlid}-enhancedSecuritySelector" style="display: none" class="ESLSelectorControlContainer">
		<div id="${args.htmlid}-enhancedSecuritySelector-selectorContainer">
		  	<ul>
	    	  <li class="editableESLSelector" style="${showMarkingEditor.nod?string("", "display:none")}"><span id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-editControls-nod" title="${msg("control.nod")?html}" class="yui-button"><span class="first-child"><button>${msg("control.nod.select")}</button></span></span></li>
	    	  <li class="editableESLSelector" style="${showMarkingEditor.classification?string("", "display:none")}"><span id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-editControls-classification" title="${msg("control.classification")?html}" class="yui-button"><span class="first-child"><button>${msg("control.classification.select")}</button></span></span></li>
	    	  <li class="editableESLSelector" style="${showMarkingEditor.atomal?string("", "display:none")}"><span id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-editControls-atomal" title="${msg("control.atomal")?html}" class="yui-button"><span class="first-child"><button>${msg("control.atomal.select")}</button></span></span></li>
	   	  	  <li class="editableESLSelector" style="${showMarkingEditor.groups?string("", "display:none")}"><span id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-editControls-groups" title="${msg("control.groups")?html}" class="yui-button"><span class="first-child"><button>${msg("control.groups.select")}</button></span></span></li>
	    	  <li class="editableESLSelector" style="${showMarkingEditor.freeform?string("", "display:none")}"><span id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-editControls-freeform" title="${msg("control.freeform")?html}" class="yui-button"><span class="first-child"><button>${msg("control.freeform.select")}</button></span></span></li>
	    	  <li class="editableESLSelector" style="${showMarkingEditor.nationality?string("", "display:none")}"><span id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-editControls-nationality" title="${msg("control.nationality")?html}" class="yui-button"><span class="first-child"><button>${msg("control.nationality.select")}</button></span></span></li>
	    	</ul>
		</div>
		<div class="visibility-container">
			<@visibilityCount.renderBodyVisibilityCount htmlId=args.htmlid />
		</div>
		<div id="${args.htmlid}-enhancedSecuritySelector-quickMarksContainer" class="quickmarks-container hidden">
			<span id="${args.htmlid}-enhancedSecuritySelector-lastMarkingButton" class="yui-button"><span class="first-child"><button>${msg("button.use-last-marking")}</button></span></span>
	    </div>
	    <div class="clear"><#-- Yeah, I know! --></div>
		<div id="${args.htmlid}-enhancedSecuritySelector-focusSlider">
		    <div class="messages-container">
				<@ribbonMessages.renderBodyRibbonMessages htmlId=args.htmlid+"-ribbonMessages" />
			</div>
		</div>
	</div>
	<#--
	<div id="${args.htmlid}-enhancedSecuritylabelViewer" class="ESLSelectorControlContainerViewOnly">
		<span>
		${msg("viewmode.label-description")?html}:
		</span>
	     <span id="${args.htmlid}-enhancedSecuritySelector-viewControls">
	          <span class="viewESLSelector" id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-viewControls-nod"><@initialValueView control="nod"/></span>
	          <span class="viewESLSelector" id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-viewControls-classification"><@initialValueView control="classification"/></span>
	          <span class="viewESLSelector" id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-viewControls-atomal"><@initialValueView control="atomal"/></span>
	          <span class="viewESLSelector" id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-viewControls-groups"><@initialValueView control="groups"/></span>
	          <span class="viewESLSelector" id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-viewControls-freeform"><@initialValueView control="freeform"/></span>
	          <span class="viewESLSelector" id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-viewControls-nationality"><@initialValueView control="nationality"/></span>
	      </span>
	      <span class="viewToEditESLSwitchContainer">
	      	<button class="viewToEditESLSwitch" id="${args.htmlid}-enhancedSecuritySelector-selectorContainer-toEditModeButton" title="${msg("button.to-edit-mode.title")?html}">...</button>
	      </span>
	</div>
	-->
</div>
<#-- End HTML Content-->
	
<script type="text/javascript">//<![CDATA[
new Alfresco.EnhancedSecuritySelector("${args.htmlid}").setMessages(
   ${messages}
);

<#if ((url.templateArgs.editMode)!"false") == "true">
    Alfresco.EnhancedSecuritySelector.toEditMode();
</#if>

//]]></script>
