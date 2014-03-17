if(typeof Sedo == 'undefined') Sedo = {};
!function($, window, document, _undefined)
{    
	Sedo.TwentyX2 = 
	{
		init: function($e)
		{
			$e.each(function() {
				var container = $(this).addClass("twentytwenty-container");
					diffPos = parseFloat(container.data('diffPos')),
					img1 = container.find('img').eq(0),
					img2 = container.find('img').eq(1),
					imgWidth1 = parseInt(img1.data('width')),
					imgWidth2 = parseInt(img2.data('width')),
					parentWidth = container.parents('.adv_bimg_block').addClass('compare').width();

				if(parentWidth != 0){
					if(imgWidth1 > parentWidth){
						imgWidth1 = parentWidth;
						img1.attr('data-width', imgWidth1);
					}

					if(imgWidth2 > parentWidth){
						imgWidth2 = parentWidth;
						img2.attr('data-width', imgWidth2);
					}
				}

				img1.width(imgWidth1);
				img2.width(imgWidth2);
					
				var widestWidth = (imgWidth1 > imgWidth2) ? imgWidth1 : imgWidth2;
				container.width(widestWidth).attr('data-width', widestWidth);
		
				var sliderPct = (diffPos) ? diffPos : 0.5,
					sliderOrientation = (container.hasClass('DiffV')) ? 'vertical' : 'horizontal';
					
				var beforeDirection = (sliderOrientation === 'vertical') ? 'down' : 'left',
					afterDirection = (sliderOrientation === 'vertical') ? 'up' : 'right';
			
				container.wrap("<div class='twentytwenty-wrapper twentytwenty-" + sliderOrientation + "'></div>");
				container.append("<div class='twentytwenty-overlay'></div>");
				container.append("<div class='twentytwenty-handle'></div>");
		
				var slider = container.find(".twentytwenty-handle");
				slider.append("<span class='twentytwenty-" + beforeDirection + "-arrow'></span>");
				slider.append("<span class='twentytwenty-" + afterDirection + "-arrow'></span>");
		
				var beforeImg = container.find("img:first").addClass("twentytwenty-before"),
					afterImg = container.find("img:last").addClass("twentytwenty-after");
			
				var overlay = container.find(".twentytwenty-overlay");
					overlay.append("<div class='twentytwenty-before-label'></div>");
					overlay.append("<div class='twentytwenty-after-label'></div>");
		
				var calcOffset = function(dimensionPct) {
					var w = beforeImg.width(), h = beforeImg.height();
					return {
						w: w+"px",
						h: h+"px",
						cw: (dimensionPct*w)+"px",
						ch: (dimensionPct*h)+"px"
					};
				};
		
				var adjustContainer = function(offset) {
					if (sliderOrientation === 'vertical') {
						beforeImg.css("clip", "rect(0,"+offset.w+","+offset.ch+",0)");
					} else {
						beforeImg.css("clip", "rect(0,"+offset.cw+","+offset.h+",0)");
					}
					container.css("height", offset.h);
				};
		
				var adjustSlider = function(pct) {
					var offset = calcOffset(pct);
					slider.css((sliderOrientation==="vertical") ? "top" : "left", (sliderOrientation==="vertical") ? offset.ch : offset.cw);
					adjustContainer(offset);
				}
		
				$(window, slider).on("resize.twentytwenty", function(e) {
					adjustSlider(sliderPct);
				});
		
				var offsetX = 0, imgWidth = 0;
			
				slider.on("movestart", function(e) {
					if (((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) && sliderOrientation !== 'vertical') {
						e.preventDefault();
					} else if (((e.distX < e.distY && e.distX < -e.distY) || (e.distX > e.distY && e.distX > -e.distY)) && sliderOrientation === 'vertical') {
						e.preventDefault();
					}
		
					container.addClass("active");
					offsetX = container.offset().left;
					offsetY = container.offset().top;
					imgWidth = beforeImg.width(); 
					imgHeight = beforeImg.height();	    
				});
		
				slider.on("moveend", function(e) {
					container.removeClass("active");
				});
		
				slider.on("move", function(e) {
					if(container.hasClass("active")) {
						sliderPct = (sliderOrientation === 'vertical') ? (e.pageY-offsetY)/imgHeight : (e.pageX-offsetX)/imgWidth;
			    			if (sliderPct < 0) {
							sliderPct = 0;
						}
						if (sliderPct > 1) {
							sliderPct = 1;
						}
						adjustSlider(sliderPct);
					}
				});
		
				container.find("img").on("mousedown", function(event) {
					event.preventDefault();
				});
		
				$(window).trigger("resize.twentytwenty");
			});
		},
		reload: function() 
		{
			$('.AdvBimgDiff').each(function(){
				var $this = $(this);

				if($this.height() == 0){
					$this.find('img').load(function(){
						$this.width($this.data('width')).trigger('resize.twentytwenty');
					});
				}
			});
		}
	}

	XenForo.register('.AdvBimgDiff', 'Sedo.TwentyX2.init');
	$(document).on('XenForoActivate', Sedo.TwentyX2.reload);
}
(jQuery, this, document);