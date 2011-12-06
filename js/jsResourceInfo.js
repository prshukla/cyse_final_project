function jsResourceInfo()
{
    this.classInfoarry = null;
    this.globalVariables = null;
    this.nodeArray = null;
    
    this.createInstance = function(filename,open,id)
    {
        this.classInfoarry = new Array();
        this.globalVariables  = new Array();
        this.nodeArray = new Array();
        this.createResourceInfo(filename,open, id);
        if(open)
            this.openFile();
        return this;
    }
    
    
    this.deleteInstance = function()
    {
        if (this.classInfoarry != null) {
            while (this.classInfoarry.length > 0) {
                var res = this.classInfoarry.pop();
                res.deleteInstance();
            }
            delete this.classInfoarry;
        }
        if(this.globalVariables != null) {
            while (this.globalVariables.length > 0) {
                var varinfo = this.globalVariables.pop();
                //varinfo.deleteInstance();
            }
            delete this.globalVariables;
        }
        this.deleteInstanceResource();
    }
    function writeContent (data, node)
    {
        node.initContent(data);
        // the contents
        if(isfileAlib(node.filename) == false)
        {
            node.createClassView();
        }    
    }
    
    function isfileAlib(filename)
    {
        var islib = false;
        if (filename.indexOf("jquery") != -1)
            islib = true;
        if (filename.indexOf("raphael.js")  != -1)
            islib = true;
        if (filename.indexOf("prototype-1.6.0.3.js") != -1)
            islib = true;
        return islib;
    }
    this.openFile = function()
    {
        var node = this;
        $.post("openfile.php",{name : this.filename}, function(data) {
            writeContent(data, node );
        } );
    }

    this.createClassView = function()
    {
       var state = new stack().createInstance();
       var jqueryfunc = false;
       var index = 0;
       var linenumber  = 0;
       var content = this.fileContent;
       if(content.indexOf("\r\n") == -1 && content.indexOf("\n") != -1)
           content = content.replace(/\n/g,"\r\n");
       var lineindex = content.indexOf("\r\n",index);
       var reg_rem_line_cmt = new RegExp ("/\\*.*\\*/","g");
       var reg_rem_cmt= new RegExp("//.*", "g");
       var regexpcharSearch = /\w/g;
       var regexRemWhiteSpace = /[ \t]+|[ \t]+$/g;
       while (lineindex != -1)
       {        
          linenumber++;
          var linestring = content.substr(index,lineindex - index + 1);
          var linestring_with_whitespace = linestring;
          linestring = linestring.replace(regexRemWhiteSpace,"");         
          linestring = linestring.replace (reg_rem_cmt,"");
          linestring = linestring.replace (reg_rem_line_cmt,"")
          var substringindex = 0;
          while (substringindex < linestring.length )
          {
              var previousIndex = substringindex;
              if( ( (substringindex = linestring.indexOf("/*")) != -1)) {
                  if (substringindex == 0) {
                      // comment block 
                      state.putElement("comment");
                      substringindex = linestring.length;
                      break;
                  } else {
                      var linestring = linestring.substring(0,substringindex);
                      if (linestring.match(regexpcharSearch).length == 0)
                           state.putElement("comment");
                  }
                  
              } else {
                  if ( ( (state.getlastElem()) == "comment"))  {
                       if (linestring.indexOf("*/") != -1) {    
                            state.getElement();
                       }
                       break;
                  } else {
                      // there may be still some comments in the code
                      // should not happen as we removed all the comment from the line 
                      if ((substringindex = linestring.indexOf("//")) != -1) {
                           if (substringindex > 0) {
                               linestring = linestring.substring(0,substringindex );
                               if (linestring.match(regexpcharSearch).length == 0)
                                    break;                           
                           }
                           else
                               break;
                      }    
                      if ( (((substringindex = linestring.indexOf("$")) != -1) && (substringindex == 0)) ||
                                 (jqueryfunc == true))  {
                             if (jqueryfunc == false) {     
                                    state.putElement("JQUERY");
                                    jqueryfunc = true;
                             }
                             while(substringindex < linestring.length)
                             {
                                 switch (linestring.charAt(substringindex++))
                                 {
                                     case "(":
                                         state.putElement("(");
                                         break;
                                     case "{":
                                         state.putElement("{");
                                         break;
                                     case "}":
                                          state.getElement();
                                          if (state.getlastElem() == 'JQUERY')
                                          {
                                              
                                          }
                                          break;
                                      case ")":
                                          state.getElement();
                                          if (state.getlastElem() == 'JQUERY')
                                              if (linestring.charAt(substringindex) == ";" )
                                              {
                                                  jqueryfunc = false;
                                                  state.getElement();
                                              }
                                       break;
                                       default:
                                           break;
                                           
                                    }
                                    if(jqueryfunc == false)
                                        break;
                                 
                             }
                             previousIndex = substringindex;
                      }
                      
                      // this actual code line
                      if ( (substringindex = linestring.indexOf("function",previousIndex)) != -1 && linestring.indexOf("document.",previousIndex) == -1)  {
                          if (substringindex == 0 ) {
                              var funcstr = "function";
                              var substringindex = linestring.indexOf("(",funcstr.length);
                              var funcname = linestring.substring(funcstr.length,substringindex);
                              state.putElement("CLASS");
                              var matchfound =  false;
                              for (i in this.classInfoarry) {
                                if (this.classInfoarry[i].classname == funcname)  
                                matchfound = true;
                              }
                              if (matchfound == false)
                                this.classInfoarry[this.classInfoarry.length]= new classInfo().createInstance(funcname,linenumber);
                          } else {
                              if ((substringindex = linestring.indexOf("=function(",previousIndex)) != -1 ) {
                                  var superclass;
                                  var methodname = linestring.replace("=function","");
                                  if (linestring.indexOf("this.") != -1) {
                                     methodname = methodname.replace("this.","");
                                     var endidx = methodname.indexOf("(");
                                     methodname = methodname.substring(0,endidx);
                                     substringindex += "(=function()".length;
                                  } else {
                                      superclass = methodname.substring(0,linestring.indexOf("."))
                                      var methodnamelength = methodname.indexOf( "(", superclass.length + (".prototype.").length)
                                      methodname = methodname.substring(superclass.length + (".prototype.").length ,methodnamelength);
                                      substringindex += "(=function()".length;
                                  }
                                  if (superclass != null)  {
                                      var matchfound = false;
                                      for (i in this.classInfoarry) {
                                        if (this.classInfoarry[i].classname == superclass) {
                                            this.classInfoarry[this.classInfoarry.length -1].addmethod(methodname,linenumber);
                                            matchfound =true;
                                            break;
                                        }
                                      }
                                      if (matchfound == false ){             
                                            this.classInfoarry[this.classInfoarry.length]= new classInfo().createInstance(superclass,linenumber);
                                            this.classInfoarry[this.classInfoarry.length -1].addmethod(methodname,linenumber);
                                      }
                                      state.putElement("METHOD");
                                      
                                  }
                                  else 
                                  {
                                        this.classInfoarry[this.classInfoarry.length -1].addmethod(methodname,linenumber);
                                        state.putElement("METHOD");
                                  }
                              }
                          }
                         
                      } else  {
                          if ( (substringindex = linestring.indexOf("}", previousIndex)) != -1) {
                                var tempidx = linestring.indexOf("{", previousIndex);
                                if( tempidx == -1 || substringindex < tempidx)
                                { 
                                    var temp = state.getElement();
                                    var lastelem = state.getlastElem();
                                    if ( lastelem == "METHOD")
                                    {
                                         state.getElement();
                                        this.classInfoarry[this.classInfoarry.length -1].setmethodEndline(linenumber);
                                    }
                                    else if (lastelem == "CLASS")
                                    {
                                        state.getElement();
                                        this.classInfoarry[this.classInfoarry.length -1].setEndLine(linenumber);
                                    }
                                    
                                }
                                previousIndex = substringindex;
                                substringindex++;
                          }
                          if ((substringindex = linestring.indexOf("{", previousIndex)) != -1)  {
                              state.putElement("{");
                          }
                          if (linestring_with_whitespace.indexOf("new ") != -1){
                              if (linestring_with_whitespace.indexOf(".prototype") != -1) {
                                  var idx = linestring.indexOf(".prototype");
                                  var classname = linestring.substring(0,idx);
                                  
                                  idx = linestring.indexOf("new") + ("new").length;
                                  var superclassname = linestring.substring(idx, linestring.length -1);
                                  
                                  for (i in this.classInfoarry) {
                                      if (this.classInfoarry[i].classname == classname)
                                          this.classInfoarry[i].superclassname = superclassname; 
                                  }   
                              }
                              else {
                                 if ((linestring_with_whitespace.indexOf("var ")) != -1) {
                                     if ((linestring.indexOf("var")) ==0 ) {
                                         var idxvar = linestring.indexOf("var") + ("var").length;
                                         var endidx = linestring.indexOf("=");
                                         var variablename = linestring.substring(idxvar,endidx);
                                         idxvar = linestring.indexOf("new") + ("new").length;
                                         endidx = linestring.indexOf("(")
                                         if (endidx == -1)
                                             endidx = linestring.length -2;
                                         var classname = linestring.substring(idxvar,endidx);
                                         substringindex = endidx +1;
                                         if (this.classInfoarry.length != 0) 
                                         {
                                            this.classInfoarry[this.classInfoarry.length -1].addComposition(variablename,linenumber, classname); 
                                            //alert( "variable name = " + variablename + " linenumber " + linenumber + "class name " + classname);
                                         }
                                         else
                                         {
                                              this.globalVariables.push(new variableInfo().createInstance(variablename, linenumber));
                                              this.globalVariables[this.globalVariables.length -1].addComposition(variablename,linenumber, classname); 
                                             // alert( "variable name = " + variablename + " linenumber " + linenumber + "class name " + classname);
                                       
                                         }
                                         substringindex = linestring.length;
                                     }
                                 } else if (linestring_with_whitespace.indexOf("this.") != -1) {
                                     if (linestring.indexOf("this.") == 0) {
                                         var idxvar = linestring.indexOf("this.") + ("this.").length;
                                         var endidx = linestring.indexOf("=");
                                         var variablename = linestring. substring(idxvar,endidx);
                                         idxvar = linestring.indexOf("new") + ("new").length;
                                         endidx = linestring.indexOf("(");
                                         if (endidx == -1)
                                             endidx = linestring.length -2;
                                         substringindex = endidx + 1;
                                         var classname = linestring.substring(idxvar,endidx);
                                         this.classInfoarry[this.classInfoarry.length -1].addComposition(variablename,linenumber, classname); 
                                         //alert( "variable name = " + variablename + " linenumber " + linenumber + "class name " + classname);
                                       
                                         substringindex = linestring.length;   
                                     } else {
                                             var statidx = linestring.indexOf("new") + "new".length;
                                             var endidx = linestring.indexOf("(");
                                             var classname = linestring. substring(statidx,endidx);
                                             this.classInfoarry[this.classInfoarry.length -1].addComposition("",linenumber, classname);
                                             substringindex = linestring.length;                    
                                     } 
                                     
                                 } else {
                                     var statidx = linestring.indexOf("new") + "new".length;
                                     var endidx = linestring.indexOf("(");
                                     var classname = linestring. substring(statidx,endidx);
                                     this.classInfoarry[this.classInfoarry.length -1].addComposition("",linenumber, classname);
                                     substringindex = linestring.length;
                                 }
                                 
                                 
                              }

                          }
                          else
                          {
                              if (linestring.indexOf("var") == 0  && linestring_with_whitespace.indexOf("var ") != -1) {
                                  if (state.getlastElem()  == '')
                                  {
                                      var startindex = linestring.indexOf("var") + ("var").length;
                                      var endindex = linestring.indexOf("=");
                                      if(endindex == -1)
                                      {
                                          endindex = linestring.indexOf(";");
                                      }
                                      var variablename = linestring.substring(startindex,endindex);
                                      var variableclass = new variableInfo().createInstance(variablename,linenumber);
                                      this.globalVariables.push(variableclass);
                                      
                                  }
                              }
                                 
                          }
                              substringindex = linestring.length;
                      }
                      if (substringindex == -1)
                        substringindex = linestring.length;
                  }
              }
          }
          index = lineindex + 2;
          lineindex = content.indexOf("\r\n",index);
          if (lineindex == -1 && index < content.length)
          {
              
              lineindex = content.length -1;
          }
       }
       
       this.createNodeforClassView();
    }
    
    this.createNodeforClassView = function()
    {
        for (i = 0; i < this.classInfoarry.length ; i++ )
        {
            var str = (this.classInfoarry[i].declarationLine +" " + this.classInfoarry[i].classname  + "\n");
            //str +=  this.classInfoarry[i].superclassname +"\n";
            for (j = 0; j < this.classInfoarry[i].compositioninfo.length ; j++)
            {
                //str += (this.classInfoarry[i].methodinfo[j].methoddeclaration + " " + 
                 str += this.classInfoarry[i].compositioninfo[j].classname + "\n";
                //str += (" end " + this.classInfoarry[i].methodinfo[j].methodendline + " " + 
                //    this.classInfoarry[i].methodinfo[j].methodname + "\n");
             }
             //alert (str)
             //str += ("End Class "+this.classInfoarry[i].endline +" " + this.classInfoarry[i].classname  + "\n");            
        }
    }
     
    this.findInstance = function(varname) 
    {
        var linenum = "";
        var content = this.fileContent;
           if (!isfileAlib(this.filename)  || content.indexOf(varname) != -1)
           {
               
               var linenumber  = 0;
               
               var index = 0;
               if(content.indexOf("\r\n") == -1 && content.indexOf("\n") != -1)
                   content = content.replace(/\n/g,"\r\n");
               var lineindex = content.indexOf("\r\n",index);
               var reg_rem_line_cmt = new RegExp ("/\\*.*\\*/","g");
               var reg_rem_cmt= new RegExp("//.*", "g");
               var regexpcharSearch = /\w/g;
               var regexRemWhiteSpace = /[ \t]+|[ \t]+$/g;
               var regexleadingwhitespace = /^\s+|\s+$/g;
               while (lineindex != -1)
               {        
                  linenumber++;
                  var linestring = content.substr(index,lineindex - index + 1);
                  var linestring_with_whitespace = linestring;     
                  linestring_with_whitespace = linestring_with_whitespace.replace (reg_rem_cmt,"");
                  linestring_with_whitespace = linestring_with_whitespace.replace (reg_rem_line_cmt,"");
                  if ( linestring_with_whitespace.indexOf(varname) != -1)
                  {
                      linestring = linestring.replace(regexleadingwhitespace,"")
                      var str  = linenumber.toString() + "  " + linestring + "\n";
                      linenum += str;

                  }
                  index = lineindex+2; 
                  lineindex = content.indexOf("\r\n",index);
               }
           }
           
           return linenum;
        
    }
}

jsResourceInfo.prototype = new resourceInfo;

function classInfo()
{
    this.superclassname = "";
    this.classname;
    this.declarationLine = 0 ;
    this.endline = 0;
    this.methodinfo;
    this.variableinfo;
    this.compositioninfo;
    
    this.deleteInstance = function()
    {
        if (this.methodinfo  != null) {
            while(this.methodinfo.length > 0 )
                this.methodinfo.pop();
            delete this.methodinfo;
        }
        if (this.variableinfo  != null) {
            while(this.variableinfo.length >  0 )
                this.variableinfo.pop();
            delete this.variableinfo;
        }
        if (this.compositioninfo  != null) {
            while( this.compositioninfo.length > 0 )
                this.compositioninfo.pop();
            delete this.compositioninfo;
        }
        
    }
    
    this.createInstance = function(name, linenumber)
    {
        this.classname = name;
        this.declarationLine = linenumber;  
        this.methodinfo = new Array();
        this.compositioninfo = new Array();
        this.superclassname = "";
        return this;
    }
    
    this.setEndLine = function(endline)
    {
        this.endline = endline;
    }
    
    this.addmethod = function(name, linenumber)
    {
        this.methodinfo[this.methodinfo.length] = new methodInfo().createInstance(name,linenumber);       
    }
    
    this.setmethodEndline = function(linenumber)
    {
        if (this.methodinfo.length != 0)
          this.methodinfo[this.methodinfo.length -1].setEndline(linenumber);
    }
    
    this.addComposition = function(varname, linenumber, classname)
    {
        this.compositioninfo[this.compositioninfo.length] = new compositionInfo().createinstance(varname, linenumber, classname);
    }

    this.get_class_details = function() {
        var str = "Method\n";
        str += "---------------\n";
        for ( k in  this.methodinfo) {
            str += this.methodinfo[k].methoddeclaration + " - " + this.methodinfo[k].methodendline + " "
                        + this.methodinfo[k].methodname + "\n";
        }
        str += "---------------\n";
        return str;
    }
    
}

function methodInfo()
{
    this.methodname = null;
    this.methoddeclaration = null;
    this.methodendline = null;   
    
    this.createInstance = function(name, linenumber)
    {
        this.methodname = name;
        this.methoddeclaration = linenumber;
        return this;
    }
    
    this.setEndline = function(endline)
    {
        this.methodendline = endline; 
    }
    
}

function variableInfo ()
{
    this.modifiedAt;
    this.isdeclaredAt;
    this.name ="";
    
    this.createInstance = function(name, linenumber)
    {
        this.isdeclaredAt = linenumber;
        this.name = name;
        return this;
    }
}

function compositionInfo ()
{
   this.classname;
   this.variablename;
   this.linedecleration;
   this.variablemodified;
   
   this.createinstance =function(variablename,  linenumber, classname)
   {
       this.classname = classname;
       this.linedecleration = linenumber;
       this.variablename = variablename;
       this.variablemodified = new Array();
       return this;
   }
   
   this.getstr = function() {
       var str = "Composition Information\n";
       str += "---------------------\n";
       str += this.linedecleration  + " " + this.variablename;
       return str;
   }
   
   this.setvariablemodified =function(linenumber)
   {
       this.variablemodified[this.variablemodified.length] = linenumber;
   }
}

function stack()
{
    
    this.stackArray = null;
    this.numelem = 0;

    this.createInstance = function()
    {
        this.stackArray = new Array();
        return this;
    }
    this.putElement = function (elem)
    {
        this.stackArray[this.numelem] = elem;
        this.numelem++;     
    }
    
    this.getElement = function()
    {
        var val = this.stackArray[this.numelem -1];
        this.stackArray.pop();
        this.numelem--;
        return val;
    }
    
    this.getlastElem = function()
    {
        if (this.numelem == 0 )
            return "";
        else
            return this.stackArray[this.numelem -1];
    }
    
}