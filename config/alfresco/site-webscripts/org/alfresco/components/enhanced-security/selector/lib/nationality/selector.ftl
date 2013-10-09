<#--
    Copyright (C) 2008-2010 Surevine Limited.
      
    Although intended for deployment and use alongside Alfresco this module should
    be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
    http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
    
    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
-->
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
