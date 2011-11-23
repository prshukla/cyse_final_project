// This is the number keeps the number of nodes
var g_resource_array = new Array();
var init_x_axis = 300;
var init_y_axis = 100;
function resourceInfo()
{
   this.filename = null;
   this.fileContent = null;
   this.node = null;
   
   this.showNode = function()
   {
       this.node.show();
   }
   
   this.hideNode = function()
   {
       this.node.hide();
   }
   
   this.deleteInstanceResource = function()
   {
       this.node.remove();
   }
   this.createResourceInfo = function(name)
   {
        this.filename  = name;
        this.node = g_node_graph_obj.addNode(init_x_axis,init_y_axis,600,800,false,name);
        g_resource_array [g_resource_array.length] = this.node
        this.node.hide();
        return this;
   }
    
   this.initContent = function(content)
   {
        this.fileContent = content;
        this.node.addText(content);
   }
    
    
}

