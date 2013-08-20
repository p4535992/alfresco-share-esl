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
<#assign el=args.htmlid?html>
<div id="${el}-form-title"></div>
<div class="editReplyForm">
   <div id="${el}-replyto" class="replyTo hidden">
   </div>
   
   <div class="editReply">
      <form id="${el}-form" name="replyForm" method="POST" action="">
         <div class='eslInline'>
                  <#import "/org/alfresco/components/enhanced-security/enhanced-security.lib.ftl" as esl/>
                  <@esl.renderESL htmlid=args.htmlid ogColumns=10 yuiGridType="gf"/>
       </div>
         <div>
            <input type="hidden" id="${el}-site"name="site" value="" />
            <input type="hidden" id="${el}-container"name="container" value="" />
            <input type="hidden" id="${el}-page" name="page" value="discussions-topicview" />
            <textarea id="${el}-content" rows="8" cols="80" name="content" class="yuieditor"></textarea>
            <div class="nodeFormAction">
               <span class="eslSubmitContainer">
                  <input type="submit" id="${args.htmlid}-submit" />
               </span>
               <span class="eslSubmitForbiddenContainer yui-button yui-submit-button yui-button-disabled yui-submit-button-disabled" style="display:none;">
                  <button type="button" id="${args.htmlid}-esl-dummy-save-button" disabled="disabled">Create</button>
               </span>
               <input type="reset" id="${args.htmlid}-cancel"  value="${msg('action.cancel')}" />
            </div>
         </div>
      </form>
   </div>
</div>
