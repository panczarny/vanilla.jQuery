(function() {
	const Q = (selector, ...args) => new Library(selector, args);

	let Library = function(selector, args) {
		let _selector;

		if(typeof selector === 'string') {
			if(selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
				_selector = [createElement(selector, args[0])];
			}
			else {
				_selector = document.querySelectorAll(selector);
			}
		}
		else if(typeof selector === 'object') {
			if(isArray(selector)) {
				_selector = selector;
			}
			else {
				_selector = [selector];
			}
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

				return this;
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
			},

			events: {
				add: function(type, callback, useCapture = false) {
					this.each((node) => node.addEventListener(type, callback, useCapture));

					return this;
				},

				on: function(type, callback, useCapture = false) {
					if(type === undefined || callback === undefined) {
						return this;
					}

					if(typeof callback === 'function') {
						this.each((node) => {
							node.addEventListener(type, callback, useCapture);
						});
					}
					else if(typeof callback === 'string' && typeof useCapture === 'function') {
						const matchSelector = callback;
						callback = useCapture;
						this.each((node) => {
							node.addEventListener(type, function(e) {
								if(Q(e.target).is(matchSelector)) {
									callback.call(e.target, e);
								}
							});
						});
					}

					return this;
				}
			},

			classManipulation: function(type, val) {
				let classes;
				classes = val.split(' ');
				this.each((node) => {
					classes.forEach((c) => {
						node.classList[type](c);
					});
				});

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

		hide: function() {
			this.nodes.forEach((node, i) => node.style.display = 'none');
			return this;
		},

		/****************************/

		show: function(style = 'block') {
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
			if(text === undefined) {
				let txt = '';
				this.each((node) => txt += node.textContent);
				return txt;
			}
			else {
				return this.helpers.setTEXT.call(this, text);
			}
		},

		/****************************/

		on: function(type, element, callback = null) {
			return this.helpers.events.on.call(this, type, element, callback);
		},

		/****************************/

		append: function(elements) {
			if(elements !== undefined) {
				this.each(function(node, i) {
					elements.each(function(n, i) {
						node.appendChild(n);
					});
				});
			}
			return this;
		},

		/****************************/

		appendTo: function(elements) {
			if(typeof elements === 'string') {
				elements = Q(elements);
			}
			this.each((node) => {
				elements.each((elem) => {
					elem.appendChild(node);
				});
			});
			return this;
		},

		/****************************/

		clone: function() {
			let clones = [];
			this.each(function(node, i) {
				const clone = node.cloneNode(true);
				clones.push(clone);
			});
			this.nodes = clones;
			return this;
		},

		/****************************/

		addClass: function(val = '') {
			if(val !== ''){
				return this.helpers.classManipulation.call(this, 'add', val);
			}
		},

		/****************************/

		removeClass: function(val = '') {
			if(val !== ''){
				return this.helpers.classManipulation.call(this, 'remove', val);
			}
		},

		/****************************/

		toggleClass: function(val = '') {
			if(val !== ''){
				return this.helpers.classManipulation.call(this, 'toggle', val);
			}
		},

		/****************************/

		hasClass: function(val = '') {
			let contains = false;
			if(val !== ''){
				this.each((node) => contains = (node.classList.contains(val) ? true : contains));
			}
			return contains;
		},

		/****************************/

		find: function(selector) {
			let found = [];
			this.each((node) => {
				const foundNodes = node.querySelectorAll(selector);
				foundNodes.forEach((n) => found.push(n));
			});
			return Q(found);
		},

		/****************************/

		is: function(selector) {
			let result = false;

			this.each((node) => {
				const nodeClone = node.cloneNode(false);
				const nodeParent = node.parentNode.cloneNode(false);
				nodeParent.appendChild(nodeClone);
				result = (nodeClone === nodeParent.querySelector(selector));
			});

			return result;
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
	Q.fn.extend = Library.prototype.extend = function() {
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

	/****************************/
	/****shortcuts for events****/
	/****************************/
	Q.fn.extend({
		click: function(callback) {
			return this.helpers.events.add.call(this, 'click', callback);
		},

		/****************************/

		keydown: function(callback) {
			return this.helpers.events.add.call(this, 'keydown', callback);
		},

		/****************************/

		keyup: function(callback) {
			return this.helpers.events.add.call(this, 'keyup', callback);
		},

		/****************************/

		keypress: function(callback) {
			return this.helpers.events.add.call(this, 'keypress', callback);
		},

		/****************************/

		input: function(callback) {
			return this.helpers.events.add.call(this, 'input', callback);
		},

		/****************************/

		focus: function(callback) {
			return this.helpers.events.add.call(this, 'focus', callback);
		},

		/****************************/

		blur: function(callback) {
			return this.helpers.events.add.call(this, 'blur', callback);
		},

		/****************************/

		hover: function(callbackIN, callbackOUT = function() {}) {
			this.helpers.events.add.call(this, 'mouseenter', callbackIN);
			this.helpers.events.add.call(this, 'mouseleave', callbackOUT);
			return this;
		}
	});

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


	// Functions
	const createElement = (name, attrs = {}) => {
		name = name.replace(/[<>]/g, '');
		const el = document.createElement(name);
		if(typeof attrs !== undefined) {
			for(let key in attrs) {
				if(attrs.hasOwnProperty(key)) {
					el.setAttribute(key, attrs[key]);
				}
			}
		}
		return el;
	};

	const isElement = (element) => {
		const allowedNodeTypes = [1, 9, 11];
		return allowedNodeTypes.indexOf(element.nodeType) > -1;
	};

	if(!window.Q) {
		window.Q = Q;
	}
	else {
		console.error('Q is already defined, I\'m not passing it as a Global!');
	}

	const isArray = function(array) {
		if(typeof Array.isArray === 'undefined') {
			return Object.prototype.toString.call(array) === '[object Array]';
		}
		else {
			return Array.isArray(array);
		}
	};
})();

// browser-sync start --no-online --server --files "*.html, *.js, *.css"
// browser-sync start -p "localhost/vanilla.jQuery" --files "*.html, *.js, *.css"

/*
var cumulativeOffset = function(element) {
	var top = 0, left = 0;
	do {
		top += element.offsetTop || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while(element);

	return {
		top: top,
		left: left
	};
};*/

// test if matches selector
// http://stackoverflow.com/questions/3304638/test-if-a-selector-matches-a-given-element
// https://davidwalsh.name/element-matches-selector
// http://youmightnotneedjquery.com/#matches

// delegate events
// http://stackoverflow.com/questions/14677019/emulate-jquery-on-with-selector-in-pure-javascript
// https://codepen.io/32bitkid/post/understanding-delegated-javascript-events

// remove event listener
// http://www.w3schools.com/jsref/met_element_removeeventlistener.asp
