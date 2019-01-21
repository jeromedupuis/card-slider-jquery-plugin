try {
	(function($) {
		"use strict"
		if($ === undefined) {
			throw new Error('jQuery plugin is missing');
		}

		var defaults = {
			slideTag: 'div',
			slideClass: null,
			current: 1,
			onBeforeMove: null,
			onAfterMove: null,
			onMove: null,
			onInit: null,
			onCurrent: null,
			followingClass: null
		}

		$.fn.cardSlider = function(options) {

			var self = this;
			this.params = $.extend({}, defaults, options || {});
			this.slider = $(this);
			this.slides = [];
			this.count = 0;
			this.current = this.params.current || 1;
			this.transitionEvent = null;

			this.init = function() {
				this.transitionEvent = self.whichTransitionEvent();
				this.setSlides();
				this.setSlideIndexes();
				this.setWheeling();
				this.setSlideClasses();
				this.setNavEvents();
				this.followContent();
				this.callFunction(this.params.onInit);
			}

			this.setNavEvents = function() {
				this.slider.delegate('.right-slide', 'click', function() {
					self.next();
					return false;
				});
				this.slider.delegate('.left-slide', 'click', function() {
					self.prev();
					return false;
				});

				this.slider.delegate('.center-slide', 'click', function() {
					self.callFunction(self.params.onCurrent);
					return false;
				});
			}

			//slider functions
			this.setSlides = function() {
				if(this.params.slideClass) {
					this.slides = this.slider.find(this.params.slideTag+'.'+this.params.slideClass);
				}
				else {
					this.slides = this.slider.find(this.params.slideTag);
				}
				this.count = this.slides.length;
			}

			this.setSlideIndexes = function() {
				var i = 0;
				this.slides.each(function() {
					$(this).attr('data-index', i).data('index', i);
					i++;
				});
			}

			this.resetSlideClasses = function() {
				this.slides.removeClass('left-hidden-slide left-slide center-slide right-slide right-hidden-slide').addClass('hidden-slide');
			}

			this.setSlideClasses = function() {
				this.resetSlideClasses();

				var classes = {
					'-2': 'left-hidden-slide'
					, '-1': 'left-slide'
					, '0': 'center-slide'
					, '1': 'right-slide'
					, '2': 'right-hidden-slide'
				};

				var inc = 0;
				for(var i in classes) {
					if(inc+1 > this.count) continue;
					var classname = classes[i];
					var slide = this.getSlidePosition(i);
					if(slide) {
						slide.addClass(classname).removeClass('hidden-slide');
					}
					inc++;
				}
			}

			this.getIndexPosition = function(i) {
				var position = parseInt(this.current)+parseInt(i);
				if(position >= this.count) {
					position = position-this.count;
				}
				else if(position <= 0) {
					position = this.count+position;
				}
				return position;
			}

			this.getSlidePosition = function(i) {
				var position = this.getIndexPosition(i);
				var index = this.getIndex(position);
				var slide = this.getSlideByIndex(index);
				return slide;
			}

			this.setWheeling = function() {
				var clone = null;
				var slide = null;

				if(this.count == 1 || this.count > 5) {
					return false;
				}

				slide = this.getSlideByIndex(this.getIndex(1));
				if(slide) {
					clone = slide.clone(true);
					this.slider.append(clone);
				}

				slide = this.getSlideByIndex(this.getIndex(2));
				if(slide) {
					clone = slide.clone(true);
					this.slider.append(clone);
				}

				if(this.count == 2) {
					slide = this.getSlideByIndex(this.getIndex(1));
					if(slide) {
						clone = slide.clone(true);
						this.slider.append(clone);
					}

					slide = this.getSlideByIndex(this.getIndex(2));
					if(slide) {
						clone = slide.clone(true);
						this.slider.append(clone);
					}
				}
				if(this.count >= 3) {
					slide = this.getSlideByIndex(this.getIndex(3));
					if(slide) {
						clone = slide.clone(true);
						this.slider.append(clone);
					}
					if(this.count >= 4) {
						slide = this.getSlideByIndex(this.getIndex(4));
						if(slide) {
							clone = slide.clone(true);
							this.slider.append(clone);
						}
					}
					if(this.count >= 5) {
						slide = this.getSlideByIndex(this.getIndex(5));
						if(slide) {
							clone = slide.clone(true);
							this.slider.append(clone);
						}
					}
				}

				this.setSlides();
			}
			this.getSlideByIndex = function(index) {
				if(!this.slides || !this.slides.length) {
					throw new Error('Slides is missing');
				}
				var slide = $(this.slides.get(index));
				if(!slide || !slide.length) return null;
				return slide;
			}

			this.getCurrentSlide = function() {
				return this.getSlideByIndex(this.getIndex(this.current));
			}

			this.afterMoveHandler = function() {
				self.callFunction(self.params.onAfterMove);
			}

			this.moveHandler = function() {
				self.setSlideClasses();
				if(self.hasFunction(self.params.onMove)) {
					self.callFunction(self.params.onMove, self.afterMoveHandler);
				} else {
					self.afterMoveHandler();
				}

				if(self.hasFunction(self.params.onAfterTransition)) {
					var slide = self.getCurrentSlide();
					slide.one(self.transitionEvent, function() {
						self.callFunction(self.params.onAfterTransition);
					})
				}

				self.followContent();
			}
			this.move = function() {
				if(this.current == 0) {
					this.current = this.count;
				}
				else if(this.current > this.count) {
					this.current = 1;
				}

				if(this.hasFunction(this.params.onBeforeMove)) {
					this.callFunction(this.params.onBeforeMove, this.moveHandler);
				}
				else {
					this.moveHandler();
				}
			}

			this.next = function() {
				this.current++;
				this.move();
			}

			this.prev = function() {
				this.current--;
				this.move();
			}

			this.followContent = function() {
				if(this.params.followingClass) {
					$('.'+this.params.followingClass).hide();
					var slide = this.getSlideByIndex(this.getIndex(this.current));
					if(slide) {
						var index = slide.data('index');
						$('.'+this.params.followingClass+'[data-index="'+index+'"]').show();
					}
				}
			}

			//tools functions
			this.hasFunction = function(func) {
				if(func && typeof func == 'function') {
					return true;
				}
				return false;
			}

			this.callFunction = function(func, callback) {
				if(this.hasFunction(func)) {
					func(this, callback);
				}
			}

			this.getIndex = function(i) {
				i = i - 1;
				return i;
			}

			this.getPercent = function(width, percent) {
				return parseFloat(width) / 100 * percent;
			}

			this.whichTransitionEvent = function() {
				var t, el = document.createElement("transitionCheckElement");
				var transitions = {
					"transition"      : "transitionend",
					"OTransition"     : "oTransitionEnd",
					"MozTransition"   : "transitionend",
					"WebkitTransition": "webkitTransitionEnd"
				}

				for (t in transitions) {
					if (el.style[t] !== undefined) {
						return transitions[t];
					}
				}
			}

			this.init();
			return this;
		}

	//eslint-disable-next-line
	})(jQuery);

} catch(err) {
	//eslint-disable-next-line
	console.log(err);
}
