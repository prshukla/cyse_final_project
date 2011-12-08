var g_cwd_path = "";
var g_node_graph_obj = null;
var g_res_js_list = null;
var g_res_png_list = null;
var g_res_html_list = null;
var g_res_php_list = null;
var g_res_css_list = null;
var projectName = "";
var g_root_nodes = null;
var g_compostion_class_list = new Array();
var g_composition_info_class = new Array();
var g_view_height = 0;
var iscompositionpopulated = false;
var num_elem_per_level = new Array();
var g_global_variable_list = new Array();
var isglobalvarlist = false;
var isclasslist = false;
var g_class_list = new Array();
var g_class_hierarcy_arry = new Array();
var class_x = 1500;
var class_y = 50;
var class_max_y = 0;
var var_x = 600;
var var_y= 2000;
var var_inst_x = 250;
var var_inst_y = 2000;
var ylevel = 0;
var xlevel = 0;
var isloadcomplete = false;
var isClickingDisabled = true;
var percentage = 0;
var isresourcelist = false;

$(function(){
g_node_graph_obj = new NodeGraph();

$("#file_open").hide();
$("#save_file").hide();
$('#browse_info').hide();
$("#views").hide();

  // consider moving to NodeGraph
  $("#canvas").mouseup(function(e){
      if (g_node_graph_obj != null)
      {
        var children = $(e.target).children();
        if (children.length > 0){
            var type = children[0].tagName;
            if (type == "desc" || type == "SPAN"){
               if(isClickingDisabled == false) 
                    g_node_graph_obj.addNodeAtMouse();
            }
        }
      }
      
  });
  
 function init() {
     
        delete g_class_hierarcy_arry;
        g_class_hierarcy_arry = null;
        g_class_hierarcy_arry = new Array();
        delete g_class_list;     
        g_class_list =null;
        g_class_list = new Array();
        delete g_res_js_list ;
        g_res_js_list = null;
        delete g_res_png_list ;
        g_res_png_list = null;
        delete g_res_html_list ;
        g_res_html_list = null;
        delete g_res_php_list ;
        g_res_php_list = null;
        delete g_res_css_list ;
        g_res_css_list = null;
        delete g_compostion_class_list;
        delete g_global_variable_list;
        g_global_variable_list =null;
        g_global_variable_list = new Array();
        g_compostion_class_list = null;
        g_compostion_class_list = new Array();
        iscompositionpopulated = false;
        isglobalvarlist = false;
        isclasslist = false;
        class_x = 1500;
        class_y = 50;
        class_max_y = 0; 
        var_x = 600; 
        var_y= 2000;
        var_inst_x = 250;
        var_inst_y = 2000;
        isClickingDisabled = true;
        xlevel = 0;
        ylevel = 0;
        delete  num_elem_per_level;
        num_elem_per_level = new Array();
        g_cwd_path = "";
        $('#res_list').remove();
        $("#expand").remove();
        $("#collapse").remove();
         
 }
 
//var opentag = $("#open");
// open the open file dialog box
$("#open").click(function(event){
    
    init();
    if (g_node_graph_obj != null)
        g_node_graph_obj.clearAll();
    $("#save_file").hide();
    $("#file_open").show();
    $('#browse_info').hide();
    //$("#views").hide();
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

        init();
        isClickingDisabled = false;
        if (g_node_graph_obj != null)
            g_node_graph_obj.clearAll();
        else
            g_node_graph_obj = new NodeGraph();
        $('#file_open').hide();
        $("#save_file").hide();
        $('#browse_info').hide();
        $("#views").hide();
    
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
    if (name.indexOf("/") != -1) {
        // unix system
        var index = name.indexOf("/",name.length - 1 );
        if (index == -1)
            name += "/";
    }
    else
    {
        var index = name.indexOf("\\",name.length - 1 );
        if (index == -1)
            name += "\\";
    }
    $.post("check_dir.php",{"name" : name}, function(data){
        if (data.indexOf("true") ==0) {
                g_cwd_path = name;
                alert ("The current working directory has been set to " + g_cwd_path);
                scan_cwd("html");
        }else {

            alert("incorrect directory. Please enter the current working directory");
        }       
    });

}  
$(".view").live('click',function(){
     var name = $(this).text();
     // some clicks on composition display all the classes
     // that are declared in another class
     if (name == " Composition ") {
         $('#var_list').remove();
         isglobalvarlist = false 
         $('#class_list').remove();
         isclasslist = false;
         if (iscompositionpopulated == false && g_view_height != 0) {
                 var height_text = g_view_height + 'px';
                 $("#views").css({"height": height_text});
         } 
         if( iscompositionpopulated == false && g_compostion_class_list != null) {   
            var comp = $('#comp');
            var complist = '$( <div id="comp_list">)';
            $(complist).insertAfter("#comp");         
            var comp_list = $("#comp_list");
            g_view_height = $("#views").height();
            for (i = 0 ; i < g_compostion_class_list.length ; i++) {

                var filetag = '<div class =class_ref>' +  g_compostion_class_list[i].name + '</div>';

                comp_list.append(filetag);
                 var height_view = $("#views").height() + 20;
                 var height_view_txt = height_view +'px';
                 $("#views").css({"height": height_view_txt});
                 iscompositionpopulated = true;
            }      
         } else {
             iscompositionpopulated = false;
             $('#comp_list').remove();
             var height_text = g_view_height + 'px';
             $("#views").css({"height": height_text});
         }
         
        $(".class_ref").live("click",function (){
           var class_name = $(this).text();
           for (i in g_compostion_class_list) {
               if (g_compostion_class_list[i].name  == class_name) {
                   create_composition_class(g_compostion_class_list[i], i);
                   break;
               }
           }
        });
         
     } else if (name == " Variables "){
            if (isglobalvarlist == false && g_view_height != 0) {
                 $('#comp_list').remove();
                 iscompositionpopulated = false;
                $('#class_list').remove();
                isclasslist = false;
                 var height_text = g_view_height + 'px';
                 $("#views").css({"height": height_text});
            } 
            if( isglobalvarlist == false && g_global_variable_list != null) {   
            var varlist = '$( <div id="var_list">)';
            $(varlist).insertAfter("#vardiv");         
            var varlist = $("#var_list");
            g_view_height = $("#views").height();
            for (i = 0 ; i < g_global_variable_list.length ; i++) {

                var filetag = '<div class ="var_ref">' +  g_global_variable_list[i].name + '</div>';

                varlist.append(filetag);
                 var height_view = $("#views").height() + 20;
                 var height_view_txt = height_view +'px';
                 $("#views").css({"height": height_view_txt});
                 isglobalvarlist = true;
            }      
         } else {
             isglobalvarlist = false;
             $('#var_list').remove();
             var height_text = g_view_height + 'px';
             $("#views").css({"height": height_text});
         }
         $('.var_ref').live('click',function(){
           var var_name = $(this).text();
           for (i in g_global_variable_list) {
               if (g_global_variable_list[i].name  == var_name) {
                   g_global_variable_list[i].createNode();
                   break;
               }
           }             
         });    
     } else if (name == " Class hierarchy ") {
         $('#comp_list').remove();
         $('#var_list').remove();
         $('#class_list').remove();
         if( g_view_height != 0) {
             var height_text = g_view_height + 'px';
             $("#views").css({"height": height_text});
         }
         g_node_graph_obj.scrollToLocX(0);
         g_node_graph_obj.scrollToLocY(0);
     } else if (name =  " Classes/Methods ") {

           $('#var_list').remove();
           isglobalvarlist = false;

           $('#comp_list').remove();
           iscompositionpopulated = false;
           
           if (isclasslist == false && g_view_height != 0) {
                 $('#class_list').remove();
                 var height_text = g_view_height + 'px';
                 $("#views").css({"height": height_text});
            } 
            if( isclasslist == false && g_class_hierarcy_arry != null) {   
                var classlist = '$( <div id="class_list">)';
                $(classlist).insertAfter("#classview");         
                var classlist = $("#class_list");
                g_view_height = $("#views").height();
                for (i = 0 ; i < g_class_hierarcy_arry.length ; i++) {
                    var filetag = '<div class ="class_info">' +  g_class_hierarcy_arry[i].name + '</div>';
                    classlist.append(filetag);
                    var height_view = $("#views").height() + 20;
                    var height_view_txt = height_view +'px';
                    $("#views").css({"height": height_view_txt});
                    isclasslist = true;
                }      
             } else {
                isclasslist = false;
                $('#class_list').remove();
                var height_text = g_view_height + 'px';
                $("#views").css({"height": height_text});
            }
            $(".class_info").live("click",function (){
                var class_name = $(this).text();
                for (i in g_class_hierarcy_arry) {
                    if (g_class_hierarcy_arry[i].name  == class_name) {
                        g_class_hierarcy_arry[i]. create_class_information();
                        break;
                    }
                }
            });
     }
         
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });    

$(".file").live ('click', function() {
    var name = $(this).text();

    isloadcomplete = false;
     $(".file").css({"cursor":"wait"});  

    $.getJSON(name,  function(data){
        window.setTimeout(function(){LoadData(data);},10)
    });
    return false;

  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });

});

function LoadData(data){

    if(g_node_graph_obj == null)
        g_node_graph_obj = new NodeGraph();
    g_node_graph_obj.fromJSON(data);
    build_resource_info(data);
    isloadcomplete = true;

    $("#file_open").hide();
    $('#browse_info').show();
    $("#views").show();
}


function save_prj_file()
{
        var filepath = document.save_project_file.save_file_txt_box.value;
        var idx = filepath.indexOf(".json");
        if (idx == -1)
        {
            alert("incorrect project file");
        }
        else
        {
            $('#save_file').css({"cursor":"wait"});
            $('#save_file').hide();
           
            var filename = "json/" + filepath;
            var jsoninfo = "";
            //rem_file_nodes();
            save_node_process();
            save_class_composition();
            create_all_composition_class();
            var len = g_cwd_path.length;
            if(g_node_graph_obj != null)
                jsoninfo = g_node_graph_obj.toJSON();  
            if (g_res_html_list != null ) {
                jsoninfo = jsoninfo.substring(0,jsoninfo.length -1);
                jsoninfo +=",";
                jsoninfo +=  '"Resource" : [';
               for (i in g_res_html_list) {
                   var html_file_name = g_res_html_list[i].filename.substring(len,g_res_html_list[i].filename.length );
                   jsoninfo += '{ "name" : "' + html_file_name + '", ';
                   jsoninfo += '"project" :"' + projectName + '", ';
                   jsoninfo += '"id": ' + g_res_html_list[i].node.id + ', ';      
                   jsoninfo += '"type" : "html" },';  
                   jsoninfo +=  g_res_html_list[i].json;
               }
               jsoninfo +=  '],';
               jsoninfo += class_info_toJson();
               jsoninfo += ',';
               jsoninfo += class_composition_toJson();
               jsoninfo += ',';
               jsoninfo += global_variable_toJson();
               jsoninfo += "}";
            }


            $.post("save.php",{"name" : filename, "data" : jsoninfo}, function(data){
                alert(data);
            });
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
        var len = g_cwd_path.length;
        var filename;
        if( g_res_html_list != null) {
            for (i = 0 ; i < g_res_html_list.length ; i++) {
                filename = g_res_html_list[i].filename;
                if ( len > 0 && (filename.indexOf (g_cwd_path) != -1))    
                    filename = filename.substring(len,filename.length );
                var filetag = '<div class =file_ref>' +  filename + '</div>';

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
                filename = g_res_js_list[i].filename;
                if(len > 0 && (filename.indexOf (g_cwd_path) != -1)) 
                    filename = filename.substring(len,filename.length);
                var filetag = '<div class =file_ref>' +  filename + '</div>'; 
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
                filename = g_res_css_list[i].filename;
                if(len > 0 && (filename.indexOf (g_cwd_path) != -1)) 
                    filename =filename.substring(len,filename.length);

                var filetag = '<div class =file_ref>' +  filename + '</div>'; 
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
            //TODO
            //g_node_graph_obj.changeLocFile();
            for (i in g_res_js_list) {
                    if (g_res_js_list[i].filename == filename) {
                        g_res_js_list[i].showNode();
                        g_node_graph_obj.scrollToLocX(g_res_js_list[i].node.x() -250);
                        g_node_graph_obj.scrollToLocY(g_res_js_list[i].node.y() - 50);
                    }      
            }          
            for (i in g_res_html_list) {
                if(g_res_html_list[i].filename == filename) {
                       g_res_html_list[i].showNode();
                       g_node_graph_obj.scrollToLocX(g_res_html_list[i].node.x() -250);
                       g_node_graph_obj.scrollToLocY(g_res_html_list[i].node.y() -50);
                }
                    
            }
            for (i in g_res_css_list) {
                if (g_res_css_list[i].filename == filename) {
                    g_res_css_list[i].showNode(); 
                    g_node_graph_obj.scrollToLocX(g_res_css_list[i].node.x() -250);
                    g_node_graph_obj.scrollToLocY(g_res_css_list[i].node.y() -50);
                }    
            }
                      
        });
        
        $("#collapse").click(function(event){           
        $('#res_list').remove(); 
        $("#browse_info").css({"height":"200px"}); 
        $("#collapse").remove();
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
            $('#views').show();

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
     return g_res_js_list[g_res_js_list.length -1];
}

function create_css_browse_info(filename)
{
    filename = g_cwd_path + filename;
    if(g_res_css_list == null)
        g_res_css_list = new Array();
    g_res_css_list.push(new cssResourseInfo().createInstance(filename,true));
    return g_res_css_list[g_res_css_list.length -1 ];
}



function build_class_hierarcy()
{
   for (i = 0; i < g_res_js_list.length ; i++)
   {
       var js_res = g_res_js_list[i];
       if (js_res.classInfoarry != null)
           for (j in js_res.classInfoarry) {
               if (js_res.classInfoarry[j].classname !="") {
                   var classinfo = new class_hierarcy().createInstance(js_res.classInfoarry[j].classname, js_res.classInfoarry[j].superclassname,
                                                                            js_res.filename);

                    for (k in js_res.classInfoarry[j].compositioninfo) {
                        var classname = js_res.classInfoarry[j].compositioninfo[k].classname;
                        var compinfo = js_res.classInfoarry[j].compositioninfo[k].getstr();
                        var class_composition = new class_compositioninfo().createInstance(classname, compinfo);
                        classinfo.composition.push(class_composition);

                    }
                   g_class_hierarcy_arry.push(classinfo);

                   classinfo.methodinfo =  js_res.classInfoarry[j].get_class_details();
                   classinfo.methodlist = js_res.classInfoarry[j].methodinfo;
               }
           }
       
   }
   

   // This is the algorithm to determine class hierarchy
   for (i in g_class_hierarcy_arry) {
      if (g_class_hierarcy_arry[i].superclassname != null && g_class_hierarcy_arry[i].superclassname.length != 0) {
         for (j in g_class_hierarcy_arry) {
             if (g_class_hierarcy_arry[i].superclassname == g_class_hierarcy_arry[j].name) {
                  g_class_hierarcy_arry[i].superclass =  g_class_hierarcy_arry[j];
                  g_class_hierarcy_arry[j].subclass.push( g_class_hierarcy_arry[i]);
                  var node = g_root_nodes;
                  var found_super_class = false;
                  while (node != null) {
                      var nextnode = node.nextnode;
                      if (node.name == g_class_hierarcy_arry[i].name) {
                          // remove this entry
                          var prevnode = node.prevnode;
                         
                          prevnode.nextnode = nextnode;
                          nextnode.prevnode = prevnode;
                          delete node;
                          
                      }
                      else if (found_super_class == false && node.name == g_class_hierarcy_arry[i].superclassname ){
                          found_super_class = true;
                      }
                         
                      node = nextnode;
                  }
                 if (found_super_class == false && g_class_hierarcy_arry[j].superclass == null) {
                     var newnode= new link_list().createInstance(g_class_hierarcy_arry[j]);
                     if(g_root_nodes != null) {
                         g_root_nodes.prevnode = newnode;
                         newnode.nextnode = g_root_nodes;
                         g_root_nodes = newnode;
                     } else {
                         g_root_nodes = newnode;
                     }                        
                     
                 }
             }
         }
      }
   }
   connect_nodes();
   create_composition_list();
   create_global_variable_list();
  
}

  

function connect_nodes() {
    var level = 0;
    num_elem_per_level[0] = 1;
    var listnode = g_root_nodes;
    while(listnode != null) {
        var nodeptr = listnode.node;
        nodeptr.createNode(level);
        num_elem_per_level[level] += 1;
        level +=1;
        for (i in nodeptr.subclass) {
            create_node(nodeptr.subclass[i], level);
        }
        listnode = nodeptr.nextnode;
    }
 }

function create_node(node, level) {
        var templevel = level;
        if (num_elem_per_level.length == templevel)
            num_elem_per_level[templevel] = 0;
        num_elem_per_level[templevel] += 1;
        node.createNode(templevel);
        templevel++;
        for(i in node.subclass) {
            
            create_node(node.subclass[i],templevel);
        }
}

function build_resource_info (data)
{
    if (g_res_js_list != null) {
        delete g_res_js_list;
        g_res_js_list = null;
    }
    if (g_res_css_list != null) {
        delete g_res_css_list;
        g_res_css_list = null;
    }
    if(g_res_html_list !=  null) {
        delete g_res_html_list;
        g_res_html_list = null;
    }
         
    for (var i in data.Resource) {
        var fileinfo = data.Resource[i]
        if (fileinfo.type = "javascript") {
            projectName = fileinfo.project;
            if (g_res_js_list == null) 
                g_res_js_list = new Array();
             var tempjs = new jsResourceInfo().createInstance(fileinfo.name,false, fileinfo.id)
             g_res_js_list.push(tempjs); 
        }else if (fileinfo.type = "html") {
                if(g_res_html_list ==  null) 
                    g_res_html_list = new Array();
             g_res_html_list.push(new htmlResourceInfo().createInstance((fileinfo.name),false, fileinfo.id)); 
        }else if (fileinfo.type = "stylesheet") {
              if (g_res_css_list == null)
                g_res_css_list = new Array();
            g_res_css_list.push(new cssResourseInfo().createInstance(fileinfo.name,false));
        }
            
    }
    create_class_view(data);
    create_composition_view(data);
    create_global_variable_view(data);
    browse_resources();
}


function link_list()
{
    this.nextnode  = null; 
    this.prevnode = null;
    this.node = null;
    this.createInstance = function(m_node,m_prevnode, m_nextnode)
    {
        this.node = m_node;
        this.prevnode = m_prevnode;
        this.nextnode = m_nextnode;
        return this;
    }
    
}    

function create_composition_list() 
{
    for (i in g_class_hierarcy_arry){
        for (j in g_class_hierarcy_arry[i].composition) {
            if(g_class_hierarcy_arry[i].composition[j].name.length  > 1) {
            var matchfound = false
            for (k in g_compostion_class_list) {
                if (g_compostion_class_list[k].name  == g_class_hierarcy_arry[i].composition[j].name ){
                    // we already have an entry
                    matchfound = true;
                    var compinfo = new class_compositioninfo().createInstance(g_class_hierarcy_arry[i].name,  g_class_hierarcy_arry[i].composition[j].info);                   
                    g_compostion_class_list[k].compositionin.push(compinfo);
                    break;
                }
            }
            if (matchfound  == false) {
               
                var comp = new class_composition().createInstance(g_class_hierarcy_arry[i].composition[j].name);
                var temp = new class_compositioninfo().createInstance(g_class_hierarcy_arry[i].name,  g_class_hierarcy_arry[i].composition[j].info);
                 comp.compositionin.push(temp);
                g_compostion_class_list.push(comp);             
               
            }
        }      
      }
    }
}

function create_all_composition_class()
{
    for(i in g_compostion_class_list) {
        create_composition_class(g_compostion_class_list[i], i);
    }
}


function create_composition_class(obj ,level) {
   if (obj.node == null){ 
        obj.createNode(level);
   }
   g_node_graph_obj.scrollToLocX(obj.node.x() -250);
   g_node_graph_obj.scrollToLocY(obj.node.y() -50);
}


function class_composition() {
     this.name ="";
     this.compositionin = new Array();
     this.compositioninnode = new Array();
     this.node = null;

     this.createInstance = function(name){
         this.name = name;
         return this;
     }
     this.createNode = function(level) {
         var x = 4600;
         var y = 50 + (ylevel) * 180;
         if (y +  this.compositionin.length * (280)  > 8000 )
         {
             ylevel = 0;
             xlevel++;
             x = x - (300 * xlevel);
             y = 50;
         }

         this.node = g_node_graph_obj.addNode(x,y,200,100,false,this.name,false);
         
         for (i in this.compositionin)  {
             var childx = x - 300;
             var childy = 50 + (ylevel) * 180;
             var temp = g_node_graph_obj.addNode(childx,childy,200,100,false, this.compositionin[i].name,false);
             
             temp.addText(this.compositionin[i].info);
             this.compositioninnode.push(temp);
             temp.nodeConnect("right", this.node ,"left");  
             ylevel++;
         }    
     }
     
}


function create_composition_view(data) {
    if(g_compostion_class_list != null)
        delete g_compostion_class_list;
    g_compostion_class_list = new Array();
    for (i in data.class_composition ) {
            var temp = new class_composition().createInstance(data.class_composition[i].name,  "");
            temp.node = g_node_graph_obj.getNode(data.class_composition[i].id);
            
            g_compostion_class_list.push(temp);
    }
}

function create_class_view (data)  
{
    for (i in data.class_info ) {
            var temp = new class_hierarcy().createInstance(data.class_info[i].name,"",""); 
            temp.classinfonode =g_node_graph_obj.getNode( data.class_info[i].id);
            g_class_hierarcy_arry.push(temp);
    }
}

function save_class_composition(){
    for (i in g_class_hierarcy_arry) {
        g_class_hierarcy_arry[i].create_class_information();
     }
}

function class_info_toJson() {
     var json =  ' "class_info" : [' ;
     for (i in g_class_hierarcy_arry) {
       if( g_class_hierarcy_arry[i].classinfonode != null){  
       json += '{ "name" : "' + g_class_hierarcy_arry[i].name + '", ';
       json += ' "id" : ' + g_class_hierarcy_arry[i].classinfonode.id + '},';   
       } else
           alert(g_class_hierarcy_arry[i].name);
    } 

    json = json.substring(0,json.length - 1);
    json += ']';    
    return json; 
}

function class_composition_toJson() {
    var json =  ' "class_composition" : [' ;
    for (i in g_compostion_class_list) {
            if (g_compostion_class_list[i].name.length  > 1){
                json += '{ "name" : "' + g_compostion_class_list[i].name + '" , '; 
                json += ' "id" : ' + g_compostion_class_list[i].node.id + '},';
            }
    } 
    json = json.substring(0,json.length - 1);
    json += ']';    
    return json;        
}

function class_hierarcy()
{
    
   this.filename= "";
   this.name = "";
   this.superclassname = "";
   this.node = null;
   this.superclass = null;
   this.subclass = null;
   this.composition = new Array();
   this.methodinfo = "";
   this.methodlist = new Array();
   this.methodinfoArry = new Array();
   this.classinfonode = null;
   this.createInstance = function(classname , superclass,filename)
   {
       this.filename =filename;
       this.name = classname;
       this.superclassname = superclass;
       this.subclass = new Array();
       return this;
   }
   
  
   this.createNode = function(level) {
             
        var x = (num_elem_per_level[level] * 300) + 10;
        var y = (level * 180 ) + 50;
        this.node = g_node_graph_obj.addNode(x,y,200,100,false,this.name,false);
        this.node.addText(this.methodinfo);
        if (this.superclass != null)
            this.node.nodeConnect("top", this.superclass.node ,"bottom");    
             
   }
   this.create_class_information = function() {
       
       if (this.classinfonode == null){
           var x = class_x;
           var y = class_y;
           var x_child = 0;
           this.classinfonode = g_node_graph_obj.addNode(x,y,200,100,false,this.name,false);
           this.classinfonode.addText(this.methodinfo);
           for (i in this.methodlist) {
                var temp = new method_info().createInstance(this.methodlist[i].methodname);
                x_child = x + 500* i;
                temp.node = g_node_graph_obj.addNode(x_child ,y + 200 ,200,100,false,this.methodlist[i].methodname,false);
                temp.node.nodeConnect("top", this.classinfonode ,"bottom"); 
                this.methodinfoArry.push(temp);
                for(j in g_res_js_list) {
                    if (this.filename != g_res_js_list[j].filename) {
                        var linenum = g_res_js_list[j].findInstance(this.methodlist[i].methodname + "(");
                        if (linenum != "") {
                            var filename = g_res_js_list[j].filename.substring(g_cwd_path.length,g_res_js_list[j].filename.length );
                            var var_inst = new  var_instance_info().createInstance(filename,linenum);
                            temp.list.push(var_inst);
                        }
                    } 
                }
                for (k in temp.list) {
                    var temp_y = y + 200 + k *200;
                    if (temp_y > class_max_y)
                        class_max_y = temp_y ;
                    temp.list[k].node = g_node_graph_obj.addNode(x_child - 250 ,temp_y  ,200,100,false,temp.list[k].filename,false);
                    temp.list[k].node.addText(temp.list[k].linenum);
                    temp.node.nodeConnect("left", temp.list[k].node ,"right");
                }
           }
           
           class_x = x + 500*this.methodlist.length;
           if(class_x - 4000 < 500 || class_x > 4000)
           {
               class_x = 2000;
               class_y = class_max_y + 200;
               class_max_y = 0;
           }
            
       }
       g_node_graph_obj.scrollToLocX(this.classinfonode.x() - 250);
       g_node_graph_obj.scrollToLocY(this.classinfonode.y() - 250);
   }
}

function method_info() 
{
    this.name ;
    this.node = null;
    this.list = new Array();
    this.createInstance = function(name){
        this.name = name;
        return this;
    }
}



function class_compositioninfo()
{
    this.name = "";
    this.info = "";
    this.createInstance = function(name,variable) {
        this.name = name;
        this.info = variable; 
        return this;
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

function global_variable_toJson() {
    
     var json =  ' "variable_info" : [' ;
     for (i in g_global_variable_list) {
       json += '{ "name" : "' + g_global_variable_list[i].name + '", ';
       json += ' "id" : ' + g_global_variable_list[i].nodeid + '},';   
    } 
    json = json.substring(0,json.length - 1);
    json += ']';    
    return json; 
}

function create_global_variable_view(data) {

    for (i in data.variable_info ) {
            var temp = new var_info().createInstance(data.variable_info[i].name,"",0);
            temp.node = g_node_graph_obj.getNode(data.variable_info[i].id );
            g_global_variable_list.push(temp);
    }
}

function create_global_variable_list()
{
    if (g_res_js_list != null) {
        for (i in g_res_js_list) {
            for (k in g_res_js_list[i].globalVariables) {
                var temp_var_info = new var_info().createInstance(g_res_js_list[i].globalVariables[k].name,
                                g_res_js_list[i].filename, g_res_js_list[i].globalVariables[k].isdeclaredAt);
                g_global_variable_list.push(temp_var_info);                
            }
                
        }
    }
    // Find the instance of the global variable in all the files
    for (i in g_global_variable_list) {
        
        for(j in g_res_js_list) {
             var linenum = g_res_js_list[j].findInstance(g_global_variable_list[i].name);
             if (linenum != "") {
                 var filename = g_res_js_list[j].filename.substring(g_cwd_path.length,g_res_js_list[j].filename.length );
                 var var_inst = new  var_instance_info().createInstance(filename,linenum);
                 g_global_variable_list[i].name_instance.push(var_inst);
             }
        }
        
    }

}


function var_info(){
    this.name ="";
    this.filename ="";
    this.linenum =0;
    this.node =null;
    this.nodeid = 0;
    this.name_instance = new Array();
    this.createInstance=function(name,filename,linenum) {
        this.name = name;
        this.filename = filename;
        this.linenum = linenum;
        return this;
    }
    this.createNode =function() {
       if (this.node == null ) { 

           this.node = g_node_graph_obj.addNode(var_x,var_y,200,100,false,this.name,false);
           this.nodeid = this.node.id;

           for (i in this.name_instance) {
                this.name_instance[i].node = g_node_graph_obj.addNode (var_inst_x, var_inst_y, 200,100,false,this.name_instance[i].filename,false);
                this.name_instance[i].node.addText(this.name_instance[i].linenum);
                 this.node.nodeConnect("left", this.name_instance[i].node ,"right");  
                 var_inst_y += 170;
            }
            var_y += (170 *this.name_instance.length);
       }
       
       g_node_graph_obj.scrollToLocX(0);
       g_node_graph_obj.scrollToLocY(this.node.y() - 100);
    }
    
}

function save_node_process() {
    for (i in g_global_variable_list) {
        g_global_variable_list[i].createNode();
    }
}

function var_instance_info(){
    this.filename;
    this.linenum;
    this.node;
    this.createInstance =function(filename, linenum) {
        this.filename = filename;
        this.linenum = linenum;
        return this;
    }
    
    
}


function save_file(filename,text)
{
    $.post("save.php",{"name" : filename, "data" : text}, function(data){
                alert(data);
            });
}
