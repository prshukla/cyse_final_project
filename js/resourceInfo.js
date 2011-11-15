function resourceInfo()
{
   this.filename = null;
   this.fileContent = null;
   
    this.createResourceInfo = function(name)
    {
        this.filename  = name;
        return this;
    }
    
    this.initContent(content)
    {
        this.fileContent = content;
    }
    
}

