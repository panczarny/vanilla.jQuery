// Anonymous function
(function () {
    // Q returns new Library object that hold our selector. Ex: Q('.wrapper')
    var Q = function (params) {
        return new Library(params);
    };
     
    // In our Library we get our selector with querySelectorAll (we do not support < ie8)
    // We also add selector length, version and twitter/github or whatever you like as information about your library.
    var Library = function (params) {
        // Get params
        var selector = document.querySelectorAll(params),
            i = 0;
        // Get selector length
        this.length = selector.length;
        this.version = '0.1.0';
        this.twitter = 'http://www.twitter.com/bjarneo_';
         
        // Add selector to object for method chaining
        for (; i < this.length; i++) {
            this[] = selector[i];
        }
         
        // Return as object
        return this;        
    };
 
    // Assign our Q object to global window object.
    if(!window.Q) {
        window.Q = Q;
    }
})();