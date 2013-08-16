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
   new Alfresco.EnhancedSecurity("${args.htmlid}").setMessages(
      ${messages}
   );
//]]></script>

<div id="${args.htmlid}-eslDialog" class="enhanced-security">
   <div class="hd">
      <span id="${args.htmlid}-eslTitleSpan"></span>
   </div>
   <div class="bd">
      <fieldset>
         <#import "/org/alfresco/components/enhanced-security/enhanced-security.lib.ftl" as esl/>
         <@esl.renderESL htmlid=args.htmlid ogColumns=10 yuiGridType="gf"/>
         <div class="bdft">
            <input id="${args.htmlid}-eslSaveButton" type="button" value="${msg("button.save")}" tabindex="0" />
            <input id="${args.htmlid}-eslCancelButton" type="button" value="${msg("button.cancel")}" tabindex="0" />
         </div>
      </fieldset>
   </div>
</div>
