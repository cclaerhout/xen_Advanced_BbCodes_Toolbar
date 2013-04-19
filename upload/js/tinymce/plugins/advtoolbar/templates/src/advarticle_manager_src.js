!function($, window, document, _undefined)
{    
	XenForo.Adv_Template_Article =
	{
		AjaxResponse : false,
		init : function($element)
		{
			//URL OPTIONS
	      		var t = XenForo.Adv_Template_Article, ed, content;
	      		
			if(!$element.hasClass('isMiu'))
			{
				if (typeof tinyMCEPopup !== 'undefined') {
					ed = tinyMCEPopup.editor;
				}
				else{
					ed = XenForo.tinymce.ed;
				}
				
				content = ed.selection.getContent();
			}
			else
			{
	      			content = XenForo.MiuFramework.miu.selection;
			}
			
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
			
			//Source Management
			var phrase_src, data_ctrl_src_width;
			$element.find('#ctrl_src').one('focus', function () {
				data_ctrl_src_width = $(this).css('width');
				phrase_src = $(this).val();
				$(this).val('');
			}).focus(function () {
				$(this).animate({width:'98%'}, 'fast')
				.next().hide();
				if($(this).val() == phrase_src){$(this).val('');}
			}).focusout(function() {
				if( $(this).val().length == 0 || $(this).val() == phrase_src) 
				{
					$(this).val(phrase_src)
					.animate({width:data_ctrl_src_width}, 'fast')
					.next().show('slow');				
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

			var t = XenForo.Adv_Template_Article;
			
			t.AjaxResponse = ajaxdata.bbCode;
			t.init(t.globalElement);
			return false;
		}
	}

	XenForo.register('#adv_article', 'XenForo.Adv_Template_Article.init');
}
(jQuery, this, document);