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
<#include "../../../../component.head.inc">
<#macro renderHeadVisibilityUserAccessSummary>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-user-access-summary.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-user-access-summary.js"></@script>
</#macro>

<#macro renderBodyVisibilityUserAccessSummary htmlId>
	<#assign thisHtmlId = "${htmlId}-visibilityUserAccessSummary" />
	
	<div id="${thisHtmlId?html}" class="visibility-user-access-summary">
		<div id="${thisHtmlId?html}-user-security-section-placeholder">
			<div id="${thisHtmlId?html}-user-security-summary-placeholder">${msg("visibility.user-access-summary.leader")?html}</div>
		</div>
	</div>
	
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityVisibilityUserAccessSummary("${thisHtmlId?js_string}");
	//]]></script>
</#macro>
