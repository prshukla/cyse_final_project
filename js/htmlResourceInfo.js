function htmlResourceInfo()
{
    this.jsresourcelist = null;
    this.cssResourcelist= null;
    this.inlinejsResource = null;
    
    this.createInstance = function(filename)
    {
        this.jsresourcelist= new Array();
        this.cssResourcelist = new Array();
        this.createResourceInfo(filename);
        this.openFile();
        return this;
    }
    
    this.deleteInstance = function()
    {
        if (this.jsresourcelist != null )
            delete this.jsresourcelist;
        if (this.cssResourcelist != null )
            delete this.cssResourcelist;
        this.deleteInstanceResource(); 
        
    }
    
    function writeContent( data, node)
    {
         node.initContent(data);
         node.parsecontent();
    }
    
    this.openFile = function()
    {
        var node = this;
         $.post("openfile.php",{name : this.filename}, function(data) {
            writeContent(data, node );
        } );      
    }
    
    this.parsecontent = function()
    {
        var state = new stack().createInstance();
        var regexleadingwhitespace = /^\s+|\s+$/g;
        var regexRemWhiteSpace = /[ \t]+|[ \t]+$/g;
        var content = this.fileContent;
        if(content.indexOf("\r\n") == -1 && content.indexOf("\n") != -1)
           content = content.replace(/\n/g,"\r\n");
        var linenumber = 0;
        var index = 0;
        var lineindex = content.indexOf("\r\n",index);
        while(lineindex != -1)
        {
            linenumber++;
            var linestring = content.substr (index, lineindex-index +1 );
            linestring = linestring.replace(regexleadingwhitespace,"");
            linestring = linestring.replace(/\t/g,"    ");
            var linestrNowhiteSpace = linestring.replace(regexRemWhiteSpace,"")
            var linestrNoWhiteSpace =linestring.replace("'","\"");
            // check if it is an empty line 
            if (linestring.length != 0)
            {
                
                var subindex = 0;
                var subindex2 = 0;
                while( subindex < linestring.length)
                {
                    // check if you are in the comment block
                    var st = state.getlastElem();
                    if (st != ""){
                        if (st == "comment")
                        {
                            subindex = linestring.indexOf("-->",subindex);
                            if(subindex == -1) {
                                subindex = linestring.length;
                            } else  {
                                subindex += ("-->").length;
                                state.getElement();
                            }
                        } else if (st == "DOCTYPE") {
                                subindex = linestring.indexOf(">",subindex);
                                if(subindex == -1) {
                                    subindex = linestring.length
                                } else {
                                    subindex += (">").length;
                                    state.getElement();
                                }
                            } else if (((subindex2 = linestring.indexOf(">"))!= -1) && (linestring.indexOf("<") == -1) ) {
                                subindex = subindex2;
                                if (st == "META")
                                {
                                   state.getElement();                                   
                                }
                                
                            }
                              
                    }
                    if (linestring[subindex] == "<") {
                        subindex++;    
                        
                        var taglength = linestring.indexOf (" ",subindex);    
                        if (taglength > linestring.indexOf(">",subindex))
                        {
                            taglength = linestring.indexOf(">",subindex);
                        } else if (taglength == -1) {
                            // tag doesn't have an attribute
                            taglength = linestring.indexOf(">",subindex);
                        }
                        var tag = linestring.substring(subindex,taglength);
                        tag = tag.toLowerCase();
                        subindex = subindex + taglength -1;
                        switch (tag)
                        {
                            case "!--" :
                            {
                                state.putElement("comment");
                                break;
                            }
                            case "!doctype" :
                            {
                                if ((subindex = linestring.indexOf(">")) == -1) {
                                    state.putElement("DOCTYPE");
                                    subindex = linestring.length;
                                }
                                break;
                            }    
                            case "html":
                            {
                                if ((subindex = linestring.indexOf(">")) == -1) {
                                    subindex = linestring.length;
                                    state.putElement("html incomplete");
                                }
                                else {
                                    subindex += 1;
                                    state.putElement("html");
                                }
                                break;
                            }
                            case "head":
                            {
                                if ((subindex = linestring.indexOf(">")) == -1) {
                                    state.putElement("head Incomplete")
                                    subindex = linestring.length;
                                } else { 
                                     subindex += 1; 
                                     state.putElement("head");
                                 }
                                 break;
                             }
                             case "script":
                             {
                                if (linestring.indexOf("</script>") != -1)
                                {
                                    var typeidx  = linestring.indexOf("type=",subindex);
                                    var srcidx = linestring.indexOf("src=",subindex);
                                    if(typeidx == -1 && srcidx == -1)
                                    {
                                        // may be this is online script file 
                                        state.putElement("script");
                                    }
                                    else
                                    {
                                        var isJavascript = false;
                                        if (typeidx  != -1)
                                        {
                                            typeidx = linestrNowhiteSpace.indexOf("type=") ;
                                            if(typeidx != -1 )
                                            {
                                                typeidx  += ("type=").length;
                                                if(linestrNoWhiteSpace.indexOf("text/javascript",typeidx) != -1)
                                                    isJavascript = true;
                                            }
                                        }
                                        if(isJavascript == true && srcidx != -1)
                                        {
                                            srcidx = linestrNowhiteSpace.indexOf("src=");
                                            if(srcidx != -1)
                                            {
                                                srcidx += ("src=").length;
                                                var endidx = linestrNoWhiteSpace.indexOf(".js",srcidx);
                                                var filename = linestrNoWhiteSpace.substring(srcidx+3,endidx +3);
                                                this.jsresourcelist[this.jsresourcelist.length] = filename;
                                            }
                                        }
                                        subindex = linestring.length;
                                     }
                                     
                                }
                                else
                                {
                                    var typeidx  = linestring.indexOf("type=",subindex);
                                    var srcidx = linestring.indexOf("src=",subindex);
                                }
                             }
                             break;
                             case "link" :
                             {  
                                  if ((linestring.indexOf("/>",subindex))!= -1) {
                                      subindex = linestring.indexOf(" ",subindex);
                                      // go through each attribute in the list
                                      var filename;
                                      var istypecss = false;
                                      while(subindex != -1) {
                                          
                                           subindex++;
                                           endidx = linestring.indexOf("=",subindex );
                                           if(endidx != -1) {
                                               var attr = linestring.substring(subindex,endidx);
                                               attr = attr.toLowerCase();
                                               subindex = linestring.indexOf(" ",endidx)
                                               if (attr == "href"){
                                                   filename = linestring.substring(endidx+2, subindex-1);
                                               } else if (attr == "rel") {                                                       
                                                   var val = linestring.substring(endidx+2, subindex-1);
                                                   val = val.toLowerCase()
                                                   if (val.indexOf("stylesheet") != -1)
                                                       istypecss = true;
                                               }
                                           }
                                           else 
                                                subindex = endidx;
                                            
                                      }
                                      if(istypecss)
                                          this.cssResourcelist.push(filename);
                                  }
                                  subindex = linestring.length; 
                             }
                             break;
                             case "title" :
                             {
                                if ((subindex = linestring.indexOf("</"))!= -1)
                                {
                                    var startidx = linestring.indexOf(">") + 1;
                                    projectName = linestring.substring(startidx,subindex);
                                }
                                subindex = linestring.length;
                             }
                             break;
                             case "meta":
                             {
                                if ((subindex == linestring.indexOf("/>")) == -1) {
                                     subindex = linestring.length;
                                     state.putElement("META");
                                 }    
                                 else
                                     subindex += 2;                   
                             }
                             break;
                             default:
                                 subindex = linestring.length;
                                 break;
                         }
                    }
                    subindex++;
                }
            }   
            index = lineindex +2; 
            lineindex = content.indexOf("\r\n",index);
        }
        this.toJason();
        browse_resources();
    }
    
    this.toJason = function()
    {
        var jason = '{"file" :' +  this.filename + ", ";
        jason +=  '{"Resource" : [';
        for (i =0; i < this.jsresourcelist.length; i++) {
            create_js_browse_info(this.jsresourcelist[i]);
            jason += '{ "name" :' + this.jsresourcelist[i] + ", ";
            jason += '"type" :javascript},';        
        }
        for (i =0; i < this.cssResourcelist.length; i++) {
            create_css_browse_info(this.cssResourcelist[i]);
            jason += '{ "name" :' + this.cssResourcelist[i] + ", ";
            jason += '"type" :stylesheet},';   
        }
        jason = jason.substring(0,jason.length - 1)
        jason += ']}';
        alert(jason);
    }
    
}

htmlResourceInfo.prototype = new resourceInfo;
