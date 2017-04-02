(function() {
	class Carousel {
		constructor(options) {
			if(!(options instanceof Object)){
				throw new Error('Carousel needs options to be specified');
			}
			if(!options.wrapperSelector || !options.transitionTime) {
				throw new Error('Carousel needs wrapperSelector and transitionTime to be specified');
			}

			Object.assign(this.options, options);
		}

		init () {
			this.$wrapper = Q(this.options.wrapperSelector);
			if(!this.$wrapper.nodes.length) {
				console.error('There is no wrapperSelector in DOM, exiting');
				return;
			}

			(this.navigation.$next = this.$wrapper.find(this.options.navigation.next)).attr('navigate', 'next');
			(this.navigation.$prev = this.$wrapper.find(this.options.navigation.prev)).attr('navigate', 'prev');

			this.items = this.$wrapper.find(this.options.item).nodes;

			if(this.options.indicators) {
				this.makeIndicators();
			}

			this.addEventHandlers();

			this.setActiveItem(0);
		}

		makeIndicators () {
			this.$indicators = this.createIndicators();
			this.$wrapper.append(this.$indicators);
		}

		createIndicators () {
			let $ol = Q('<ol>', {
				class: 'indicators'
			});
			for(let i = 0, len = this.items.length; i < len; i++) {
				let $li = Q('<li>', {
					'data-order': i
				});
				$ol.append($li);
			}

			return $ol;
		}

		addEventHandlers () {
			for(let key in this.navigation) {
				let $nav = this.navigation[key];
				$nav.click((e) => {
					let direction = $nav.attr('navigate');
					this.navigate(direction);
				});
			}

			if(this.options.indicators) {
				this.$indicators.on('click', 'li', (e) => {
					const nextSlide = Q(e.target).attr('data-order');
					this.navigate(nextSlide);
				});
			}

			if(this.options.swipe) {
				if(!Q.isFunction(Q.fn.swipe)) {
					throw new Error('Please include Q.swipe in order to allow swipe methods');
				}

				this.$wrapper.swipe(this.options.swipe, (diff) => {
					let next = '';

					next = diff.x > 0 ? 'next' : 'prev';
					this.navigate(next);
				});
			}
		}

		navigate (direction) {
			let index = 0;
			switch (direction) {
				case 'next':
				index = this.getNextIndex();
				break;

				case 'prev':
				index = this.getPreviousIndex();
				break;

				default:
				if(Q.isNumeric(direction = parseInt(direction)) && direction >= 0 && direction < this.items.length) {
					index = direction;
				}
				break;
			}
			this.setActiveItem(index);
		}

		setActiveItem (index) {
			if(this.toggleClassTimeout || this.activeIndex === index) {
				return;
			}
			const $item = Q(this.items[index]);
			const prevIndex = this.activeIndex !== undefined ? this.activeIndex : null;
			const $prevItem = this.$activeItem !== undefined ? this.$activeItem : null;
			this.$activeItem = $item;
			this.activeIndex = index;

			this.$activeItem.addClass('active in');
			if($prevItem) {
				$prevItem.addClass('out').removeClass('active');
			}

			if(this.options.indicators) {
				let $li;
				($li = this.$indicators.find('li')).removeClass('active');
				Q($li.nodes[this.activeIndex]).addClass('active');
			}

			this.toggleClassTimeout = setTimeout(() => {
				if($prevItem) {
					$prevItem.removeClass('out');
				}
				this.$activeItem.removeClass('in');
				clearTimeout(this.toggleClassTimeout = null);

				this.options.onCarouselSlideEnd({
					activeItem: this.$activeItem,
					prevItem: $prevItem,
					activeIndex: this.activeIndex
				});
			}, this.options.transitionTime);
		}

		getPreviousIndex () {
			let prev;
			const len = this.items.length;
			if (this.activeIndex < 0 || this.activeIndex >= len) {
				prev = 0;
			}
			switch(len) {
				case 0:
				prev = 0;
				break;

				case 1:
				prev = this.activeIndex;
				break;

				default:
				prev = this.activeIndex === 0 ? len - 1 : this.activeIndex - 1;
				break;
			}
			return prev;
		}

		getNextIndex () {
			let next;
			const len = this.items.length;
			if (this.activeIndex < 0 || this.activeIndex >= len) {
				next = 0;
			}
			switch(len) {
				case 0:
				next = 0;
				break;

				case 1:
				next = this.activeIndex;
				break;

				default:
				next = this.activeIndex === len - 1 ? 0 : this.activeIndex + 1;
				break;
			}
			return next;
		}
	}

	Carousel.prototype.navigation = {};
	Carousel.prototype.options = {
		navigation: {
			next: '.next',
			prev: '.prev'
		},
		item: '.item',
		transitionTime: null,
		indicators: true,
		swipe: {
			threshold: 50,
			customCheck: function(diff) {
				return Math.abs(diff.x) > this.threshold;
			}
		},
		onCarouselSlideEnd: () => {}
	};

	Q.extend({ Carousel });
})();
