window.onload = function() {
	// $(".matches").hhtml();
};

function $(selector, context) {
	return (context || document).querySelectorAll(selector);
}

function $1(selector, context) {
	return (context || document).querySelector(selector);
}

$.prototype.hhtml = function(html) {
	console.log(this);
};





var pack = {
	binder: [{}]
};

pack.query_bind = function( bound ) {
	if (bound) pack.binder[1] = bound;
};

pack.fn = function( attributes ) {
	for (var i in attributes) {
		pack.binder[0][i] = attributes[i];
	}
};

var _wrap = function(selector) {
	this.node = /^(#|.)\w+/.test(selector) ? pack.binder[1](selector) : {};
};

_wrap.prototype = pack.binder[0];

var wrap = function(selector) {
	pack.query_bind(document.querySelectorAll.bind(document));
	return new _wrap(selector);
};

wrap.fn = pack.fn;

wrap.fn({
	cool: function() {
	},
	nice: function() {}
});

wrap('div').cool();
console.log(pack);
wrap('.matches').cool();
console.log(pack);