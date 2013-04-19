!function($, window, document, _undefined)
{    
	XenForo.AdvBbcodes = 
	{
		Spoilerbb: function($element)
		{
			var m = $element.attr('data-easing'), 
			d = $element.attr('data-duration');

			$element.children('.adv_spoilerbb_content_box').children('div.adv_spoilerbb_content_noscript').hide().removeClass('adv_spoilerbb_content_noscript');
			$boxdisplay = $element.children('.adv_spoilerbb_title').children('input.adv_spoiler_display').show().addClass('active');
			$boxhidden = $element.children('.adv_spoilerbb_title').children('input.adv_spoiler_hidden').hide();		
	
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
		Accordion: function($element)
		{
			var m = $element.attr('data-easing'), 
			d = $element.attr('data-duration');

			$element.children('dd:not(.AdvSlideOpen)').hide();
			$element.children('dt').click(function(e)
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
		FieldsetFix: function($element)
		{
			/*
				Simple FIX for IE 
				Doesn't work with IE 6 => must use CSS fix
			*/
			$fieldset = $element.children('fieldset');
			$legend = $fieldset.children('legend');
			
			var width_fieldset = $fieldset.width(),
			width_legend = $legend.width();
	
			if(width_legend > width_fieldset)
			{
				$legend.width(width_fieldset);
			}
		}
	}

	 XenForo.register('.AdvFieldsetTrigger', 'XenForo.AdvBbcodes.FieldsetFix');
	 XenForo.register('.adv_accordion', 'XenForo.AdvBbcodes.Accordion');
	 XenForo.register('.AdvSpoilerbbCommand', 'XenForo.AdvBbcodes.Spoilerbb');
	 XenForo.register('.adv_tabs', 'XenForo.AdvBbcodes.Tabs');
	 
	 
}
(jQuery, this, document);