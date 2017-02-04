(function($, window){
	"use strict";
	var wb = {
		sampleFunction: {
			test: function() {
				return true;
			},
			run: function() {

				var windowHeight = $(window).height();
				var numberOfItems = $('.scroll-item').length;
				$('.scroll-item').first().addClass('active').next().addClass('active');

				setResizes();

				$(window).resize(function() {
					setResizes();				  
				});

				function setResizes() {
					var windowHeight = $(window).height();
					var windowWidth = $(window).width();
					$('.scroll-viewer').css('height', windowHeight+"px");
					$('.main-container').css('width', windowWidth+"px");

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
				$('.scroll-item__container').each(function(i) {
					var scrollAt = $(this).height() - windowHeight;

					// make sure have defined lengths
					if(divPosition.length) {
						top = divPosition[i-1]['height'] + divPosition[i-1]['top'];
						bottom = $(this).height() + top;
						scrollAt = bottom - windowHeight;
					}

					// push to an array of objects
					divPosition.push({
						index: i,
						height: $(this).height(),
						top: top,
						scrollAt: scrollAt,
						bottom: bottom
					})
					
				});

				var divLength = divPosition.length;
				// console.log(divPosition);

				$('body').css('height', divPosition[divPosition.length-1]['bottom']+windowHeight+'px');
			
			
				var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"
				$(window).bind(mousewheelevt, function(e){

				    var evt = window.event || e
				    evt = evt.originalEvent ? evt.originalEvent : evt; 
				    var delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta

				    var currentPosition = $(document).scrollTop();
	      	  var windowHeight = $(window).height();
	          var currIndex = $('.scroll-item').eq(counter).find('.scroll-item__container');

				    if(delta > 0) {

		          if(looped == 0) {
		          	totalHeight = currIndex.height() + totalHeight;
		          	divLength = divLength + 1;
		          	looped = 1;
		          }

		          if(currentPosition < divPosition[counter]['scrollAt']) {
		          	$(currIndex).css('top', (divPosition[counter]['bottom'] - (divPosition[counter]['top'] + currentPosition))+'px');
		          	if(currentPosition < divPosition[counter]['top']) {
		          		$('.active').first().css('transform', 'translateY(' + (currentPosition-divPosition[counter]['scrollAt']) + 'px)');
		          	}
		          } else {
		          	// divPosition[counter]['']-windowHeight
		          	// var fade = ((divPosition[counter+1]['bottom']-currentPosition)/windowHeight) - 2;
		          	// $('.scroll-overlay').css('opacity', fade);
		          	var yAxis = (divPosition[counter]['scrollAt'] - currentPosition);
		          	if(yAxis < 0) {
		          		$('.active').first().css('transform', 'translateY(' + yAxis + 'px)');
		          	}
		          }

		          if(currentPosition < divPosition[counter]['top']) {
		          		$('.active').first().css('top', (windowHeight-0)+'px');
		          		$('.active').first().prev('.scroll-item').addClass('active');
		          		$('.active').last().removeClass('active');
		          		$('.active').first().next('.scroll-item').addClass('active');

		          		$('.scroll-overlay').css({
		          			opacity: 0,
		          			zIndex: divLength - counter
		          		});
		          		counter = counter + 1;
		          		looped = 0;
		          }

				    } else {

		          if(looped == 0) {
		          	totalHeight = currIndex.height() + totalHeight;
		          	divLength = divLength - 1;
		          	looped = 1;
		          }

		          if(currentPosition < divPosition[counter]['scrollAt']) {
		          	$(currIndex).css('top', (divPosition[counter]['top'] - currentPosition)+'px');
		          } 
		          else {
		          	var fade = (divPosition[counter+1]['top']-currentPosition)/windowHeight;
		          	$('.scroll-overlay').css('opacity', fade);
		          	$('.active').first().css('transform', 'translateY(' + ((totalHeight - windowHeight)-currentPosition) + 'px)');
		          }

		         	if(currentPosition > totalHeight) {
		         		// $('body').addClass('stop-scrolling');
		         		// setTimeout(function() {
		         		// 	$('body').removeClass('stop-scrolling');
		         		// }, 1000);
		         		$('.scroll-item').eq(counter).css('top', -(windowHeight)+'px').removeClass('active');
		         		$('.active').first().next().addClass('active');
		         		$('.scroll-overlay').css({
		         			opacity: 1,
		         			zIndex: divLength
		         		});
		         		counter = counter + 1;
		         		looped = 0;
		         	}

				    }   
				});

				// $(window).scroll(function() {
					
				//   var currentPosition = $(document).scrollTop();
				//   var windowHeight = $(window).height();
			 //    var currIndex = $('.scroll-item').eq(counter).find('.scroll-item__container');
			    
			 //    // console.log(currentPosition);

			 //    if(looped == 0) {
			 //    	totalHeight = currIndex.height() + totalHeight;
			 //    	divLength = divLength - 1;
			 //    	looped = 1;
			 //    }

			 //    if(currentPosition < divPosition[counter]['scrollAt']) {
			 //    	$(currIndex).css('top', (divPosition[counter]['top'] - currentPosition)+'px');
			 //    } 
			 //    else {
			 //    	var fade = (divPosition[counter+1]['top']-currentPosition)/windowHeight;
			 //    	$('.scroll-overlay').css('opacity', fade);
			 //    	$('.active').first().css('transform', 'translateY(' + ((totalHeight - windowHeight)-currentPosition) + 'px)');
			 //    }

			 //   	if(currentPosition > totalHeight) {
			 //   		$('.scroll-item').eq(counter).css('top', -(windowHeight)+'px').removeClass('active');
			 //   		$('.active').first().next().addClass('active');
			 //   		$('.scroll-overlay').css({
			 //   			opacity: 1,
			 //   			zIndex: divLength
			 //   		});
			 //   		counter = counter + 1;
			 //   		looped = 0;
			 //   	}

				// });

			}
		}
	};
	for (var key in wb){
		if (wb[key].test()){
			wb[key].run();
		}
	}
}(jQuery, window));
