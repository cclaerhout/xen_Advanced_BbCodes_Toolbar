!function($, window, document, _undefined)
{    
	XenForo.Adv_Template_Fieldset = 
	{
		AjaxResponse : false,
		init: function($element)
		{
			var t = XenForo.Adv_Template_Fieldset, ed, content;
			
			if(!$element.hasClass('isMiu'))
			{
				if (typeof tinyMCEPopup !== 'undefined') {
					ed = tinyMCEPopup.editor;
				}
				else{
					ed = XenForo.tinymce.ed;
				}
	
				var field_title_width_stretched = ed.getParam('advtoolbar_template_strechedtitlewidth'),
				field_title_width_normal = ed.getParam('advtoolbar_template_normaltitlewidth'),		
				auto = ed.getParam('advtoolbar_template_phrase_auto'),
				content = ed.selection.getContent();
			}
			else
			{
	      			var field_title_width_stretched = $element.attr('data-streched-width'),
	      			field_title_width_normal = $element.attr('data-normal-width'),
	      			auto = $element.attr('data-auto'),
	      			content = XenForo.MiuFramework.miu.selection;
			}
	
			//RETRIEVE TEXT FROM EDITOR
			if(content.length != 0)
			{
				if(t.AjaxResponse === false)
				{
					t.globalElement = $element;
					XenForo.ajax(
						'index.php?editor/to-bb-code',
						{ html: content },
						t.html2bbcode
					);
					return false;
				}
	
				$element.find('#ctrl_text').val(t.AjaxResponse);
			}
	
			//Title Management
			$element.find('#ctrl_title').one('focus', function () {
				data_ctrl_title_width = $(this).css('width');
				$(this).val('');
			}).focus(function () {
				$(this).animate({width:field_title_width_stretched}, 'fast');
			
				if( $(this).val() == auto ) 
				{
					$(this).val('');
				}
			}).focusout(function() {
				if( $(this).val().length == 0 || $(this).val() == auto ) 
				{
					$(this).val(auto);
					$(this).animate({width:field_title_width_normal}, 'fast');
				}
			});		
	
			//Width Management
			$widthtype = $element.find('#ctrl_widthtype').hide();
			
			$element.find('#ctrl_width').one('focus', function () {
				$(this).val('');
			}).focus(function () {
				$widthtype.show('fast');
			
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
	
	
			//BLOCK ALIGN OPTIONS
			$element.find('#block_align li').click(function(e)
			{
				$target = $element.find('#ctrl_blockalign');
				$active = $element.find('#block_align li.active');
	
				if(!$(this).hasClass('active'))
				{
					var target = $(this).children('div').attr('id');
					$active.removeClass('active');
					$(this).addClass('active');
					$target.val(target);
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

			var t = XenForo.Adv_Template_Fieldset;
			
			t.AjaxResponse = ajaxdata.bbCode;
			t.init(t.globalElement);
			return false;
		}
	}
	
	XenForo.register('#adv_fieldset', 'XenForo.Adv_Template_Fieldset.init');
}
(jQuery, this, document);