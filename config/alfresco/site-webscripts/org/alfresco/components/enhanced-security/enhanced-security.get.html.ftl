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