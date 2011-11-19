var g_cwd_path = "";
var g_node_graph_obj = null;
var g_res_list = null;
var g_res_js_list = null;
var g_res_png_list = null;
var g_res_html_list = null;
var g_res_php_list = null;
var g_res_css_list = null;
var g_res_dir_list = null;
var projectName = null;


$(function(){

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
    // check to determine if the directory is valid 
    $.post ("check_dir.php", {"name" : name}, function(data) {
        if (data.indexOf("true") != -1){
            g_cwd_path = name;
            alert ("The current working directory has been set to " + g_cwd_path);
        } else {
            alert("Failed this is not a valid directory");
        }   
    });
}
});

function open_file(form)
{
    if (g_cwd_path == "")
    {
        alert("please enter the current working directory")
    }
    else
    {
        var filepath = form.filename.value;
        var idx = filepath.indexOf(".json");
        if (idx == -1)
        {
            alert("incorrect project file");
        }
        else
        {
            $('#file_open').hide();

            var filepath_arry = new Array();
            filepath_arry = filepath.split("\\");
            var  filename = filepath_arry[filepath_arry.length - 1];

            filename = g_cwd_path + filename;
            $('#browse_info').show();
            $.getJSON(filename, function(data)
            {
                alert(data);
            });
        }
    }
}

function save_file(form)
{
    if (g_cwd_path == "") {
        alert("please enter the current working directory")
    } else {
        var filepath = form.save_file_txt_box.value;
        var idx = filepath.indexOf(".json");
        if (idx == -1) {
            alert("incorrect project file");
        } else {
            $('#save_file').hide();
           
            var filename = g_cwd_path + filepath;
            alert(filename);
            //$('#browse_info').show();
            $.post("save.php",{"name" : filename}, function(data){
                alert(data);
            });
        }
    }    
}
// 
// This function takes care of the resource info 
// 
function browse_resources(projectName)
{   
    // first create the resources box
    $("#browse_info").css({"height":"200px"}); 
    // Then create the exand button
    if (projectName == null)
    {
        projectName = ' Project Name';
    }
    var prjExpandTag = '<a id="expand" href="#" > <img  src="images/expand.png"><span class="project_name">' + projectName + 
        '</span> </a>' ;
    var prjCollapseTag = '<a id="collapse" href="#" class="project_name"> <img  src="images/contract.png"><span class="project_name ">' + projectName + 
        '</span> </a>' ;
        
    $(prjExpandTag).insertAfter("#res");
    
    $("#expand").click(function(event){
        $("#expand").hide();
        $(prjCollapseTag).insertAfter("#res");
        var filelist = '$( <div id="res_list">)';
        $(filelist).insertAfter("#collapse");
        var res_list = $("#res_list");

        for (i = g_res_list.length - 1 ; i >=  0  ; i--) {
            var filetag = '<div class =file_ref>' +  g_res_list[i] + '</div>'; 
            res_list.append(filetag);
            if (i > 5) {
                var height = $("#browse_info").height() + 18 ;
                var height_txt = height + 'px';
                $("#browse_info").css({"height":height_txt}); 
            }           
        }
        $(".file_ref").live('click',function() {
               alert($(this).text())
               // need to add code to display the text in the code 
               // 
        });
        $("#collapse").click(function(event){           
        $('#res_list').remove(); 
        $("#browse_info").css({"height":"200px"}); 
        $("#collapse").hide();
        $("#expand").show();
    });

    });
    
}

function dirlist(data)
{
    
}


function scan_cwd(dirname)
{
  if (g_cwd_path == ""){
    alert("please enter the current working directory")
  } else {     
        // list all the directories in the cwd
        $.post("scandir.php",{"name" : g_cwd_path,  "isdir" : true }, function(data){
                if (g_res_dir_list == null)
                    g_res_dir_list = new Array();
                g_res_dir_list = data.split("<br>");
                
                for (i =1 ; i < g_res_dir_list.length -2 ; i++) {
                    var dir = g_cwd_path + g_res_dir_list[i];
                    $.post("scandir.php",{"name" : dir, "isdir" : true}, function(data){
                         dirlist(data);
                    });
                }
        });
        
        
    
    }
}
/*
alert("directory" + temp_file_name)
                       $.post("scandir.php",{name : temp_file_name}, function(data){
                            var dirlist = new Array();
                            dirlist = data.split("<br>");
                            for(i in dirlist) { 
                                g_res_list.push(dirlist[i]);
                            }
                                 
                       });     
    window.setTimeout('browse_resources()',2000); 
/*
        
        if (g_res_list == null)
            g_res_list = new Array();
         
         g_res_list = data.split("<br>");
         g_res_list.pop(g_res_list.length)
         $("#file_open").hide();        
         $('#browse_info').show();
                  
         if (g_node_graph_obj == null)
             g_node_graph_obj = new NodeGraph(); 
                   
          // open the html files and determine the list of js file
          for (i = 0; i < g_res_list.length; i++){
             var file_name = g_res_list[i];
             file_name = g_cwd_path + file_name;
             if ( file_name.indexOf(".html") != -1){
             
                //alert (file_name + " is html file")
                // open the file and look for all script
             }else if (file_name.indexOf(".js") != -1) {
                
                if (g_res_js_list == null) {
                   
                   g_res_js_list = new Array;
                }
                g_res_js_list[g_res_js_list.length] = new jsResourceInfo().createInstance(file_name);
                
             } else if ( file_name.indexOf(".css") != -1) {
                
                if (g_res_css_list == null)
                    g_res_css_list = new Array;
                 g_res_css_list[g_res_css_list.length] = new cssResourceInfo().createInstance(file_name);
             } else if ( file_name.indexOf(".png") != -1)  {
                 //alert(file_name + " image file")
             } else if (file_name.indexOf(".php") != -1) {
                 // alert(file_name + " is a php file")
             } else {
                var temp_file_name = g_cwd_path + file_name;
                var str = "true ";
                $.post("check_dir.php" ,{"name" : temp_file_name}, function(data) { 
                    var idx = data.indexOf("true ");
                    if (idx != -1) {
                         var directory_name = data.substring(str.length, data.length);
                         if (g_res_dir_list == null)
                            g_res_dir_list = new Array;
                         g_res_dir_list[g_res_dir_list.length] = directory_name;
                         $.post("scandir.php",{name : directory_name}, function(data){
                            var dirlist = new Array();
                            dirlist = data.split("<br>");
                            for(i in dirlist) { 
                                g_res_list.push(dirlist[i]);
                            }
                                 
                       });
                   }
                });
                
             }
                                                                      
           }
       });
    }     
 */