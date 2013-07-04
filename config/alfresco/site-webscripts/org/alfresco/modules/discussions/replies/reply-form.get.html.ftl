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