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
<#include "../../../../component.head.inc">
<#macro renderHeadVisibilitySearchResult>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-search-result.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-search-result.js"></@script>

	<#import "visibility-user-access-summary.ftl" as visibilityUserAccessSummary />
	<@visibilityUserAccessSummary.renderHeadVisibilityUserAccessSummary />

	<#import "visibility-user-profile-summary.ftl" as visibilityUserProfileSummary />
	<@visibilityUserProfileSummary.renderHeadVisibilityUserProfileSummary />
</#macro>

<#macro renderBodyVisibilitySearchResult htmlId>
	<#import "visibility-user-access-summary.ftl" as visibilityUserAccessSummary />
	<#import "visibility-user-profile-summary.ftl" as visibilityUserProfileSummary />

	<#assign thisHtmlId = "${htmlId}-visibilitySearchResult" />
	
	<div id="${thisHtmlId?html}" class="visibility-search-result">
		<@visibilityUserAccessSummary.renderBodyVisibilityUserAccessSummary htmlId=thisHtmlId />
		<@visibilityUserProfileSummary.renderBodyVisibilityUserProfileSummary htmlId=thisHtmlId />
	</div>
	
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityVisibilitySearchResult("${thisHtmlId?js_string}");
	//]]></script>
</#macro>
