xenMCE.Templates.Bbm_adv_slides = {
	mode: 'accordion',
	slaveContentHeight: '',
	sliderTextareaHeightDiff: 50,
	onafterload: function($ovl, data, ed, parentClass)
	{
		this.$ovl = $ovl;
		this.$builder = $ovl.find('#xenpane_slides_builder');
		this.$masterHeight = $ovl.find('#adv_sliders_height');
		
		this.parentClass = parentClass;
		this.phrases = xenMCE.Phrases;
		this.auto = this.phrases.adv_auto,
		this.htmlPattern = $ovl.find('.slidePane').html();

		this.cleanWhiteSpace = function($e){
			parentClass.cleanWhiteSpace($e);
		};
		
		var self = this, phrases = xenMCE.Phrases, auto = phrases.adv_auto;

		this.globalInit();
		this.initTabs();		

		$ovl.find('#adv_slides_create').click(function(e){
			self.createSlide();
		});

		this.rebindSlaveFunctions();
	},
	globalInit: function()
	{
		$ovl = this.$ovl;
		var self = this;
		
		/* Only display slide creator button with the slides builder tool */
			$config = $ovl.find('#xentabs_adv_slides_config');
			$builder = $ovl.find('#xentabs_adv_slides_builder');
			$creator = $ovl.find('#adv_slides_create');
			
			$config.click(function(){
				$creator.hide();
			});
	
			$builder.click(function(){
				$creator.show();
			});
			
		/* Get mode & select current */
			$slidesModes = $ovl.find('#adv_slides_mode').children();
			$slidesModes.click(function(e)
			{
				self.mode = $(this).data('mode');
				$ovl.find('#adv_slides_mode_input').val(self.mode);

				$slidesModes.removeClass('active');
				$(this).addClass('active');

				self.initSlideModeChange();
				self.initModeLayout(); // <= will be use in more cases than the previous one
			});
			
		/* Get slave_content textarea height */
			this.slaveContentHeight = $ovl.find('.slave_content').height();


		/* Width/WidthType & Master Height Management */
			var wh_speed = 'fast';
			$width = $ovl.find('#adv_sliders_width');
			$widthType = $ovl.find('#adv_sliders_width_type').hide();
			$height = this.$masterHeight;
			$heightType = $ovl.find('#adv_sliders_height_type');
			$heightText = $height.parent().prev();
			$heightBlock = $height.add($heightType).add($heightText).hide();
				
			$width.one('focus', function () {
				$(this).val('');
			}).focus(function () {
				$widthType.show(wh_speed);
				$height.add($heightText).show(wh_speed);
				
				if( $(this).val() == self.auto ) 
					$(this).val('');
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
					$(this).val(self.auto);
					$widthType.hide(wh_speed);
					$heightBlock.hide(wh_speed);
				}
			});
					
			$widthType.click(function(e)
			{
				if( $(this).val() == '%' ) 
					$(this).val('px');
				else
					$(this).val('%');
			});
				
			$height.one('focus', function () {
				$(this).val('');
			}).focus(function () {
				$heightType.show('fast');
				
				if( $(this).val() == self.auto ) 
					$(this).val('');
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
				$slaveHeightGroup = self.getSlaveHeightGroup();
				
				if( $(this).val().length == 0 || isNaN( $(this).val() ) )
				{
					$(this).val(self.auto);
					$heightType.hide(wh_speed);
					$slaveHeightGroup.show(); //Only for accordion (to check)
				}
				else
				{
					$slaveHeightGroup.hide();
				}
			});

		/* Slider player block Management */
			$player = $ovl.find('select[name="sliderPlayer"]');
			$playerOpts = $ovl.find('.adv_slider_player').nextAll().hide();
			$interval = $ovl.find('#adv_sliders_interval');
			$intervalType = $ovl.find('#adv_sliders_interval_type').hide();

			$player.click(function(e){
				if($(this).val() == 'yes'){
					$playerOpts.show();
				}else{
					$playerOpts.hide();
				}
			});

			
			$interval.one('focus', function () {
				$(this).val('');
			}).focus(function () {
				$intervalType.show('fast');
				
				if( $(this).val() == self.auto ) 
					$(this).val('');
			}).focusout(function() {
				var interval_tmp = $(this).val();
					
				//For our Chinese & Japanese Friends
				var regex_interval = new RegExp("[０-９]+");
				if (regex_interval.test(interval_tmp))
				{
					interval_tmp = parentClass.zen2han(interval_tmp);
					$(this).val(interval_tmp);
				}
					
				//Width must be a number !
				if( $(this).val().length == 0 || isNaN( $(this).val() ) )
				{
					$(this).val(self.auto);
					$intervalType.hide(wh_speed);
				}
			});

		/*Modify dynamically slave inputs names (id incrementation)*/
		this.resetSlidesOrder();
	},
	getSlaveHeightGroup: function()
	{
		return this.$builder.find('.heightGroup');
	},
	initSlideModeChange: function()
	{
		if(this.mode == 'tabs'){
			this.selectAlign(false, 'center');
		}else{
			this.selectAlign(false, 'left');		
		}
	},	
	initModeLayout: function()
	{
		/* Show/Hide dedicated classes*/
		$ovl = this.$ovl;

		function createClass(mode){
			return '.advOnly'+mode.charAt(0).toUpperCase()+mode.slice(1)
		}

		var modes = ['accordion', 'tabs', 'slider'], mode = this.mode, classToShow, classesToHide, i = modes.indexOf(mode);
		modes.splice(i, 1);

		$.each(modes, function(i, v){
			modes[i] = createClass(v);
		});

		classesToHide = modes.join(', ');
		$(classesToHide).hide();

		classToShow = createClass(mode);
		$(classToShow).show();

		/* Manager slave textarea height */		
		$slaveContent = $ovl.find('textarea.slave_content');
		
		if(mode == 'slider'){
			$slaveContent.height(this.slaveContentHeight-this.sliderTextareaHeightDiff);
		}else{
			$slaveContent.height(this.slaveContentHeight);
		}
		
		if(mode == 'accordion'){
			if( !isNaN(this.$masterHeight.val()) ) //if is a number hide slave height group
			{
				$slaveHeightGroup = self.getSlaveHeightGroup();
				$slaveHeightGroup.hide();
			}
		}
		
		if(mode != 'accordion'){
			//RAZ checked Open slave option
			$slaveOpen = $ovl.find('.slave_open').removeClass('mce-checked').find('input').val(0);
		}
	},
	initTabs: function(index)
	{
		$ovl = this.$ovl;
		
		$advTabs = $ovl.find('.advSlidesTabs');
		this.cleanWhiteSpace($advTabs);
		$advPanes = $ovl.find('.advSlidesPanes').children(); 
		
		$advTabs.tabs($advPanes, {
			initialIndex: (typeof index !== 'undefined') ? index : 0
		});
	},
	selectAlign: function($clickedButton, align)
	{
		if($clickedButton == false){
			//Global RAZ + Select
			$slaveAlign = this.$builder.find('.slave_align');
			$alignButtons = $slaveAlign.find('div');
			$formButtons = this.$builder.find('input.slaveAlignForm');

			$alignButtons.removeClass('align_select_left align_select_center align_select_right');

			if($.inArray(align, ['left', 'center', 'right']) == -1){
				return false;
			}

			$slaveAlign.find('.align_'+align).addClass('align_select_'+align);
			$formButtons.val(align);
			
			return false;
		}
		
		//Targeted RAZ + Select
		$slaveAlign = $clickedButton.parents().parent('.slave_align');
		$formButtons = $slaveAlign.next();
		$alignButtons = $slaveAlign.find('div');
		$alignButtons.removeClass('align_select_left align_select_center align_select_right');

		if($clickedButton.hasClass('align_'+align)){
			$clickedButton.addClass('align_select_'+align);
			$formButtons.val(align);
		}
	},
	createSlide: function()
	{
		$ovl = this.$ovl;
		var index;
	
		$currentTab = this.getCurrentTab(true);
		index = $currentTab.index();
		$currentPane = this.getPaneByIndex(index);

		$currentTab.clone().insertAfter($currentTab);
		$currentPane.clone().html(this.htmlPattern).insertAfter($currentPane);

		this.resetSlidesOrder();
		this.initTabs(index+1);
		this.rebindSlaveFunctions();
		
		this.initModeLayout();
	},
	deleteSlide: function()
	{
		var index;
		
		$currentTab = this.getCurrentTab(true);
		index = $currentTab.index();
		$currentTab.remove();
		
		$currentPane = this.getPaneByIndex(index);
		$currentPane.remove();
		
		this.resetSlidesOrder();
		this.initTabs(index-1);		
	},	
	getCurrentTab: function(removeCurrentClass)
	{
		$current = this.$ovl.find('.slideTab.current');
		
		if(removeCurrentClass == true)
			$current.removeClass('current');
			
		return $current;
	},
	getCurrentPane: function()
	{
		var currentTabIndex = this.$ovl.find('.slideTab.current').index();
		return this.getPaneByIndex(currentTabIndex);
	},
	getPaneByIndex: function(index)
	{
		 return this.$ovl.find('.advSlidesPanes').children().eq(index);
	},
	getMode: function()
	{
		//To use with binded functions
		return this.$ovl.find('#adv_slides_mode_input').val();
	},	
	resetSlidesOrder: function()
	{
		$ovl = this.$ovl;
		$builder = this.$builder;

		$advTabs = $ovl.find('.advSlidesTabs').children();
		$advPanes = $ovl.find('.advSlidesPanes').children();
		
		$advTabs.each(function(i) {
			i++;
			$(this).attr('data-order', i);
			$(this).text(i);
		});
		
		$advPanes.each(function(i) {
			i++;
			$(this).attr('data-order', i);

			$inputs = $(this).find('input, textarea, select');
			$inputs.each(function(){
				var name = $(this).attr('name').replace(/_\d+/, '');
				$(this).attr('name', name+'_'+i);
			});
		});
	},
	rebindSlaveFunctions: function()
	{
		/*Don't use input name selector here => are dynamically changed*/
		
		self = this;
		$ovl = this.$ovl;
		$builder = this.$builder;
		var wh_speed = 'fast';

		/*Delete slide*/
			$ovl.find('.slideDelete').unbind('click').bind('click', function(e){
				self.deleteSlide();
			});
		
		/*Checkbox from Quattro framework */
			//Get checkbox
			$checkbox = $builder.find('.xenCheckBox');
			
			//Rebind
			this.parentClass._initCheckBox($checkbox);


		/* Title Block Management */
			$title = $builder.find('.slave_title').unbind('focus focusout');
			$nextAllTitle = $title.parent().nextAll();

			var titleWidth; 
		
			$title.one('focus', function () {
				titleWidth = $(this).width();
				$(this).val('');
			})
			.bind('focus', function () {
				$(this).parent().nextAll().hide();
				$(this).animate({width:'400px'}, wh_speed);
				
				if($(this).val() == self.auto)
					$(this).val('')
			})
			.bind('focusout', function() {
				$(this).animate({width:titleWidth}, 
					function() {
						$nextAllTitle.show();
						self.initModeLayout();	
					}
				);
				
				if($(this).val().length == 0)
					$(this).val(self.auto)
			});		

		//Align Management
			$alignButton = $builder.find('.slave_align div').unbind('click');

			$alignButton.bind('click', function(e){
				$btn = $(this);
				self.selectAlign($btn, $btn.data('salign'));
			});

		//Slave Height Management
			$slaveheight = $builder.find('.slave_height').unbind('focus focusout');
			$slaveheightType = $builder.find('.slave_height_type').hide();
		
			$slaveheight.one('focus', function () {
				$(this).val('');
			}).focus(function () {
				$slaveheightType.show(wh_speed);
				
				if( $(this).val() == self.auto ) 
					$(this).val('');
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
					$(this).val(self.auto);
					$slaveheightType.hide(wh_speed);
				}
			});

		//Slider IMG ID full mode
			$IDHelper = $builder.find('.advSlidesIdTrigger').unbind('click').show();

			$ovl.find('.advSlideHide').children().hide();
			
			$IDHelper.bind('click', function(){
				$parentSlide =  $(this).parents('.slidePane');
				$slaveContent = $parentSlide.find('.slave_content');
				$slaveIdMode = $parentSlide.find('.quattro_slides_attach');
				$elAfter = $(this).nextAll();

				if($(this).attr('active')){
					$(this).parent().addClass('advSlideHide');
					$(this).removeAttr('active').removeClass('active');
					$slaveIdMode.remove();
					$slaveContent.show();
					$elAfter.hide();
					$parentSlide.find('.slave_slider_id').val('');
					return false;
				}
			
				$(this).parent().removeClass('advSlideHide');
				$(this).attr('active', true).addClass('active');
				$elAfter.show();
				$slaveContent.hide();
				$attachDialog = $ovl.find('#quattro_slider_patterns > .quattro_slides_attach').clone();
				
				$attachDialog
					.insertAfter($slaveContent)
					.height($slaveContent.height())
					.show();
					
				$attachIMG = $attachDialog.find('img').unbind('click');
				
				$attachIMG.bind('click', function(){
					var id = $(this).data('attachid');
					$parentSlide =  $(this).parents('.slidePane');
					$parentSlide.find('.slave_slider_id').val(id);
				});
			});
			
		//Slave Open configuration (accordion can have several open slides, others modes can't)
			$slaveOpen = $builder.find('.slave_open > i').unbind('click');
			
			$slaveOpen.bind('click', function(e){
				var mceChecked = 'mce-checked', mode = self.getMode();
				
				$openParent = $slaveOpen.parent();
				$openInput = $openParent.find('input');
				$thisParent = $(this).parent();
				$thisInput = $thisParent.find('input');

				if($thisParent.hasClass(mceChecked)){
					$thisParent.removeClass(mceChecked);
					$thisInput.val(0);
					return false;
				}

				if(mode != 'accordion'){
					$openParent.removeClass(mceChecked);
					$openInput.val(0);
				}
				
				$thisParent.addClass(mceChecked);
				$thisInput.val(1);
				
				return false;
			});
	},
	submit: function(e, $ovl, ed, parentClass)
	{
		/***
			>>> Reminder: 
			    this function is independent from the previous functions
		***/

		//Set local variables
		var self = this, data = e.data, mode = data.mode, phrases = xenMCE.Phrases, auto = phrases.adv_auto, 
		separator = parentClass.bbm_separator, tag = parentClass.bbm_tag;
		
		
		if($.inArray(mode, ['accordion', 'tabs', 'slider']) == -1){
			return false;
		}

		var tag = data['adv_tag_'+mode];

		//Set global variables
		this.mode = mode;
		this.ed = ed;
		this.parentClass = parentClass;
		this.tag = tag; //should not be need => better to create an orphan button + some options for tags
		this.phrases = phrases;
		this.auto = auto;
		this.separator = separator;

		//Get slaves fields by slides
		this.getSlavesDatas = function(){
			return this.slaveDataBySlides(e.data);
		}

		var 	blockalign = (data.blockalign == 'bleft') ? false : data.blockalign,

			globalWidthType = (data.globalWidthType == 'px') ? '' : '%',
			globalWidth = (data.globalWidth == auto) ? false : data.globalWidth+globalWidthType,
			globalHeight = (isNaN(data.globalHeight)) ? false : data.globalHeight,
			globalWidth = (globalWidth && globalHeight) ? globalWidth+'x'+data.globalHeight : globalWidth,

			sliderPlayer = (data.sliderPlayer == 'yes') ? 'cmd' : false,
			sliderAutoplay = (parseInt(data.sliderAutoplay)) ? 'autoplay' : false,
			sliderNoclick = (parseInt(data.sliderAutoclick)) ? false : 'noclick',
			sliderInterval = (data.sliderInterval == auto) ? false : data.sliderInterval+'ms',
			sliderLayout = (data.sliderLayout  == 'outside') ? false : 'inside',
			sliderTabsStyle = (data.sliderTabsStyle == 'bullet') ? false : 'num';
		
			//console.log('width:'+globalWidth+' , widthType:'+globalWidthType+' ,height:'+globalHeight);
			//console.log('player:'+sliderPlayer+' , autoplay:'+sliderAutoplay+' ,interval:'+sliderInterval+' ,sliderLayout:'+sliderLayout+' ,sliderTabsStyle:'+sliderTabsStyle);
		
		var masterOptions = '';
		
		function manageMasterOptions(option)
		{
			if (masterOptions.length == 0){
				masterOptions = "=" + option;
			}else{
				masterOptions = masterOptions + separator + option;			
			}
		}

		if(blockalign !== false){ manageMasterOptions(blockalign); }
		if(globalWidth !== false){ manageMasterOptions(globalWidth); }
		
		if(mode == 'slider'){
			if(sliderLayout !== false){ manageMasterOptions(sliderLayout); }
			if(sliderTabsStyle !== false){ manageMasterOptions(sliderTabsStyle); }
			if(sliderPlayer !== false){ manageMasterOptions(sliderPlayer); }
			if(sliderAutoplay !== false){ manageMasterOptions(sliderAutoplay); }
			if(sliderNoclick !== false){ manageMasterOptions(sliderNoclick); }
			if(sliderInterval !== false){ manageMasterOptions(sliderInterval); }		
		}
		
		var content = this.manageSlaveSlides(globalHeight);

		var output = '['+tag+masterOptions+']' + content + '[/'+tag+']';

		XenForo.ajax(
			'index.php?editor/to-html',
			{ bbCode: output },
			$.proxy(self, 'insert')
		);
		
		return false;		
	},
	slaveDataBySlides: function(data)
	{
		var slaves = {};

		$.each(data, function(k, v){
			var 	prefix = k.substr(0,5), 
				id = parseInt(k.substr(k.lastIndexOf('_')+1)), 
				name = k.substr(0, k.lastIndexOf('_'));
					
			if(prefix == 'slave' && !isNaN(id)){
				if(typeof slaves[id] === 'undefined'){
					slaves[id] = {};
				}

				slaves[id][name] = v;
			}
		});
		
		return slaves;
	},
	manageSlaveSlides: function(globalHeight)
	{
		var slaveSlidesData = this.getSlavesDatas(), auto = this.auto, mode = this.mode, slides = '';
		
		$.each(slaveSlidesData, function(id, data){
			var slaveOptions = '';
		
			function manageSlaveOptions(option)
			{
				if (slaveOptions.length == 0){
					slaveOptions = "=" + option;
				} else {
					slaveOptions = slaveOptions + '|' + option;
				}
			}	

			//Get datas
			var 	slaveTitle = (data.slaveTitle == auto) ? false : data.slaveTitle,
				slaveAlign = (data.slaveAlign == 'left') ? false : data.slaveAlign,
				slaveHeight = (isNaN(parseInt(data.slaveHeight)) || globalHeight !== false) ? false : data.slaveHeight,
				slaveOpen = (parseInt(data.slaveOpen)) ? 'open' : false,
				slaveContent = data.slaveContent,
				
				slaveSliderId = ( isNaN(parseInt(data.slaveSliderId)) ) ? false : data.slaveSliderId,
				slaveSliderTitlePosition = (!slaveSliderId) ? false : data.slaveSliderTitlePosition,
				slaveSliderFull = (!slaveSliderId || parseInt(data.slaveSliderFull) == 0) ? false : 'full';
	
			//Manage datas
			if(slaveTitle !== false){ manageSlaveOptions(slaveTitle); }
			if(slaveAlign !== false){ manageSlaveOptions(slaveAlign); }
			if(slaveOpen !== false){ manageSlaveOptions(slaveOpen); }

			if(mode == 'accordion'){
				if(slaveHeight !== false){ manageSlaveOptions(slaveHeight); }
			}

			if(mode == 'slider'){
				if(slaveSliderId !== false){ manageSlaveOptions(slaveSliderId); }
				if(slaveSliderTitlePosition !== false){ manageSlaveOptions(slaveSliderTitlePosition); }
				if(slaveSliderFull !== false){ manageSlaveOptions(slaveSliderFull); }
			}

			slides += '\n{slide'+slaveOptions+'}' + slaveContent + '{/slide}\n';
		});
		
		return slides;
	},
	insert: function(ajaxData)
	{
		if (XenForo.hasResponseError(ajaxData)){
			return false;
		}

		this.ed.execCommand('mceInsertContent', false, ajaxData.html);

		return false;		
	}
}
