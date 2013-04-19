var AdvArticleDialog = {

	init: function()
	{
	},

	submit: function(inputs, from)
	{
		//Init
      		var t = AdvArticleDialog, phrase_src, src, text, options = '', output;

		//Get form values and bake them !
		phrase_src = $('#ctrl_src_phrase').val();
		src = $('#ctrl_src').val();
		text = $('#ctrl_text').val();
		
		//Bake options		
		if (src == phrase_src){ src = false; }
		if(src !== false){ bakeOptions(src); }
			
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
		output = '[article'+options+']' + text + '[/article]';

		if(from != 'isMiu')
		{
			XenForo.ajax(
				'index.php?editor/to-html',
				{ bbCode: output },
				t.insert
			);
		
			return false;
		}

      		$.markItUp({ 
            		replaceWith: output, 
      			caretPositionIE: XenForo.MiuFramework.miu.caretPosition,
      			selectionIE: XenForo.MiuFramework.miu.selection				      			
		});
            		
            	return false;
	},
	insert: function(ajaxData)
	{
		if (XenForo.hasResponseError(ajaxData))
		{
			return false;
		}

		var output = ajaxData.html, ed, mcePopup = false;
		

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
		tinyMCEPopup.onInit.add(AdvArticleDialog.init, AdvArticleDialog);
	}

