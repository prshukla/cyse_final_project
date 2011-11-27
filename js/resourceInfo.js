// This is the number keeps the number of nodes
var g_resource_array = new Array();

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
        var x = g_node_graph_obj.get_file_x();
        var y = g_node_graph_obj.get_file_y(); 
        this.node = g_node_graph_obj.addNode(x,y,500,700,false,name);
        g_resource_array [g_resource_array.length] = this.node
        this.node.hide();
        return this;
   }
   
   this.close_node  = function()
   {
       if (this.node != null) {
           this.node.remove();
           this.node = null;
       }
   }
   
   this.initContent = function(content)
   {
        this.fileContent = content;
        this.node.addText(content);
   }
    
    
}

