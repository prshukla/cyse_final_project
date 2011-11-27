var g_cwd_path = "";
var g_node_graph_obj = null;
var g_res_js_list = null;
var g_res_png_list = null;
var g_res_html_list = null;
var g_res_php_list = null;
var g_res_css_list = null;
var projectName = "";


$(function(){
g_node_graph_obj = new NodeGraph();

$("#file_open").hide();
$("#save_file").hide();
$('#browse_info').hide();

  // consider moving to NodeGraph
  $("#canvas").mouseup(function(e){
      if (g_node_graph_obj != null)
      {
        var children = $(e.target).children();
        if (children.length > 0){
            var type = children[0].tagName;
            if (type == "desc" || type == "SPAN"){
                g_node_graph_obj.addNodeAtMouse();
            }
        }
      }
      
  });
  
//var opentag = $("#open");
// open the open file dialog box
$("#open").click(function(event){
    if (g_node_graph_obj != null)
        g_node_graph_obj.clearAll();
    $("#save_file").hide();
    $("#file_open").show();
    $('#browse_info').hide();
    var fileList =  $("#files");
    fileList.html("<div>loading...<\/div>");
    fileList.load("files.php?");   
    
});
// open the save dialog box
$("#save").click(function(event){
    $('#file_open').hide();
    $("#save_file").show();
    
});

$("#new").click(function(event){
    if (g_cwd_path == "")
        alert("Please enter the working directory");
    else
    {
        if (g_node_graph_obj != null)
            g_node_graph_obj.clearAll();
        else
            g_node_graph_obj = new NodeGraph();
        $('#file_open').hide();
        $("#save_file").hide();
        $('#browse_info').show();
       
    }
});

  $("#cwd_form").submit(function(e){
    e.preventDefault();
    savecwd();
  });

  var nameMessage = "Enter your current working directory";
  var current = $("#cwd").val(nameMessage);

  current.focus(function(){
    if ($(this).val() == nameMessage){
      $(this).val("");
    }
  }).blur(function(){
    if ($(this).val() == ""){
      $(this).val(nameMessage);
    }
  });
  
function savecwd(){
    var name = current.val();
    if (name == "" || name == nameMessage){
      alert("Please Name Your current working directory");
      current[0].focus();
      return;
    }
    var index = name.indexOf("\\",name.length - 1 );
    if (index == -1)
        name += "\\";
    g_cwd_path = name;
    alert ("The current working directory has been set to " + g_cwd_path);

}


$(".file").live('click', function() {
    var name = $(this).text();
    $.getJSON(name, {n:Math.random()}, function(data){
        if(g_node_graph_obj == null)
            g_node_graph_obj = new NodeGraph();
       g_node_graph_obj.fromJSON(data);
       build_resource_info(data);
    });
    $("#file_open").hide();
    $('#browse_info').show();
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });

});

function save_prj_file()
{
    if (g_cwd_path == "")
    {
        alert("please enter the current working directory")
    }
    else
    {
        var filepath = document.save_project_file.save_file_txt_box.value;
        var idx = filepath.indexOf(".json");
        if (idx == -1)
        {
            alert("incorrect project file");
        }
        else
        {
            $('#save_file').hide();
           
            var filename = "json/" + filepath;
            var jsoninfo = "";
            rem_file_nodes();
            if(g_node_graph_obj != null)
                jsoninfo = g_node_graph_obj.toJSON();  
            if (g_res_html_list != null ) {
                jsoninfo = jsoninfo.substring(0,jsoninfo.length -1);
                jsoninfo +=",";
                jsoninfo +=  '"Resource" : [';
               for (i in g_res_html_list) {
                   this.json += '{ "name" : "' + g_res_html_list.filename + '", ';
                   this.json += '"type" : "html" },';  
                   jsoninfo +=  g_res_html_list[i].json;
               }
               jsoninfo +=  ']}';
            }
            $.post("save.php",{"name" : filename, "data" : jsoninfo}, function(data){
                alert(data);
            });
        }
    }    
}
// 
// This function takes care of the resource info 
// 
function browse_resources()
{   
    // first create the resources box
    $("#browse_info").css({"height":"200px"}); 
    // Then create the exand button
    if (projectName == null)
    {
        projectName = ' Project';
    }
    var prjExpandTag = '<a id="expand" href="#" > <img  src="images/expand.png"><span class="project_name">' + projectName + 
        '</span> </a>' ;
    var prjCollapseTag = '<a id="collapse" href="#" class="project_name"> <img  src="images/contract.png"><span class="project_name ">' +  projectName + 
        '</span> </a>' ;
        
    $(prjExpandTag).insertAfter("#res");
    
    $("#expand").click(function(event){
        $("#expand").hide();
        $(prjCollapseTag).insertAfter("#res");
        var filelist = '$( <div id="res_list">)';
        $(filelist).insertAfter("#collapse");
        var res_list = $("#res_list");
        var count = 0;
        var len = g_cwd_path.length
        if( g_res_html_list != null) {
            for (i = 0 ; i < g_res_html_list.length ; i++) {

                var file_name = g_res_html_list[i].filename.substring(len,g_res_html_list[i].filename.length );
                var filetag = '<div class =file_ref>' +  file_name + '</div>';

                res_list.append(filetag);
                if (count++ > 5) {
                    var height = $("#browse_info").height() + 16 ;
                    var height_txt = height + 'px';
                    $("#browse_info").css({"height":height_txt}); 
                }           
            }
        }
        if (g_res_js_list != null) {
            for(i =0; i < g_res_js_list.length ; i++){
                var file_name = g_res_js_list[i].filename.substring(len,g_res_js_list[i].filename.length);

                var filetag = '<div class =file_ref>' +  file_name + '</div>'; 
                res_list.append(filetag);
                if (count++ > 5) {
                    var height = $("#browse_info").height() + 16 ;
                    var height_txt = height + 'px';
                    $("#browse_info").css({"height":height_txt}); 
                }           
            }
        }
        if(g_res_css_list != null) {
            for(i =0; i < g_res_css_list.length ; i++){
                var file_name = g_res_css_list[i].filename.substring(len,g_res_css_list[i].filename.length);

                var filetag = '<div class =file_ref>' +  file_name + '</div>'; 
                res_list.append(filetag);
                if (count++ > 5) {
                    var height = $("#browse_info").height() + 16 ;
                    var height_txt = height + 'px';
                    $("#browse_info").css({"height":height_txt}); 
                }           
            }
        }    
        $(".file_ref").live('click',function() {
            var filename = $(this).text();
            filename = g_cwd_path + filename;    
            for (i in g_res_js_list) {
                    if (g_res_js_list[i].filename == filename)
                        g_res_js_list[i].showNode();
            }          
            for (i in g_res_html_list) {
                if(g_res_html_list[i].filename == filename) {
                        g_res_html_list[i].showNode();
                }
                    
            }
            for (i in g_res_css_list) {
                if (g_res_css_list[i].filename == filename)
                    g_res_css_list[i].showNode();           
            }
                      
        });
        
        $("#collapse").click(function(event){           
        $('#res_list').remove(); 
        $("#browse_info").css({"height":"200px"}); 
        $("#collapse").hide();
        $("#expand").show();
    });

    });
}

function scan_cwd(filetype)
{
    if (g_cwd_path == "") {
        alert("please enter the current working directory")
    } else {
        if (g_res_html_list != null ) {

            while(g_res_html_list.length > 0) {
                var html_res = g_res_html_list.pop();
                html_res.deleteInstance();
            }
            delete g_res_html_list;
        }
        if (g_res_js_list != null ) {
            while(g_res_js_list.length >0) {
               var js_res = g_res_js_list.pop();
               js_res.deleteInstance();
            }

            delete g_res_js_list;
        }
        
        if(g_res_css_list != null) {
            while (g_res_css_list.length > 0 ) {
               var css_res = g_res_css_list.pop();
               css_res.deleteInstance();                
            }
            delete g_res_css_list;
        }
        // list all the files in the cwd
        $.post("scandir.php",{"name" : g_cwd_path, "isdir" : false}, function(data){

            var file_list = new Array();
            file_list = data.split("<br>");
            $("#file_open").hide();
            $('#browse_info').show();
            $('#res_list').remove();
            $("#expand").remove();
            $("#collapse").remove();

            if (g_node_graph_obj == null)
                g_node_graph_obj = new NodeGraph(); 
                   
            // open the html files and determine the list of js file
            for (i = 0; i < file_list.length; i++) {
                var file_name = file_list[i];
                // only process
                if (file_name.indexOf(".html") != -1) {
                    file_name = g_cwd_path + file_name;
                    if(g_res_html_list ==  null) {
                        g_res_html_list = new Array;
                    }
                    g_res_html_list[g_res_html_list.length] = new htmlResourceInfo().createInstance(file_name,true);
                }             
             }
        });
    }
}

function create_js_browse_info(filename)
{
    filename = g_cwd_path + filename;
    if (g_res_js_list == null) 
        g_res_js_list = new Array;
     g_res_js_list[g_res_js_list.length] = new jsResourceInfo().createInstance(filename,true);   
}

function create_css_browse_info(filename)
{
    filename = g_cwd_path + filename;
    if(g_res_css_list == null)
        g_res_css_list = new Array();
    g_res_css_list.push(new cssResourseInfo().createInstance(filename,true));
}

var g_class_hierarcy_arry = new Array();

function build_class_hierarcy()
{
   for (i = 0; i < g_res_js_list.length ; i++)
   {
       var js_res = g_res_js_list[i];
       if (js_res.classInfoarry != null)
           for (j in js_res.classInfoarry) {
               var classinfo = new class_hierarcy().createInstance(js_res.classInfoarry[j].classname, js_res.classInfoarry[j].superclassname);
               classinfo.createNode();
               
                for (k in js_res.classInfoarry[j].compositioninfo) {
                    classinfo.composition.push(js_res.classInfoarry[j].compositioninfo[k].classname);
                }
               g_class_hierarcy_arry.push(classinfo);
               
               var str =  js_res.classInfoarry[j].get_class_details();
               
               classinfo.node.addText(str);
           }
       
   }
    
   for (i in g_class_hierarcy_arry) {
       if (g_class_hierarcy_arry[i].superclass != null && g_class_hierarcy_arry[i].superclass.length != 0) {
           for (j in g_class_hierarcy_arry)
               if (g_class_hierarcy_arry[i].superclass == g_class_hierarcy_arry[j].name) {
                   g_class_hierarcy_arry[i].superclassnode = g_class_hierarcy_arry[j].node;
                   g_class_hierarcy_arry[j].node.nodeConnect("bottom",g_class_hierarcy_arry[i].node, "top");
                   break;
               }               
       } 
       for ( k in g_class_hierarcy_arry[i].composition) {
           if (g_class_hierarcy_arry[i].composition != null && g_class_hierarcy_arry[i].composition.length != 0) {
               var matchfound = false;
               for (l in g_class_hierarcy_arry) {
                   if (g_class_hierarcy_arry[i].composition[k] == g_class_hierarcy_arry[l].name) {
                       matchfound = true;
                       g_class_hierarcy_arry[i].node.nodeConnect("right", g_class_hierarcy_arry[l].node ,"left");
                       break;
                   }
               }
           }    
       }
   }
   
   
   
   //for (i in g_class_hierarcy_arry) {
       
   //}
   
}

function build_resource_info (data)
{
    for (var i in data.Resource) {
        var fileinfo = data.Resource[i]
        if (fileinfo.type = "javascript") {
            if (g_res_js_list == null) 
                g_res_js_list = new Array;
             g_res_js_list.push(new jsResourceInfo().createInstance(fileinfo.name,false)); 
        }else if (fileinfo.type = "html") {
                if(g_res_html_list ==  null) 
                    g_res_html_list = new Array;
             g_res_html_list.push(new jsResourceInfo().createInstance(fileinfo.name,false)); 
        }else if (fileinfo.type = "stylesheet") {
            if (g_res_css_list = null)
                g_res_css_list = new Array();
            g_res_css_list.push(new cssResourseInfo().createInstance(fileinfo.name,false));
        }
            
    }
    browse_resources();
}

function class_hierarcy()
{
   this.name = "";
   this.superclass = "";
   this.node = null;
   this.superclassnode = null;
   this.composition = new Array();
   this.createInstance = function(classname , superclass)
   {
       this.name = classname;
       this.superclass = superclass;
       return this;
   }
   
  
   this.createNode = function() {
             var x = g_node_graph_obj.get_x();
             var y = g_node_graph_obj.get_y();
            this.node = g_node_graph_obj.addNode(x,y,200,100,false,this.name);  
   }
   
}

function rem_file_nodes()
{
    if (g_res_html_list != null ) {
       for (i in g_res_html_list) {
           var html_res = g_res_html_list[i];
           html_res.close_node();
       }
   }
   if (g_res_js_list != null ) {
       for (i in g_res_js_list) {
           var js_res = g_res_js_list[i];
           js_res.close_node();
       }
   }
   if(g_res_css_list != null) {
        for (i in g_res_css_list) {
         var css_res = g_res_css_list[i];
         css_res.close_node();                
      }
   }   
}

function save_file(filename,text)
{
    $.post("save.php",{"name" : filename, "data" : text}, function(data){
                alert(data);
            });
}
