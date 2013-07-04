<#include "../../../../component.head.inc">
<#macro renderHeadFreeformMarkingsSelector>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/lib/freeform-markings/selector.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/lib/freeform-markings/selector.js"></@script>
</#macro>

<#macro renderBodyFreeformMarkingsSelector htmlId>
	<#assign thisHtmlId = "${htmlId}-freeformMarkingsSelector" />

	<div id="${thisHtmlId?html}" class="freeform-markings-selector-panel hidden">
		<div class="hd">
			<span id="${thisHtmlId?html}-title-span">${msg("control.freeform")?html}</span>
		</div>
		<div class="bd">
		  <span id="${thisHtmlId?html}-help-span" class="eslFreeformHelp">${msg("control.freeform.help")?html}</span>
		</div>
		<div class="bd">
			<input type="text" class="eslTextFreeformSelector" id="${thisHtmlId?html}-textBox" />
		</div>
		<div class="ft">
			<button id="${thisHtmlId?html}-saveButton">${msg("button.save")}</button>
			<button id="${thisHtmlId?html}-cancelButton">${msg("button.cancel")?html}</button>
		</div>
	</div>
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityFreeformMarkingsSelector("${thisHtmlId?js_string}")
		.setMessages(${messages});
	//]]></script>
</#macro>