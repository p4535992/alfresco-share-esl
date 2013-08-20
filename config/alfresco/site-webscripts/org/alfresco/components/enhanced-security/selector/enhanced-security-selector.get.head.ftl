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
<#include "../../component.head.inc">
<!-- Enhanced Security Selector -->
<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/enhanced-security-selector.css" />

<!-- Library files -->
<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/visibility-utils.js"></@script>

<!-- Component files -->
<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/enhanced-security-static-data.js"></@script>
<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/enhanced-security-selector.js"></@script>
<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/advanced-group-selector/controller.js"></@script>
<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/advanced-group-selector/single-group-selector.js"></@script>
<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/advanced-group-selector/organisation-selector.js"></@script>
<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/security-label-message-box.js"></@script>
<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/enhanced-security-logic.js"></@script>


<!-- Advanced Groups Selector -->
<#import "lib/groups/advanced-selector.ftl" as advancedSelector />
<@advancedSelector.renderHeadAdvancedGroupSelector />

<!-- Single Value Selectors -->
<#import "lib/single-value-selector.ftl" as singleValueSelector />
<@singleValueSelector.renderHeadSingleValueSelector />

<!-- Freeform Markings Selector -->
<#import "lib/freeform-markings/selector.ftl" as freeFormMarkingSelector />
<@freeFormMarkingSelector.renderHeadFreeformMarkingsSelector />

<!-- Nationality Marking Selector -->
<#import "lib/nationality/selector.ftl" as nationalityMarkingSelector />
<@nationalityMarkingSelector.renderHeadNationalityMarkingSelector />

<!-- Visibility Count -->
<#import "widgets/visibility-count.lib.ftl" as visibilityCount />
<@visibilityCount.renderHeadVisibilityCount />

<!-- Visibility Drill Down -->
<#import "widgets/visibility/visibility-drill-down.ftl" as visibilityDrillDown />
<@visibilityDrillDown.renderHeadVisibilityDrillDown />

<!-- Ribbon Messages -->
<#import "widgets/ribbon-messages.ftl" as ribbonMessages />
<@ribbonMessages.renderHeadRibbonMessages />
