(function() {
	let _options = {
		threshold: false,
		allowedTime: false,
		customCheck: false
	};

	const swipe = function(options = {}, succeeded = () => {}, failed = () => {}) {
		Object.assign(_options, options);

		this.each(function(el) {
			$el = Q(el);
			$el.on('touchstart', function(e) {
				this.start = {
					x: e.changedTouches[0].clientX,
					y: e.changedTouches[0].clientY,
					time: new Date().getTime()
				};
			})
			.on('touchend', function(e) {
				let canCallCallback = false;

				this.end = {
					x: e.changedTouches[0].clientX,
					y: e.changedTouches[0].clientY,
					time: new Date().getTime()
				};

				this.diff = {
					x: this.end.x -  this.start.x,
					y: this.end.y -  this.start.y,
					time: this.end.time - this.start.time
				};

				this.diff.distance = Math.round(Math.sqrt(Math.pow(this.diff.x, 2) + Math.pow(this.diff.y, 2)));

				const diff = Object.assign({}, this.diff);

				if(_options.customCheck && Q.isFunction(_options.customCheck)) {
					canCallCallback = _options.customCheck(diff);
				}
				else {
					canCallCallback = validSwipe.call(diff);
				}
				if(canCallCallback) {
					succeeded(diff);
				}
				else {
					failed(diff);
				}
			});
		});

		return this;
	};

	const validSwipe = (diff) => {
		let isValid = false;

		if(_options.threshold && _options.allowedTime) {
			if(distanceBeaten(diff) && timeBeaten(diff)) {
				isValid = true;
			}
		}
		else if(_options.threshold) {
			if(distanceBeaten(diff)) {
				isValid = true;
			}
		}
		else if (_options.allowedTime) {
			if(timeBeaten(diff)) {
				isValid = true;
			}
		}

		return isValid;
	};

	const distanceBeaten = (diff) => diff.distance >= _options.threshold;
	const timeBeaten = (diff) => diff.time <= _options.allowedTime;

	Q.fn.extend({ swipe });
})();
