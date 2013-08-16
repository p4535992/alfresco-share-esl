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
<script type="text/javascript">//<![CDATA[
   new Alfresco.WikiList("${args.htmlid}").setOptions(
   {
      siteId: "${page.url.templateArgs["site"]!""}",
      <#if error??>error: true,</#if>
      pages: [<#if pageList?? && pageList.pages?size &gt; 0><#list pageList.pages as p>"${p.name}"<#if p_has_next>, </#if></#list></#if>],
      <#if pageList?? && pageList.permissions??>
         <#assign permissions = pageList.permissions>
      <#else>
         <#assign permissions = {}>
      </#if>
      permissions:
      {
         "create": ${(permissions["create"]!false)?string}
      },
      filterId: "${(page.url.args.filter!"recentlyModified")?js_string}"
   });                                       
//]]></script>
<div id="${args.htmlid}-pagelist" class="yui-navset pagelist"> 
<#if pageList?? && pageList.pages?size &gt; 0>
<#list pageList.pages as p>
   <div class="wikipage <#if p.tags??><#list p.tags as t>wp-${t}<#if t_has_next> </#if></#list></#if>">
<#if p.eslPM?exists>
   <div class='eslPMWiki${p.eslPM?replace(" ","")}'>
      <span class='eslRenderNod'><#if p.eslNod?exists>${p.eslNod}</#if></span><span class='eslRenderPM'> <#if p.eslPM?exists>${p.eslPM}</#if></span><span class='eslRenderAtomal'> <#if p.eslAtomal?exists>${p.eslAtomal}</#if></span><span id='eslRenderFreeForm'> <#if p.eslFreeformCaveats?exists>${p.eslFreeformCaveats}</#if></span><span class='eslRenderEyes'> <#if p.eslEyes?exists>${p.eslEyes}</#if></span>
      <br/>
      <span class='eslRenderClosed'><#if p.eslClosed?exists>${p.eslClosed}</#if></span> <span class='eslRenderOrganisations'><#if p.eslOrganisations?exists>${p.eslOrganisations}</#if></span> <span class='eslRenderOpen'> <#if p.eslOpen?exists>${p.eslOpen}</#if></span>
  </div>
</#if>
   <div class="actionPanel">
      <#if p.permissions.edit><div class="editPage"><a href="${url.context}/page/site/${page.url.templateArgs.site?html}/wiki-page?title=${p.name?url}&amp;action=edit&amp;listViewLinkBack=true">${msg("link.edit")}</a></div></#if>
      <div class="detailsPage"><a href="${url.context}/page/site/${page.url.templateArgs.site}/wiki-page?title=${p.name?url}&amp;action=details&amp;listViewLinkBack=true">${msg("link.details")}</a></div>
      <#if p.permissions.delete><div class="deletePage"><a href="#" class="delete-link" title="${p.name}">${msg("link.delete")}</a></div></#if>
   </div>
   <div class="pageTitle"><a class="pageTitle theme-color-1" href="${url.context}/page/site/${page.url.templateArgs.site?html}/wiki-page?title=${p.name?url}&amp;listViewLinkBack=true">${p.title}</a></div>
   <div class="publishedDetails">
      <span class="attrLabel">${msg("label.creator")}</span> <span class="attrValue"><a href="${url.context}/page/user/${p.createdByUser?url}/profile" class="theme-color-1" >${p.createdBy?html}</a></span>
      <span class="spacer">&nbsp;</span>
      <span class="attrLabel">${msg("label.createDate")}</span> <span class="attrValue">${xmldate(p.createdOn)?string(msg("date-format.defaultFTL"))}</span>
      <span class="spacer">&nbsp;</span>
      <span class="attrLabel">${msg("label.modifier")}</span> <span class="attrValue"><a href="${url.context}/page/user/${p.modifiedByUser?url}/profile" class="theme-color-1">${p.modifiedBy?html}</a></span>
      <span class="spacer">&nbsp;</span>
      <span class="attrLabel">${msg("label.modifiedDate")}</span> <span class="attrValue">${xmldate(p.modifiedOn)?string(msg("date-format.defaultFTL"))}</span>
   </div>
   <#assign pageCopy>${(p.text!"")?replace("</?[^>]+>", " ", "ir")}</#assign>
   <div class="pageCopy rich-content"><#if pageCopy?length &lt; 1000>${pageCopy}<#else>${pageCopy?substring(0, 1000)}...</#if></div>
   <#-- Display tags, if any -->
   <div class="pageTags">
      <span class="tagDetails">${msg("label.tags")}</span>
      <#if p.tags?? && p.tags?size &gt; 0><#list p.tags as tag><a href="#"  class="wiki-tag-link">${tag}</a><#if tag_has_next>,&nbsp;</#if></#list><#else>${msg("label.none")}</#if>
   </div>
   </div><#-- End of wikipage -->
</#list>
<#elseif error??>
   <div class="error-alt">${error}</div>
<#else>
   <div class="noWikiPages">${msg("label.noPages")}</div>
</#if>
</div>
