!function($, window, document, _undefined)
{    
	XenForo.Adv_Template_Picasa =
	{
		init : function($element)
		{
			var t = XenForo.Adv_Template_Picasa, ed, content;
			
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
	
			$picasa_width = $element.find('#picasa_width');
			$widthpx = $element.find('#widthpx').hide();
			$picasa_height = $element.find('#picasa_height').hide();
			$heightpx = $element.find('#heightpx').hide();
			$int_sec = $element.find('#int_sec').hide();
			$inputwidth = $element.find('#ctrl_width');
			$inputheight = $element.find('#ctrl_height');
			$inputint = $element.find('#ctrl_int');		

			//URL OPTIONS
			if(content.length != 0)
			{
				$element.find('#ctrl_src').val(t.unescapeHtml(content, 'space').replace(/\<[^\>]*\>/gi, ''));			
			}
	
			//Width Management
			$inputwidth.one('focus', function () {
				$(this).val('');
			}).focus(function () {
				$widthpx.show('fast');
				$picasa_height.show('fast');
				
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
					$picasa_height.hide('fast');
					$inputheight.val(auto);
	
				}
					$widthpx.hide('fast');			
			});
			
			//Height management
			$inputheight.one('focus', function () {
				$(this).val('');
				
			}).focus(function () {
				$heightpx.show('fast');
				if( $(this).val() == auto ) 
				{
					$(this).val('');
				}
			}).focusout(function() {
				var height_tmp = $(this).val();
				
				//For our Chinese & Japanese Friends
				var regex_height = new RegExp("[０-９]+");
				if (regex_height.test(height_tmp))
				{
					height_tmp = t.zen2han(height_tmp);
					$(this).val(height_tmp);
				}
				
				//Width must be a number !
				if( $(this).val().length == 0 || isNaN( $(this).val() ) )
				{
					$(this).val(auto);
				}
				$heightpx.hide();			
			});
	
			//Int management $int_sec
			$inputint.one('focus', function () {
				$(this).val('');
				
			}).focus(function () {
				$int_sec.show('fast');
				if( $(this).val() == auto ) 
				{
					$(this).val('');
				}
			}).focusout(function() {
				var int_tmp = $(this).val();
				
				//For our Chinese & Japanese Friends
				var regex_int = new RegExp("[０-９]+");
				if (regex_int.test(int_tmp))
				{
					int_tmp = t.zen2han(int_tmp);
					$(this).val(int_tmp);
				}
				
				//Width must be a number !
				if( $(this).val().length == 0 || isNaN( $(this).val() ) )
				{
					$(this).val(auto);
				}
				$int_sec.hide();			
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
		}
	}
	
	 XenForo.register('#adv_picasa', 'XenForo.Adv_Template_Picasa.init');
}
(jQuery, this, document);