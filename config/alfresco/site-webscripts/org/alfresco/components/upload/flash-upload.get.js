<import resource="classpath:alfresco/site-webscripts/org/alfresco/components/enhanced-security/enhanced-security.get.js">
/**
 * Custom content types
 */
function getContentTypes()
{
   // TODO: Data webscript call to return list of available types
   var contentTypes = [
   {
      id: "cm:content",
      value: "cm_content"
   }];

   return contentTypes;
}

model.contentTypes = getContentTypes();