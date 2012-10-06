var Randall = Randall || {};
/*
    Note: underscores indicate pseudo-private variables
*/

//Collection
Randall.Collection = function(options) {
    this._itemConstructor = this._itemConstructors[options.type];
    this.type = options.type;
    this.parent = options.parent;
    this.data = [];
};
Randall.Collection.prototype._addItem = function(options) {
    var item = new this._itemConstructor(options);
    if (typeof options !== 'object') { item.value = options; };
    if (!item.id) item.id = this.data.length+1; //if first item has no id, give it id 1, etc.
    this.data.push(item);
    item.collection = this;
    if (this._afterAddItem) this._afterAddItem(item);
    return item;
};
Randall.Collection.prototype.add = function(options) {
    if (!(options instanceof Array)) { return this._addItem(options); } //options: object - returns the item
    for (var i=0, j=options.length; i<j; i++) { this._addItem(options[i]); }; return this; //options: array of objects - returns the collection
};
Randall.Collection.prototype.each = function(options) { //runs the passed function/functionName for each item 
    for (var i=0, j=this.data.length; i<j; i++) {
        var item = this.data[i];
        options.func ? options.func(item) : item[options.functionName]();
    };
};
Randall.Collection.prototype.join = function(options) { //joins collection items using an item function/functionName and operator
    var x = options.initialValue || '';
    var operator = options.operator || 'append';
    for (var i=0, j=this.data.length; i<j; i++) {
        var item = this.data[i];
        var itemOutput = (options.func ? options.func(item) : item[options.functionName]());
        if ( operator === 'append' || operator  === 'add' ) { x += itemOutput; }
        else if ( operator === 'multiply' ) { x *= itemOutput; }
        else if ( operator === 'or' ) { x = x || itemOutput; }
        else if ( operator === 'and' ) { x = x && itemOutput; };
    };
    return x;
};
Randall.Collection.prototype.get = function(options) { //gets the first item which returns true from the passed function
    for (var i=0, j=this.data.length; i<j; i++) {
        var item = this.data[i];
        if (options.func(item)) return item;
    };
};
Randall.Collection.prototype.getById = function(options) { //gets the first item which has the passed id
    var id = options.id || options;
    return this.get({ func: function(item) { return (item.id === id) } });
};
Randall.Collection.prototype.getByGuid = function(options) { //gets the first item which has the passed id
    var guid = options.guid || options;
    return this.get({ func: function(item) { return (item.getGuid() === guid) } });
};
//

//Utility
Randall.Utility = {
    isArray: function(x) { return x instanceof Array },
    merge: function(object, defaults, options) { //merges default and option properties into an object
        object = object || {};
        for (var property in defaults) { object[property] = defaults[property]; };
        for (var property in options) { object[property] = options[property]; };
        return object;
    },
    isInArray: function(item, array) { return $.inArray(item, array) > -1 }
};
//