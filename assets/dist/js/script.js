'use strict';

(function ($, window) {
	"use strict";
	var wb = {
		sampleFunction: {
			test: function test() {
				return true;
			},
			run: function run() {

				var windowHeight = $(window).height();
				var numberOfItems = $('.scroll-item').length;
				$('.scroll-item').first().addClass('active').next().addClass('active');

				setResizes();

				$(window).resize(function () {
					setResizes();
				});

				function setResizes() {
					var windowHeight = $(window).height();
					var windowWidth = $(window).width();
					$('.scroll-viewer').css('height', windowHeight + "px");
					$('.main-container').css('width', windowWidth + "px");

					var itemHeight = $('.active').first().height();
				}

				var counter = 0;
				var totalHeight = 0;
				var looped = 0;

				var startAnimationPosition = [];
				var itemBottom = [];

				console.log(windowHeight);

				//
				// GET WHERE ITEMS NEED TO START FADE //
				//

				var divPosition = [],
				    top = 0,
				    bottom = 0;
				$('.scroll-item__container').each(function (i) {
					var scrollAt = $(this).height() - windowHeight;

					// make sure have defined lengths
					if (divPosition.length) {
						top = divPosition[i - 1]['height'] + divPosition[i - 1]['top'];
						bottom = $(this).height() + top;
						scrollAt = bottom - windowHeight;
					}

					// push to an array of objects
					divPosition.push({
						height: $(this).height(),
						top: top,
						scrollAt: scrollAt,
						bottom: bottom
					});
				});

				var divLength = divPosition.length;
				// console.log(divPosition);

				$('body').css('height', divPosition[divPosition.length - 1]['bottom'] + windowHeight + 'px');

				$(window).scroll(function () {

					var currentPosition = $(document).scrollTop();
					var windowHeight = $(window).height();
					var currIndex = $('.scroll-item').eq(counter).find('.scroll-item__container');

					// console.log(currentPosition);

					if (looped == 0) {
						totalHeight = currIndex.height() + totalHeight;
						divLength = divLength - 1;
						looped = 1;
					}

					if (currentPosition < divPosition[counter]['scrollAt']) {
						$(currIndex).css('top', divPosition[counter]['top'] - currentPosition + 'px');
					} else {
						console.log("top: " + divPosition[counter + 1]['top']);
						console.log("currentpos :" + currentPosition);
						console.log("window : " + windowHeight);
						var fade = (divPosition[counter + 1]['top'] - currentPosition) / windowHeight;
						var yAxis = Math.abs($('.active').first().height());
						console.log(fade);
						console.log("ad" + (divPosition[counter + 1]['scrollAt'] - currentPosition));
						$('.scroll-overlay').css('opacity', fade);
						$('.active').first().css('transform', 'translateY(' + (totalHeight - windowHeight - currentPosition) + 'px)');
					}

					if (currentPosition > totalHeight) {
						$('.scroll-item').eq(counter).css('top', -windowHeight + 'px').removeClass('active');
						$('.active').first().next().addClass('active');
						$('.scroll-overlay').css({
							opacity: 1,
							zIndex: divLength
						});
						counter = counter + 1;
						looped = 0;
					}
				});
			}
		}
	};
	for (var key in wb) {
		if (wb[key].test()) {
			wb[key].run();
		}
	}
})(jQuery, window);