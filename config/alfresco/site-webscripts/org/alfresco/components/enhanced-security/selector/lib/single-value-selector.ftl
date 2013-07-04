<#include "../../../component.head.inc">
<#macro renderHeadSingleValueSelector>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/lib/single-value-selector.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/lib/single-value-selector.js"></@script>
</#macro>

<#macro renderBodySingleValueSelector htmlId inputName>
	<#assign thisHtmlId = "${htmlId}-${inputName}-singleValueSelector" />

	<div id="${thisHtmlId?html}" class="single-value-selector-panel hidden">
		<div class="hd">
			<span id="${thisHtmlId?html}-title-span">${msg("control." + inputName)?html}</span>
		</div>
		<div class="bd">
			<ul class="single-value-selector-list">
				<#list enhancedMarkings[inputName] as mark>
					<li>
			            <button value="${mark}" id="${thisHtmlId?html}-${inputName}-${mark_index}-button"
			            		class="markingButton ${inputName}MarkingButton" name="${mark}Button">
				            <#if mark == "">
				            	${msg("single-value-selector." + inputName + ".none")}
				            <#else>
				           		${mark}
				           	</#if>
		            	</button>
		            </li>
				</#list>
			</ul>
		</div>
		<div class="ft">
			<button id="${thisHtmlId?html}-cancelButton">${msg("button.cancel")?html}</button>
		</div>
	</div>
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecuritySingleValueSelector("${thisHtmlId?js_string}", "${inputName?js_string}")
		.setMessages(${messages});
	//]]></script>
</#macro>