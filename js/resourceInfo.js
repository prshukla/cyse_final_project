// This is the number keeps the number of nodes
var g_resource_array = new Array();
var init_x_axis = 300;
var init_y_axis = 100;
function resourceInfo()
{
   this.filename = null;
   this.fileContent = null;
   this.node = null;
   
    this.createResourceInfo = function(name)
    {
        this.filename  = name;
        this.node = g_node_graph_obj.addNode(init_x_axis,init_y_axis,300,300,false);
        init_x_axis += 30;
        init_y_axis += 20;
        g_resource_array [g_resource_array.length] = this.node
        return this;
    }
    
    this.initContent = function(content)
    {
        this.fileContent = content;
        this.node.addText(content);
    }
    
    
}

