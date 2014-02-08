xenMCE.Templates.Bbm_adv_article = {
	onafterload: function($ovl, data, ed, parentClass)
	{
		var selection = parentClass.getSelection(), content = selection.text,
		phrases = xenMCE.Phrases, auto = phrases.adv_auto;

		/**
			//Can't use it yet - cf bug #6018 => http://www.tinymce.com/develop/bugtracker_view.php?id=6018
			var loadNestedEditors = function($popup){
				var $nestedEditors = $popup.find('.MceEditor').css('visibility', 'visible'),
					nestedEditorsConfig = {
						toolbar_items_size: 'small',
						toolbar: "undo redo | bold italic underline",
						plugins: [
							"xenforo"
						],
						menubar: false,
						statusbar: false,
						skin: false
				};

				var abc = $.extend({}, ed.settings, nestedEditorsConfig);
				delete abc['selector'];
				
				$nestedEditors.tinymce(abc);
			};
			loadNestedEditors($ovl);
		*/

		//Textarea Management
		$ovl.find('#adv_article_textarea').one('click keydown', function () {
			if($(this).val() == $(this).data('message')){
				$(this).val('');
			}
		})

		//Source Management
		var phrase_src, data_ctrl_src_width;
			
		$ovl.find('#adv_article_src_input').one('focus', function (){
			data_ctrl_src_width = $(this).css('width');
			phrase_src = $(this).val();
			$(this).val('');
		})
		.focus(function (){
			$(this).parent().css('width', '80%').next().hide();
			$(this).animate({width:'98%'}, 'fast');

			if($(this).val() == phrase_src)
				$(this).val('');
		})
		.focusout(function(){
			if( $(this).val().length == 0 || $(this).val() == phrase_src) 
			{
				$(this).parent().css('width', '').next().show('slow');	
				$(this).val(phrase_src).animate({width:data_ctrl_src_width}, 'fast');
			}
		});
	},
	submit: function(e, $ovl, ed, parentClass)
	{
		this.ed = ed;

		var tag = parentClass.bbm_tag, separator = parentClass.bbm_separator,
		data = e.data, options = '', output, 
		source = (data.source == data.source_phrase) ? false : data.source, text = data.text;
		
		//Bake options		
		if(source !== false){ bakeOptions(source); }

		function bakeOptions(option)
		{
			if (options.length == 0){
				options = "=" + option;
			}else{
				options = options + separator + option;
			}
		}		

		output = '['+tag+options+']' + text + '[/'+tag+']';

		XenForo.ajax(
			'index.php?editor/to-html',
			{ bbCode: output },
			$.proxy(this, 'insert')
		);
		
		return false;
	},
	insert: function(ajaxData)
	{
		if (XenForo.hasResponseError(ajaxData))
			return false;

		var output = ajaxData.html;
		
		if (output.match(/\n/))
			output = '<p>' + output + '</p>';

		this.ed.execCommand('mceInsertContent', false, output);
      		return false;
	}
}
