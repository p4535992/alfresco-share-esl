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
<#include "include/documentlibrary.inc.ftl" />
<@templateHeader>
   <@documentLibraryJS />
   <script type="text/javascript">//<![CDATA[
      new Alfresco.widget.Resizer("DocumentLibrary");
   //]]></script>
   <@script type="text/javascript" src="${url.context}/res/modules/documentlibrary/doclib-actions.js"></@script>
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
      <div class="yui-t1" id="alfresco-documentlibrary">
         <div id="yui-main">
            <div class="yui-b" id="alf-content">
               <@region id=doclibType + "toolbar" scope="template" protected=true />
               <@region id=doclibType + "documentlist" scope="template" protected=true />
            </div>
         </div>
         <div class="yui-b" id="alf-filters">
            <@region id=doclibType + "filter" scope="template" protected=true />
            <@region id=doclibType + "tree" scope="template" protected=true />
            <@region id=doclibType + "tags" scope="template" protected=true />
            <@region id=doclibType + "fileplan" scope="template" protected=true />
            <@region id=doclibType + "savedsearch" scope="template" protected=true />
         </div>
      </div>

      <@region id=doclibType + "html-upload" scope="template" protected=true />
      <@region id=doclibType + "flash-upload" scope="template" protected=true />
      <@region id=doclibType + "file-upload" scope="template" protected=true />
   </div>
</@>

<@templateFooter>
   <div id="alf-ft">
      <@region id="footer" scope="global" protected=true />
   </div>
</@>
