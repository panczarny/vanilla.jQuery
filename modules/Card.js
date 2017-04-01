(function() {

	const card = function(options) {
		_options = {
			thisActiveClass: 'active',
			elementActiveClass: 'active'
		};

		Object.assign(_options, options);

		this.each((el) => {
			Q(el).click(function() {
				const $this = Q(this);
				const href = $this.data('href');
				const $element = Q(href);
				$element.toggleClass(_options.elementActiveClass);
				$this.toggleClass(_options.thisActiveClass);
			});
		});

		return this;
	};

	Q.fn.extend({ card });
})();
