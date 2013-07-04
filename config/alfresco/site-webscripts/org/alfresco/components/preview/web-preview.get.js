<import resource="classpath:/alfresco/site-webscripts/org/alfresco/components/enhanced-security/lib/enhanced-security.lib.js">

/**
 * Main entry point for component webscript logic
 *
 * @method main
 */
function main()
{
   // Check mandatory parameters
   var nodeRef = args.nodeRef;
   if (nodeRef == null || nodeRef.length == 0)
   {
      status.code = 400;
      status.message = "Parameter 'nodeRef' is missing.";
      status.redirect = true;
   }

   // Call repo for node's metadata
   var json = remote.call("/api/metadata?nodeRef=" + nodeRef);
   if (json != null && json.toString().trim().length() > 2)
   {
      var node = {},
         n = eval('(' + json + ')');
         mcns = "{http://www.alfresco.org/model/content/1.0}",
         content = n.properties[mcns + "content"];

      // Call repo for available previews
      json = remote.call("/api/node/" + nodeRef.replace(":/", "") + "/content/thumbnaildefinitions");
      var previews =  eval('(' + json + ')');

      node.nodeRef = nodeRef;
      node.name = n.properties[mcns + "name"];
      node.icon = "/components/images/generic-file-32.png";
      node.mimeType = n.mimetype;
      node.previews = previews;
      
      var eslNS="{http://www.alfresco.org/model/enhancedSecurity/0.3}";
      var eslNod=n.properties[eslNS + "nod"];
      var eslPM=n.properties[eslNS + "pm"];
      var eslFreeFormCaveats=n.properties[eslNS + "freeFormCaveats"];
      var eslClosed = new Array();
      eslClosed = n.properties[eslNS + "closedMarkings"];
      var seperatedClosed = seperateAtomalFromClosedMarkings(eslClosed);
      eslClosed = seperatedClosed.closedMarkings;
      var eslAtomal = seperatedClosed.atomal;
      var eslOpen = new Array();
      eslOpen = n.properties[eslNS + "openMarkings"];
      var eslOrganisation = new Array();
      eslOrganisation = n.properties[eslNS + "organisations"];

      var eslEyes=n.properties[eslNS + "nationalityCaveats"];
      
      
      
      var closedStr="";
      if (eslClosed != null) {
        for ( var i=0; i < eslClosed.length; i++)
        {
          closedStr = closedStr + " ";
          closedStr = closedStr + eslClosed[i];
        }
      }

      var openStr="";
      if (eslOpen !=null) {
        for ( var i=0; i < eslOpen.length; i++)
        {
          openStr = openStr+" ";
          openStr = openStr+eslOpen[i];
        }
      }
      
      var orgStr="";
      if (eslOrganisation !=null) {
        for ( var i=0; i < eslOrganisation.length; i++)
        {
          orgStr = orgStr+" ";
          orgStr = orgStr+eslorg[i];
        }
      }
      
      
      
      if (eslNS !=null ) {
        model.eslNS=eslNS;
      }
      else {
        model.eslNS="";
      }
      if (eslNod != null ) {
        model.eslNod=eslNod;
      }
      else {
        model.eslNod="";
      }
      if (eslPM != null ) {
        model.eslPM=eslPM;
      }
      else {
        model.eslPM="";
      }
      if (eslFreeFormCaveats !=null ) {
        model.eslFreeFormCaveats=eslFreeFormCaveats;
      }
      else {
        model.eslFreeFormCaveats="";
      }
      model.eslClosed=closedStr;
      model.eslOpen=openStr;
      model.eslOrganisation=orgStr;
      if (eslEyes !=null ) {
        model.eslEyes=eslEyes;
      }
      else {
        model.eslEyes="";
      }
      if (eslAtomal!=null) {
          model.eslAtomal=eslAtomal;
      }
      else {
          model.eslAtomal="";
      }
      
      if (content)
      {
         var size = content.substring(content.indexOf("size=") + 5);
         size = size.substring(0, size.indexOf("|"));
         node.size = size;
      }
      else
      {
         node.size = "0";
      }

      // Prepare the model
      model.node = node;
   }
}

// Start the webscript
main();