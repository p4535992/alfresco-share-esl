<#include "../../../component.head.inc">
<#macro renderHeadRibbonMessages>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/widgets/ribbon-messages.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/widgets/ribbon-messages.js"></@script>
</#macro>

<#macro renderBodyRibbonMessages htmlId>
	<div id="${htmlId?html}" class="enhanced-security-ribbon-messages hidden">
		<ul id="${htmlId?html}-list" aria-live="polite">
		</ul>
	</div>
	
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityRibbonMessages("${htmlId?js_string}");
	//]]></script>
</#macro>