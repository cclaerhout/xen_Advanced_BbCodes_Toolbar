/*Event move 1.3.6*/
(function(n){typeof define=="function"&&define.amd?define(["jquery"],n):n(jQuery)})(function(n,t){function bt(n){function u(){t?(r(),ot(u),i=!0,t=!1):i=!1}var r=n,t=!1,i=!1;this.kick=function(){t=!0,i||u()},this.end=function(n){var u=r;n&&(i?(r=t?function(){u(),n()}:n,t=!0):n())}}function gt(){return!0}function tt(){return!1}function g(n){n.preventDefault()}function nt(n){it[n.target.tagName.toLowerCase()]||n.preventDefault()}function vt(n){return n.which===1&&!n.ctrlKey&&!n.altKey}function o(n,t){var i,r;if(n.identifiedTouch)return n.identifiedTouch(t);for(i=-1,r=n.length;++i<r;)if(n[i].identifier===t)return n[i]}function ut(n,t){var i=o(n.changedTouches,t.identifier);if(i)return i.pageX===t.pageX&&i.pageY===t.pageY?void 0:i}function pt(n){var t;vt(n)&&(t={target:n.target,startX:n.pageX,startY:n.pageY,timeStamp:n.timeStamp},i(document,u.move,ft,t),i(document,u.cancel,c,t))}function ft(n){var t=n.data;v(n,t,n,l)}function c(){l()}function l(){r(document,u.move,ft),r(document,u.cancel,c)}function wt(n){var t,r;it[n.target.tagName.toLowerCase()]||(t=n.changedTouches[0],r={target:t.target,startX:t.pageX,startY:t.pageY,timeStamp:n.timeStamp,identifier:t.identifier},i(document,f.move+"."+t.identifier,a,r),i(document,f.cancel+"."+t.identifier,h,r))}function a(n){var i=n.data,t=ut(n,i);t&&v(n,i,t,s)}function h(n){var t=n.data,i=o(n.changedTouches,t.identifier);i&&s(t.identifier)}function s(n){r(document,"."+n,a),r(document,"."+n,h)}function v(n,t,i,r){var f=i.pageX-t.startX,u=i.pageY-t.startY;f*f+u*u<rt*rt||dt(n,t,i,f,u,r)}function yt(){return this._handled=gt,!1}function b(n){n._handled()}function dt(n,t,i,r,u,f){var h=t.target,o,s;o=n.targetTouches,s=n.timeStamp-t.timeStamp,t.type="movestart",t.distX=r,t.distY=u,t.deltaX=r,t.deltaY=u,t.pageX=i.pageX,t.pageY=i.pageY,t.velocityX=r/s,t.velocityY=u/s,t.targetTouches=o,t.finger=o?o.length:1,t._handled=yt,t._preventTouchmoveDefault=function(){n.preventDefault()},e(t.target,t),f(t.identifier)}function k(n){var t=n.data.timer;n.data.touch=n,n.data.timeStamp=n.timeStamp,t.kick()}function d(n){var t=n.data.event,i=n.data.timer;kt(),y(t,i,function(){setTimeout(function(){r(t.target,"click",tt)},0)})}function kt(){r(document,u.move,k),r(document,u.end,d)}function p(n){var i=n.data.event,r=n.data.timer,t=ut(n,i);t&&(n.preventDefault(),i.targetTouches=n.targetTouches,n.data.touch=t,n.data.timeStamp=n.timeStamp,r.kick())}function w(n){var t=n.data.event,r=n.data.timer,i=o(n.changedTouches,t.identifier);i&&(et(t),y(t,r))}function et(n){r(document,"."+n.identifier,p),r(document,"."+n.identifier,w)}function ht(n,t,i){var u=i-n.timeStamp;n.type="move",n.distX=t.pageX-n.startX,n.distY=t.pageY-n.startY,n.deltaX=t.pageX-n.pageX,n.deltaY=t.pageY-n.pageY,n.velocityX=.3*n.velocityX+.7*n.deltaX/u,n.velocityY=.3*n.velocityY+.7*n.deltaY/u,n.pageX=t.pageX,n.pageY=t.pageY}function y(n,t,i){t.end(function(){return n.type="moveend",e(n.target,n),i&&i()})}function ct(){return i(this,"movestart.move",b),!0}function st(){return r(this,"dragstart drag",g),r(this,"mousedown touchstart",nt),r(this,"movestart",b),!0}function lt(n){n.namespace!=="move"&&n.namespace!=="moveend"&&(i(this,"dragstart."+n.guid+" drag."+n.guid,g,t,n.selector),i(this,"mousedown."+n.guid,nt,t,n.selector))}function at(n){n.namespace!=="move"&&n.namespace!=="moveend"&&(r(this,"dragstart."+n.guid+" drag."+n.guid),r(this,"mousedown."+n.guid))}var rt=6,i=n.event.add,r=n.event.remove,e=function(t,i,r){n.event.trigger(i,r,t)},ot=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(n){return window.setTimeout(function(){n()},25)}}(),it={textarea:!0,input:!0,select:!0,button:!0},u={move:"mousemove",cancel:"mouseup dragstart",end:"mouseup"},f={move:"touchmove",cancel:"touchend",end:"touchend"};n.event.special.movestart={setup:ct,teardown:st,add:lt,remove:at,_default:function(n){function s(){ht(o,r.touch,r.timeStamp),e(n.target,o)}var o,r;n._handled()&&(o={target:n.target,startX:n.startX,startY:n.startY,pageX:n.pageX,pageY:n.pageY,distX:n.distX,distY:n.distY,deltaX:n.deltaX,deltaY:n.deltaY,velocityX:n.velocityX,velocityY:n.velocityY,timeStamp:n.timeStamp,identifier:n.identifier,targetTouches:n.targetTouches,finger:n.finger},r={event:o,timer:new bt(s),touch:t,timeStamp:t},n.identifier===t?(i(n.target,"click",tt),i(document,u.move,k,r),i(document,u.end,d,r)):(n._preventTouchmoveDefault(),i(document,f.move+"."+n.identifier,p,r),i(document,f.end+"."+n.identifier,w,r)))}},n.event.special.move={setup:function(){i(this,"movestart.move",n.noop)},teardown:function(){r(this,"movestart.move",n.noop)}},n.event.special.moveend={setup:function(){i(this,"movestart.moveend",n.noop)},teardown:function(){r(this,"movestart.moveend",n.noop)}},i(document,"mousedown.move",pt),i(document,"touchstart.move",wt),typeof Array.prototype.indexOf=="function"&&function(n){for(var r=["changedTouches","targetTouches"],i=r.length;i--;)n.event.props.indexOf(r[i])===-1&&n.event.props.push(r[i])}(n)});
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