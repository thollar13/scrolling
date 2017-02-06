'use strict';

(function ($, window) {
	"use strict";
	var wb = {
		sampleFunction: {
			test: function test() {
				return true;
			},
			run: function run() {

				/// force reload to top of the page
				$(document).ready(function () {
					$(this).scrollTop(0);
				});

				setResizes();

				$(window).resize(function () {
					setResizes();
				});

				function setResizes() {
					$('.scroll-viewer').css('height', windowHeight() + "px");
					$('.main-container').css('width', $(window).width() + "px");
				}

				function windowHeight() {
					return $(window).height();
				}

				function scrollPosition() {
					return $(document).scrollTop();
				}

				$('.scroll-item').first().addClass('active').next().addClass('active');

				//// GET WHERE ITEMS NEED TO START FADE ////
				var divPosition = [],
				    top = 0,
				    bottom = 0,
				    height = 0,
				    counter = 0;

				$('.scroll-item__container').each(function (i) {
					height = $(this).height();
					var scrollAt = height - windowHeight();
					//// MAKE SURE WE HAVE DEFINITIONS
					if (divPosition.length) {
						top = divPosition[i - 1]['height'] + divPosition[i - 1]['top'];
						bottom = height + top;
						scrollAt = bottom - windowHeight();
						height = height;
					} else {
						height = 0 + height;
						bottom = 0 + height;
					}

					//// PUSH VALUES TO ARRAY OF OBJETS ////
					divPosition.push({
						index: $('.scroll-item').length - i,
						height: height,
						top: top,
						scrollAt: scrollAt,
						bottom: bottom,
						scrollUpAt: top + windowHeight()
					});
				});

				console.log(divPosition);

				//// SET DYNAMIC Z-INDEXS ////
				$.each(divPosition, function (i) {
					$('.scroll-item').eq(i).css('z-index', divPosition[i]['index']);
				});
				//// SET OVERLAY TO FIRST SCROLL ITEMS INDEX ////
				$('.scroll-overlay').css('z-index', divPosition[0]['index']);

				//// SET OVERALL BODY HEIGHT TO BE ABLE TO SCROLL ////
				$('body').css('height', divPosition[divPosition.length - 1]['bottom'] + 'px');

				//// SET OVERLAY POSITION COUNTER ////
				var overlay = divPosition[0]['index'];

				//// SCROLL EVENTS ////
				var mousewheelevt = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel";
				$(window).bind(mousewheelevt, function (e) {

					var evt = window.event || e;
					evt = evt.originalEvent ? evt.originalEvent : evt;
					var delta = evt.detail ? evt.detail * -40 : evt.wheelDelta;

					var currIndex = $('.scroll-item').eq(counter).find('.scroll-item__container');

					var scroll_At = divPosition[counter]['scrollAt'],
					    scroll_Bottom = divPosition[counter]['bottom'],
					    scroll_Height = divPosition[counter]['height'],
					    scroll_Top = divPosition[counter]['top'];

					var active = $('.active');

					console.log(scrollPosition());

					if (delta > 0) {

						// make sure we're not at the top of the page
						if (scrollPosition() > 0) {

							if (scrollPosition() > scroll_Top && scrollPosition() < scroll_Bottom) {
								// is above the scrollAt position
								if (scrollPosition() < scroll_At) {

									if (scrollPosition() < scroll_Top) {
										$('.active').first().css('transform', 'translateY(' + (scrollPosition() - scroll_Top) + 'px)');
									}

									$('.active').first().css('transform', 'translateY(0px)');
									$(currIndex).css('top', 0);
								} else {
									$('.active').first().css('top', 0);
									var yAxis = scroll_At - scrollPosition();
									if (yAxis < 0) {
										$('.active').first().css('transform', 'translateY(' + yAxis + 'px)');
									}
									var fade = (divPosition[counter + 1]['top'] - scrollPosition()) / windowHeight();
									$('.scroll-overlay').css('opacity', fade);
								}
							} else {
								//// is below the scrollAt position

								active.first().prev('.scroll-item').addClass('active');
								active.last().removeClass('active');
								active.first().next('.scroll-item').removeClass('active');

								if (scrollPosition() < scroll_Bottom) {
									counter = counter - 1;
									$('.scroll-overlay').css({
										opacity: 0,
										zIndex: overlay - counter
									});
								}
							}
						}
					} else {

						if (scrollPosition() < divPosition[counter]['scrollAt']) {
							// $(currIndex).css('top', (divPosition[counter]['top'] - scrollPosition())+'px')
						} else {
								var fade = (divPosition[counter + 1]['top'] - scrollPosition()) / windowHeight();
								$('.scroll-overlay').css('opacity', fade);
								$('.active').first().css('transform', 'translateY(' + (divPosition[counter]['scrollAt'] - scrollPosition()) + 'px)');
							}

						if (scrollPosition() > divPosition[counter]['bottom']) {
							$('.scroll-item').eq(counter).css('top', -windowHeight() + 'px').removeClass('active');
							$('.active').first().next().addClass('active');
							counter = counter + 1;
							$('.scroll-overlay').css({
								opacity: 1,
								zIndex: overlay - counter
							});
						}
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