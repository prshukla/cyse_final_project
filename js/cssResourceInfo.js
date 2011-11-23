function cssResourseInfo()
{
    // create an instance
    this.createInstance = function(filename) 
    {
        this.createResourceInfo(filename);
        this.openFile();
        return this;
    }
    
    this.deleteInstance = function() 
    {
        this.deleteInstanceResource()
    }
    
    function writeContent(data,node){
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

cssResourseInfo.prototype = new resourceInfo;
