!function($, window, document, _undefined)
{    
	XenForo.AdvBbcodes = 
	{
		Spoilerbb: function($e)
		{
			var m = $e.attr('data-easing'), 
			d = $e.attr('data-duration');

			$e.children('.adv_spoilerbb_content_box').children('div.adv_spoilerbb_content_noscript').hide().removeClass('adv_spoilerbb_content_noscript');
			$boxdisplay = $e.children('.adv_spoilerbb_title').children('input.adv_spoiler_display').show().addClass('active');
			$boxhidden = $e.children('.adv_spoilerbb_title').children('input.adv_spoiler_hidden').hide();		
	
			$boxdisplay.click(function() {
				if($(this).hasClass('active'))
				{
					$(this).hide().removeClass('active');
					$(this).next().show().addClass('active');
					$(this).parent().next().children('div').show(d, m);
				}
			});		
	
			$boxhidden.click(function() {
				if($(this).hasClass('active'))
				{
					$(this).hide().removeClass('active');
					$(this).prev().show().addClass('active');
					$(this).parent().next().children('div').hide(d, m);
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
				var src = $(this).parent().attr('id');
				$target = $(this).next();
	
				if(!$target.hasClass('AdvSlideActive'))
				{
					$('#' + src + '.adv_accordion > dt').removeClass('AdvSlideActive');         
					$(this).addClass('AdvSlideActive');
	
					$('#' + src + '.adv_accordion > dd').removeClass('AdvSlideActive').slideUp(d, m);
					$target.addClass('AdvSlideActive').slideDown(d, m);
				}
				else if($target.hasClass('AdvSlideActive'))
				{
					$(this).removeClass('AdvSlideActive');
					$target.removeClass('AdvSlideActive').slideUp(d, m);
				}
			});
		},
		FieldsetFix: function($e)
		{
			/*
				Simple FIX for IE 
				Doesn't work with IE 6 => must use CSS fix
			*/
			$fieldset = $e.children('fieldset');
			$legend = $fieldset.children('legend');
			
			var width_fieldset = $fieldset.width(),
			width_legend = $legend.width();
	
			if(width_legend > width_fieldset)
			{
				$legend.width(width_fieldset);
			}
		},
		Tabs: function($e)
		{
			$tabs = $e.children('.advtabs');
			$panes = $e.children('.advpanes').children('div');
			$tabs.tabs($panes);
			$tabs.find('.openMe').trigger('click');
			$e.find('.adv_tabs_link').click(function(){ return false; });
		},
		Slider: function($e)
		{
			var t = XenForo.AdvBbcodes, toAutoplay = new Array(), imgToLoad = new Array();
			
			$e.each(function(i){
				$slider_tabs = $(this).children('.advslidestabs');
				$slides = $(this).children('.advslides').children('div');

				if($slides.length == 0)
					return false; //Important => prevent infinite loops when no slide

				var autoplay = (parseInt($e.attr('data-autoplay')) == 1 ? 1 : 0);
				var interval = parseInt($e.attr('data-interval'));
				interval = (isNaN(interval)) ? 3000 : interval;

				$images = $slides.find('.advSliderImage');
				
				/*Image Mode - Resize & Loader*/
				if($images.length > 0){

					$images.bind('load',function(){
						if($(this).parents('.imageMode').hasClass('outside'))
							$slide = $(this).parents('.advslides');
						else
							$slide = $(this).parents('.adv_slider_wrapper');

						var imageRef = new Image();
						imageRef.src = $(this).attr("src");

						$(this).parent().siblings('.adv_slide_mask').hide();//hide mask
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
							if(!$(this).hasClass('full'))
								fw = w * ratio;
						}
						$(this).css({'width': fw, 'height': fh})
					})
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
						$z = this.getPanes().eq(i);
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
					clickable: true
				});
				
				 /* Open another slide than the first one */
				$slider_tabs.children('.open').trigger('click');

				 /* Autoplay loader (autoplay direct jqt cmd needs the page to be fully loaded) */
				if(autoplay === 1) toAutoplay[i] = $slider_tabs.get(0);
			});
				
			/* Autowidth function (for % sliders) */
			t.SliderAutoWidth();
	
			$(window).resize(function() {
				 t.SliderAutoWidth();
			});

			/* Autoplay loader starts (once page has been loaded) */
			$(window).load(function() {
				if(toAutoplay.length != 0) 
					$(toAutoplay).data('slideshow').play();
			});

			/* Play & stop functions */
			$slider_tabs = $e.children('.advslidestabs');
			
			$slider_tabs.children('.play').click(function(e){
				$(this).parent().data('slideshow').play();
			});
			$slider_tabs.children('.pause').click(function(e){
				$(this).parent().data('slideshow').stop();
			});
		},
		SliderAutoWidth:function($e)
		{
      			$sl = $('.adv_slider_wrapper');
			var diff = $sl.attr('data-autodiff');

			$sl.each(function() {
				$t = $(this);
		      		if(!$t.hasClass('inner')){
					var width = $t.width()-diff;
					$t.find('.advAutoWidth, .imageMode').width(width);
				}
	      		});
		}
	};
	
	XenForo.register('.AdvFieldsetTrigger', 'XenForo.AdvBbcodes.FieldsetFix');
	XenForo.register('.adv_accordion', 'XenForo.AdvBbcodes.Accordion');
	XenForo.register('.AdvSpoilerbbCommand', 'XenForo.AdvBbcodes.Spoilerbb');
	XenForo.register('.adv_tabs_wrapper', 'XenForo.AdvBbcodes.Tabs');
	XenForo.register('.adv_slider_wrapper', 'XenForo.AdvBbcodes.Slider');
	$(document).bind("AutoValidationComplete", XenForo.AdvBbcodes.SliderAutoWidth);
}
(jQuery, this, document);