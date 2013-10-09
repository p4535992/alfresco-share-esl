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
<#import "../../widgets/visibility-count.lib.ftl" as visibilityCount />

<#include "../../../../component.head.inc">
<#macro renderHeadAdvancedGroupSelector>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/lib/groups/advanced-selector.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/lib/groups/advanced-selector.js"></@script>
</#macro>

<#macro renderBodyAdvancedGroupSelector htmlId>
	<#assign helpPages = config.scoped["HelpPages"]["help-pages"]>
	<#assign helpLink = helpPages.getChildValue("enhanced-security-help")>
	<#assign thisHtmlId = "${htmlId}-advancedGroupSelector">
	<div id="${thisHtmlId?html}" class="group-selector-panel hidden">
		<div class="hd">
			<span id="${thisHtmlId?html}-title-span">${msg("advanced-group-selector.title")?html}</span>
		</div>
		<div class="bd">
			<div class="inner">
				<#if helpLink != ""><div class="eslHelpLink"><a href="${helpLink?html}" rel="_blank" target="_blank">${msg("esl.label.help")}</a></div></#if>
				<@visibilityCount.renderBodyVisibilityCount htmlId=thisHtmlId />
				<div id="${htmlId?html}-advancedGroupSelector-groups" class="group-selector-lists-container"></div>
				<div class="clear"></div>
				<div id="${htmlId?html}-advancedGroupSelector-validationMessages" class="validation-messages" aria-live="polite" aria-relevant="all"></div>
				<div class="clear"></div>
			</div>
		</div>
		<div class="ft">
			<button id="${thisHtmlId?html}-saveButton">${msg("button.save")}</button>
			<button id="${thisHtmlId?html}-cancelButton">${msg("button.cancel")}</button>
		</div>
	</div>
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecuritySelectorGroupsAdvancedSelector("${thisHtmlId?js_string}")
		.setMessages(${messages});
	//]]></script>
</#macro>
