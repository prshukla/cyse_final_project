function jsResourceInfo()
{
    this.classInfoarry = null;
    this.variables = null;
    this.text = null;
    
    this.createInstance = function(filename)
    {
        this.classInfoarry = new Array();
        this.createResourceInfo(filename);
        this.openFile();
        return this;
    }
    
    function writeContent (data, node)
    {
        node.initContent(data);
        // the contents
        node.createClassView();
        
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
       var index = 0;
       var linenumber  = 0;
       var content = this.fileContent;
       var lineindex = content.indexOf("\r\n",index);
       var regexpcharSearch = /\w/g;
       var regexRemWhiteSpace = /[ \t]+|[ \t]+$/g;
       while (lineindex != -1)
       {        
          linenumber++;
          var linestring = content.substr(index,lineindex - index + 1);
          var linestring_with_whitespace = linestring;
          linestring = linestring.replace(regexRemWhiteSpace,"");
          var substringindex = 0;
          while (substringindex < linestring.length )
          {
              
              if( ( (substringindex = linestring.indexOf("/*")) != -1)) {
                  if (substringindex == 0) {
                      // comment block 
                      state.putElement("comment");
                      break;
                  } else {
                      var linestring = linestring.substring(0,substringindex);
                      if (linestring.match(regexpcharSearch).length == 0)
                           state.putElement("comment");
                  }
                  
              } else {
                  if ( ( (state.getlastElem()) == "comment"))  {
                       if (linestring.indexOf("*/") != -1) {    
                            state.getElement("comment");
                       }
                       break;
                  } else {
                      // there may be still some comments in the code
                      if ((substringindex = linestring.indexOf("//")) != -1) {
                           if (substringindex > 0) {
                               linestring = linestring.substring(0,substringindex );
                               if (linestring.match(regexpcharSearch).length == 0)
                                    break;                           
                           }
                           else
                               break;
                      }    
                      // this actual code line
                      if ( (substringindex = linestring.indexOf("function")) != -1)  {
                          if (substringindex == 0 ) {
                              var funcstr = "function";
                              var funcname = linestring.substring(funcstr.length,linestring.length -3);
                              state.putElement("CLASS");
                              var matchfound =  false;
                              for (i in this.classInfoarry) {
                                if (this.classInfoarry[i].classname == funcname)  
                                matchfound = true;
                              }
                              if (matchfound == false)
                                this.classInfoarry[this.classInfoarry.length]= new classInfo().createInstance(funcname,linenumber);
                          } else {
                              if ((substringindex = linestring.indexOf("=function(")) != -1 ) {
                                  var superclass;
                                  var methodname = linestring.replace("=function","");
                                  if (linestring.indexOf("this.") != -1)
                                     methodname = methodname.replace("this.","");
                                  else {
                                      superclass = methodname.substring(0,linestring.indexOf("."))
                                      methodname = methodname.substring(superclass.length + (".prototype.").length ,methodname.length -1 );
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
                          if (linestring.indexOf("}") != -1) {
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
                          if (linestring.indexOf("{") != -1)  {
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
                                 if ((linestring_with_whitespace.indexOf("var")) != -1) {
                                     if ((linestring.indexOf("var")) ==0 ) {
                                         var idxvar = linestring.indexOf("var") + ("var").length;
                                         var endidx = linestring.indexOf("=");
                                         var variablename = linestring.substring(idxvar,endidx);
                                         idxvar = linestring.indexOf("new") + ("new").length;
                                         endidx = linestring.indexOf("(")
                                         if (endidx == -1)
                                             endidx = linestring.length -2;
                                         var classname = linestring.substring(idxvar,endidx);
                                         alert ("composition " + classname + " " + variablename)
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
                                         var classname = linestring.substring(idxvar,endidx);
                                         alert("composition " + classname + " " + variablename);
                                     }   
                                 } else {
                                     
                                 }
                                 
                                 
                              }
                          }                          
                      }
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
        var str = "File Name: " + this.filename + "\n\n";
        
        for (i = 0; i < this.classInfoarry.length ; i++ )
        {
            
            str += (this.classInfoarry[i].declarationLine +" " + this.classInfoarry[i].classname  + "\n");
            for (j = 0; j < this.classInfoarry[i].methodinfo.length ; j++)
            {
                str += (this.classInfoarry[i].methodinfo[j].methoddeclaration + " " + 
                    this.classInfoarry[i].methodinfo[j].methodname + "\n");
                str += (" end " + this.classInfoarry[i].methodinfo[j].methodendline + " " + 
                    this.classInfoarry[i].methodinfo[j].methodname + "\n");
             }
             str += ("End Class "+this.classInfoarry[i].endline +" " + this.classInfoarry[i].classname  + "\n");
        }
        alert(str)
    }
}

jsResourceInfo.prototype = new resourceInfo;

function classInfo()
{
    this.superclassname;
    this.classname;
    this.declarationLine = 0 ;
    this.endline = 0;
    this.methodinfo;
    this.variableinfo;
    
    this.createInstance = function(name, linenumber)
    {
        this.classname = name;
        this.declarationLine = linenumber;  
        this.methodinfo = new Array;
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
        this.methodinfo[this.methodinfo.length -1].setEndline(linenumber);
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

function variableInfo (name)
{
    this.modifiedAt = null;
    this.isdeclared = false;
}

function compositionInfo ()
{
   this.classname;
   this.variablename;
   this.linedecleration;
   this.variablemodified;
   
   this.createinstance =function(variablename, classname, linenumber)
   {
       this.classname = classname;
       this.linedecleration = linenumber;
       this.variablename = variablename;
       this.variablemodified = new Array();
   }
   
   this.setvariablemodifie =function(linenumber)
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
        //this.stackArray.pop();
        this.numelem--;
        return val;
    }
    
    this.getlastElem = function()
    {
        return this.stackArray[this.numelem -1];
    }
    
}