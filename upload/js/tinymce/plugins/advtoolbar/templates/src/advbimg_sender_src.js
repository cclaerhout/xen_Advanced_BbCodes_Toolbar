var AdvBimgDialog  = {
	init: function()
	{
	},

	submit: function(inputs, from)
	{
		//Init
      		var t = AdvBimgDialog, ed, mcePopup = false, src, width, widthtype, _float, caption, caption_position,caption_inside, caption_align, options = '', output, blockalign = false, auto;

		t.isMiu = false;
		if(from != 'isMiu')
		{		
	      		if (typeof tinyMCEPopup !== 'undefined') {
	      			ed = tinyMCEPopup.editor;
	      			mcePopup = true;
	      		}
	      		else{
	      			ed = XenForo.tinymce.ed;
	      		}
	
			auto = ed.getParam('advtoolbar_template_phrase_auto');
		}
		else
		{
			t.isMiu = true;
			auto = $('#adv_bimg').attr('data-auto');
		}

		//Get form values and bake them !
		src = $('#ctrl_src').val(); src = AdvBimgDialog.escapeHtml(src);
		widthtype = $('#ctrl_widthtype').val(); if (widthtype == 'px') { widthtype = false; }; //px is default
		caption = $('#ctrl_caption').val(); if (caption.length == 0){ caption = false; } else { caption = AdvBimgDialog.escapeHtml(caption, 'space'); }
		caption_align = $('#ctrl_caption_align').val();	if (caption_align == 'left'){ caption_align = false; }
		width = $('#ctrl_width').val();	if (width == auto){ width = false; } else { if (widthtype !== false){width = width + widthtype;} }

		/*
		if ( $('#ctrl_standards').attr('checked') && !$('#ctrl_standards').attr('disabled') )
		{
			width = ed.getParam('advtoolbar_Advimgx');		
		}
		*/

		switch ($('#ctrl_float').val())
		{
			case 'normal': _float = false; break;
			case 'normal_center': _float = false; blockalign = 'bcenter' ; break;
			case 'normal_right': _float = false; blockalign = 'bright' ; break;						
			case 'fleft':  _float = 'fleft'; break;
			case 'fright':  _float = 'fright'; break;			
			default: _float = false;
		}
		
		switch ($('#ctrl_caption_position').val())
		{
			case 'bottom_out': caption_position = false; caption_inside = false; break;
			case 'top_out': caption_position = 'top'; caption_inside = false; break;
			case 'bottom_in': caption_position = false; caption_inside = 'inside'; break;
			case 'top_in': caption_position = 'top'; caption_inside = 'inside'; break;			
			default: caption_position = false; caption_inside = false;
		}

		//Bake options		
		if(_float !== false){ bakeOptions(_float); }
		if(blockalign !== false){ bakeOptions(blockalign); }		
		if(width !== false){ bakeOptions(width); }
		if(caption_position !== false){ bakeOptions(caption_position); }
		if(caption_inside !== false){ bakeOptions(caption_inside); }
		if(caption_align !== false){ bakeOptions(caption_align); }		
		if(caption !== false){ bakeOptions(caption); }
				
		function bakeOptions(option)
		{
			if (options.length == 0)
			{
				options = "=" + option;
			}
			else
			{
				options = options + '|' + option;			
			}
		}
		
		//Bake ouput & insert it in editor !
		output = '[bimg'+options+']' + src + '[/bimg]';

      		if(from != 'isMiu')
      		{
      			ed.execCommand('mceInsertContent', false, output);
      
      			if(mcePopup)
      			{
      				tinyMCEPopup.close();
      			}
      			return false;
      		}
      		
      		$.markItUp({ 
            		replaceWith: output, 
      			caretPositionIE: XenForo.MiuFramework.miu.caretPosition,
      			selectionIE: XenForo.MiuFramework.miu.selection				      			
            		});
            		
            	return false;
	},
	escapeHtml: function(string, options) 
	{
		//No need anymore with editor/to-html ?
		if( options != 'onlyspace' )
		{
			string = string
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");
		}
		
		//Must be executed in second
		if(options == 'space' || options == 'onlyspace')
		{
			string = string
				.replace(/\t/g, '    ')
				.replace(/ /g, '&nbsp;')
				.replace(/\n/g, '</p>\n<p>');
		}

		return string;
	}
	
};

	if (typeof tinyMCEPopup !== 'undefined') {
		tinyMCEPopup.onInit.add(AdvBimgDialog.init, AdvBimgDialog);
	}