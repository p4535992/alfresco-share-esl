<#include "../../../../component.head.inc">
<#macro renderHeadVisibilitySingleUserDetails>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-single-user-details.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-single-user-details.js"></@script>

	<#import "visibility-search-input.ftl" as visibilitySearchInput />
	<@visibilitySearchInput.renderHeadVisibilitySearchInput />

	<#import "visibility-search-result.ftl" as visibilitySearchResult />
	<@visibilitySearchResult.renderHeadVisibilitySearchResult />
</#macro>

<#macro renderBodyVisibilitySingleUserDetails htmlId>
	<#import "visibility-search-input.ftl" as visibilitySearchInput />
	<#import "visibility-search-result.ftl" as visibilitySearchResult />

	<#assign thisHtmlId = "${htmlId}-visibilitySingleUserDetails" />
	
	<div id="${thisHtmlId?html}" class="visibility-single-user-details">
		<@visibilitySearchInput.renderBodyVisibilitySearchInput htmlId=thisHtmlId />
		<@visibilitySearchResult.renderBodyVisibilitySearchResult htmlId=thisHtmlId />
	</div>
	
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityVisibilitySingleUserDetails("${thisHtmlId?js_string}");
	//]]></script>
</#macro>