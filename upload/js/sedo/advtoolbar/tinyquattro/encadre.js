xenMCE.Templates.Bbm_adv_encadre = {
	onafterload: function($ovl, data, ed, parentClass)
	{
		$title = $ovl.find('#adv_encadre_title');
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
		$ovl.find('#adv_encadre_textarea').one('click keydown', function () {
			if($(this).val() == $(this).data('message')){
				$(this).val('');
			}
		})
	
		//Width Management
		$widthtype = $ovl.find('#adv_encadre_width_type').hide();
		
		$ovl.find('#adv_encadre_width').one('focus', function () {
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
	
	
		//SKIN OPTIONS
		$ovl.find('#adv_encadre_skins li').click(function(e)
		{
			$target = $ovl.find('#adv_encadre_skin_input');
			$active = $ovl.find('#adv_encadre_skins li.active');
	
			if(!$(this).hasClass('active'))
			{
				var target = $(this).children('div').data('skin');
				$active.removeClass('active');
				$(this).addClass('active');
				$target.val(target);
			}
		});
	
	
		//FLOAT OPTIONS
		$ovl.find('#adv_encadre_float li').click(function(e)
		{
			$target = $ovl.find('#adv_encadre_float_input');
			$active = $ovl.find('#adv_encadre_float li.active');

			if(!$(this).hasClass('active'))
			{
				var target = $(this).children('div').data('float');
				$active.removeClass('active');
				$(this).addClass('active');
				$target.val(target);
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
		skin = (data.skin == 'skin1') ? false : data.skin,
		_float = (data.float == 'fright') ? false : data.float,
		widthtype = (data.widthType == '%') ? '' : 'px', // % is default (comes from vBulletin version)
		width = (data.width == auto) ? false :data.width+widthtype;

		//Bake options		
		if(skin !== false){ bakeOptions(skin); }
		if(_float !== false){ bakeOptions(_float); }
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
