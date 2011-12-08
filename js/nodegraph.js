function NodeGraph(){
  var win = $(window);
  var canvas = $("#canvas");
  var overlay = $("#overlay");
  var currentNode;
  var currentConnection = {};
  var connections = {};
  var connectionId = 0;
  var newNode;
  var nodes = {};
  var nodeId = 0;
  var mouseX = 0, mouseY = 0;
  var loops = [];
  var pathEnd = {};
  var zindex = 1;
  var hitConnect;
  var key = {};
  var SHIFT = 16;
 
 
  // Prashant Change
  // added 20 to compensate for margins
  var topHeight = $("#mainhdr").height() + 20;
  // Prashant change
  // added 20 to compensate for the margins
  var resWidth  = $("#browse_info").width() + 20; 
  
  var paper = new Raphael("canvas", "100", "100");
  // Prashant Comment
  /*
  function resizePaper(){
    max_x = win.width() - resWidth;
    max_y =  win.height() - topHeight;
    max_file_x = win.width() + 1000 - resWidth;
    max_file_y = win.height() - topHeight;
    paper.setSize(win.width() + 1000 - resWidth, win.height() - topHeight);
  }
  */
  var canvas_width = win.width()  - resWidth;
  var canvas_height = win.height() - topHeight;
  canvas.css({"width":canvas_width, "height" : canvas_height, "border" :"1px solid #cccccc" });
  function resizePaper(){
       paper.setSize(10000,8000);
       //canvas.jScrollPane({showArrows: true, hijackInternalLinks: true});
  }
  win.resize(resizePaper);
  resizePaper();
  
  canvas.jScrollPane({showArrows: true, hijackInternalLinks: true});
  var api = canvas.data('jsp');
  
  canvas.append("<ul id='menu1'><li>Left<\/li><li>Right<\/li><li>Top<\/li><li>Bottom<\/li><\/ul>");
  var menu = $("#menu1");

  menu.css({"position" : "absolute", "left" : 100, "top" : 0, "z-index" : 5000, "border" : "1px solid gray", "padding" : 0});

   $("#menu1 li").css({"list-style" : "none", "font-size": "10px" ,  "margin": 0 , "cursor": "pointer", "background-color": "white",
        "font-family" : "Helvetica","border-bottom" : "1px solid #cccccc", "padding" : "5px 10px 5px 10px"});
  menu.hide();
 /* 
 canvas. append ("<ul id='submenu'><li>Save<\/li><li>hide<\/li><li>exit<\/li>" );
 var submenu = $("#submenu");
 submenu.css({"position" : "absolute", "left" : 100, "top" : 0, "z-index" : 5000, "border" : "1px solid gray", "padding" : 0});

  var li = $("#submenu li")
  li.css({"list-style" : "none", "font-size": "10px" ,  "margin": 0 , "cursor": "pointer", "background-color": "white",
        "font-family" : "Helvetica","border-bottom" : "1px solid #cccccc", "padding" : "5px 10px 5px 10px"
  })
 
  submenu.hide(); 
   */ 
  canvas.append("<div id='hit' />");
  hitConnect = $("#hit");
  hitConnect.css({"position" : "absolute", "left" : 350, "top" : 0, "z-index" : 4000, "border" : "none", 
                  "width" : 10, "height": 10, "cursor":"pointer", "font-size": "1px"});
                  
  $("#menu1 li").hover(function(){
    $(this).css("background-color", "#cccccc");
  },
  function(){
    $(this).css("background-color", "white");
  }).click(function(){
    menu.hide();
    var dir = $(this).text();
    connectNode(dir);
  });
  
  this.getNode = function(id) {
    return nodes[id];
  }

  
  function connectNode(dir){
    var node, x, y;
    dir = dir.toLowerCase();
      
    if (dir == "left"){
        //alert("left");
      // prashant change   
      //x = pathEnd.x + 5;
      x = pathEnd.x + 5;
      //y = pathEnd.y + topHeight - currentNode.height() / 2;
      y = pathEnd.y - currentNode.height() / 2 -1;
      
    }else if (dir == "right"){
      x = pathEnd.x - currentNode.width() - 5;
      // Prashant Change 
      //y = pathEnd.y + topHeight - currentNode.height() / 2;
      y = pathEnd.y  - currentNode.height() / 2 + 7;
    }else if (dir == "top"){  
      x = pathEnd.x - currentNode.width() / 2;
      //prashant change 
      //y = pathEnd.y + topHeight + 5 ;
      y = pathEnd.y + 5;
    }else if (dir == "bottom"){
      var temp = currentNode.width()
      x = pathEnd.x - currentNode.width() / 2 ;
     // prashant change
     temp = currentNode.height()
     y = pathEnd.y  - currentNode.height() ;
     // y = pathEnd.y + topHeight - 5 - currentNode.height();
    }
    
 
    node = new Node(x, y, currentNode.width(), currentNode.height(),"");
    saveConnection(node, dir);
    currentNode = node;
  }

  
  this.scrollToLocX =function(x) 
  {
      
      api.scrollToX(x);
  }
   
 this.scrollToLocY =function(y)
 {
     api.scrollToY(y);
 }
  
  var max_file_x = 10000;
  var max_file_y = 6000;
  var curr_file_x = 6000;
  var curr_file_y = 50; 
  var min_file_x = 6000;
  var min_file_y = 50;
  

  var min_class_x = 1000;
  var min_class_y = 50;
 
  
  this.get_file_x = function()
  {
     if (max_file_x - curr_file_x  > 100)
        curr_file_x += 600;
     else {
         curr_file_x = min_file_x;
         curr_file_y += 900;
     }
     return curr_file_x;
     
  }
  
  this.get_file_y = function()
  {
      return curr_file_y;
  }
  
   var max_comp_x = 1000;
   var max_comp_y = 4000;
   var curr_comp_x = 0;
   var curr_comp_y = 0;
   var min_comp_x = 0;
   var min_comp_y = 50;
   
   this.get_comp_x = function()
   {
       return curr_comp_x;
   }

   this.get_comp_y = function() 
   {
       return curr_comp_y;
   }
   
   var max_var_x = 4000;
   var max_var_y = 4000;
   var curr_var_x = 0; 
   var curr_var_y  = 0;
   var min_var_x = 3000;
   var min_var_y = 50;
   
   this.get_var_x = function()
   {
       return curr_var_x;
   }
   
   this.get_var_y = function()
   {
       return curr_var_y; 
   }
  function createConnection(a, conA, b, conB){
      var link = paper.path("M 0 0 L 1 1");
      link.attr({"stroke-width":2});
      link.parent = a[conA];
      
      a.addConnection(link);
      currentConnection = link;
      currentNode = a;
      saveConnection(b, conB);
  }
  
  function saveConnection(node, dir){
    if (!currentConnection) return;
    if (!currentConnection.parent) return;
    
    currentConnection.startNode = currentNode;
    currentConnection.endNode = node;
    currentConnection.startConnection = currentConnection.parent;
    currentConnection.endConnection = node[dir.toLowerCase()];
    
    currentConnection.id = connectionId;
    connections[connectionId] = currentConnection;
    connectionId++;
    
    currentNode.updateConnections();
    node.addConnection(currentConnection);
    
    $(currentConnection.node).mouseenter(function(){        
      this.raphael.attr("stroke","#FF0000");
    }).mouseleave(function(){
      this.raphael.attr("stroke","#000000");
    }).click(function(){
      if (confirm("Are you sure you want to delete this connection?")){
        this.raphael.remove();
        delete connections[this.raphael.id];
      }
    });
  }
  // Prashant Comment 
  // This method is working fine
  canvas.mousedown(function(e){
    if (menu.css("display") == "block"){

      if (e.target.tagName != "LI"){
        menu.hide();
        currentConnection.remove();
      }
    }
  });
  
  $(document).keydown(function(e){
    key[e.keyCode] = true;
  }).keyup(function(e){
    key[e.keyCode] = false;
  });
  
  $(document).mousemove(function(e){
    // Prashant Change
    //mouseX = e.pageX ;
    var x_sc = api.getPaneWidth();
    var y_sc = api.getPaneHeight();
    mouseX = e.pageX + x_sc - resWidth;
    mouseY = e.pageY + y_sc - topHeight;
  }).mouseup(function(e){
    overlay.hide();
    var creatingNewNode = newNode;
    // Prashant Change
    //hitConnect.css({"left":mouseX - 5, "top":mouseY + topHeight - 5});
    hitConnect.css({"left":mouseX - 5, "top":mouseY - 5});
    for (var i in nodes){
      if (nodes[i]){
        var n = nodes[i];
        if (n != currentNode){
          var nLoc = n.content.position();
          if (hitTest(toGlobal(nLoc, n.left), hitConnect)){
            saveConnection(n, "left");
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.top), hitConnect)){
            saveConnection(n, "top");
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.right), hitConnect)){
            saveConnection(n, "right");
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.bottom), hitConnect)){
            saveConnection(n, "bottom");
            newNode = false;
            break;
          }
        }
      }
    }
    hitConnect.css("left", "-100px");
    
    if (newNode){
        //alert("entering newNode")
      if (key[SHIFT]){
        menu.css({"left":mouseX - 10, "top":mouseY});
        menu.show();
      }else{
        var dir;
        var currDir = currentConnection.parent.attr("class");
       
        if (currDir == "left"){
          dir = "right";
        }else if (currDir  == "right"){
          dir = "left";
        }else if (currDir == "top"){
          dir = "bottom";
        }else if (currDir == "bottom"){
          dir = "top";
        }
        
        if (pathEnd.x == undefined || pathEnd.y == undefined){
          currentConnection.remove();
        }else{
          connectNode(dir);
        }
      }
    }
    newNode = false;
    
    for (var i in loops){
      clearInterval(loops[i]);
    }
    try{
      if (loops.length > 0) document.selection.empty();
    }catch(e){}
    loops = [];
    
    if (creatingNewNode) currentNode.txt[0].focus();
  });
  
  function toGlobal(np, c){
    var l = c.position();
    return {position : function(){ return {left: l.left + np.left, top : l.top + np.top}; },
            width : function(){ return c.width(); },
            height : function(){ return c.height(); }};
  }
  
  function showOverlay(){
    overlay.show();
    overlay.css({"width" : win.width(), "height" : win.height()}); //, "opacity": 0.1});
  }
  
  function startDrag(element, updateloc, bounds, dragCallback){
    showOverlay();

    var startX = mouseX  - element.position().left;
    var startY = mouseY - element.position().top;
    if (!dragCallback) dragCallback = function(){};
      var id = setInterval(function(){
      var x = mouseX - startX;
      var y = mouseY - startY;
      if (bounds){
        if (x < bounds.left) x = bounds.left;
        if (x > bounds.right) x = bounds.right;
        if (y < bounds.top) y = bounds.top;
        if (y > bounds.bottom) y = bounds.bottom;
      }
      element.css("left", x).css("top",y);

      dragCallback();
    },topHeight);
    loops.push(id);
  }
  
  
  function Node(xp, yp, w, h, title, noDelete,  displayLineNum, forceId){
    

    if (forceId != null){
       nodeId = forceId;
    }
    this.id = nodeId;
    nodes[nodeId] = this;
    nodeId++;
    
    var curr = this;
    this.connections = {};
    var connectionIndex = 0;
    
    this.addConnection = function(c){
      curr.connections[connectionIndex++] = c;
      return c;
    }
    
    var temp = $(".jspPane").last();
    temp.append("<div class='node'/>");
    //canvas.append("<div class='node'/>");
    
    var n = $(".node").last();
    n.css({"position" : "absolute",      
           "left" : xp, "top" : yp,
           "width" : w, "height" : h,   
           "border" : "1px solid gray",
           "background-color" : "white"
            });
    n.css("z-index", zindex++);
   
    canvas.jScrollPane({showArrows: true, hijackInternalLinks: true});
    
    this.content = n;
    
    this.page_title = title;
    
    var displaylineNum = displayLineNum;
    this.title = function() {
        return this.page_title;
    }
    this.width = function(){
      return n.width();
    }
    this.height = function(){
      return n.height();
    }
    this.x = function(){
      return n.position().left;
    }
    this.y = function(){
      return n.position().top;
    }
    
    var nodeWidth = n.width();
    var nodeHeight = n.height();
    var bar =  "<div class='bar'>" + title + "</div>"      
    n.append(bar);
    var bar = $(".node .bar").last();
    bar.css({"height" : "13px", 
             "background-color" : "Gray", "font-family" : "Helvetica",
             "padding" : "0", "margin": "0","color": "white",
             "font-size" : "10px","text-align" : "center" , "cursor" : "pointer"});
             
         
    if (!noDelete){
      n.append("<div class='ex'>V<\/div>");
      var ex = $(".node .ex").last();
      ex.css({"position":"absolute","padding-right" : 2, "padding-top" : 1, "padding-left" : 2,
              "color" : "white", "font-family" : "sans-serif",
              "top" : 0, "left": 0, "cursor": "pointer",
              "font-size" : "9px", "background-color" : "gray", "z-index" : 100}); 
        n. append ("<ul class='submenu'><li>Save<\/li><li>hide<\/li><li>exit<\/li>" );
        var submenu = $(".node .submenu").last();
        submenu.css({"position" : "absolute", "left" : 0, "top" : -3, "z-index" : 5000, "border" : "1px solid gray", "padding" : 0, 
            "display": "none"});     
    
        var li = $(".node .submenu li");
        li.css({"list-style" : "none", "font-size": "10px" ,  "margin": 0 , "cursor": "pointer", "background-color": "white",
            "font-family" : "Helvetica","border-bottom" : "1px solid #cccccc", "padding" : "5px 10px 5px 10px"
        })
        submenu.hide();
    
 li.hover(function(){
    $(this).css("background-color", "#cccccc");
    return false;
  }, 
  function () {
      $(this).css("background-color","white");
      return false;
  }).click(function(){
     submenu.hide();
     var cmd = $(this).text();
     //currentNode =curr; 
       if (cmd == "exit") {
            currentNode.remove();
       } else if (cmd == "Save") {
           if(confirm("Are you sure you want to save this file")){
               if (page_title != null && page_title.length > 0)
               save_file(page_title, this.txt.val());
           }
       } else if (cmd == "hide") {
           currentNode.hide();
       }
       return false;
  });   

   ex.hover(function(){
                  ex.css("color","black");
      }, function(){
                  ex.css("color","white");
      }).click(function(){
         currentNode  = curr;
         submenu.show();    
      });
      
      
    }
    this.executecmd = function(cmd)
    {
       if (cmd == "exit") {
            currentNode.remove();
       } else if (cmd == "Save") {
           if(confirm("Are you sure you want to save this file")){
               if (page_title != null && page_title.length > 0)
               save_file(page_title, this.txt.val());
           }
       } else if (cmd == "hide") {
           currentNode.hide();
       }
    }
    this.hide= function()
    {
        n.hide();
    }
   
    this.show = function()
    {
        curr.content.show();
    }
    
    this.nodeConnect  = function(nodepos1, node, pos2){
        createConnection(this, nodepos1,node, pos2)
    }
    var textwidth = nodeWidth -5;
    var textleftLoc = 0;
    var linenum = null;
    if (displayLineNum == true)
    {
        n.append ("<div class='linenum'/>");
        linenum = $(".node .linenum").last();
        linenum.css ("position","absolute");
        linenum.css({"width" : 15,
                 "height" : nodeHeight - bar.height() - 5,
                 "resize" : "none", "overflow" : "hidden",
                 "font-size" : "12px" , "font-family" : "sans-serif",
                 "border-right" : "1px solid #cccccc","z-index":4});
         textwidth =   nodeWidth - 22;
         textleftLoc = 17; 
    }
    this.linenum = linenum;

    n.append("<textarea class='txt' spellcheck='false' />");
    var txt = $(".node .txt").last();
    txt.css("position","absolute");
   
    txt.css({"width" : textwidth,
             "height" : nodeHeight - bar.height() - 5,
             "left" : textleftLoc,
             "resize" : "none", "overflow" : "auto",
             "font-size" : "12px" , "font-family" : "sans-serif",
             "border" : "none","z-index":4});
    
    this.txt = txt;
    
    if ( this.linenum != null) {
      txt.onkeydown = function() { positionLineObj(this.linenum,txt); };
      txt.onmousedown = function() { positionLineObj(this.linenum,txt); };
      txt.onscroll = function() { positionLineObj(this.linenum,txt); };
      txt.onblur = function() { positionLineObj(this.linenum,txt); };
      txt.onfocus = function() { positionLineObj(this.linenum,txt); };
      txt.onmouseover = function() { positionLineObj(this.linenum,txt); };      
    }      //var scrollnode = $(".node .scroll-pane").last();
    
    function positionLineObj(lineobj, txtobj){
        lineobj.style.top = (txtobj.scrollTop * -1) + 'px'; 
    }
    //scrollnode.jScrollPane();
    n.append("<div class='resizer' />");
    var resizer = $(".node .resizer").last();
    
    resizer.css({"position" : "absolute" , "z-index" : 10,
                 "width" : "10px", "height" : "10px",
                 "left" : nodeWidth - 11, "top" : nodeHeight - 11,
                 "background-color" : "white", "font-size" : "1px",
                 "border" : "1px solid gray",
                 "cursor" : "pointer"});
    
    n.append("<div class='left'>");
    n.append("<div class='top'>");
    n.append("<div class='right'>");
    n.append("<div class='bottom'>");
    
    var left = $(".node .left").last();
    left.css("left","-11px");
    
    var top = $(".node .top").last();
    top.css("top","-11px");
    
    var right = $(".node .right").last();
    var bottom = $(".node .bottom").last();
    
    setupConnection(left);
    setupConnection(right);
    setupConnection(top);
    setupConnection(bottom);
    
    positionLeft();
    positionRight();
    positionTop();
    positionBottom();
    
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    
    this.addText = function(val)
    {
        this.txt.val(val);
    }
    
    this.addLineNum = function(val) 
    {
    }
    function positionLeft(){
      left.css("top", n.height() / 2 - 5);
    }
    function positionRight(){ 
      right.css("left",n.width() + 1).css("top", n.height() / 2 - 5);
    }
    function positionTop(){
      top.css("left", n.width() / 2 - 5);
    }
    function positionBottom(){
      bottom.css("top",n.height() + 1).css("left", n.width() / 2 - 5);
    }
    
    function setupConnection(div){
      div.css({"position" : "absolute", "width" : "10px", "padding":0,
               "height" : "10px", "background-color" : "#aaaaaa",
               "font-size" : "1px", "cursor" : "pointer"});
    }
    
    this.connectionPos = function(conn){
      var loc = conn.position();
      var nLoc = n.position();
      var point = {};
      point.x = nLoc.left + loc.left + 5;
      // prashant Change
      //point.y = nLoc.top - topHeight + loc.top + 50;
      point.y = nLoc.top + loc.top + 7 ;
      return point;
    }
    
    function updateConnections(){
       for (var i in curr.connections){
         var c = curr.connections[i];
         if (!c.removed){
           var nodeA = c.startNode.connectionPos(c.startConnection);
           var nodeB = c.endNode.connectionPos(c.endConnection);
           c.attr("path","M " + nodeA.x + " " + nodeA.y + " L " + nodeB.x + " " + nodeB.y);
            
         }
       }
    }
    this.updateConnections = updateConnections;
    
    
   function addLink(e){
       //alert("entering addlink")
      currentNode = curr;
      e.preventDefault();
      showOverlay();
      var link = paper.path("M 0 0 L 1 1");
      link.attr({"stroke-width":2});
      currentConnection = link;
      currentConnection.parent = $(this);
      
      curr.addConnection(link);
      var loc = $(this).position();
      var nLoc = n.position();
      
      
       var x = loc.left + nLoc.left + 5;
      // changed prashant 
      // var y = loc.top + nLoc.top - topHeight + 5;
      var y = loc.top + nLoc.top + 7;
      //alert(x);
      newNode = true;
      
      var id = setInterval(function(){
        link.attr("path","M " + x + " " + y + " L " + mouseX + " " + mouseY);
        
        pathEnd.x = mouseX;
        pathEnd.y = mouseY;
      }, 30);
      loops.push(id);
   }
   left.mousedown(addLink);
   right.mousedown(addLink);
   top.mousedown(addLink);
   bottom.mousedown(addLink);
   
   this.remove = function(){
     for (var i in curr.connections){
       var c = curr.connections[i];
       c.remove();
       delete connections[c.id];
       delete curr.connections[i];
     }
     n.remove();
     delete nodes[this.id];
   }
    
    // Prashant Comment
    // This method looks good
    resizer.mousedown(function(e){
      currentNode = curr;
      e.preventDefault();
      startDrag(resizer, false, {left : 20, top : 20, right : 2000, bottom : 2000},
      function(){
        var loc = resizer.position();
        var x = loc.left;
        var y = loc.top;
        n.css({"width" : x + resizer.width() + 1,
               "height" : y + resizer.height() + 1});
        if (displaylineNum) {
            linenum.css({"width" : 17, "height" : n.height() - bar.height() - 5});
            txt.css({"width" : n.width() - 22, "height" : n.height() - bar.height() - 5});
        } else {
           txt.css({"width" : n.width() - 5, "height" : n.height() - bar.height() - 5});
        }
        positionLeft();
        positionRight();
        positionTop();
        positionBottom();
        updateConnections();
      });
    });
    // prashant comment
    // These methods look good 
    bar.mousedown(function(e){
      currentNode = curr;
      n.css("z-index", zindex++);
      e.preventDefault();
      // prashant change 
      startDrag(n, true, {left : 10, top: 40, right :10000 , bottom : 8000},
      //startDrag(n, true, {left : 10, top: 40, right : win.width() - n.width() - 10, bottom : win.height() - n.height() - 10},
      updateConnections);
    });
    
    n.mouseenter(function(){
      n.css("z-index", zindex++);
    });
    
  }
  
  function hitTest(a, b){
    var aPos = a.position();
    var bPos = b.position();
    
    var aLeft = aPos.left;
    var aRight = aPos.left + a.width();
    var aTop = aPos.top;
    var aBottom = aPos.top + a.height();
    
    var bLeft = bPos.left;
    var bRight = bPos.left + b.width();
    var bTop = bPos.top;
    var bBottom = bPos.top + b.height();
    
    //alert ("aleft " + aLeft + " aRight " + aRight + " aTop " + aTop + " aBottom " + aBottom  + 
     //       " bLeft" + bLeft + " bRight " + bRight +  " bTop " + bTop + " bBottom " + bBottom);
    // http://tekpool.wordpress.com/2006/10/11/rectangle-intersection-determine-if-two-given-rectangles-intersect-each-other-or-not/
    return !( bLeft > aRight
      || bRight < aLeft
      || bTop > aBottom
      || bBottom < aTop
      );
  }
  
  
 function clear(){
    nodeId = 0;
    connectionsId = 0;
    for (var i in nodes){
      nodes[i].remove();
    }
  }
  
  this.clearAll = function(){
    clear();
    //defaultNode();
    currentConnection = null;
    currenNode = null;
  }
  
  this.addNode = function(x, y, w, h, noDelete,title, displayLineNum){
    return new Node(x, y, w, h, title ,noDelete, displayLineNum);
  }
  
  var defaultWidth = 100;
  var defaultHeight = 50;
  // might need some tweeking 
  this.addNodeAtMouse = function(){
    //alert("Zevan");
    var w,h = null;
    if (currentNode  == null)
    {
        w = defaultWidth;
        h = defaultHeight;
    }
    else
    {
         w = currentNode.width() || defaultWidth;
         h = currentNode.height () || defaultHeight;
    }

    //var x_sc = api.getPaneWidth();
    // Prashant made a change 
    //var temp = new Node(mouseX - resWidth/2 + 40, mouseY , w, h, "");
    var temp = new Node(mouseX - resWidth/2 + 40, mouseY , w, h, "", false,false);
    currentNode = temp;
    currentConnection = null;
  }
  
  function defaultNode(){
    
    var temp = new Node(win.width() / 2 - defaultWidth / 2, 
                        win.height() / 2 - defaultHeight / 2,
                        defaultWidth, defaultHeight, "" ,true,false);
    temp.txt[0].focus();
    currentNode = temp;
  }
  //defaultNode();


  this.fromJSON = function(data){
    clear();
    for (var i in data.nodes){
      var n = data.nodes[i];
      var title = remspecialchar(n.title);
      var temp = new Node(n.x, n.y, n.width, n.height, title, false, false, n.id );
      var addreturns = remspecialchar(n.txt);

      temp.txt.val(addreturns);
    }
    for (i in data.connections){
      var c = data.connections[i];
      createConnection(nodes[c.nodeA], c.conA, nodes[c.nodeB], c.conB);
    }
  }
  
  this.toJSON = function(){
    var json = '{"nodes" : [';
    for (var i in nodes){
      var n = nodes[i];
      json += '{"id" : ' + n.id + ', ';
      json += '"x" : ' + n.x() + ', ';
      json += '"y" : ' + n.y() + ', ';
      json += '"width" : ' + n.width() + ', ';
      json += '"height" : ' + n.height() + ', ';
      json += '"title" : "' + addSlashes(n.title()) + '", ';
      json += '"txt" : "' + addSlashes(n.txt.val()) + '"},';
      //json += '"txt" : "' + "" + '"},';
    }
    json = json.substr(0, json.length - 1); 
    json += '], "connections" : [';
    
    var hasConnections = false;
    for (i in connections){
      var c = connections[i];
      if (!c.removed){
      json += '{"nodeA" : ' + c.startNode.id + ', ';
      json += '"nodeB" : ' + c.endNode.id + ', ';
      json += '"conA" : "' + c.startConnection.attr("class") + '", ';
      json += '"conB" : "' + c.endConnection.attr("class") + '"},';
      hasConnections = true;
      }
    }
    if (hasConnections){
      json = json.substr(0, json.length - 1);
    }
    json += ']}';
    return json;
  } 

}

function addSlashes(str) {
    str = str.replace(/\\/g,'&bkslash;');
    str = str.replace(/\'/g,'&squote;');
    str = str.replace(/\"/g,'&quote;');
    str = str.replace(/\0/g,'&nc;');
    str = str.replace(/\n/g,'&nl;');
    str = str.replace(/{/g,'&obraces;');
    str = str.replace(/}/g,'&cbraces;');
    str = str.replace(/:/g,'&cl;');
    str = str.replace(/,/g,'&cm;');
    str = str.replace(/\t/g,'&tb;');
    return str;
  }
  
  function remspecialchar(str) {
      str = str.replace(/&bkslash;/g,"\\");
      str = str.replace(/&squote;/g,"\'");
      str = str.replace(/&quote;/g,"\"");
      str = str.replace(/&nc;/g,"\0");
      str = str.replace(/&nl;/g,"\n");
      str = str.replace(/&obraces;/g,"{");
      str = str.replace(/&cbraces;/g,"}");
      str = str.replace(/&cl;/g,":");
      str = str.replace(/&cm;/g,",");
      str = str.replace(/&tb;/g,"\t");
      
      return str;
  }