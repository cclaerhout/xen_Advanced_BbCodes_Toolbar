!function($, window, document, _undefined)
{    
	XenForo.Adv_Template_Bimg = 
	{
		AjaxResponse : false,
		init : function($element)
		{
			var t = XenForo.Adv_Template_Bimg, ed, content, match_id, auto, bimg_id;
			
			if(!$element.hasClass('isMiu'))
			{
				if (typeof tinyMCEPopup !== 'undefined') {
					ed = tinyMCEPopup.editor;
				}
				else{
					ed = XenForo.tinymce.ed;
				}
				auto = ed.getParam('advtoolbar_template_phrase_auto');
				content = ed.selection.getContent();
				bimg_id = ed.getLang('advtoolbar.bimg_id')
			}
			else
			{
	      			auto = $element.attr('data-auto');
	      			bimg_id = $element.attr('data-bimgid')
	      			content = XenForo.MiuFramework.miu.selection;			
			}
				
			match_id = content.match(/(?:alt="attach(?:Thumb|Full)(\d+?)"|\[ATTACH(?:=.+?)?\](\d+?)\[\/ATTACH\])/i);
			
			//URL OPTIONS
				/*Xen Attachements*/
				if(match_id){
					if(match_id[1]){content = match_id[1];}
					if(match_id[2]){content = match_id[2];}
					$element.find('#url_phrase').text(bimg_id);
				}
	
				/*UnescapeHtml and insert inside the field*/
				if(content.length != 0)
				{
					//.replace(/\<[^\>]*\>/gi, '') = strip_tags
					$element.find('#ctrl_src').val(t.unescapeHtml(content, 'space').replace(/\<[^\>]*\>/gi, ''));
				}
			
			//FLOAT OPTIONS
			$info = $element.find('.info').hide();
			
			$element.find('#float_select li').click(function(e)
			{
				$target = $element.find('#ctrl_float');
				$active = $element.find('#float_select li.active');
	
				if(!$(this).hasClass('active'))
				{
					var target = $(this).attr('class');
					$active.removeClass('active');
					$(this).addClass('active');
					$target.val(target);
	
					if($(this).hasClass('normal'))
					{
						$info.slideUp();
					}
					else
					{
						$info.slideDown();
					}
				}
				else if ($(this).hasClass('active') && ($(this).attr('id') == 'normalSelect'))
				{
					if($(this).hasClass('normal'))
					{
						$(this).removeClass('normal').addClass('normal_center');
						$target.val('normal_center');
						$(this).children('span#normalText').addClass('hidden');
						$(this).children('span#centerText').removeClass('hidden');
					}
					else if($(this).hasClass('normal_center'))
					{
						$(this).removeClass('normal_center').addClass('normal_right');
						$target.val('normal_right');
						$(this).children('span#centerText').addClass('hidden');
						$(this).children('span#rightText').removeClass('hidden');
					}
					else
					{
						$(this).removeClass('normal_right').addClass('normal');
						$target.val('normal');
						$(this).children('span#rightText').addClass('hidden');
						$(this).children('span#normalText').removeClass('hidden');
					}
				}
			});
	
			//CAPTION BOX
			$element.find('#caption_content').hide();
			$element.find('#trigger_caption').click(function(e)
			{
				$target = $(this).next();
	
				if(!$(this).hasClass('active'))
				{
					$(this).addClass('active');
					$target.slideDown();
					$('#ctrl_caption').focus();
				}
				else
				{
					$(this).removeClass('active');
					$target.slideUp();
					$('#ctrl_src').focus();
				}
			});
	
			//CAPTION OPTIONS
			$element.find('#caption_select li').click(function(e)
			{
				$target = $element.find('#ctrl_caption_position');
				$active = $element.find('#caption_select li.active');
	
				if(!$(this).hasClass('active'))
				{
					var target = $(this).attr('class');
					$active.removeClass('active');
					$(this).addClass('active');
					$target.val(target);
				}
			});
	
			//Width Management
			$widthtype = $element.find('#ctrl_widthtype').hide();
			
			$element.find('#ctrl_width').one('focus', function () {
				$(this).val('');
			}).focus(function () {
				$widthtype.show('fast');
				//$element.find('#ctrl_standards').attr("disabled", true).attr("checked", false).next().addClass('muted');
			
				if( $(this).val() == auto ) 
				{
					$(this).val('');
				}
			}).focusout(function() {
				var width_tmp = $(this).val();
				
				//For our Chinese & Japanese Friends
				var regex_width = new RegExp("[０-９]+");
				if (regex_width.test(width_tmp))
				{
					width_tmp = t.zen2han(width_tmp);
					$(this).val(width_tmp);
				}
				
				//Width must be a number !
				if( $(this).val().length == 0 || isNaN( $(this).val() ) )
				{
					$(this).val(auto);
					$widthtype.hide('fast');
					//$element.find('#ctrl_standards').attr("disabled", false).next().removeClass('muted');
				}
			});
				
			$widthtype.click(function(e)
			{
				if( $(this).val() == '%' ) 
				{
					$(this).val('px');
				}
				else
				{
					$(this).val('%');
				}
			});
		},
		zen2han : function(str)
		{
			// ==========================================================================
			// Project:   SproutCore - JavaScript Application Framework
			// Copyright: ©2006-2011 Strobe Inc. and contributors.
			//            ©2008-2011 Apple Inc. All rights reserved.
			// License:   Licensed under MIT license (see license.js)
			// ==========================================================================
			var nChar, cString= '', j, jLen;
			//here we cycle through the characters in the current value
			for (j=0, jLen = str.length; j<jLen; j++)
			{
				nChar = str.charCodeAt(j);
			       //here we do the unicode conversion from zenkaku to hankaku roomaji
				nChar = ((nChar>=65281 && nChar<=65392)?nChar-65248:nChar);
		
				//MS IME seems to put this character in as the hyphen from keyboard but not numeric pad...
				nChar = ( nChar===12540?45:nChar) ;
				cString = cString + String.fromCharCode(nChar);
			}
			return cString;
		},
		unescapeHtml : function(string, options) 
		{
			string = string
				.replace(/&amp;/g, "&")
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">")
				.replace(/&quot;/g, '"')
				.replace(/&#039;/g, "'");
				
			if(options == 'space')
			{
				string = string
					.replace(/    /g, '\t')
					.replace(/&nbsp;/g, '  ')
					.replace(/<\/p>\n<p>/g, '\n');
			}
	
			var regex_p = new RegExp("^<p>([\\s\\S]+)</p>$", "i"); //Memo: No /s flag in javascript => need to use [\s\S] but in RegExp need to escape 'character classes' backslash
			if(regex_p.test(string))
			{
				string = string.match(regex_p);
				string = string[1];
			}
				
			return string;
		},
		html2bbcode : function(ajaxdata)
		{
			if (XenForo.hasResponseError(ajaxdata))
			{
				return;
			}

			var t = XenForo.Adv_Template_Bimg;
			
			t.AjaxResponse = ajaxdata.bbCode;
			t.init(t.globalElement);
			return false;
		}
	}

	XenForo.register('#adv_bimg', 'XenForo.Adv_Template_Bimg.init');
}
(jQuery, this, document);