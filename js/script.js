var g_cwd_path = "";
var g_node_graph_obj = null;
var g_res_list = null;
var g_res_js_list = null;
var g_res_png_list = null;
var g_res_html_list = null;
var g_res_php_list = null;
var g_res_css_list = null;
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
        addimg();
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
    if (g_cwd_path == "")
    {
        alert("please enter the current working directory")
    }
    else
    {
        var filepath = form.save_file_txt_box.value;
        var idx = filepath.indexOf(".json");
        if (idx == -1)
        {
            alert("incorrect project file");
        }
        else
        {
            $('#save_file').hide();
           
            var filename = g_cwd_path + filepath;
            alert(filename);
            //$('#browse_info').show();
            $.post("save.php",{"name" : filename, "data" : "this is nice world"}, function(data){
                alert(data);
            });
        }
    }    
}
function addimg(projectName)
{   
    // first create the resources box
    $("#browse_info").css({"height":"200px"}); 
    // Then create the exand button
    if (projectName == null)
    {
        projectName = ' Project Name';
    }
    var prjExpandTag = '<a id="expand" href="#"> <img  src="images/expand.png"><span class=file_ref >' + projectName + 
        '</span> </a>' ;
    var prjCollapseTag = '<a id="collapse" href="#"> <img  src="images/contract.png"><span class=file_ref >' + projectName + 
        '</span> </a>' ;
        
    $(prjExpandTag).insertAfter("#res");
    
    $("#expand").click(function(event){
        $("#expand").hide();
        $(prjCollapseTag).insertAfter("#res");
        $('<ul id="res_list">').insertAfter("#collapse");
        for (i = g_res_list.length - 2 ; i >=  0  ; i--)
        {
            var tag = '<li class="res_list_i" id=res_list_' + i + ">" + '<a class="file_ref" id="#' +
                g_res_list[i] + '">' + g_res_list[i]  +  "</a></span></li>" ;
            //alert(tag);    
            $(tag).insertAfter("#res_list");
            $(tag).css({width: '210px'});
            $(tag).addClass("file_ref");
            if (i > 5)
            {
                var height = $("#browse_info").height() + 18 ;
                var height_txt = height + 'px';
                $("#browse_info").css({"height":height_txt}); 
            }
 
        }
        $("#collapse").click(function(event){           
        $('#res_list').remove(); 
        for (i = 0 ; i < g_res_list.length -1; i++)
        {
           var tag = "#res_list_" + i;
           $(tag).remove();
        }
        $("#browse_info").css({"height":"200px"}); 
        $("#collapse").hide();
        $("#expand").show();
    });

    });
    
}

function scan_cwd()
{
  if (g_cwd_path == "")
    {
        alert("please enter the current working directory")
    }
    else
    {
        // list all the files in the cwd
        $.post("scandir.php",{"name" : g_cwd_path}, function(data){
                if (g_res_list == null)
                    g_res_list = new Array();
                g_res_list = data.split("<br>");
                $("#file_open").hide();
                $('#browse_info').show();
                addimg();
                if (g_node_graph_obj == null)
                   g_node_graph_obj = new NodeGraph(); 
                   
                // open the html files and determine the list of js file
                for (i = 0; i < g_res_list.length; i++)
                {
                    var file_name = g_res_list[i];
                    if ( file_name.indexOf(".html") != -1)
                    {
                        //alert (file_name + " is html file")
                        // open the file and look for all script files
                        
                    }
                    else if (file_name.indexOf(".js") != -1)
                    {
                        //alert (file_name + " is javascript file")
                        file_name = g_cwd_path + file_name;
                        if (g_res_js_list == null)
                        {
                            g_res_js_list = new Array;
                        }
                        g_res_js_list[g_res_js_list.length] = file_name;
                        $.post("openfile.php",{name : file_name}, function(data){
                             //g_node_graph_obj.addNode(300,300,300,300,true);
                        });
                        
                    }
                    else if ( file_name.indexOf(".css") != -1)
                    {
                        if (g_res_css_list == null)
                            g_res_css_list = new Array;
                        g_res_css_list[g_res_css_list.length] = file_name;
                    }
                    else if ( file_name.indexOf(".png") != -1)  
                    {
                        //alert(file_name + " image file")
                    }
                    else if (file_name.indexOf(".php") != -1)
                    {
                       // alert(file_name + " is a php file")
                    }
                        
                        
                        
                }
            });
    }
}

