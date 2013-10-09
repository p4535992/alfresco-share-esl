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
<#macro renderHeadVisibilityDrillDown>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-drill-down.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-drill-down.js"></@script>

	<#import "visibility-user-list.ftl" as visibilityUserList />
	<@visibilityUserList.renderHeadVisibilityUserList />

	<#import "visibility-single-user-details.ftl" as visibilitySingleUserDetails />
	<@visibilitySingleUserDetails.renderHeadVisibilitySingleUserDetails />
</#macro>

<#macro renderBodyVisibilityDrillDown htmlId>
	<#import "visibility-user-list.ftl" as visibilityUserList />
	<#import "visibility-single-user-details.ftl" as visibilitySingleUserDetails />
	
	<#assign thisHtmlId = "${htmlId}-visibilityDrillDown" />
	
	<div id="${thisHtmlId?html}" class="visibility-drill-down hidden">
		<div class="hd">
			<span id="${thisHtmlId?html}-title-span">${msg("visibility")?html}</span>
		</div>
		<div class="bd">
			<p class="marking-label">
				<span class="marking-label-intro">${msg("visibility.you-are-working-with")?html}</span>
				<span id="${thisHtmlId?html}-markingLabel" class="marking-label-marking"></span>
			</p>
			
			<p id="${thisHtmlId?html}-countLabel" class="count-label"></p>

			<div id="${thisHtmlId?html}-tabView" class="yui-navset">
			    <ul class="yui-nav">
			        <li class="selected"><a href="#tab1" title="${msg("visibility.tabs.user-list.tooltip")?html}"><em>${msg("visibility.tabs.user-list")?html}</em></a></li>
			        <li><a href="#tab2" title="${msg("visibility.tabs.user-search.tooltip")?html}"><em>${msg("visibility.tabs.user-search")?html}</em></a></li>
			    </ul>            
			    <div class="yui-content">
			        <div><@visibilityUserList.renderBodyVisibilityUserList htmlId=thisHtmlId /></div>
			        <div><@visibilitySingleUserDetails.renderBodyVisibilitySingleUserDetails htmlId=thisHtmlId /></div>
			    </div>
			</div>
		</div>
		<div class="ft">
			<button id="${thisHtmlId?html}-closeButton">${msg("button.close")?html}</button>
		</div>
	</div>
	
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityVisibilityDrillDown("${thisHtmlId?js_string}")
		.setMessages(${messages});
	//]]></script>
</#macro>
