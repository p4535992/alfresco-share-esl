<#include "../../../../component.head.inc">
<#macro renderHeadVisibilitySearchInput>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-search-input.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-search-input.js"></@script>
</#macro>

<#macro renderBodyVisibilitySearchInput htmlId>
	<#assign thisHtmlId = "${htmlId}-visibilitySearchInput" />
	
	<div id="${thisHtmlId?html}" class="visibility-search-input">
		<label for="${thisHtmlId?html}-searchText">${msg("visibility.single-user-search.label")}</label>
		<div id="${thisHtmlId?html}-autocomplete" class="autocomplete">
			<input id="${thisHtmlId?html}-searchText" type="text" />
			<div id="${thisHtmlId?html}-autocompleteResults" class="autocomplete-results-container"></div>
		</div>
		<div class="clear"></div>
	</div>
	
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityVisibilitySearchInput("${thisHtmlId?js_string}");
	//]]></script>
</#macro>