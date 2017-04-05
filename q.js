/* jshint esversion: 6, unused: true */
(function() {
	// Helpers functions
	const _helpers = {
		createElement: (name, attrs = {}) => {
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
		},

		matches: function(node, selector) {
			if(typeof node !== 'object' || node.nodeType !== 1) {
				return false;
			}
			const nodeClone = node.cloneNode(false);
			const nodeParent = node.parentNode.cloneNode(false);
			nodeParent.appendChild(nodeClone);
			return (nodeClone === nodeParent.querySelector(selector));
		},

		doCSS: function(prop, val) {
			const action = CSSStyleDeclaration.prototype.setProperty;
			const args = arguments;

			if(prop === undefined) {
				return this;
			}

			if(typeof prop === 'object') {
				const declarations = prop;

				for(let dec in declarations) {
					this.each((node) => action.apply(node.style, [dec, declarations[dec]]));
				}
			}
			else {
				if(val !== undefined) {
					this.each((node) => action.apply(node.style, args));
					return this;
				}
				else {
					return this.nodes[0].style[prop];
				}
			}

			return this;
		},

		doANIMfade: function(type, duration = 300, callback = function() {}, display = 'block') {
			this.each(function(node) {
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
					this.each((node) => action.apply(node, [attr, attributes[attr]]));
				}
			}
			else {
				if(val !== undefined) {
					this.each((node) => action.apply(node, args));
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
					type.split(' ').forEach((type) => {
						this.each((node) => {
							node.addEventListener(type, callback, useCapture);
						});
					});
				}
				else if(typeof callback === 'string' && typeof useCapture === 'function') {
					const matchSelector = callback;
					callback = useCapture;
					this.each((node) => {
						node.addEventListener(type, (e) => {
							let t = e.target;
							while(t) {
								if(Q(t).is(matchSelector)) {
									const event = _helpers.fixEvent(e);
									event.currentTarget = t;
									callback.call(t, event);
								}
								t = t.parentNode;
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
		},

		fixEvent: function(origEvent) {
			return new Q.Event(origEvent);
		},

		sibling: function(elem, dir) {
			return Q(elem[dir]);
		}
	};

	const ELEMENT_NODE_TYPE = 1;
	const DOCUMENT_NODE_TYPE = 9;
	const DOCUMENT_FRAGMENT_NODE_TYPE = 11;

	const returnFalse = () => false;
	const returnTrue = () => true;


	const Q = (selector, ...args) => new Q.init(selector, args);


	Q.init = function(selector, args) {
		let nodes;

		switch(typeof selector) {
			case 'string':
			if(selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
				nodes = [_helpers.createElement(selector, args[0])];
			}
			else {
				nodes = document.querySelectorAll(selector);
			}
			break;

			case 'object':
			if(Q.isArray(selector)) {
				nodes = selector;
			}
			else {
				nodes = [selector];
			}
			break;

			case 'function':
			const fn = selector;
			Q(document).ready(fn);
			return;

			default:
			break;
		}
		const len = nodes.length;

		for(let i = 0; i < len; i++) {
			this[i] = nodes[i];
		}
		this.length = len;
		this.splice = [].splice;

		this.nodes = Array.from(nodes);
	};

	// extending Library
	Q.prototype = Q.fn = Q.init.prototype = Array.prototype;

	// Allow extending the library
	Q.fn.extend = Q.init.prototype.extend = Q.extend = function() {
		const options = arguments[0];

		if(typeof options !== 'object') {
			return;
		}

		Object.assign(this, options);
	};

	Q.fn.extend({
		ready: function(action) {
			document.addEventListener('DOMContentLoaded', action);
		},

		/****************************/

		each: function(action) {
			this.nodes.forEach((node, i) => action(node, i));
			return this;
		},

		/****************************/

		hide: function() {
			this.nodes.forEach((node) => node.style.display = 'none');
			return this;
		},

		/****************************/

		show: function(style = 'block') {
			this.nodes.forEach((node) => node.style.display = style);
			return this;
		},

		/****************************/

		css: function(prop, val) {
			return _helpers.doCSS.call(this, prop, val);
		},

		/****************************/

		fadeIn: function(duration, callback, display) {
			return _helpers.doANIMfade.call(this, 'fadeIn', duration, callback, display);
		},

		/****************************/

		fadeOut: function(duration, callback, display) {
			return _helpers.doANIMfade.call(this, 'fadeOut', duration, callback, display);
		},

		/****************************/

		attr: function(prop, val) {
			return _helpers.doATTR.call(this, prop, val);
		},

		/****************************/

		data: function(prop, val) {
			return _helpers.doATTR.call(this, `data-${prop}`, val);
		},

		/****************************/

		text: function(text) {
			if(text === undefined) {
				let txt = '';
				this.each((node) => txt += node.textContent);
				return txt;
			}
			else {
				return _helpers.setTEXT.call(this, text);
			}
		},

		/****************************/

		on: function(type, element, callback = null) {
			return _helpers.events.on.call(this, type, element, callback);
		},

		/****************************/

		empty: function() {
			this.each((node) => {
				const ELEMENT_NODE_TYPE = 1;
				if(node.nodeType === ELEMENT_NODE_TYPE) {
					while(node.firstChild) {
						node.removeChild(node.firstChild);
					}
					node.textContent = '';
				}
			});
			return this;
		},

		/****************************/

		html: function(value) {
			let retVal;
			if(typeof value === 'undefined') {
				retVal = this.nodes[0].innerHTML;
			}
			else if(typeof value === 'string') {
				this.each((node) => {
					node.innerHTML = value;
				});

				retVal = this;
			}
			else {
				retVal = null;
			}
			return retVal;
		},

		/****************************/

		append: function(elements) {
			if(elements !== undefined) {
				this.each(function(node) {
					if(Q.isArray(elements)) {
						elements.each(function(n) {
							node.appendChild(n);
						});
					}
					else if (elements instanceof Q.init) {
						elements.each(function(n) {
							node.appendChild(n);
						});
					}
					else {
						node.appendChild(elements);
					}
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
			this.each(function(node) {
				const clone = node.cloneNode(true);
				clones.push(clone);
			});
			this.nodes = clones;
			return this;
		},

		/****************************/

		addClass: function(val = '') {
			if(val !== ''){
				return _helpers.classManipulation.call(this, 'add', val);
			}
		},

		/****************************/

		removeClass: function(val = '') {
			if(val !== ''){
				return _helpers.classManipulation.call(this, 'remove', val);
			}
		},

		/****************************/

		toggleClass: function(val = '') {
			if(val !== ''){
				return _helpers.classManipulation.call(this, 'toggle', val);
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
				if(result === false) {
					result = _helpers.matches(node, selector);
				}
			});

			return result;
		},

		/****************************/

		val: function(value) {
			let ret = '';
			if(value === undefined) {
				this.each((node) => {
					if(node.value !== undefined) {
						ret += node.value;
					}
				});
			}
			else {
				this.each((node) => {
					if(node.value !== undefined) {
						node.value = value;
					}
				});
				ret = this;
			}
			return ret;
		},

		/****************************/

		parent: function() {
			let retVal;
			const parentElement = this.nodes[0].parentElement;
			retVal = parentElement.nodeType === 1 ? Q(parentElement) : null;
			return retVal;
		},

		/****************************/

		parents: function(selector) {
			let foundParents = [];
			this.each((node) => {
				let parent = node;
				let i = 0;
				while(parent.nodeType == 1 && (i++ < 8)) {
					if(_helpers.matches(parent, selector)) {
						if(!foundParents.includes(parent)) {
							foundParents.push(parent);
						}
					}

					parent = parent.parentNode;
				}
			});

			return Q(foundParents);
		},

		next: function() {
			let elem = this.nodes[0];
			return elem ? _helpers.sibling(elem, 'nextElementSibling') : false;
		},

		prev: function() {
			let elem = this.nodes[0];
			return elem ? _helpers.sibling(elem, 'previousElementSibling') : false;
		},

		/****************************/

		remove: function() {
			this.each((node) => {
				try {
					node.parentElement.removeChild(node);
				} catch(e) {}
			});

			return this;
		},

		/****************************/

		focus: function() {
			this.nodes[0].focus();
			return this;
		},

		/****************************/
		/****shortcuts for events****/
		/****************************/

		click: function(callback) {
			return _helpers.events.add.call(this, 'click', callback);
		},

		/****************************/

		keydown: function(callback) {
			return _helpers.events.add.call(this, 'keydown', callback);
		},

		/****************************/

		keyup: function(callback) {
			return _helpers.events.add.call(this, 'keyup', callback);
		},

		/****************************/

		keypress: function(callback) {
			return _helpers.events.add.call(this, 'keypress', callback);
		},

		/****************************/

		input: function(callback) {
			return _helpers.events.add.call(this, 'input', callback);
		},

		/****************************/

		blur: function(callback) {
			return _helpers.events.add.call(this, 'blur', callback);
		},

		/****************************/

		hover: function(callbackIN, callbackOUT = function() {}) {
			_helpers.events.add.call(this, 'mouseenter', callbackIN);
			_helpers.events.add.call(this, 'mouseleave', callbackOUT);
			return this;
		},

		trigger: function(eventName) {
			// http://stackoverflow.com/questions/2381572/how-can-i-trigger-a-javascript-event-click
			const findDocument = function(node) {
				let doc;
				if (node.ownerDocument) {
					doc = node.ownerDocument;
				} else if (node.nodeType == DOCUMENT_NODE_TYPE){
					doc = node;
				} else {
					doc = false;
				}
				return doc;
			};

			let eventClass = "";
			switch (eventName) {
				case "click":
				case "mousedown":
				case "mouseup":
				eventClass = "MouseEvents";
				break;

				case "focus":
				case "change":
				case "blur":
				case "select":
				eventClass = "HTMLEvents";
				break;

				default:
				return;
			}

			const doc = findDocument.call(this, this[0]);
			if(!doc) {
				return;
			}
			let event = doc.createEvent(eventClass);
			event.initEvent(eventName, true, true);
			event.synthetic = true;

			this.each(node => node.dispatchEvent(event, true));

			return this;
		},

		/****************************/

		serialize: function (intoArray = false) {
			// https://plainjs.com/javascript/ajax/serialize-form-data-into-an-array-46/22
			let serialized = [];
			const form = this.nodes[0];
			if (form !== null && form.nodeName == "FORM") {
				const len = form.elements.length;
				for (let i = 0; i < len; i++) {
					let field = form.elements[i];
					if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
						if (field.type == 'select-multiple') {
							const optionsLength = form.elements[i].options.length;
							for (let j = 0; j < optionsLength; j++) {
								if(field.options[j].selected) {
									serialized.push(intoArray
										? {
											name: field.name,
											value: field.options[j].value
										}
										: encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value)
										);
								}
							}
						}
						else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
							serialized.push(intoArray
								? {
									name: field.name,
									value: field.value
								}
								: encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value)
								);
						}
					}
				}
			}
			return intoArray ? serialized : serialized.join('&').replace(/%20/g, '+');
		}
	});

	Q.extend({ //
		Event: function(event) {
			if(event.defaultPrevented || event.defaultPrevented === undefined && event.returnValue === false) {
				this.isDefaultPrevented = returnTrue;
			}
			else {
				this.isDefaultPrevented = returnFalse;
			}

			for(let key in event) {
				if(typeof event[key] !== 'function') {
					this[key] = event[key];
				}
			}
			this.originalEvent = event;
		}
	});

	Q.Event.prototype = {
		constructor: Q.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,

		preventDefault: function() {
			const e = this.originalEvent;
			this.isDefaultPrevented = returnTrue;
			if(e && !this.isSimulated) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			const e = this.originalEvent;
			this.isPropagationStopped = returnTrue;
			if(e && !this.isSimulated) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			const e = this.originalEvent;
			this.isImmediatePropagationStopped = returnTrue;
			if(e && !this.isSimulated) {
				e.stopImmediatePropagation();
			}
			this.stopPropagation();
		}
	};

	// Ajax
	const ajaxDefaults = {
		type: 'GET',
		url: '/',
		data: {},
		async: true,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}
	};
	Q.extend({
		ajax: function(options = {}) {
			const setRequestHeaders = (req, headers) => {
				for(let key in headers) {
					req.setRequestHeader(key, headers[key]);
				}
			};

			const conv = (response) => {
				try {
					response = JSON.parse(response + "");
				} catch (error) {
					return error;
				}

				return response;
			};

			const makeData = (data) => {
				data = typeof data === 'string'
				? data
				: (() => {
					let _opts = [];
					for(let k in data) {
						const value = data[k = encodeURIComponent(k)];
						_opts.push(`${k}=${encodeURIComponent(value)}`);
					}
					return _opts.join('&');
				})();

				return data;
			};


			let opts = this.copyObject(this.copyObject({}, ajaxDefaults), options);

			opts.type = opts.type.toUpperCase();

			if(opts.dataType == 'json') {
				opts.headers['Content-Type'] = 'application/json';
			}
			if(opts.type === 'POST') {
				opts.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
			}

			opts.data = makeData(opts.data);

			const request = new XMLHttpRequest();
			request.open(opts.type, opts.url, opts.async);

			if(opts.async === true) {
				request.onreadystatechange = () => {
					if(request.readyState === XMLHttpRequest.DONE) {
						const status = request.status;
						const isSuccess = status >= 200 && status < 300 || status === 304;

						if(isSuccess) {
							const response = conv(request.responseText);
							if(typeof opts.done === 'function') {
								opts.done(response, request.statusText, request);
							}
						}
						else {
							if(typeof opts.fail === 'function') {
								opts.fail(request, request.statusText);
							}
						}
					}
				};
			}

			setRequestHeaders(request, opts.headers);
			request.send(opts.data);
		}
	});

	/* Utilities */
	Q.extend({

		isElement: (element) => {
			const allowedNodeTypes = [ELEMENT_NODE_TYPE, DOCUMENT_NODE_TYPE, DOCUMENT_FRAGMENT_NODE_TYPE];
			return allowedNodeTypes.includes(element.nodeType);
		},

		isArray: (array) => {
			if(typeof Array.isArray === 'undefined') {
				return Object.prototype.toString.call(array) === '[object Array]';
			}
			else {
				return Array.isArray(array);
			}
		},

		isNumeric: (value) => {
			const type = typeof value;
			return (type === 'number' || type === 'string') && !Number.isNaN(value - Number.parseFloat(value));
		},

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

		cumulativeOffset: function(element) {
			let top = 0;
			let left = 0;
			do {
				top += element.offsetTop  || 0;
				left += element.offsetLeft || 0;
			} while ((element = element.offsetParent));

			return {
				top,
				left
			};
		},

		copyObject: (dest, src) => {
			for(let key in src) {
				dest[key] = src[key];
			}
			return dest;
		},

		isFunction: (fn) => !!(fn && fn.constructor && fn.call && fn.apply)
	});

	if(!window.Q) {
		window.Q = Q;
	}
	else {
		console.error('Q is already defined, I\'m not passing it as a Global!');
	}
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
