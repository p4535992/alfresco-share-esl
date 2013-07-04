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