(function($, window){
	"use strict";
	var wb = {
		sampleFunction: {
			test: function() {
				return true
			},
			run: function() {

				setResizes()

				$(window).resize(function() {
					setResizes();			  
				});

				function setResizes() {
					$('.scroll-viewer').css('height', windowHeight()+"px")
					$('.main-container').css('width', $(window).width()+"px")

					var itemHeight = $('.active').first().height()
				}

				function windowHeight() {
					return $(window).height()
				}

				function scrollPosition() {
					return $(document).scrollTop()
				}

				var numberOfItems = $('.scroll-item').length
				$('.scroll-item').first().addClass('active').next().addClass('active')		
				var counter = 0, totalHeight = 0, looped = 0

				//
				// GET WHERE ITEMS NEED TO START FADE //
				//

				var divPosition = [], top = 0, bottom = 0, height = 0

				$('.scroll-item__container').each(function(i) {
					height = $(this).height()
					var scrollAt = height - windowHeight()
					// make sure have defined lengths
					if(divPosition.length) {
						top = divPosition[i-1]['height'] + divPosition[i-1]['top']
						bottom = height + top
						scrollAt = bottom - windowHeight()
						height = height
					} else {
						height = 0 + height
						bottom = 0 + height
					}

					// push to an array of objects
					divPosition.push({
						index: $('.scroll-item').length - i,
						height: height,
						top: top,
						scrollAt: scrollAt,
						bottom: bottom,
						scrollUpAt: top + windowHeight(),
					})
					
				})

				// set z-indexs
				$.each(divPosition,function(i) {
					$('.scroll-item').eq(i).css('z-index', divPosition[i]['index'])
				});
				$('.scroll-overlay').css('z-index', divPosition[0]['index'])

				var divLength = divPosition.length
				$('body').css('height', divPosition[divLength-1]['bottom']+'px')
			

				//// SCROLL EVENTS
				var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"
				$(window).bind(mousewheelevt, function(e){

				    var evt = window.event || e
				    evt = evt.originalEvent ? evt.originalEvent : evt
				    var delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta

	          var currIndex = $('.scroll-item').eq(counter).find('.scroll-item__container')

				    if(delta > 0) {

				    	// make sure we're not at the top of the page
		          if(scrollPosition() > 0 ) {
		          	
		          	if(looped == 0) {
		          		looped = 1
		          	}

		          	if((scrollPosition() > divPosition[counter]['top']) && (scrollPosition() < divPosition[counter]['bottom']))  {
		          		// is above the scrollAt position
		          		if(scrollPosition() < divPosition[counter]['scrollAt']) {
		          			$(currIndex).css('top', (divPosition[counter]['bottom'] - (divPosition[counter]['height'] + scrollPosition()))+'px')
		          			if(scrollPosition() < divPosition[counter]['top']) {
		          				$('.active').first().css('transform', 'translateY(' + (scrollPosition()-divPosition[counter]['scrollAt']) + 'px)')
		          			}
		          		} else {
		          			var yAxis = (divPosition[counter]['scrollAt'] - scrollPosition())
		          			if(yAxis < 0) {
		          				$('.active').first().css('transform', 'translateY(' + yAxis + 'px)')
		          			}
		          		}
	          		} else {
	          			//// is below the scrollAt position
	          			var active = $('.active')

	          			active.first().prev('.scroll-item').addClass('active')
	          			active.last().removeClass('active')
	          			active.first().next('.scroll-item').removeClass('active')

	          			if(scrollPosition() < divPosition[counter]['bottom']) {
	          				counter = counter - 1
	          				$('.scroll-overlay').css({
	          					opacity: 0,
	          					zIndex: divLength-counter
	          				})
	          				looped = 0
	          			} 
	          			console.log("looped :"+looped);
	          			console.log("counter :"+counter);
	          			
	          		}

							}		          

				    } else {

		          if(looped == 0) {
		          	totalHeight = currIndex.height() + totalHeight
		          	divLength = divLength - 1
		          	looped = 1
		          }

		          if(scrollPosition() < divPosition[counter]['scrollAt']) {
		          	$(currIndex).css('top', (divPosition[counter]['top'] - scrollPosition())+'px')
		          } 
		          else {
		          	var fade = (divPosition[counter+1]['top']-scrollPosition())/windowHeight()
		          	$('.scroll-overlay').css('opacity', fade)
		          	$('.active').first().css('transform', 'translateY(' + (divPosition[counter]['scrollAt']-scrollPosition()) + 'px)')
		          }

		         	if(scrollPosition() > divPosition[counter]['bottom']) {
		         		$('.scroll-item').eq(counter).css('top', -(windowHeight())+'px').removeClass('active')
		         		$('.active').first().next().addClass('active')
		         		// $('.scroll-overlay').css({
		         		// 	opacity: 1,
		         		// 	zIndex: divLength
		         		// });
		         		counter = counter + 1
		         		looped = 0
		         	}

				    }   
				});

			}
		}
	};
	for (var key in wb){
		if (wb[key].test()){
			wb[key].run();
		}
	}
}(jQuery, window));
