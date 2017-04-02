(function() {
	let _options = {
		thisActiveClass: 'active',
		elementActiveClass: 'active'
	};

	const card = function(options) {

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
