var Q = function(selector) {
	if(typeof selector !== 'string') {
		return false;
	}

	var elem = document.querySelectorAll(selector);
	return elem;
};


console.log(Q("p"));








// var pack = {
// 	binder: [{}]
// };

// pack.query_bind = function(bound) {
// 	if(bound) {
// 		pack.binder[1] = bound;
// 	}
// };

// pack.fn = function(attributes) {
// 	for(var i in attributes) {
// 		pack.binder[0][i] = attributes[i];
// 	}
// };

// var _Q = function(selector) {
// 	if(typeof selector !== 'string') {
// 		return false;
// 	}
// 	this.node = pack.binder[1](selector);
// };

// _Q.prototype = pack.binder[0];

// var Q = function(selector) {
// 	pack.query_bind(document.querySelectorAll.bind(document));
// 	return new _Q(selector);
// };

// Q.fn = pack.fn;

// Q.fn({
// 	throwErrors: true,

// 	isFunction: function(f) {
// 		var getType = {};
// 		return f && getType.toString.call(f) === '[object Function]';
// 	},

// 	fadeIn: function(duration, callback, display) {
// 		if(this.throwErrors){throwErrors = this.throwErrors;}else{throwErrors = false;}
// 		duration = duration || 300;
// 		callback = callback || function() {};
// 		display = display || "block";
// 		var _ = this;
// 		var s = _.style;
// 		var timeout = 25;
// 		var step = timeout/duration;
// 		console.log(_.node);
// 		s.opacity = s.opacity || 0;
// 		s.display = display;
// 		(function fade() {
// 			(s.opacity = parseFloat(s.opacity) + step) > 1 ? 
// 			(function() {
// 				s.opacity = 1;
// 				if(callback){
// 					if(isFunction(callback)) {
// 						callback();
// 					} else {
// 						if(throwErrors) {
// 							console.log('"' + callback + '" is not a function');
// 						}
// 					}
// 				}
// 			})()
// 			: setTimeout(fade, timeout);
// 		})();
// 	}
// });

// var els = Q("p");
// els = els.node;
// console.log(els);
// for (var i = els.length - 1; i >= 0; i--) {
// 	console.log(els[i]);
// 	els[i].fadeIn();
// }