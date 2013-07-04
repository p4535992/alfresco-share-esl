<#include "../../../../component.head.inc">
<#macro renderHeadVisibilityUserProfileSummary>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-user-profile-summary.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-user-profile-summary.js"></@script>
</#macro>

<#macro renderBodyVisibilityUserProfileSummary htmlId>
	<#assign thisHtmlId = "${htmlId}-visibilityUserProfileSummary" />
	
	<div id="${thisHtmlId?html}" class="visibility-user-profile-summary hidden">
	
		<h3>${msg("visibility.user-profile.title")?html}</h3>
		<ul class="profile">
			<li id="${thisHtmlId?html}-profileNameRow">
				<span class="title">${msg("profile.name")?html}</span>
				<span id="${thisHtmlId?html}-profileName"></span>
			</li>
			<li id="${thisHtmlId?html}-profileUserNameRow">
				<span class="title">${msg("profile.username")?html}</span>
				<span id="${thisHtmlId?html}-profileUserName"></span>
			</li>
			<li id="${thisHtmlId?html}-profileJobTitleRow">
				<span class="title">${msg("profile.job-title")?html}</span>
				<span id="${thisHtmlId?html}-profileJobTitle"></span>
			</li>
			<li id="${thisHtmlId?html}-profileOrganisationRow">
				<span class="title">${msg("profile.organisation")?html}</span>
				<span id="${thisHtmlId?html}-profileOrganisation"></span>
			</li>
			<li id="${thisHtmlId?html}-profileLocationRow">
				<span class="title">${msg("profile.location")?html}</span>
				<span id="${thisHtmlId?html}-profileLocation"></span>
			</li>
			<li id="${thisHtmlId?html}-profileEmailRow">
				<span class="title">${msg("profile.email")?html}</span>
				<span id="${thisHtmlId?html}-profileEmail"></span>
			</li>
		</ul>
		<p class="theme-border-2 profile-link"><a id="${thisHtmlId?html}-profileLink" target="_blank">${msg("profile.link")?html}</a></p>
	</div>
	
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityVisibilityUserProfileSummary("${thisHtmlId?js_string}");
	//]]></script>
</#macro>