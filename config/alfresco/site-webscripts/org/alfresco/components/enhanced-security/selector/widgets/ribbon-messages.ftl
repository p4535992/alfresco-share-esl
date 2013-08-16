<!--
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
