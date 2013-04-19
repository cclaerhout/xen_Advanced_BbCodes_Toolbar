var AdvFieldsetDialog = {
	init: function()
	{
	},
	submit: function(inputs, from)
	{
		//Init
      		var t = AdvFieldsetDialog, ed, title, width, widthtype, text, blockalign, options = '', output, auto;
		
		if(from == 'isMiu')
		{
			auto = $('#adv_fieldset').attr('data-auto');
		}
		else
		{
	      		if (typeof tinyMCEPopup !== 'undefined') {
	      			ed = tinyMCEPopup.editor;
	      		}
	      		else{
	      			ed = XenForo.tinymce.ed;
	      		}
	
			auto = ed.getParam('advtoolbar_template_phrase_auto');		
		}

		title = $('#ctrl_title').val();
		widthtype = $('#ctrl_widthtype').val();
		width = $('#ctrl_width').val();
		
		//Get form values and bake them !
		if (title == auto) { title = false; }
		if (widthtype == '%') { widthtype = false; }; // % is default (comes from vBulletin version)
		if (width == auto) { width = false; } else { if (widthtype !== false){width = width + widthtype;} }
		
		switch ($('#ctrl_blockalign').val())
		{
			case 'BlockLeft': blockalign = false; break;
			case 'BlockCenter': blockalign = 'bcenter' ; break;
			case 'BlockRight': blockalign = 'bright' ; break;						
			default: blockalign = false;
		}

		text = $('#ctrl_text').val();
		
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
		output = '[fieldset'+options+']' + text + '[/fieldset]';

		if(from == 'isMiu')
		{
	    		$.markItUp({ 
	          		replaceWith: output, 
	    			caretPositionIE: XenForo.MiuFramework.miu.caretPosition,
	    			selectionIE: XenForo.MiuFramework.miu.selection				      			
	          	});
	          		
	          	return false;
	        }

		XenForo.ajax(
			'index.php?editor/to-html',
			{ bbCode: output },
			t.insert
		);
	
		return false;	
	},
	insert: function(ajaxData)
	{
		if (XenForo.hasResponseError(ajaxData))
		{
			return false;
		}

		var output = ajaxData.html, mcePopup = false;
		
		if (output.match(/\n/))
		{
			output = '<p>' + output + '</p>';
		}

      		if (typeof tinyMCEPopup !== 'undefined') {
      			ed = tinyMCEPopup.editor;
      			mcePopup = true;
      		}
      		else{
      			ed = XenForo.tinymce.ed;
      		}

		ed.execCommand('mceInsertContent', false, output);

		if(mcePopup)
		{
			tinyMCEPopup.close();
		}
		
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
		tinyMCEPopup.onInit.add(AdvFieldsetDialog.init, AdvFieldsetDialog);
	}
