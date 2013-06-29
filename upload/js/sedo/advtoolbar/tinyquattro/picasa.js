xenMCE.Templates.Bbm_adv_picasa = {
	onafterload: function($ovl, data, ed, parentClass)
	{
  		var phrases = xenMCE.Phrases, auto = phrases.adv_auto;
  		
  		$inputWidth = $ovl.find('#adv_picasa_width');
  		$width_px = $ovl.find('#adv_picasa_width_type').hide();
  		$width_block = $inputWidth.parent().add($inputWidth.parent().prev());

  		$inputHeight = $ovl.find('#adv_picasa_height');
  		$height_px = $ovl.find('#adv_picasa_height_type').hide();
  		$height_block = $inputHeight.parent().add($inputHeight.parent().prev()).hide();
  		
  		$inputInterval = $ovl.find('#adv_picasa_interval');
  		$interval_sec = $ovl.find('#adv_picasa_interval_type').hide();
  		$interval_block = $inputInterval.parent().add($inputInterval.parent().prev());


  		//Width Management
  		$inputWidth.one('focus', function () {
  			$(this).val('');
  		}).focus(function () {
  			$width_px.show('fast');
  			$height_block.show('fast');
  			
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
  				$height_block.hide('fast');
  				$inputHeight.val(auto);
  			}
	
			$width_px.hide('fast');			
  		});
  		
  		//Height management
  		$inputHeight.one('focus', function () {
  			$(this).val('');
  			
  		}).focus(function () {
  			$height_px.show('fast');
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
  			
  			$height_px.hide();			
  		});
  
  		//Int management $interval_sec
  		$inputInterval.one('focus', function () {
  			$(this).val('');
  			
  		}).focus(function () {
  			$interval_sec.show('fast');
  			if( $(this).val() == auto ) 
  			{
  				$(this).val('');
  			}
  		}).focusout(function() {
  			var int_tmp = $(this).val();
  			
  			//For our Chinese & Japanese Friends
  			var regex_int = new RegExp("[０-９]+");
  			if (regex_int.test(int_tmp))
  			{
  				int_tmp = parentClass.zen2han(int_tmp);
  				$(this).val(int_tmp);
  			}
  			
  			//Width must be a number !
  			if( $(this).val().length == 0 || isNaN( $(this).val() ) )
  			{
  				$(this).val(auto);
  			}
  			
  			$interval_sec.hide();			
  		});
	},
	submit: function(e, $ovl, ed, parentClass)
	{
		this.ed = ed;

		var tag = parentClass.bbm_tag, separator = parentClass.bbm_separator, 
		phrases = xenMCE.Phrases, auto = phrases.adv_auto,
		data = e.data, options = '', output;

		var src = data.source,
		width = (data.width == auto) ? false : data.width,
		height = (data.height == auto) ? false : data.height,
		interval = (data.interval == auto) ? false : data.interval+'s';

		//Bake options		
		if(width !== false){ bakeOptions(width); }
		if(height !== false){ bakeOptions(height); }
		if(interval !== false){ bakeOptions(interval); }

		function bakeOptions(option)
		{
			if (options.length == 0){
				options = "=" + option;
			}else{
				options = options + separator + option;
			}
		}		

		output = '['+tag+options+']{adv_source}[/'+tag+']';
		this.output = parentClass.unescapeHtml(output);

		XenForo.ajax(
			'index.php?editor/picasa',
			{ source: src },
			$.proxy(this, 'insert')
		);
		return false;
	},
	insert: function(ajaxData)
	{
		if (XenForo.hasResponseError(ajaxData))
			return false;

		if (ajaxData.URL_NOT_OK)
		{
			this.ed.windowManager.alert(ajaxData.URL_NOT_OK);
			return false;
		}
		
		var output = this.output.replace(/{adv_source}/i, ajaxData.URL_OK);
			
		if (output.match(/\n/))
			output = '<p>' + output + '</p>';

		this.ed.execCommand('mceInsertContent', false, output);
  		return false;
	}
}
