<#include "../../../../component.head.inc">
<#macro renderHeadNationalityMarkingSelector>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/lib/nationality/selector.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/lib/nationality/selector.js"></@script>
</#macro>

<#macro renderBodyNationalityMarkingSelector htmlId>
	<#assign thisHtmlId = "${htmlId}-nationalityMarkingSelector" />

	<div id="${thisHtmlId?html}" class="nationality-marking-selector-panel hidden">
		<div class="hd">
			<span id="${thisHtmlId?html}-title-span">${msg("control.nationality")?html}</span>
		</div>
		<div class="bd">
			<div class="container">
				<ul id="${thisHtmlId?html}-valueList" class="individual-list">
				<#list enhancedMarkings.nationality.valueList as value>
					<li>
						<input id="${thisHtmlId?html}-value-${value?html}" type="checkbox" value="${value?html}" />
						<label for="${thisHtmlId?html}-value-${value?html}">${value?html}</label>
		            </li>
				</#list>
				</ul>
				<p id="${thisHtmlId?html}-currentMarking" class="current-nationality-marking" aria-live="polite" title="${msg("control.nationality.current-marking")?html}"></p>
			</div>
		</div>
		<div class="ft">
			<button id="${thisHtmlId?html}-saveButton">${msg("button.save")}</button>
			<button id="${thisHtmlId?html}-cancelButton">${msg("button.cancel")?html}</button>
		</div>
	</div>
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityNationalityMarkingSelector("${thisHtmlId?js_string}")
		.setOptions({
	        forcedValue : "${enhancedMarkings.nationality.forcedValue?js_string}",
	        suffix : "${enhancedMarkings.nationality.suffix?js_string}",
	        separator : "${enhancedMarkings.nationality.separator?js_string}"
   		})
		.setMessages(${messages});
	//]]></script>
</#macro>