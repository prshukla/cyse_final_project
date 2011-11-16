function jsResourceInfo()
{
    this.methods = null;
    this.variables = null;
    this.text = null;
    
    this.createInstance = function(filename)
    {
        this.createResourceInfo(filename);
        this.openFile();
        
        return this;
    }
    
    function writeContent (data, node)
    {
        node.initContent(data);
    }
    
    this.openFile = function()
    {
        var node = this;
        $.post("openfile.php",{name : this.filename}, function(data) {
            writeContent(data, node );
        } );
    }
    
}

jsResourceInfo.prototype = new resourceInfo;
