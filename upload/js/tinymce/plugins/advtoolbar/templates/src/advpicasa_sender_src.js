var AdvPicasaDialog = {
	init: function()
	{
	},

	submit: function(inputs, from)
	{
		var t = AdvPicasaDialog;

		t.isMiu = false;
		if(from == 'isMiu')
		{
			t.isMiu = true;
			t.phrase_auto = $('#adv_picasa').attr('data-auto');
		}

		if (typeof inputs !== 'undefined') {
			//Call from fast popup function
			t.inputs = inputs;	
		}

		XenForo.ajax(
			'index.php?editor/picasa',
			{ source: $('#ctrl_src').val() },
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

		if (ajaxData.URL_NOT_OK)
		{
			alert(ajaxData.URL_NOT_OK);
		}
		else if (ajaxData.URL_OK)
		{
			function bakeOptions(option)
			{
				if (options.length == 0)
				{
					options = "=" + option;
				}
				else
				{
					options = options + ',' + option;			
				}
			}			

			//Init
			var t = AdvPicasaDialog, ed, mcePopup = false, src = ajaxData.URL_OK, width, height, interval, options = '', output, auto;
			
			if(t.isMiu !== true)
			{
				if (typeof tinyMCEPopup !== 'undefined') {
					ed = tinyMCEPopup.editor;
					mcePopup = true;
	
					width = $('#ctrl_width').val();
					height =  $('#ctrl_height').val();
					interval = $('#ctrl_int').val();
				}
				else{
					ed = XenForo.tinymce.ed;
					width = t.inputs.width;
					height =  t.inputs.height;
					interval = t.inputs.interval;
				}

				auto = ed.getParam('advtoolbar_template_phrase_auto');
			}
			else
			{
				width = t.inputs.width;
				height =  t.inputs.height;
				interval = t.inputs.interval;
				auto = t.phrase_auto;
			}
			
			if (width == auto){ width = false; }
			if (height == auto){ height = false; }
			if (interval == auto){ interval = false; } else { interval = interval + 's';}			

			//Bake options		
			if(width !== false){ bakeOptions(width); }
			if(height !== false){ bakeOptions(height); }
			if(interval !== false){ bakeOptions(interval); }

			//Bake ouput & insert it in editor !
			output = '[picasa'+options+']' + src + '[/picasa]';
	
			if(t.isMiu == false)
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
		}
	}
};

	if (typeof tinyMCEPopup !== 'undefined') {
		tinyMCEPopup.onInit.add(AdvPicasaDialog.init, AdvPicasaDialog);
	}
