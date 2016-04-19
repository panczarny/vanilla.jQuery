/*
** done:
fadeIn()
fadeOut()
hide()
show()
toggle()
Ajax()
addClass()
removeClass()
toggleClass() trzeba fix na IE9
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


/*
** hide()
**/
Element.prototype.hide = function() {
	this.style.display = "none";
};


/*
** show()
**/
Element.prototype.show = function(display) {
	display = display || "block";
	this.style.display = display;
};


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
var Ajax = function(options, done, fail) {
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
		console.log('PROBLEM ON IE9!');
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




/*
** TESTY
**/
(function() {
	var f = document.getElementsByClassName('wrapper')[0];
	f.toggleClass('wrapper');
	// f.toggleClass('wrapper');

	// ajax request example
	Ajax({
		type: 'GET',
		url: 'ajax.php'
	}, 
	function(message, status, statusText) {
		var data;
		try {
			data = JSON.parse(message);
		}
		catch(e) {
			console.log(e.message);
			return false;
		}
		console.log(data);
	},
	function(message, status, statusText) {
		console.log(message);
		console.log(status);
		console.log(statusText);
	});
})();
