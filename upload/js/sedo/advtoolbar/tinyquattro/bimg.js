xenMCE.Templates.Bbm_adv_bimg = {
	onafterload: function($ovl, data, ed, parentClass)
	{
			var selection = parentClass.getSelection(), 
				content = selection.text,
				phrases = xenMCE.Phrases, 
				auto = phrases.adv_auto, 
				adv_bimg_id = phrases.adv_bimg_id,
				match_id = content.match(/(?:alt="attach(?:Thumb|Full)(\d+?)"|\[ATTACH(?:=.+?)?\](\d+?)\[\/ATTACH\]|(\d+))/i);
			
			
			var $urlPhrase = $ovl.find('#adv_bimg_url_phrase'),
				$bimgSrc = $ovl.find('#adv_bimg_src');
			
			//URL OPTIONS
				/*Xen Attachements*/
				if(match_id){
					content = match_id[0];
					$urlPhrase.text(adv_bimg_id);
				}
	
				/*UnescapeHtml and insert inside the field*/
				if(content.length != 0)
					$bimgSrc.val(parentClass.unescapeHtml(content).replace(/\<[^\>]*\>/gi, ''));
			
			//FLOAT OPTIONS
			var $info = $ovl.find('.info').hide(),
				$floatOptions = $ovl.find('#adv_bimg_float_select li');
			
			$floatOptions.click(function(e){
				var $this = $(this),
					$target = $ovl.find('#adv_bimg_float_input'),
					$active = $ovl.find('#adv_bimg_float_select li.active');
	
				if(!$this.hasClass('active'))
				{
					var target = $this.attr('class');
					$active.removeClass('active');
					$this.addClass('active');
					$target.val(target);
	
					if($this.hasClass('normal'))
						$info.slideUp();
					else
						$info.slideDown();
				}
				else if($this.hasClass('active') && ($this.attr('id') == 'adv_bimg_normal_select'))
				{
					if($this.hasClass('normal'))
					{
						$this.removeClass('normal').addClass('normal_center');
						$target.val('normal_center');
						$this.children('#adv_bimg_normalText').addClass('hidden');
						$this.children('#adv_bimg_centerText').removeClass('hidden');
					}
					else if($(this).hasClass('normal_center'))
					{
						$this.removeClass('normal_center').addClass('normal_right');
						$target.val('normal_right');
						$this.children('#adv_bimg_centerText').addClass('hidden');
						$this.children('#adv_bimg_rightText').removeClass('hidden');
					}
					else
					{
						$this.removeClass('normal_right').addClass('normal');
						$target.val('normal');
						$this.children('#adv_bimg_rightText').addClass('hidden');
						$this.children('#adv_bimg_normalText').removeClass('hidden');
					}
				}
			});
	
			//CAPTION OPTIONS
			var $optionsCaption = $ovl.find('#adv_bimg_caption_select li')
			
			$optionsCaption.click(function(e){
				var $this = $(this),
					$target = $ovl.find('#adv_bimg_caption_position_input'),
					$active = $ovl.find('#adv_bimg_caption_select li.active');
	
				if(!$this.hasClass('active'))	{
					var target =$this.attr('class');
					$active.removeClass('active');
					$this.addClass('active');
					$target.val(target);
				}
			});
	
			//Width Management
			var $width = $ovl.find('#adv_bimg_width'),
				$widthtype = $ovl.find('#adv_bimg_width_type').hide();
			
			$width.one('focus', function () {
				$(this).val('');
			}).focus(function () {
				$widthtype.show('fast');
			
				if( $(this).val() == auto ) 
					$(this).val('');
			}).focusout(function() {
				var width_tmp = $(this).val();
				
				//For our Chinese & Japanese Friends
				var regex_width = new RegExp("[０-９]+");
				if (regex_width.test(width_tmp)){
					width_tmp = parentClass.zen2han(width_tmp);
					$(this).val(width_tmp);
				}
				
				//Width must be a number !
				if( $(this).val().length == 0 || isNaN( $(this).val() ) ){
					$(this).val(auto);
					$widthtype.hide('fast');
				}
			});
				
			$widthtype.click(function(e){
				if( $(this).val() == '%' ) 
					$(this).val('px');
				else
					$(this).val('%');
			});
			
			/*Attachments options*/
			var $attachIMG = $ovl.find('#xenpane_bimg_attach img');
			
			$attachIMG.click(function(){
				var id = $(this).data('attachid');
				$bimgSrc.val(id);
				$ovl.find('#xentabs_bimg_general').trigger('click');
				$urlPhrase.text(adv_bimg_id);
			});
	},
	submit: function(e, $ovl, ed, parentClass)
	{
		var tag = parentClass.bbm_tag, 
			separator = parentClass.bbm_separator,
			data = e.data,
			content = data.content,
			options = data.options,
			phrases = xenMCE.Phrases,
			auto = phrases.adv_auto;

		var src = parentClass.escapeHtml(data.src),
			widthType = (data.widthType == 'px') ? '' : '%', //px is default
			width = (data.width == auto) ? false : data.width+widthType,
			caption = (data.caption.length == 0) ? false : parentClass.escapeHtml(data.caption),
			captionAlign = (data.captionAlign == 'left') ? false : data.captionAlign,
			noLightbox = (data.nolightbox) ? 'no-lightbox' : false,
			wrappingUrl = (data.blink.length == 0) ? false : data.blink,
			diffV = (parseInt(data.diff_v)) ? 'diff-v' : false,
			diffPos = (data.diff_pos == '0.5') ? false : 'diff-pos:'+data.diff_pos;
			
		var diffUrl = (data.bsrc.length == 0) ? false : parentClass.escapeHtml(data.bsrc);
		
		if(src && diffUrl){
			src += '|'+diffUrl;
		}

		var blockalign = false, _float = false;
		
		switch (data._float){
			case 'normal_center': 
				blockalign = 'bcenter';
				break;
			case 'normal_right': 
				blockalign = 'bright';
				break;						
			case 'fleft':
				 _float = 'fleft';
				 break;
			case 'fright':
				 _float = 'fright';
				 break;			
		}
		
		var captionPosition = false, captionInside = false;
		
		switch (data.captionPosition){
			case 'bottom_out': break;
			case 'top_out': 
				captionPosition = 'top'; 
				break;
			case 'bottom_in': 
				captionInside = 'inside';
				break;
			case 'top_in': 
				captionPosition = 'top'; 
				captionInside = 'inside';
				break;			
		}

		//Bake options
		var options = '';
			
		if(_float !== false){ bakeOptions(_float); }
		if(blockalign !== false){ bakeOptions(blockalign); }		
		if(width !== false){ bakeOptions(width); }
		if(captionPosition !== false){ bakeOptions(captionPosition); }
		if(captionInside !== false){ bakeOptions(captionInside); }
		if(captionAlign !== false){ bakeOptions(captionAlign); }		
		if(caption !== false){ bakeOptions(caption); }
		if(noLightbox  !== false && wrappingUrl === false && diffUrl === false){ bakeOptions(noLightbox); }
		if(wrappingUrl !== false){ bakeOptions(wrappingUrl); }
		if(diffUrl && diffPos !== false){ bakeOptions(diffPos); }		
		if(diffUrl && diffV !== false){ bakeOptions(diffV); }
				
		function bakeOptions(option){
			if (options.length == 0)
				options = option;
			else
				options = options + separator + option;			
		}
		
		//Bake ouput & insert it in editor !
		parentClass.insertBbCode(tag, options, src);
	}
}
