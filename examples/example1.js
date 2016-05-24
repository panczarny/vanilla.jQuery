var pack = {
	binder: [{}]
};

pack.query_bind = function( bound ) {
	if (bound) pack.binder[1] = bound;
};

pack.fn = function( attributes ) {
	for (var i in attributes) pack.binder[0][i] = attributes[i];
};

var _wrap = function(selector) {
	this.node = /^(#|.)\w+/.test(selector) ? pack.binder[1](selector) : {};
};

_wrap.prototype = pack.binder[0];

var wrap = function(selector) {
	pack.query_bind(document.querySelector.bind(document));
	return new _wrap(selector);
};

wrap.fn = pack.fn;

wrap.fn({
	cool: function() {},
	nice: function() {}
});

wrap('#mydiv').cool();