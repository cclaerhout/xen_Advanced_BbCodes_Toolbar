xenMCE.Templates.Bbm_adv_fieldset = {
	onafterload: function($ovl, data, ed, parentClass)
	{
		$title = $ovl.find('#adv_fieldset_title');
		var phrases = xenMCE.Phrases, auto = phrases.adv_auto,
		field_title_width_normal = $title.width(),
		field_title_width_stretched = 410;

		//Title Management
		$title.one('focus', function () {
			$(this).val('');
		}).focus(function () {
			$(this).parent().nextAll('dt, dd').hide();
			$(this).animate({width:field_title_width_stretched}, 'fast');
		
			if( $(this).val() == auto ) 
			{
				$(this).val('');
			}
		}).focusout(function() {
			$(this).animate({width:field_title_width_normal}, 'fast');
			$(this).parent().nextAll('dt, dd').show();

			if( $(this).val().length == 0 || $(this).val() == auto ) 
			{
				$(this).val(auto);
			}
		});		

		//Textarea Management
		$ovl.find('#adv_fieldset_text').one('click keydown', function () {
			if($(this).val() == $(this).data('message')){
				$(this).val('');
			}
		})
	
		//Width Management
		$widthtype = $ovl.find('#adv_fieldset_width_type').hide();
		
		$ovl.find('#adv_fieldset_width').one('focus', function () {
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
				width_tmp = parentClass.zen2han(width_tmp);
				$(this).val(width_tmp);
			}

			//Width must be a number !
			if( $(this).val().length == 0 || isNaN( $(this).val() ) )
			{
				$(this).val(auto);
				$widthtype.hide('fast');
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
	
		//BLOCK ALIGN OPTIONS
		$blockAlign = $ovl.find('#adv_fieldset_blockalign');
		
		$blockAlign.find('li').click(function(e)
		{
			$target = $ovl.find('#adv_fieldset_blockalign_input');
			$active = $blockAlign.find('li.active');

			if(!$(this).hasClass('active'))
			{
				var align = $(this).children('div').data('align');
				$active.removeClass('active');
				$(this).addClass('active');
				$target.val(align);
			}
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
		blockAlign = data.blockalign,
		widthtype = (data.widthType == '%') ? '' : 'px', // % is default (comes from vBulletin version)
		width = (data.width == auto) ? false :data.width+widthtype;

		switch (blockAlign)
		{
			case 'left': 
				blockAlign = false; 
				break;
			case 'center':
				blockAlign = 'bcenter';
				break;
			case 'right':
				blockAlign = 'bright'; 
				break;						
			default: blockAlign = false;
		}

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
