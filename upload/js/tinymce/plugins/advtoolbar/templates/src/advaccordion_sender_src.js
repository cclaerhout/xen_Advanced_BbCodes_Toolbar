var AdvAccordionDialog = {
	init: function()
	{
	},

	submit: function(inputs, from)
	{
		//Init
      		var t = AdvAccordionDialog, ed, mcePopup = false, title, width, height, widthtype, text, blockalign, MasterOptions = '', content, output, auto, tag;

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
			auto = $('#adv_accordion').attr('data-auto');
		}

		function bakeMasterOptions(option)
		{
			if (MasterOptions.length == 0)
			{
				MasterOptions = "=" + option;
			}
			else
			{
				MasterOptions = MasterOptions + '|' + option;			
			}
		}				
		
		//Get form values and bake them !
		blockalign = $('#ctrl_blockalign').val(); if (blockalign == 'bleft'){ blockalign = false; }
		widthtype = $('#ctrl_widthtype').val(); if (widthtype == 'px') { widthtype = false; };
		width = $('#ctrl_width').val();	if (width == auto){ width = false; } else { if (widthtype !== false){width = width + widthtype;} }		
		height =  $('#ctrl_height').val(); if ( isNaN(height) ){ height = false; } else { width = width + 'x' + height; }
		tag = $('#ctrl_mode').val();

		//Bake Master Options		
		if(blockalign !== false){ bakeMasterOptions(blockalign); }
		if(width !== false){ bakeMasterOptions(width); }

		//Bake slides
		content = AdvAccordionDialog.BakeSlides(height) ;

		//Bake ouput & insert it in editor !
		output = '['+tag+MasterOptions+']' + content + '[/'+tag+']';

		if(from != 'isMiu')
		{
			XenForo.ajax(
				'index.php?editor/to-html',
				{ bbCode: output },
				AdvAccordionDialog.insert
			);
		
			return false;
		}

      		$.markItUp({ 
            		replaceWith: output, 
      			caretPositionIE: XenForo.MiuFramework.miu.caretPosition,
      			selectionIE: XenForo.MiuFramework.miu.selection				      			
            	});		
	},

	BakeSlides: function(globalheight) 
	{

		var slides = '';
		
		$('.slide').not($('#model .slide')).each(function(index) {
			//Init
			var title, align, height, text, open = false, SlaveOptions = '';			

			function bakeSlaveOptions(option)
			{
				if (SlaveOptions.length == 0)
				{
					SlaveOptions = "=" + option;
				}
				else
				{
					SlaveOptions = SlaveOptions + '|' + option;			
				}
			}

			//Get datas
			title = $(this).find('.CMD_Title input').val(); if (title.length == 0){ title = false; }
			align = $(this).find('.CMD_Align input').val();	if (align == 'left'){ align = false; }		
			height = $(this).find('.CMD_Height input').val(); if (globalheight !== false || isNaN(height) ) { height = false; }
			if ( $(this).find('.CMD_Open input').attr('checked') )	{ open = 'open'; } else { open = false }

			text = $(this).find('.CMD_Content textarea').val();
			
			//Bake datas
			if(title !== false){ bakeSlaveOptions(title); }
			if(align !== false){ bakeSlaveOptions(align); }
			if(height !== false){ bakeSlaveOptions(height); }
			if(open !== false){ bakeSlaveOptions(open); }

			slides = slides + '\n{slide'+SlaveOptions+'}' + text + '{/slide}\n';
		});
	
		return slides;
	},

	insert: function(ajaxData)
	{
		if (XenForo.hasResponseError(ajaxData))
		{
			return false;
		}

    		var ed, mcePopup = false;
    		if (typeof tinyMCEPopup !== 'undefined') {
    			ed = tinyMCEPopup.editor;
    			mcePopup = true;
    		}
    		else{
    			ed = XenForo.tinymce.ed;
    		}

		ed.execCommand('mceInsertContent', false, ajaxData.html);
		
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
		tinyMCEPopup.onInit.add(AdvAccordionDialog.init, AdvAccordionDialog);
	}
