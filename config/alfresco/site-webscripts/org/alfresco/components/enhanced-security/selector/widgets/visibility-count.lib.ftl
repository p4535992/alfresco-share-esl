<!--
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
<#include "../../../component.head.inc">
<#macro renderHeadVisibilityCount>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/widgets/visibility-count.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/widgets/visibility-count.js"></@script>
</#macro>

<#macro renderBodyVisibilityCount htmlId>
	<#assign thisHtmlId = "${htmlId}-visibilityCount" />
	
	<div id="${thisHtmlId?html}" class="visibility-count" aria-live="polite" tabindex="0" title="${msg("visibility.tooltip")?html}">
		<span id="${thisHtmlId?html}-label">${msg("visibility.everyone")?html}</span>
		<span class="yui-button" id="${thisHtmlId?html}-detailsButton"><span class="first-child"><button>${msg("visibility.details")?html}</button></span></span>
	</div>
	
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityVisibilityCount("${thisHtmlId?js_string}")
		.setMessages(${messages});
	//]]></script>
</#macro>

<#macro renderSpacerElement>
	<div class="visibility-count visibility-count-dummy" style="visibility: hidden;">${msg("visibility")?html}: ${msg("visibility.everyone")?html}</div>
</#macro>
