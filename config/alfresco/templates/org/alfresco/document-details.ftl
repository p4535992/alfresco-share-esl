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
<#include "include/alfresco-template.ftl" />
<@templateHeader>
   <@link rel="stylesheet" type="text/css" href="${url.context}/res/components/blog/postview.css" />
   <@script type="text/javascript" src="${page.url.context}/res/components/blog/blogdiscussions-common.js"></@script>
   <@script type="text/javascript" src="${page.url.context}/res/components/blog/blog-common.js"></@script>
   <@script type="text/javascript" src="${url.context}/res/modules/documentlibrary/doclib-actions.js"></@script>
   <@script type="text/javascript" src="${page.url.context}/res/templates/document-details/document-details.js"></@script>
   <#if doclibType?starts_with("dod5015")><@script type="text/javascript" src="${page.url.context}/res/templates/document-details/dod5015-document-details.js"></@script></#if>
   <@templateHtmlEditorAssets />
</@>

<@templateBody>
   <div id="alf-hd">
      <@region id=appType + "header" scope="global" protected=true />
      <@region id=appType + doclibType + "title" scope="template" protected=true />
      <@region id=appType + doclibType + "navigation" scope="template" protected=true />
      <@region id="enhanced-security-selector-view" scope="global" protected=true />
   </div>
   <div id="bd">
      <@region id=doclibType + "actions-common" scope="template" protected=true />
      <@region id=doclibType + "actions" scope="template" protected=true />
      <@region id=doclibType + "path" scope="template" protected=true />

      <div class="yui-g">
         <div class="yui-g first">
         <#if (config.scoped['DocumentDetails']['document-details'].getChildValue('display-web-preview') == "true")>
            <@region id=doclibType + "web-preview" scope="template" protected=true />
         </#if>
         <#if doclibType?starts_with("dod5015")>
            <@region id=doclibType + "events" scope="template" protected=true />
         <#else>
            <div class="document-details-comments">
               <@region id=doclibType + "comments" scope="template" protected=true />
               <@region id=doclibType + "createcomment" scope="template" protected=true />
            </div>
         </#if>
         </div>
         <div class="yui-g"> 
            <div class="yui-u first">
               <@region id=doclibType + "document-metadata-header" scope="template" protected=true />
               <@region id=doclibType + "document-metadata" scope="template" protected=true />
               <@region id=doclibType + "document-info" scope="template" protected=true />
               <@region id=doclibType + "document-workflows" scope="template" protected=true />
               <@region id=doclibType + "document-versions" scope="template" protected=true />
            </div>
            <div class="yui-u">
               <@region id=doclibType + "document-actions" scope="template" protected=true />
               <@region id=appType + doclibType + "document-links" scope="template" protected=true />
               <#if doclibType?starts_with("dod5015")>
                  <@region id=doclibType + "document-references" scope="template" protected=true />                                 
               </#if>
            </div>
         </div>
      </div>

      <@region id="html-upload" scope="template" protected=true />
      <@region id="flash-upload" scope="template" protected=true />
      <@region id="file-upload" scope="template" protected=true />
   </div>
   
   <script type="text/javascript">//<![CDATA[
   new ${jsType}().setOptions(
   {
      nodeRef: new Alfresco.util.NodeRef("${url.args.nodeRef?js_string}"),
      siteId: "${page.url.templateArgs.site!""}",
      rootNode: "${rootNode}"
   });
   //]]></script>

</@>

<@templateFooter>
   <div id="alf-ft">
      <@region id="footer" scope="global" protected=true />
   </div>
</@>
