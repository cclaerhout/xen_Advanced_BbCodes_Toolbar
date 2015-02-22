/*Twentytwenty + XenForo Integration*/
if(typeof Sedo == 'undefined') Sedo = {};
!function($, window, document, _undefined)
{    
	Sedo.TwentyX2 = 
	{
		init: function($e)
		{
			$e.each(function() {
				var container = $(this),
					img1 = container.find('img').eq(0),
					img2 = container.find('img').eq(1);

	    			if(img1.width() <= 2 || img1.height() <= 2 || container.data('complete') == 1){
	    				return;	
	    			}
	
	    			var diffPos = parseFloat(container.data('diffPos')),
	    				imgWidth1 = parseInt(img1.data('width')),
	    				imgWidth2 = parseInt(img2.data('width')),
	    				parentWrapper = container.parents('.adv_bimg_block').addClass('compare'),
	    				parentWidth = parentWrapper.width(),
	    				ratio = imgWidth1/100,//fluid
	    				ovlPhrase = container.data('phrase').split('|');
	
	    			container.addClass("twentytwenty-container").data('complete', 1);
	
	    			var manageFluidWidth = function(){
	    				if(!container.hasClass('Fluid')) return;
	    				parentWidth = parentWrapper.width();
	    				
	    				var tmpWidth = parentWidth*ratio,
	    					imageRef = new Image(),
	    					maxWidth, maxWidthImg1, maxWidthImg2;
	    					
	      				imageRef.src = img1.attr('src');
	      				maxWidthImg1 = imageRef.width;
	      				imageRef.src = img2.attr('src');
	      				maxWidthImg2 = imageRef.width;
	      				maxWidth = (maxWidthImg1 > maxWidthImg2) ? maxWidthImg1 : maxWidthImg2;
	
	      				if(tmpWidth > maxWidth){
	      					tmpWidth = maxWidth;
	      				}
	      				
	      				imgWidth1 = imgWidth2 = tmpWidth;
	      			
	    				return tmpWidth;
	    			}
	    			
	    			manageFluidWidth();
	    			
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
	
	    			/*Build slider*/
	    			container.wrap("<div class='twentytwenty-wrapper twentytwenty-" + sliderOrientation + "'></div>");
	    			container.append("<div class='twentytwenty-overlay'></div>");
	    			container.append("<div class='twentytwenty-handle'></div>");
	    	
	    			var slider = container.find(".twentytwenty-handle");
	    			slider.append("<span class='twentytwenty-" + beforeDirection + "-arrow'></span>");
	    			slider.append("<span class='twentytwenty-" + afterDirection + "-arrow'></span>");
	    	
	    			var beforeImg = container.find("img:first").addClass("twentytwenty-before"),
	    				afterImg = container.find("img:last").addClass("twentytwenty-after");
	
	    			var overlay = container.find(".twentytwenty-overlay");
	    				overlay.append("<div class='twentytwenty-before-label-text'>"+ovlPhrase[0]+"</div><div class='twentytwenty-before-label'></div>");
	    				overlay.append("<div class='twentytwenty-after-label-text'>"+ovlPhrase[1]+"</div><div class='twentytwenty-after-label'></div>");
	
	    			/*Adjust slider function*/
	    			var calcOffset = function(dimensionPct) {
	    				var w = beforeImg.width(), h = beforeImg.height();
	    				if(h < 2){
	    					//No idea why it sometimes occurs
	    					var imageRef = new Image();
	    					imageRef.src = beforeImg.attr("src");
	    					h = imageRef.height*(w/imageRef.width);
	    				}
	    				
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
	    	
	    			$(window, slider).on('adjustTwenty', function(e) {
	    				adjustSlider(sliderPct);
	    				//container.trigger('resize');
	    			});
	
	    			adjustSlider(sliderPct);
	
	    			/*Resize slider function*/
	    			var resizeSlider = function(){
	    				var parentWrapperWidth = parentWrapper.parent().width(),
	    					containerWidth = container.width(),
	    					widestImg = (imgWidth1 > imgWidth2) ? img1 : img2,
	    					widestImgRealWidth = widestImg.width(),
	    					overlay = container.find('.twentytwenty-overlay');
	
	    				if(container.hasClass('Fluid')){
	    					var newWidth = manageFluidWidth();
	    					img1.width(newWidth);
	    					img2.width(newWidth);
	    					container.width(newWidth);
	    					adjustSlider(sliderPct);						
	    					return;
	    				}
	
	    				if(containerWidth < parentWrapperWidth){
	    				
	    					if(containerWidth < widestWidth){
	    						container.width(parentWrapperWidth);
	    						overlay.width(parentWrapperWidth);
	    						adjustSlider(sliderPct);
	    					};
	    					return;
	    				}
	    				
	    				container.width(parentWrapperWidth)
	    				overlay.width(parentWrapperWidth);
	    				adjustSlider(sliderPct);		
	    			};
	    			
	    			resizeSlider();
	
	    			$(window, container).on('resize', function(e) {
	    				resizeSlider();
	    			});
	
	    			/*External call*/
	    			container.data('sedoTwenty', {
	    				'adjustTwenty':adjustSlider,
	    				'resizeTwenty': resizeSlider
	    			});
	
	    			/*Events*/		
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
			});
		},
		reload:function() 
		{
			$('.AdvBimgDiff').each(function(){
				var $this = $(this);

				if($this.height() == 0){
					$this.find('img').load(function(){
						$this.width($this.data('width')).trigger('adjustTwenty');
					});
				}
			});
		},
		rebuild:function(e)
		{
			var $target = $('.AdvBimgDiff');
			Sedo.TwentyX2.init($target);
			$target.trigger('resize');
		}
	}


	XenForo.register('.AdvBimgDiff', 'Sedo.TwentyX2.init');
	$(document).on('XenForoActivate', Sedo.TwentyX2.reload);
	$(window).on('load sedoRebuild',Sedo.TwentyX2.rebuild);
}
(jQuery, this, document);