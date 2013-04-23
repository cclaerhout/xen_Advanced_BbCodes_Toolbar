(function() {
/**
* GLOBAL VARIABLES
*/
	var adv_highlight_active = false, 
	replace_id_n = 1,
	replace_id_s = 1,
       	adv_hl_norm_open,adv_hl_norm_options,adv_hl_norm_close,adv_hl_spe_open,adv_hl_spe_content,adv_hl_spe_close,adv_hl_tag_separator, //Highlighting colors
     	safety = 1, // Just for Highlighting  developpement
      	pattern = new Array; //Highlighting Regex patterns
	
/**
* TINYMCE CREATE PLUGIN
*/
        tinymce.create('tinymce.plugins.AdvBBcodesToolbar', {
	/**
	* INIT
	*/
                init : function(ed, url) {
                	var t = this;
			//Function to get a template with its style
			function _getFullDialogUrl(template)
			{
				var dialogUrl = ed.getParam('theme_xenforo_dialog_url');
				if (dialogUrl.indexOf('?') == -1)
				{
					return dialogUrl + '?dialog=' + encodeURIComponent(template);
				}
				else
				{
					return dialogUrl + '&dialog=' + encodeURIComponent(template);
				}
			};
		/**
		* PICASA
		*/
                        ed.addCommand('AdvPicasa', function() {

				if (ed.getParam('fast_overlay') == 1) {
					XenForo.tinymce._overlay_callbacks(t, 'adv_picasa_ontrigger');
					XenForo.ajax('index.php?editor/fast-dialog',    { dialog: 'fast_adv_picasa'}, XenForo.tinymce._overlay_success);
				}
				else{
					ed.focus();
						ed.windowManager.open({
							file : _getFullDialogUrl('advpicasa'),
							width : 510,
							height : 289,
							inline : true
		                                }, {
	        	                                plugin_url : url, // Plugin absolute URL
							some_custom_arg : 'custom arg' // Custom argument
		                                });
				}

                        });
                        // Picasa button
                        ed.addButton('adv_picasa', {
                                title : 'advtoolbar.picasa_desc',
                                cmd : 'AdvPicasa'
                        });
                        
		/**
		* ARTICLE
		*/
                        ed.addCommand('AdvArticle', function() {

				if (ed.getParam('fast_overlay') == 1) {
					XenForo.tinymce._overlay_callbacks(t, 'adv_article_ontrigger');
					XenForo.ajax('index.php?editor/fast-dialog',    { dialog: 'fast_adv_article'}, XenForo.tinymce._overlay_success);
				}
				else{
					ed.focus();
					ed.windowManager.open({
							file : _getFullDialogUrl('advarticle'),
							width : "510",
							height : "289", // can't use this value due to an auto-resize
							inline : true
		                                }, {
	        	                                plugin_url : url, // Plugin absolute URL
							some_custom_arg : 'custom arg' // Custom argument
					});				
				}
                        });
                        ed.addButton('adv_article', {
                                title : 'advtoolbar.article_desc',
                                cmd : 'AdvArticle'
                        });
		/**
		* ENCADRE
		*/
                        ed.addCommand('AdvEncadre', function() {

				if (ed.getParam('fast_overlay') == 1) {
					XenForo.tinymce._overlay_callbacks(t, 'adv_enc_ontrigger');
					XenForo.ajax('index.php?editor/fast-dialog', { dialog: 'fast_adv_enc'}, XenForo.tinymce._overlay_success);
				}
				else{
					ed.focus();
					ed.windowManager.open({
							file : _getFullDialogUrl('advenc'),
							width : "510",
							height : "289", // can't use this value due to an auto-resize
							inline : true
		                                }, {
	        	                                plugin_url : url, // Plugin absolute URL
							some_custom_arg : 'custom arg' // Custom argument
					});
				}			
                        });
                        // Encadre Button
                        ed.addButton('adv_encadre', {
                                title : 'advtoolbar.encadre_desc',
                                cmd : 'AdvEncadre'
                        });
		/**
		* FIELDSET
		*/
			// Fieldset Command
                        ed.addCommand('AdvFieldset', function() {

				if (ed.getParam('fast_overlay') == 1) {
					XenForo.tinymce._overlay_callbacks(t, 'adv_fieldset_ontrigger');
					XenForo.ajax('index.php?editor/fast-dialog', { dialog: 'fast_adv_fieldset'}, XenForo.tinymce._overlay_success);
				}
				else{
					ed.focus();
					ed.windowManager.open({
							file : _getFullDialogUrl('advfieldset'),
							width : "510",
							height : "289", // can't use this value due to an auto-resize
							inline : true
		                                }, {
	        	                                plugin_url : url, // Plugin absolute URL
							some_custom_arg : 'custom arg' // Custom argument
					});
				}				
                        });
                        // Fieldset Button
                        ed.addButton('adv_fieldset', {
                                title : 'advtoolbar.fieldset_desc',
                                cmd : 'AdvFieldset'
                        });
		/**
		* GVIEW
		*/
                        ed.addCommand('AdvGview', function() {
				ed.focus();
				ed.selection.setContent('[gview]' + ed.selection.getContent() + '[/gview]');
                        });
                        ed.addButton('adv_gview', {
                                title : 'advtoolbar.gview_desc',
                                cmd : 'AdvGview'
                        });
		/**
		* BIMG
		*/
                        ed.addCommand('AdvBimg', function() {
                        
				if (ed.getParam('fast_overlay') == 1) {
					XenForo.tinymce._overlay_callbacks(t, 'adv_bimg_ontrigger');
					XenForo.ajax('index.php?editor/fast-dialog', { dialog: 'fast_adv_bimg'}, XenForo.tinymce._overlay_success);
				}
				else{
					ed.focus();
					ed.windowManager.open({
							file : _getFullDialogUrl('advbimg'),
							width : "510",
							height : "289", // can't use this value due to an auto-resize
							inline : true
		                                }, {
	        	                                plugin_url : url, // Plugin absolute URL
							some_custom_arg : 'custom arg' // Custom argument
					});
				}
                        });
                        ed.addButton('adv_bimg', {
                                title : 'advtoolbar.bimg_desc',
                                cmd : 'AdvBimg'
                        });

		/**
		* JUSTIF
		*/
                        ed.addCommand('AdvJustif', function() {
				ed.focus();
				ed.selection.setContent('[justif]' + ed.selection.getContent() + '[/justif]');
                        });
                        ed.addButton('adv_justif', {
                                title : 'advtoolbar.justif_desc',
                                cmd : 'AdvJustif'
				//,image : url + '/images/justifyall.png'
                        });
		/**
		* LATEX
		*/
                        ed.addCommand('AdvLatex', function() {

				if (ed.getParam('fast_overlay') == 1) {
					XenForo.tinymce._overlay_callbacks(t, 'adv_latex_ontrigger');
					XenForo.ajax('index.php?editor/fast-dialog',    { dialog: 'fast_adv_latex'}, XenForo.tinymce._overlay_success);
				}
				else{
					ed.focus();
					ed.windowManager.open({
							file : _getFullDialogUrl('advlatex'),
							width : "510",
							height : "289", // can't use this value due to an auto-resize
							inline : true
		                                }, {
	        	                                plugin_url : url, // Plugin absolute URL
							some_custom_arg : 'custom arg' // Custom argument
					});
				}			
                        });
                        ed.addButton('adv_latex', {
                                title : 'advtoolbar.latex_desc',
                                cmd : 'AdvLatex'
                        });
		/**
		* SPOILER
		*/
                        ed.addCommand('AdvSpoiler', function() {
				ed.focus();
				ed.selection.setContent('[spoiler]' + ed.selection.getContent() + '[/spoiler]');
                        });
                        ed.addButton('adv_spoiler', {
                                title : 'advtoolbar.spoiler_desc',
                                cmd : 'AdvSpoiler'
                        });
                        ed.addCommand('AdvSpoilerBB', function() {
				ed.focus();
				ed.selection.setContent('[spoilerbb]' + ed.selection.getContent() + '[/spoilerbb]');
                        });
                        ed.addButton('adv_spoilerbb', {
                                title : 'advtoolbar.spoiler_desc',
                                cmd : 'AdvSpoilerBB'
                        });
                        
		/**
		* PRIVATE 1&2
		*/
                        ed.addCommand('AdvPrivate', function() {
				var pv = ed.getParam('advtoolbar_AdvPV');
				ed.focus();
				ed.selection.setContent('[' + pv + ']' + ed.selection.getContent() + '[/' + pv + ']');
                        });
                        ed.addButton('adv_private', {
                                title : 'advtoolbar.private_desc',
                                cmd : 'AdvPrivate'
                        });

                        ed.addCommand('AdvPrivate2', function() {
				var pv2 = ed.getParam('advtoolbar_AdvPV2');
				ed.focus();
				ed.selection.setContent('[' + pv2 + ']' + ed.selection.getContent() + '[/' + pv2 + ']');
                        });
                        ed.addButton('adv_private2', {
                                title : 'advtoolbar.private2_desc',
                                cmd : 'AdvPrivate2'
                        });
		/**
		* PREMIUM 1&2
		*/
                        ed.addCommand('AdvPremium', function() {
				var prem = ed.getParam('advtoolbar_AdvPREM');
				ed.focus();
				ed.selection.setContent('[' + prem + ']' + ed.selection.getContent() + '[/' + prem + ']');
                        });
                        ed.addButton('adv_premium', {
                                title : 'advtoolbar.premium_desc',
                                cmd : 'AdvPremium'
				//,image : url + '/images/premium.png'
                        });


                        ed.addCommand('AdvPremium2', function() {
				var prem2 = ed.getParam('advtoolbar_AdvPREM2');
				ed.focus();
				ed.selection.setContent('[' + prem2 + ']' + ed.selection.getContent() + '[/' + prem2 + ']');
                        });
                        ed.addButton('adv_premium2', {
                                title : 'advtoolbar.premium2_desc',
                                cmd : 'AdvPremium2'
				//,image : url + '/images/premium2.png'
                        });

		/**
		* ACCORDION
		*/
                        ed.addCommand('AdvAccordion', function() {
				var chkIE;
				if($.browser.msie && $.browser.version=="6.0"){ chkIE= 'ie6'; } else { chkIE = ''; }

				if (ed.getParam('fast_overlay') == 1) {
					XenForo.tinymce._overlay_callbacks(t, 'adv_accordion_ontrigger');
					XenForo.ajax('index.php?editor/fast-dialog',    { dialog: 'fast_adv_accordion'+chkIE}, XenForo.tinymce._overlay_success);
				}
				else{
					ed.focus();
      					ed.windowManager.open({
      						file : _getFullDialogUrl('advaccordion'+chkIE),
      						width : 510,
      						height : 289,
      						inline : true
      	                                }, {
              	                                plugin_url : url, // Plugin absolute URL
      						some_custom_arg : 'custom arg' // Custom argument
      	                                });
		                }
                        });
                        ed.addButton('adv_accordion', {
                                title : 'advtoolbar.accordion_desc',
                                cmd : 'AdvAccordion'
				//,image : url + '/images/accordion.png'
                        });
                        
                        
		/**
		* HIGHLIGHT
		*/
			// Highlight Command
                        ed.addCommand('AdvHighlight', function() {
                        
	                  	adv_hl_norm_open = ed.getParam('advtoolbar_Hl_Norm_Open'),
				adv_hl_norm_options = ed.getParam('advtoolbar_Hl_Norm_Options'),
				adv_hl_norm_close = ed.getParam('advtoolbar_Hl_Norm_Close'),
				adv_hl_spe_open = ed.getParam('advtoolbar_Hl_Spe_Open'),
				adv_hl_spe_content = ed.getParam('advtoolbar_Hl_Spe_Content'),
				adv_hl_spe_close = ed.getParam('advtoolbar_Hl_Spe_Close'),
				adv_hl_tag_separator = ed.getParam('advtoolbar_Hl_Tag_Separator'),
				pattern.normalOpen = 	/(\[[^\/]+?)((?==)[^\[]*?)?\](?!<[\/]?span)/gi,
				pattern.normalClose = 	/(\[\/([^[]+?)\])(?!<\/span>)/gi,
				pattern.special = 	/(\{([^\/]+?)(?:=.+?)?\})(?!<\/span>)((?:\{\2(?:=.+?)?\}(?:\{\2(?:=.+?)?\}[\s\S]*?\{\/\2\}|[\s\S])+?\{\/\2\}|[\s\S])*?)(\{\/\2\})/gi;
                        
				if(adv_highlight_active === false) //Jquery: if(!($('.mce_adv_highlight').hasClass('mceButtonActive')))
				{
			                /**
			                 * Change Button State to ON
			                 */
					ed.onNodeChange.add(function(ed, cm, n) {
						cm.setActive('adv_highlight', 1); //Jquery:  $('.mce_adv_highlight').addClass('mceButtonActive');
						adv_highlight_active = true;
					})
			                /**
			                 * Start Highlighting
			                 */
					ed.onNodeChange.add(t._getHighlight);
					ed.onKeyDown.add(t._getHighlight);
				}
				else
				{
			                /**
			                 * Change Button State to OFF
			                 */
					ed.onNodeChange.add(function(ed, cm, n) {
						cm.setActive('adv_highlight', 0); // Jquery: $('.mce_adv_highlight').removeClass('mceButtonActive');
						adv_highlight_active = false;
					})
			                /**
			                 * Stop Highlighting
			                 */
					ed.onNodeChange.remove(t._getHighlight);
					ed.onKeyDown.remove(t._getHighlight);
					ed.dom.remove(ed.dom.select('.adv_hl'), 'adv_hl'); 	// Jquery: $('.mceIframeContainer iframe').contents().find('.adv_hl').contents().unwrap();
					replace_id_n = 0;
					replace_id_s = 0;
				}
                        });
			// Delete all Highlight modifications during editor Init
			ed.onInit.add(function(ed) {
				ed.dom.remove(ed.dom.select('.adv_hl'), 'adv_hl'); // Jquery: $('.mceIframeContainer iframe').contents().find('.adv_hl').contents().unwrap();
				replace_id_n = 0;
				replace_id_s = 0;
			});
			// Highlight Button
                        ed.addButton('adv_highlight', {
                                title : 'advtoolbar.highlight_desc',
                                cmd : 'AdvHighlight'
                                //,image : url + '/images/adv_tags.png'
                        });
                },
	/**
	* PRIVATE FUNCTIONS
	*/
		/** HIGHLIGHT (NEW) */
		_getHighlight :	function (ed, cm, n) {
			var content = ed.getContent(),
			triger_replace = false,
			triger_normal = false,
			triger_special = false,
			NoContent = false;

			if (pattern.normalOpen.test(content))
			{
				triger_replace = true;
				triger_normal = true;
				content = content.replace(pattern.normalOpen,
					function(fullMatch, tagopen, tagoptions) {
						replace_id_n++;
						var builder = '<span id="advhln_'+ (replace_id_n) +'" class="adv_hl adv_hln_'+ (replace_id_n) +'" style="background-color:'+ adv_hl_norm_open +'">'+ tagopen;

						if(typeof tagoptions !== 'undefined')
						{
							var separator;
							if(tagopen == '[picasa') { separator = /,/gi; } else { separator = /\|/gi; };
							tagoptions = tagoptions.replace(separator, '<span class="adv_hl" style="color:'+ adv_hl_tag_separator +';font-weight:bolder;">$&</span>');
							
							builder+= '<span class="adv_hl adv_hln_'+ (replace_id_n) +' tag_options_'+ (replace_id_n) +'" style="background-color:'+ adv_hl_norm_options +'">'+ tagoptions +'</span>';
						}
						
						builder+= ']</span>';
						
						return builder;
				});
			}

			if (pattern.normalClose.test(content))
			{
				triger_replace = true;
				triger_normal = true;
				content = content.replace(pattern.normalClose,
					function(fullMatch, tagclose, tag) {
						replace_id_n++;
						return '<span id="advhln_'+ (replace_id_n) +'" class="adv_hl adv_hln_'+ (replace_id_n) +'" style="background-color:'+ adv_hl_norm_close +'">'+ tagclose +'</span>';
				});
			}

			//Special tags
			if (pattern.special.test(content))
			{
				//Special tags
				triger_replace = true;
				triger_special = true;				
						
				content = content.replace(pattern.special,
					function(fullMatch, tagopen, tag, tagcontent, tagclose) {
						replace_id_s++;
						if(!tagcontent){ NoContent = true; }

						return '<span id="advhls_open_'+ (replace_id_s) +'" class="adv_hl adv_hls_'+ (replace_id_s) +'" style="background-color:'+ adv_hl_spe_open +'">'+ tagopen +'</span><span id="advhls_content_'+ (replace_id_s) +'" class="adv_hl  adv_hls_'+ (replace_id_s) +'" style="background-color:'+ adv_hl_spe_content +'">'+ tagcontent +'</span><span id="advhls_close_'+ (replace_id_s) +'" class="adv_hl  adv_hls_'+ (replace_id_s) +'" style="background-color:'+ adv_hl_spe_close +'">'+ tagclose +'</span>';
					});
			}

			if (triger_replace)
  			{
				//Highlight!!!
				ed.setContent(content);
				
				if (triger_normal === true)
				{ 
					ed.selection.select(ed.dom.select('span#advhln_' + replace_id_n)[0]); 		//Get the selection
					ed.selection.setContent(ed.selection.getContent());				//Replace the selection to move the caret outside
				}
				else if (triger_special === true)
				{
  					if(NoContent) //If tag has no content, target the open tag to move the caret on the right
  					{
  						var builder_temp;
  						//Select the opening tag
  						ed.selection.select(ed.dom.select('span#advhls_open_' + replace_id_s)[0]);
  						//Rebuild the span for the content tag (its content was nulled so the span hadn't been created) and insert in it a "caretfix" span to select later
  						builder_temp = ed.selection.getContent() + '<span id="advhls_content_'+ (replace_id_n) +'" class="adv_hl  adv_hls_'+ (replace_id_n) +'" style="background-color:'+ adv_hl_spe_content +'"><span id="adv_caretfix"></span></span>';
  						ed.selection.setContent(builder_temp);
  						//Select the caretfix tag (will be automatically killed during setContent)
  						ed.selection.select(ed.dom.select('span#adv_caretfix')[0]);
  						ed.selection.setContent(ed.selection.getContent());
  					}
  					else
  					{
  						ed.selection.select(ed.dom.select('span#advhls_close_' + replace_id_s)[0]);
  						ed.selection.setContent(ed.selection.getContent());
  					}
				}
			}
		},
		adv_picasa_ontrigger : function(inputs) {
			AdvPicasaDialog.submit(inputs);
		},
		adv_latex_ontrigger : function(inputs) {
			AdvLatexDialog.submit(inputs);
		},
		adv_fieldset_ontrigger : function(inputs) {
			AdvFieldsetDialog.submit(inputs);
		},
		adv_enc_ontrigger : function(inputs) {
			AdvEncDialog.submit(inputs);		
		},
		adv_bimg_ontrigger : function(inputs) {
			AdvBimgDialog.submit(inputs);		
		},
		adv_accordion_ontrigger : function(inputs) {
			AdvAccordionDialog.submit(inputs);
		},
		adv_article_ontrigger : function(inputs) {
			AdvArticleDialog.submit(inputs);		
		},

	/**
	* PLUGIN INFORMATION
	*/
                getInfo : function() {
                        return {
                                longname : 'Advanced BBcodes Bar',
                                author : 'Cédric Claerhout',
                                authorurl : 'http://xenforo.com/community/members/cclaerhout.509/',
                                infourl : '',
                                version : "3.2"
                        };
                }
        });
/**
* REGISTER PLUGIN
*/
        tinymce.PluginManager.add('advtoolbar', tinymce.plugins.AdvBBcodesToolbar);
})();