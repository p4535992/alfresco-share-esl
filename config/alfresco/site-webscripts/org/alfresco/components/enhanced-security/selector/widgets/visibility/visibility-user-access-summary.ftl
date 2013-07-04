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