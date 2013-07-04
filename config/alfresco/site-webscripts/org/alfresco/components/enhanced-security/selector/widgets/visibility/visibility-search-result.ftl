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