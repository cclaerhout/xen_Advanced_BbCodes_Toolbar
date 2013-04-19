!function($, window, document, _undefined)
{    
	XenForo.Adv_Template_Accordion = 
	{
		AjaxResponse : false,
		init: function($element)
		{
			var t = XenForo.Adv_Template_Accordion, content;
			
			t.isMiu = false;
			
			if(!$element.hasClass('isMiu'))
			{
				if (typeof tinyMCEPopup !== 'undefined') {
					t.ed = tinyMCEPopup.editor;
				}
				else{
					t.ed = XenForo.tinymce.ed;
				}
				
				content = t.ed.selection.getContent();
			}
			else
			{
				t.isMiu = true;
				content = XenForo.MiuFramework.miu.selection;
			}

			//GET TEXT FROM EDITOR
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
	
				$element.find('#slide_content_1').val(t.AjaxResponse).animate({height:'75px'}, 'fast');
			}
	
			//DEFAULT CODE
			t.bakeBasics($element);
			
			$element.find('#createSlide').click(function(e)
			{
				var slideid = $('#slides').children().length + 1,
				newslide = $element.find('#model').html().replace(/replaceid/g, slideid);
				$(newslide).appendTo('#slides');
	
				t.bakeBasics($element); //Lazy Refesh JS
				$('#slide_content_'+slideid).focus();
			});
		},
		bakeBasics : function($element)
		{
			var t = XenForo.Adv_Template_Accordion;
			
			$ctrl_width = $element.find('#ctrl_width');
			$widthtype = $element.find('#ctrl_widthtype').hide();
			$cmd_height = $element.find('.CMD_Height');
			$element.find('.heightpx').hide();
			$masterheight = $element.find('#MasterHeight').css('visibility', 'hidden');
	
			if(t.isMiu == false)
			{
				var field_title_width_stretched = t.ed.getParam('advtoolbar_template_strechedtitlewidth'),
				field_title_width_normal = t.ed.getParam('advtoolbar_template_normaltitlewidth'),		
				auto = t.ed.getParam('advtoolbar_template_phrase_auto');
			}
			else
			{
	      			var field_title_width_stretched = $element.attr('data-streched-width'),
	      			field_title_width_normal = $element.attr('data-normal-width'),
	      			auto = $element.attr('data-auto');
			}
			
			var phrase_fulldisplay = $cmd_height.children('input').val(),
			heightcmd_width = $cmd_height.children('input').css('width');
	
			/*******
				MASTER TAG
			***/		
	
			//Width Management
			$ctrl_width.one('focus', function () {
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
					$widthtype.hide('fast');
					$(this).val(auto);
					$masterheight.css('visibility', 'hidden').children('input').val(phrase_fulldisplay).css('width', heightcmd_width);
				}
				else
				{
					$masterheight.css('visibility', 'visible');
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
	
			/*******
				MASTER & SLAVE TAGS
			***/	
	
			//Height management
			if( !isNaN( $('#MasterHeight input').val() ) )
			{
				$('.CMD_Height').not('#MasterHeight').hide();	
			}
			
			$cmd_height.children('input').one('focus', function () {
				$(this).val('');
			}).focus(function () {
				$(this).next('.heightpx').show('fast');
			
				if( $(this).val() == phrase_fulldisplay ) 
				{
					$(this).val('');
				}
	
				$(this).animate({width:'30px'}, 
					function() {
						//After complete
					}
				);
				
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
					$(this).animate({width:heightcmd_width}, 
						function() {
							$(this).val(phrase_fulldisplay);
						}
					);
					if( $(this).parent().attr('id') == 'MasterHeight')
					{
						$('.CMD_Height').not('#MasterHeight').show('slow');
					}
				}
				else
				{
					if( $(this).parent().attr('id') == 'MasterHeight')
					{
						$('.CMD_Height').not('#MasterHeight').hide('slow');
						$('.CMD_Height input').not('#MasterHeight input').val(phrase_fulldisplay).css('width', heightcmd_width);
					}
				}
				
				$(this).next('.heightpx').hide(); 
			});
	
	
			/*******
				SLAVE TAG
			***/
	
			//Title Management
			$element.find('.CMD_Title').children('input').one('focus', function () {
				data_ctrl_title_width = $(this).css('width');
				$(this).val('');
			}).focus(function () {
				$(this).parent().nextAll('li').hide();
				$(this).animate({width:'300px'}, 'fast');
			}).focusout(function() {
				$fout = $(this);
				$(this).animate({width:field_title_width_normal}, 
					function() {
						if( isNaN( $('#MasterHeight input').val() ) )
						{
							$fout.parent().nextAll('li').show();	
						}
						else
						{
							$fout.parent().nextAll('li:not(.CMD_Height)').show();
						}
					}
				);
			});		
	
			//Align Management
			$element.find('.CMD_Align li').click(function(e)
			{
				//Init
				$align_target_button = $(this).children('div');
				$align_target_form = $(this).parent().next('input');
				
				//RAZ
				$(this).parent().children('li').children('div').removeClass('align_select_left align_select_center align_select_right');
	
				//GO
				if( $align_target_button.hasClass('align_left') )
				{
					$align_target_button.addClass('align_select_left');
					$align_target_form.val('left');
				}
				else if( $align_target_button.hasClass('align_center') )
				{
					$align_target_button.addClass('align_select_center');
					$align_target_form.val('center');
				}
				else if( $align_target_button.hasClass('align_right') )
				{
					$align_target_button.addClass('align_select_right');
					$align_target_form.val('right');
				}			
			});		
	
			//Content Management
			$element.find('.slide_content').children('textarea').focus(function () {
				$(this).animate({height:'75px'}, 'fast');
			}).focusout(function() {
				$(this).animate({height:'15px'}, 'fast');
			});
			
			//Delete slide
			$element.find('.deleteSlide').bind('click', function(e)
			{
				$(this).parent().parent().remove();
				t.updateID();
			});
		},
		updateID : function()
		{
			var id = 1;
			$('.slide').not($('#model .slide')).each(function(index) {
				$(this).attr('id','slide_'+id);
				$(this).find('.CMD_Title input').attr('id', 'slide_title_'+id).attr('name', 'slidetitle'+id);
				$(this).find('.CMD_Align input').attr('id', 'slide_align_'+id).attr('name', 'slidealign'+id);			
				$(this).find('.CMD_Height input').attr('id', 'slide_height_'+id).attr('name', 'slideheight'+id);	
				$(this).find('.CMD_Open input').attr('id', 'slide_open_'+id).attr('name', 'slideopen'+id);
				$(this).find('.CMD_Content textarea').attr('id', 'slide_content_'+id).attr('name', 'slidecontent'+id);
				$(this).find('.CMD_Id').text(id);
				id++;
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

			var t = XenForo.Adv_Template_Accordion;
			
			t.AjaxResponse = ajaxdata.bbCode;
			t.init(t.globalElement);
			return false;
		}
	}

	XenForo.register('#adv_accordion', 'XenForo.Adv_Template_Accordion.init');
}
(jQuery, this, document);