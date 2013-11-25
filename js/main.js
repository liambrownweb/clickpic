/*
 * sample_data_set = {
 *  file: "images/house1/1.jpg",
 *  shapes: {
 *      up: {
 *          link:
 *          top:
 *          right:
 *          bottom:
 *          left:
 *      },
 *      [etc.]
 *  }
 * }
 */

var TargetObject = function(data){
    this.link = data.link;
    this['top'] = data['top'];
    this['bottom'] = data['bottom'];
    this['left'] = data['left'];
    this['right'] = data['right'];
};

//Determines whether the point specified by (x,y) is within the limits of the object.
TargetObject.prototype.hasPoint = function(x,y){
    if (typeof(x) === 'number' && typeof(y) === 'number'){
        return (y >= this['top'] && y <= this['bottom'] && x <= this['right'] && x >= this['left']);
    }
};


var viewManager = function(data){
    var that = this;
    this.displayDiv = $("#main_view");
    this.setUIData(data.shapes);
    this.setDisplayImage(data.file);

    this.displayDiv.click(function(e){
        var offsets = that.displayDiv.offset();
        var xPercent = (e.pageX - offsets['top']) / that.displayDiv.width();
        var yPercent = (e.pageY - offsets['left']) / that.displayDiv.height();
        viewman.clickEvent(xPercent, yPercent);
    });

    this.displayDiv.mousemove(function(e){
        var offsets = that.displayDiv.offset();
        var xPercent = (e.pageX - offsets['top']) / that.displayDiv.width();
        var yPercent = (e.pageY - offsets['left']) / that.displayDiv.height();
        viewman.hoverEvent(xPercent, yPercent);
    });
};

//Method to be triggered by hovering over a div
viewManager.prototype.hoverEvent = function(x,y){
    //Later on this will be needed for changing the mouse pointer and possibly other functionality related to mouse movement.
};

//Method to be triggered by clicking in a given area
viewManager.prototype.clickEvent = function(x,y){
    var target = this.getMEventTarget(x,y);
    console.log(x + ", " + y);
    //this.requestNewScreen(target.link);
};

//Generates a standardized URL from a preset (i.e. hardcoded) domain and a list of options.
viewManager.prototype.generateURL = function(options){
    var i;
    var url = "get_data.php";
    if (typeof(options)==='object'){
        var separator = "?";
        for (name in options){
            url += separator + name + "=" + options[name];
            separator = "&";
        }
    }
    return url;
};

//Determines target object for click or hover event based on coords
viewManager.prototype.getMEventTarget = function(x,y){
    var i;
    for (i = 0; i < this.targets.length; i++){
        if (this.targets[i].hasPoint(x,y)){
            return this.targets[i];
        }
    }
    return null;
};

//Validates a block of returned data based on a set of criteria
viewManager.prototype.isValid = function(data){
    return true;
}

//Sends request for new display data
viewManager.prototype.requestNewScreen = function(link){
    var url = this.generateURL({page:link});
    var that = this;
    $.getJSON(url, function(data){
        if (that.isValid(data)){
            that.setUIData(data.shapes);
            that.setDisplayImage(data.file);
        }
    });
};

//Sets display data
viewManager.prototype.setUIData = function(data){
    var i;
    if (!this.hasOwnProperty('targets')){
        this.targets = [];
    }
    for (i = 0; i < data.length; i++){
        this.targets[i] = new TargetObject(data[i]);
    }
};

//Sets div image value
viewManager.prototype.setDisplayImage = function(uri){
    $("#main_view").html('<img class="mainimage" src = "'+uri+'"></img>');
};

viewman = new viewManager({
    file: "data/images/house1/0.jpg",
    shapes: [
        {
            'link':'house1_1',
            'top':'0',
            'right':'100',
            'bottom':'100',
            'left':'0'
        }
    ]
});

