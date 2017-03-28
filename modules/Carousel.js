(function() {
	class Carousel {
		constructor(options) {
			if(!(options instanceof Object)){
				throw new Error('Carousel needs options to be specified');
			}
			if(!options.wrapperSelector || !options.transitionTime) {
				throw new Error('Carousel needs wrapperSelector and transitionTime to be specified');
			}
			this.$wrapper = Q(options.wrapperSelector);
			this.options.transitionTime = options.transitionTime;
		}

		init () {
			if(!this.$wrapper.nodes.length) {
				console.error('There is no wrapperSelector in DOM, exiting');
				return;
			}

			(this.navigation.$next = this.$wrapper.find(this.options.navigation.next)).attr('navigate', 'next');
			(this.navigation.$prev = this.$wrapper.find(this.options.navigation.prev)).attr('navigate', 'prev');

			this.items = this.$wrapper.find(this.options.item).nodes;

			this.addEventHandlers();

			this.setActiveItem(0);
		}

		addEventHandlers () {
			for(let key in this.navigation) {
				let $nav = this.navigation[key];
				$nav.click((e) => {
					let direction = $nav.attr('navigate');
					this.navigate(direction);
				});
			}
		}

		navigate (direction) {
			let index;
			switch (direction) {
				case 'next':
				index = this.getNextIndex();
				break;

				case 'prev':
				index = this.getPreviousIndex();
				break;

				default:
				index = 0;
				break;
			}
			this.setActiveItem(index);
		}

		setActiveItem (index) {
			if(this.toggleClassTimeout) {
				return;
			}
			const prev = this.getPreviousIndex();
			const next = this.getNextIndex();
			const $item = Q(this.items[index]);
			const prevIndex = this.activeIndex !== undefined ? this.activeIndex : null;
			const $prevItem = this.$activeItem !== undefined ? this.$activeItem : null;
			this.$activeItem = $item;
			this.activeIndex = index;

			this.$activeItem.addClass('active in');
			if($prevItem) {
				$prevItem.addClass('out').removeClass('active');
			}


			this.toggleClassTimeout = setTimeout(() => {
				if($prevItem) {
					$prevItem.removeClass('out');
				}
				this.$activeItem.removeClass('in');
				clearTimeout(this.toggleClassTimeout = null);
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
		transitionTime: null
	};

	Q.extend({ Carousel });
})();
