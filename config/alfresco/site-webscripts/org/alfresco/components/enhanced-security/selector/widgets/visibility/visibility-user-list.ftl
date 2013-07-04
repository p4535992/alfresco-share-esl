<#include "../../../../component.head.inc">
<#macro renderHeadVisibilityUserList>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-user-list.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-user-list.js"></@script>
</#macro>

<#macro renderBodyVisibilityUserList htmlId>
	<#assign thisHtmlId = "${htmlId}-visibilityUserList" />
	
	<div id="${thisHtmlId?html}" class="visibility-user-list">
	</div>
	
	<div id="${thisHtmlId?html}" class="visibility-user-list">
        
	</div>
	
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityVisibilityUserList("${thisHtmlId?js_string}")
		.setMessages(${messages});
	//]]></script>
</#macro>