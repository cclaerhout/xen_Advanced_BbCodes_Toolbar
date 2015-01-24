if(typeof Sedo == 'undefined') Sedo = {};
!function($, window, document, _undefined)
{    
	Sedo.AdvBbcodes = 
	{
		Spoilerbb: function($e)
		{
			var m = $e.attr('data-easing'), 
				d = $e.attr('data-duration'),
				noscriptClass = 'adv_spoilerbb_content_noscript',
				$boxdisplay = $e.children('.adv_spoilerbb_title').children('input.adv_spoiler_display').show().addClass('active');
				$boxhidden = $e.children('.adv_spoilerbb_title').children('input.adv_spoiler_hidden').hide();

			$e.children('.adv_spoilerbb_content_box').children('div.'+noscriptClass).hide().removeClass(noscriptClass);

			$boxdisplay.click(function() {
				var $this = $(this);
				if($this.hasClass('active')) {
					$e.find('img, iframe').each(function(){
						var $img = $(this);
						if($img.data('spoilerSrc')){
							$img.attr('src', $img.data('spoilerSrc'))
							$img.data('spoilerSrc', '')
						}
					});
			
					$this.hide().removeClass('active');
					$this.next().show().addClass('active');
					$this.parent().next().children('div').show(d, m);
				}
			});		
	
			$boxhidden.click(function() {
				var $this = $(this);
				if($this.hasClass('active')) {
					$this.hide().removeClass('active');
					$this.prev().show().addClass('active');
					$this.parent().next().children('div').hide(d, m);
				}
			});
		},
		Accordion: function($e)
		{
			var m = $e.attr('data-easing'), 
				d = $e.attr('data-duration');

			$e.children('dd:not(.AdvSlideOpen)').hide();
			$e.children('dt').click(function(e)
			{
				//e.preventDefault(); // If Slide Menu Title has an URL, it will prevent a new page to be opened.
				var $this = $(this),
					src = $this.parent().attr('id'),
					$target = $this.next(),
					activeClass = 'AdvSlideActive';
	
				if(!$target.hasClass(activeClass)) {
					$('#' + src + '.adv_accordion > dt').removeClass(activeClass);         
					$this.addClass(activeClass);
	
					$('#' + src + '.adv_accordion > dd').removeClass(activeClass).slideUp(d, m);
					$target.addClass(activeClass).slideDown(d, m);
				} else if($target.hasClass(activeClass)) {
					$this.removeClass(activeClass);
					$target.removeClass(activeClass).slideUp(d, m);
				}
			});
		},
		FieldsetFix: function($e)
		{
			/***
			 * Simple FIX for IE 
			 * Doesn't work with IE 6 => must use CSS fix
			 **/
			var $fieldset = $e.children('fieldset'),
				$legend = $fieldset.children('legend'),
				width_fieldset = $fieldset.width(),
				width_legend = $legend.width();
	
			if(width_legend > width_fieldset){
				$legend.width(width_fieldset);
			}
		},
		Tabs: function($e)
		{
			var $tabs = $e.children('.advtabs'),
				$panes = $e.children('.advpanes').children('div');

			$tabs.tabs($panes);
			$tabs.find('.openMe').trigger('click');
			$e.find('.adv_tabs_link').click(function(){ return false; });

			var elementWidth = $e.width(),
				widthInPercent = $e.css('width').indexOf('%') !=-1,
				panesHeight = $panes.height(),
				tabsWidth = getTabsWidth(),				
				tabsHeight = $tabs.first().height(),
				tabsItems = $tabs.children().length,
				tabsDelta = tabsHeight*(tabsItems-1);

			function getTabsWidth(){
				var width = 0;
				$tabs.children().each(function(){
					width = width+$(this).width();
				});
				return width;
			};

			function getVisibleParent($src){
				if($src.parent().is(':visible')) {
					return $src.parent();
				}else{
					return getVisibleParent($src.parent());
				}
			}

			var adjustSize = function(){
				var $parent = getVisibleParent($e),
					parentWidth = $parent.width()-2;
					
				if(!tabsWidth){
					tabsWidth = getTabsWidth();
				}

				//Width manager
				if(!widthInPercent){
					if(elementWidth > parentWidth){
						$e.width(parentWidth);
					}else{
						$e.width(elementWidth);
					}
				}

				//Tabs & height manager
				if(tabsWidth > parentWidth){
					$e.addClass('alter');
					$panes.height(panesHeight-tabsDelta);
				}else{
					$e.removeClass('alter');
					$panes.height(panesHeight);
				}
			};
			
			/*For window resize*/
			$(window).resize(function() {
				adjustSize(); 
			});

			/*For nested tabs*/
			$e.data('autoResize', adjustSize);
			
			$tabs.click(function(){
				$panes.find('.adv_tabs_wrapper').each(function(){
					var $this = $(this), 
						autoResize = $this.data('autoResize');
					
					if($this.is(':visible') && typeof autoResize === 'function'){
						autoResize();
					}
				});
			});

			/*For current tabs hidden by a parent tag*/
			var isVisible = $e.is(':visible');

			$e.parentsUntil('.messageText').click(function(){
				var checkVisible = $e.is(':visible');
				if(!isVisible && checkVisible){
					adjustSize();			
				}
				isVisible = checkVisible;
			});
				
			/*For current tabs*/
			adjustSize();
		},
		Slider: function($e)
		{
			var self = Sedo.AdvBbcodes, 
				toAutoplay = [], 
				imgToLoad = [];
			
			$e.each(function(i){
				var $this = $(this),
					$slider_tabs = $this.children('.advslidestabs'),
					$slides = $this.children('.advslides').children('div'),
					$images = $slides.find('.advSliderImage'),
					autoclick = !($this.data('noclick'));

				if($slides.length == 0)
					return false; //Important => prevent infinite loops when no slide

				var autoplay = (parseInt($e.attr('data-autoplay')) == 1 ? 1 : 0),
					interval = parseInt($e.attr('data-interval'));

				interval = (isNaN(interval)) ? 3000 : interval;
			
				/*Image Mode - Resize & Loader*/
				if($images.length > 0){

					$images.load(function(){
						var $that = $(this), $slide;
						
						if($that.parents('.imageMode').hasClass('outside')){
							$slide = $that.parents('.advslides');
						}else{
							$slide = $that.parents('.adv_slider_wrapper');
						}

						var imageRef = new Image();
						imageRef.src = $that.attr("src");

						$that.parent().siblings('.adv_slide_mask').hide();//hide mask
						
						var h = imageRef.height, w = imageRef.width, sh = $slide.height(), sw = $slide.width(), ratio, fh, fw;

						//@Src: http://gabrieleromanato.name/jquery-resize-images-proportionally
						if (w > sw) {
						        ratio = sw / w;
						        fw = sw;
						        fh = h * ratio;
					        }
						if (h > sh) {
							ratio = sh / h;
							fh = sh;
							if(!$that.hasClass('full'))
								fw = w * ratio;
						}
						
						$that.css({'width': fw, 'height': fh})
					})
					.error(function(e){
						$this = $(this);
						//$this.parent().siblings('.adv_slide_mask').hide();
						//console.debug("Slider error: ", this, e);
					});
				}

				/*Slider*/
				$slider_tabs.tabs($slides, {
					effect: 'fade',
					fadeOutSpeed: "fast",
					rotate: true,
					onBeforeClick: function(ev,i) {
						/*	Add an active class to the pane being processed
							A css with a relative position will be applied
							The relative position allows to get the parent block width 
							where as the absolution position avoid any glitches during transitions
						*/
						this.getCurrentPane().hide(); //to avoid extra glitches - P.S the current pane is in fact the futur previous pane
						this.getPanes().removeClass('active').eq(i).addClass('active');
						
						var $z = this.getPanes().eq(i);
							$w = this.getTabs().parent();

						if($z.hasClass('imageMode'))
							$w.addClass('imageMenu');
						else
							$w.removeClass('imageMenu');						
					}
				}).slideshow({
					prev:'.adv_backward',
					next:'.adv_forward',
					interval: interval,
					clickable: autoclick
				});
				
				 /* Open another slide than the first one */
				$slider_tabs.children('.open').trigger('click');

				 /* Autoplay loader (autoplay direct jqt cmd needs the page to be fully loaded) */
				if(autoplay === 1){
					toAutoplay[i] = $slider_tabs.get(0);
				}
			});
				
			/* Autowidth function (for % sliders) */
			self.SliderAutoWidth();
	
			$(window).resize(function() {
				 self.SliderAutoWidth();
			});

			/* Autoplay loader starts (once page has been loaded) */
			$(window).load(function() {
				if(toAutoplay.length != 0) {
					$(toAutoplay).data('slideshow').play();
				}
			});

			/* Play & stop functions */
			var $slider_tabs = $e.children('.advslidestabs');
			
			$slider_tabs.children('.play').click(function(e){
				$(this).parent().data('slideshow').play();
			});
			$slider_tabs.children('.pause').click(function(e){
				$(this).parent().data('slideshow').stop();
			});
		},
		SliderAutoWidth:function($e)
		{
			var $sl = $('.adv_slider_wrapper'), diff = $sl.attr('data-autodiff');

			$sl.each(function() {
				var $this = $(this);
		      		if(!$this.hasClass('inner')){
					var width = $this.width()-diff;
					$this.find('.advAutoWidth, .imageMode').width(width);
				}
	      		});
		}
	};
	
	var xenRegister = function(el, advBbCodesFct){
		XenForo.register(el, 'Sedo.AdvBbcodes.'+advBbCodesFct);
	}
	
	xenRegister('.AdvFieldsetTrigger', 'FieldsetFix');
	xenRegister('.adv_accordion', 'Accordion');
	xenRegister('.AdvSpoilerbbCommand', 'Spoilerbb');
	xenRegister('.adv_tabs_wrapper', 'Tabs');
	xenRegister('.adv_slider_wrapper', 'Slider');

	$(document).bind('AutoValidationComplete', Sedo.AdvBbcodes.SliderAutoWidth);
}
(jQuery, this, document);