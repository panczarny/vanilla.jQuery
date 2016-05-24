var pack = {
	bind: [{}]
};

pack.query_bind = function(bound) {
	if(bound) {
		pack.binder[1] = bound;
	}
};

pack.fn = function(attributes) {
	for(var i in attributes) {
		pack.binder[0][i] = attributes[i];
	}
};

var _Q = function(selector) {
	this.node = /^(#|.)\w+/.test(selector) ? pack.binder[1](selector) : {};
};

_Q.prototype = pack.binder[0];

var Q = function(selector) {
	pack.query_bind(document.querySelector.bind(document));
	return new _Q(selector);
};

Q.fn = pack.fn;

Q.fn({
	cool: function() {
	},

	nice: function() {
	}
});

Q("#id").cool();