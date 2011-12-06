function resourceInfo()
{
   this.filename = null;
   this.fileContent = null;
   this.node = null;
   this.x = 0;
   this.y =0;
   
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
   this.createResourceInfo = function(name,open, id)
   {
        this.filename  = name;
        if (open) {
            this.x = g_node_graph_obj.get_file_x();
            this.y = g_node_graph_obj.get_file_y(); 
            this.node = g_node_graph_obj.addNode(this.x,this.y,500,700,false,name,true);
            //g_resource_array [g_resource_array.length] = this.node
            //this.node.hide();
        } else  {
            this.node = g_node_graph_obj.getNode(id);
        }
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
        var linenumbers = this.get_num_lines(content);
        this.node.addLineNum(linenumbers);
   }
   
   this.get_num_lines = function(content)
   {
       var linenum = 0;
       var linenumstr ="";
       var index = content.indexOf("\n",0);
       while ( index != -1) {
           index ++;
           linenum++;
           if (linenumstr.length > 0 )
                linenumstr = linenumstr + "<br>";
            linenumstr =  linenumstr + linenum;   
           index = content.indexOf("\n",index);
       }
       //alert(linenumstr);
       return linenumstr;
       
   }
   
   
    
}

