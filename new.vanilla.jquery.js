// browser-sync start --no-online --server --files "*.html, *.js, *.css"
// browser-sync start -p "localhost/vanilla.jQuery" --files "*.html, *.js, *.css"

var vanilla = (function() {
	function doCSS(prop, val) {
		var isSetVal = Boolean(val);
		var isSetProp = Boolean(prop);
		var action = CSSStyleDeclaration.prototype.setProperty;
		var args = arguments;
		if(isSetVal) {
			this.each(function(node, i){
				action.apply(node.style, args);
			});
			return this;
		}
		else if(isSetProp){
			return this.nodes[0].style[prop];
		}
		else {
			return false;
		}
	}


	function doATTR(prop, val) {
		var isSetVal = Boolean(val);
		var isSetProp = Boolean(prop);
		var action = Element.prototype.setAttribute;
		var args = arguments;
		if(isSetVal) {
			this.each(function(node, i) {
				action.apply(node, args);
			});
			return this;
		}
		else if(isSetProp){
			return Array.prototype.map.call(this.nodes, function(node) {
				return node.getAttribute(prop);
			});
		}
		else {
			return false;
		}
	}


	function doANIMfade(type, duration, callback, display) {
		duration = duration || 300;
		callback = callback || function() {};
		display = display || "block";
		this.each(function(node, i) {
			var _ = node;
			var s = _.style;
			var timeout = 25;
			var step = timeout/duration;
			switch(type) {
				case 'fadeIn':
				s.opacity = s.opacity || 0;
				s.display = display;
				(function fade() {
					(s.opacity = parseFloat(s.opacity) + step) > 1 ?
					(function() {
						s.opacity = 1;
						if(callback){
							callback();
						}
					})()
					: setTimeout(fade, timeout);
				})();
				break;

				case 'fadeOut':
				s.opacity = 1;
				s.display = display;
				(function fade() {
					(s.opacity = parseFloat(s.opacity) - step) < 0 ?
					(function() {
						s.opacity = 0;
						s.display = "none";
						if(callback){
							if(isFunction(callback)) {
								callback();
							} else {
								if(throwErrors) {
									console.log('"' + callback + '" is not a function');
								}
							}
						}
					})()
					: setTimeout(fade, timeout);
				})();
				break;
			}

		return this;
		});
		/*
		*/
	}



	return (function(selector) {
		var q = new Function();
		q.selector = selector;

		/****************************/

		q.nodes = document.querySelectorAll(selector);

		/****************************/

		q.each = function(action) {
			Array.prototype.forEach.call(this.nodes, function(item, i) {
				action(item, i);
			});
			return this;
		};

		/****************************/

		q.toString = function() {
			return this.selector;
		};

		/****************************/

		q.css = function(prop, val) {
			return doCSS.call(this, prop, val);
		};

		/****************************/

		q.attr = function(prop, val) {
			return doATTR.call(this, prop, val);
		};

		/****************************/

		q.fadeIn = function(duration, callback, display) {
			return doANIMfade.call(this, 'fadeIn', duration, callback, display);
		};

		q.debounce = function(func, wait, immediate) {
			// https://github.com/yckart/jquery.unevent.js/blob/master/jquery.unevent.js
			var timeout;

			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if(!immediate) {
						func.apply(context, args);
					}
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if(callNow) {
					func.apply(context, args);
				}
			};
		};

		q.once = function(fn, context) {
			var result;

			return function() {
				if(fn) {
					result = fn.apply(context || this, arguments);
					fn = null;
				}

				return result;
			};
		};



		return q;
	});
})();



document.addEventListener('DOMContentLoaded', DOMInit);

function DOMInit() {
	// console.log(vanilla("p").attr('data-color'));
	console.log(vanilla("p").fadeIn());
	vanilla("p").fadeIn().css('background', 'red');
	return;

	var myEfficientFn = vanilla.debounce(function() {
		console.log('I\'m debounced!');
	}, 250);
	window.addEventListener('resize', myEfficientFn);


	var canFireOnlyOnce = vanilla.once(function() {
		console.log('Only once fired!');
	});

	canFireOnlyOnce();
	canFireOnlyOnce();
}
