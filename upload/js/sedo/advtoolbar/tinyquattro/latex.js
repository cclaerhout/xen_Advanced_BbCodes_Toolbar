xenMCE.Templates.Bbm_adv_latex = {
	onafterload: function($ovl, data, ed, parentClass)
	{
		$title = $ovl.find('#adv_latex_title');
		var phrases = xenMCE.Phrases, auto = phrases.adv_auto,
		field_title_width_normal = $title.width(),
		field_title_width_stretched = 410;

		$ctrl_width = $ovl.find('#adv_latex_width');
		$ctrl_height = $ovl.find('#adv_latex_height');
		$ctrl_text = $ovl.find('#adv_latex_text');
		$ctrl_width_type = $ovl.find('#adv_latex_width_type').hide();
		$block_height = $ovl.find('#adv_latex_width_type').parent().nextAll().hide();
			
		//Title Management
		$title.one('focus', function () {
			$(this).val('');
		}).focus(function () {
			$(this).animate({width:field_title_width_stretched}, 'fast');
			$(this).parent().nextAll().hide();
			
			if( $(this).val() == auto ) 
			{
				$(this).val('');
			}
		}).focusout(function() {
			if( $(this).val().length == 0 ) 
			{
				$(this).val(auto);
			}
			$fout = $(this);
			$(this).animate({width:field_title_width_normal}, 
				function() {
					if($ctrl_width.val() == auto)
					{
						$(this).parent().nextAll().not($block_height).show();
					}
					else
					{
						$(this).parent().nextAll().show();
					}
				}
			);
		});		
	
		//Width Management
		$ctrl_width.one('focus', function () {
			$(this).val('');
		}).focus(function () {
			$ctrl_width_type.show('fast');
			$block_height.show('fast');
			
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
				width_tmp = parentClass.zen2han(width_tmp);
				$(this).val(width_tmp);
			}
				
			//Width must be a number !
			if( $(this).val().length == 0 || isNaN( $(this).val() ) )
			{
				$ctrl_width_type.hide('fast');
				$block_height.hide('fast');
					
				$(this).val(auto);
				$ctrl_height.val(auto);
			}
		});
			
		$ctrl_width_type.click(function(e)
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
	
		//Height management
		$ctrl_height.one('focus', function () {
			$(this).val('');
		}).focus(function () {
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
				height_tmp = parentClass.zen2han(height_tmp);
				$(this).val(height_tmp);
			}
				
			//Width must be a number !
			if( $(this).val().length == 0 || isNaN( $(this).val() ) )
			{
				$(this).val(auto);
			}
		});

		//Textarea Management
		$ctrl_text.one('click keydown', function () {
			if($(this).val() == $(this).data('message')){
				$(this).val('');
			}
		});
	
		//Help Box Insert Commands
		$ovl.find('.cmd').click(function(e)
		{
			/*
				"append expects html data starting with a html element" 
					ref: http://stackoverflow.com/questions/946534/insert-text-into-textarea-with-jquery
			*/
			//$ctrl_text.append($(this).text());
			$ctrl_text.val( $ctrl_text.val() + $(this).text() );
		});
	},
	submit: function(e, $ovl, ed, parentClass)
	{
		this.ed = ed;

		var tag = parentClass.bbm_tag, separator = parentClass.bbm_separator, 
		phrases = xenMCE.Phrases, auto = phrases.adv_auto,
		data = e.data, options = '', output;

		var text = data.text,
		title = (data.title == auto) ? false : data.title,
		blockAlign = (data.blockalign == 'bleft') ? false : data.blockalign,
		widthtype = (data.widthType == '%') ? '' : 'px', // % is default (comes from vBulletin version)
		width = (data.width == auto) ? false :data.width+widthtype;

		//Bake options		
		if(blockAlign !== false){ bakeOptions(blockAlign); }
		if(width !== false){ bakeOptions(width); }
		if(title !== false){ bakeOptions(title); }

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
