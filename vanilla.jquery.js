/*
** done:
fadeIn()
fadeOut()
fadeToggle()
hide()
show()
toggle()
Ajax()
addClass()
removeClass()
toggleClass() trzeba fix na IE9
parents()
form.serialize()
**/

var throwErrors = true;
/*
**
**
** GLOBAL NEEDS
**
**
**/


/*
** Sprawdzam czy isFunction
**/
function isFunction(f) {
	var getType = {};
	return f && getType.toString.call(f) === '[object Function]';
}


/*
**
**
** END OF GLOBAL NEEDS
**
**
**/

/******************************************/
/******************************************/
/*
** Animations
**/

/*
** fadeIn
**/
Element.prototype.fadeIn = function(duration, callback, display) {
	if(throwErrors){throwErrors = throwErrors;}else{throwErrors = false;}
	duration = duration || 300;
	callback = callback || function() {};
	display = display || "block";
	var _ = this;
	var s = _.style;
	var timeout = 25;
	var step = timeout/duration;
	s.opacity = s.opacity || 0;
	s.display = display;
	(function fade() {
		(s.opacity = parseFloat(s.opacity) + step) > 1 ? 
		(function() {
			s.opacity = 1;
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
};

/******************************************/

/*
** fadeOut
**/
Element.prototype.fadeOut = function(duration, callback, display) {
	if(throwErrors){throwErrors = throwErrors;}else{throwErrors = false;}
	duration = duration || 300;
	callback = callback || function() {};
	display = display || "block";
	var _ = this;
	var s = _.style;
	var timeout = 25;
	var step = timeout/duration;
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
};

/******************************************/

/*
** fadeToggle
**/
Element.prototype.fadeToggle = function(duration, callback, display) {
	duration = duration || 300;
	callback = callback || function() {};
	display = display || "block";
	var _ = this;
	var curr_display = (window.getComputedStyle ? getComputedStyle(_, null) : _.currentStyle).display;
	switch (curr_display) {
		case 'none':
		_.fadeIn(duration, callback, display);
		break;
		default:
		_.fadeOut(duration, callback, display);
		break;
	}
};

/******************************************/

/*
** hide()
**/
Element.prototype.hide = function() {
	this.style.display = "none";
};

/******************************************/

/*
** show()
**/
Element.prototype.show = function(display) {
	display = display || "block";
	this.style.display = display;
};

/******************************************/

/*
** toggle()
**/
Element.prototype.toggle = function(display) {
	var _ = this;
	var s = _.style;
	var curr_display = (window.getComputedStyle ? getComputedStyle(_, null) : _.currentStyle).display;
	if(curr_display == 'block') {
		s.display = 'none';
	} else {
		display = display || 'block';
		s.display = display;
	}
};

/******************************************/
/******************************************/
/*
** Class Manipulation
**/

/*
** addClass
**/
Element.prototype.addClass = function(className) {
	var _ = this;
	if(!className) {
		return false;
	}
	if(_.classList) {
		_.classList.add(className);
	} else {
		_.className += ' ' + className;
	}
	return true;
};

/******************************************/

/*
** removeClass
**/
Element.prototype.removeClass = function(className) {
	var _ = this;
	if(!className) {
		return false;
	}
	if(_.classList) {
		_.classList.remove(className);
	} else {
		_.className.replace(className, '');
	}
	return true;
};

/******************************************/

/*
** toggleClass
**/
Element.prototype.toggleClass = function(className) {
	var _ = this;
	if(!className) {
		return false;
	}
	console.log(".toggleClass() doesn't work on IE <= IE9");
	if(_.classList) {
		_.classList.toggle(className);
	} else {
		// _.className.replace(className, '');
	}
	return true;
};

/******************************************/
/******************************************/
/*
** DOM
**/

/*
** Traverse DOM UP searching SELECTOR
**/
Element.prototype.parents = function(selector) {
	if(!selector) {
		return false;
	}
	var type;
	var _ = this;
	var el = _;
	if(selector.indexOf("#") === 0) {
		type = 'id';
		selector = selector.substr(1);
	}
	else if(selector.indexOf(".") === 0) {
		type = 'class';
		selector = selector.substr(1);
	}
	else {
		type = 'tag';
	}

	while(_.parentNode) {
		el = el.parentNode;
		if(el.tagName.toLowerCase() == 'html') {
			return false;
		}
		if(el) {
			switch (type) {
				case 'id':
				if(el.id && el.id == selector) {
					return el;
				}
				break;
				case 'class':
				if(el.classList && el.classList.contains(selector)) {
					return el;
				}
				break;
				case 'tag':
				if(el.tagName && el.tagName.toLowerCase() == selector.toLowerCase()) {
					return el;
				}
				break;
			}
		}
	}
	return false;
};
/*
** END OF Traverse DOM searching SELECTOR
**/

/******************************************/



/*
** Ajax
** Example:
Ajax({
	type: 'GET',
	url: 'index.php'
}, 
function(message) {
	// done
},
function(message, status) {
	// fail
});
**/
var Ajax = function(options) {
	if(throwErrors){throwErrors = throwErrors;}else{throwErrors = false;}
	/*
	checking if all necessary data provided
	necessary:
	options{
		url
	}
	**/
	TYPE = options.type;
	URL = options.url;
	DATA = options.data;
	ASYNC = options.async;
	var done = options.done;
	var fail = options.fail;
	if(!TYPE) {
		TYPE = "GET";
	} else if(typeof TYPE != 'string' && (TYPE.toUpperCase() != 'GET' && TYPE.toUpperCase() != 'POST')) {
		if(throwErrors){
			console.log('TYPE of request should be POST or GET');
		}
		return false;
	}
	TYPE = TYPE.toUpperCase();
	if(!URL || typeof URL != 'string') {
		if(throwErrors){
			console.log('Where is URL?');
		}
		return false;
	}
	if(DATA) {
		if(typeof DATA == 'object') {
		} else {
			if(throwErrors){
				console.log('Type of your data is not an object!');
			}
		}
	}


	/*
	** options checked, now sending
	**/
	var xhr = (window.XMLHttpRequest ? new XMLHttpRequest() : ( window.ActiveXObject ? function() { try {return new ActiveXObject('Msxml2.XMLHTTP');}catch(e){try{return new ActiveXObject('Microsoft.XMLHTTP');}catch(e){}}} : function() {} ));
	if(!xhr) {
		if(throwErrors) {
			console.log('Error during creating XMLHTTP');
		}
		return false;
	}
	var params = null;
	var responseText;
	xhr.open(TYPE, URL);
	xhr.onreadystatechange = function() {
		if(throwErrors){
			console.log('PROBLEM ON IE9!');
		}
		var readyState;
		var statusText;
		try {
			readyState = xhr.readyState;
			statusText = xhr.statusText;
		}
		catch(e) {
			if(throwErrors) {
				console.log('Error during getting statusText and readyState');
			}
			return false;
		}
		var status;
		try {
			status = xhr.status;
		}
		catch(e) {
			if(throwErrors) {
				console.log(e);
			}
			return false;
		}
		if(readyState == 4) {
			// done
			try {
				responseText = xhr.responseText;
			}
			catch(e) {
				if(throwErrors) {
					console.log(e);
				}
				return false;
			}
			if(status == 200) {
				// OK
				if(done && isFunction(done)) {
					done(responseText, status, statusText);
				}
			} else {
				// Error with connection
				if(fail && isFunction(fail)) {
					fail(responseText, status, statusText);
				}
			}
		}
	};
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	if(TYPE == "POST") {
		// Needed for POST
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('Content-lenth', DATA.length);
		params = DATA;
	}
	xhr.send(params);
};
/*
** END OF Ajax
**/

/******************************************/

/*
** Serializing form into query string
**/
Element.prototype.serialize = function() {
	var field, l, s = [], f = this;
	if (typeof f == 'object' && f.nodeName == "FORM") {
		var len = f.elements.length;
		for (var i=0; i<len; i++) {
			field = f.elements[i];
			if (field.name && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
				if (field.type == 'select-multiple') {
					l = f.elements[i].options.length; 
					for (var j=0; j<l; j++) {
						if(field.options[j].selected)
							s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
					}
				} else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
					s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
				}
			}
		}
		return s.join('&').replace(/%20/g, '+');
	}
	else {
		return false;
	}
};