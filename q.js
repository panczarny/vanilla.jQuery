(function() {
	const Q = (selector) => new Library(selector);

	let Library = function(selector) {
		let _selector;

		if(typeof selector === 'string') {
			_selector = document.querySelectorAll(selector);
		}
		else if(typeof selector === 'object') {
			_selector = [selector];
		}
		const nodes = _selector;

		let i = 0;

		this.length = nodes.length;
		this.version = '0.1.0';
		this.nodes = nodes;

		// Helpers functions
		this.helpers = {
			doCSS: function(prop, val) {
				const action = CSSStyleDeclaration.prototype.setProperty;
				const args = arguments;

				if(prop === undefined) {
					return this;
				}

				if(typeof prop === 'object') {
					const declarations = prop;

					for(let dec in declarations) {
						this.each((node, i) => action.apply(node.style, [dec, declarations[dec]]));
					}
				}
				else {
					if(val !== undefined) {
						this.each((node, i) => action.apply(node.style, args));
						return this;
					}
					else {
						return this.nodes[0].style[prop];
					}
				}
			},

			doANIMfade: function(type, duration = 300, callback = function() {}, display = 'block') {
				this.each(function(node, i) {
					const _ = node;
					const s = _.style;
					const timeout = 25;
					const step = timeout/duration;
					switch(type) {
						case 'fadeIn':
						s.opacity = s.opacity || 0;
						s.display = display;
						(function fade() {
							if((s.opacity = parseFloat(s.opacity) + step) > 1) {
								s.opacity = 1;
								callback();
							}
							else {
								setTimeout(fade, timeout);
							}
						})();
						break;

						case 'fadeOut':
						s.opacity = 1;
						s.display = display;
						(function fade() {
							if((s.opacity = parseFloat(s.opacity) - step) < 0) {
								s.opacity = 0;
								s.display = "none";
								callback();
							}
							else {
								setTimeout(fade, timeout);
							}
						})();
						break;
					}
				});

				return this;
			},

			doATTR: function(prop, val) {
				const action = Element.prototype.setAttribute;
				const args = arguments;

				if(prop === undefined) {
					return this;
				}

				if(typeof prop === 'object') {
					const attributes = prop;
					for(let attr in attributes) {
						this.each((node, i) => action.apply(node, [attr, attributes[attr]]));
					}
				}
				else {
					if(val !== undefined) {
						this.each((node, i) => action.apply(node, args));
					}
					else {
						let props = [];
						this.each((node) => props.push(node.getAttribute(prop)));

						return (props.length > 1 ? props : props[0]);
					}
				}

				return this;
			},

			setTEXT: function(txt) {
				this.each((node) => node.textContent = txt);

				return this;
			}
		};

		// return this;
	};

	// extending Library
	Q.fn = Library.prototype = {

		/****************************/

		each: function(action) {
			this.nodes.forEach((node, i) => action(node, i));
			return this;
		},

		/****************************/

		hide: function () {
			this.nodes.forEach((node, i) => node.style.display = 'none');
			return this;
		},

		/****************************/

		show: function (style = 'block') {
			this.nodes.forEach((node, i) => node.style.display = style);
			return this;
		},

		/****************************/

		css: function(prop, val) {
			return this.helpers.doCSS.call(this, prop, val);
		},

		/****************************/

		fadeIn: function(duration, callback, display) {
			return this.helpers.doANIMfade.call(this, 'fadeIn', duration, callback, display);
		},

		/****************************/

		fadeOut: function(duration, callback, display) {
			return this.helpers.doANIMfade.call(this, 'fadeOut', duration, callback, display);
		},

		/****************************/

		attr: function(prop, val) {
			return this.helpers.doATTR.call(this, prop, val);
		},

		/****************************/

		text: function(text) {
			return this.helpers.setTEXT.call(this, text);
		}
	};

	// Allow extending the library
	Q.extend = function() {
		const target = this;

		const options = arguments[0];
		let key;

		if(typeof arguments[0] !== 'object') {
			return;
		}

		for(key in options) {
			target[key] = options[key];
		}
	};

	Q.extend({
		debounce: function(func, wait, immediate) {
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
		},

		once: function(fn, context) {
			var result;

			return function() {
				if(fn) {
					result = fn.apply(context || this, arguments);
					fn = null;
				}

				return result;
			};
		},
	});


	if(!window.Q) {
		window.Q = Q;
	}
	else {
		console.error('Q is already defined, I\'m not passing it as a Global!');
	}
})();


document.addEventListener('DOMContentLoaded', DOMInit);

function DOMInit() {
	let i = 10;
	Q('p').show().each((node) => Q(node).attr('fz', (i++) + '')).text('doge');
}
