var AdvLatexDialog = {
	init: function()
	{
	},
	submit: function(inputs, from)
	{
		//Init
      		var t = AdvLatexDialog, ed, mcePopup = false, title, width, widthtype, height, text, blockalign, options = '', output, auto;

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
			auto = $('#adv_latex').attr('data-auto');
		}

		title = $('#ctrl_title').val();
		widthtype = $('#ctrl_widthtype').val();
		width = $('#ctrl_width').val();
		height =  $('#ctrl_height').val();
		blockalign = $('#ctrl_blockalign').val();
		text = $('#ctrl_text').val();
		
		//Get form values and bake them !
		if (title == auto){ title = false; } else { title = t.escapeHtml(title); }
		if (widthtype == 'px') { widthtype = false; };
		if (width == auto){ width = false; } else { if (widthtype !== false){width = width + widthtype;} }
		if (height == auto){ height = false; } else { width = width + 'x' + height; }
		blockalign = $('#ctrl_blockalign').val(); if (blockalign == 'bleft'){ blockalign = false; }
		text = t.escapeHtml(text, 'space');
		
		
		//Bake options		
		if(blockalign !== false){ bakeOptions(blockalign); }
		if(width !== false){ bakeOptions(width); }
		if(title !== false){ bakeOptions(title); }
				
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
		output = '[latex'+options+']' + text + '[/latex]';

      		if(t.isMiu == false)
      		{
			if (output.match(/\n/))
			{
				output = '<p>' + output + '</p>';
			}

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
		tinyMCEPopup.onInit.add(AdvLatexDialog.init, AdvLatexDialog);
	}
