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
