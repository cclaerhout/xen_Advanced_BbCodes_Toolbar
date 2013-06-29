<?php

class Sedo_AdvBBcodeBar_Listener_Templates_AdvBar
{
	/***
	* HOOK LISTENERS
	**/
	public static function ManageBar($hookName, &$contents, array $hookParams, XenForo_Template_Abstract $template)
	{
		switch ($hookName) 
		{
			case 'miu_integrator_global':
				$xenOptions = XenForo_Application::get('options');
			
				if ( 	($template instanceof XenForo_Template_Admin && !$xenOptions->AdvBBcodeBar_ModifAdmin )
					|| (!$xenOptions->AdvBBcodeBar_JsMiu)
				)
				{
					break;
				}
			
				$jsUrl = XenForo_Application::$javaScriptUrl;
	
				if($xenOptions->markitup_integration_debug_devmode)
				{
					$extendJs = '<script src="' . $jsUrl . '/sedo/advtoolbar/src/markitup.advbb.set.src.js"></script>';
				}
				else
				{
					$extendJs = '<script src="' . $jsUrl . '/sedo/advtoolbar/markitup.advbb.set.js"></script>';
				}
				
				$contents .= $extendJs;
				
			break;

			case 'editor_tinymce_init':
				if (	($template instanceof XenForo_Template_Admin && !$xenOptions->AdvBBcodeBar_ModifAdmin)
					|| (!XenForo_Application::get('options')->get('AdvBBcodeBar_activate_bar'))
				)
				{
					break;
				}

				if(XenForo_Application::get('options')->get('currentVersionId') >= 1020031)
				{
					break;
				}

      				//Bake Parameters
      				$params = self::initParams();
				$contents = preg_replace('#xenforo_smilies:#', $params . '$0', $contents);
      			break;

			case 'editor_js_setup':

				$xenOptions = XenForo_Application::get('options');

				if ( 	($template instanceof XenForo_Template_Admin && !$xenOptions->AdvBBcodeBar_ModifAdmin)
					|| !$xenOptions->AdvBBcodeBar_activate_bar
				)
				{
					break;
				}

				if(XenForo_Application::get('options')->get('currentVersionId') >= 1020031)
				{
					break;
				}

				//Tinymce Plugin declaration: add advtoolbar plugin
				$contents = str_replace("plugins = '", "plugins = 'advtoolbar,", $contents);

				//Phrase buttons
				$phrases = '
				advtoolbar:
				{
					picasa_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_picasa') . '",
					article_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_article') . '",
					encadre_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_encadre') . '",
					fieldset_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_fieldset') . '",
					gview_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_gview') . '",
					bimg_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_bimg_new') . '",
					justif_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_justif') . '",
					latex_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_latex') . '",
					spoiler_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_spoiler') . '",
					private_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_private') . '",
					private2_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_private2') . '",
					premium_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_premium') . '",
					premium2_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_premium2') . '",
					highlight_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_highlight') . '",
					accordion_desc: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_accordion') . '",
					bimg_id: "' . new XenForo_Phrase('Sedo_AdvBBcodeBar_button_bimg_new_id') . '"			
				},
				';
	
				//Init phrases!
				$contents = preg_replace('#window\.tinyMCE.+?xenforo:.+?{#is', '$0' . $phrases, $contents);
			break; 
		}
	}

	public static function initParams()
	{
		$xenOptions = XenForo_Application::get('options');
		$params = array();
		
		/*General parameters*/
		$params['advtoolbar_Advimgx'] = $xenOptions->AdvBBcodeBar_imgdefault;
		$params['advtoolbar_AdvFieldset'] = $xenOptions->AdvBBcodeBar_fieldsetdefault;
		$params['advtoolbar_AdvEncadrex'] = $xenOptions->AdvBBcodeBar_encdefault;
		$params['advtoolbar_template_strechedtitlewidth'] = XenForo_Template_Helper_Core::styleProperty('adv_template_stretchedtitlefield_width');
		$params['advtoolbar_template_normaltitlewidth'] = XenForo_Template_Helper_Core::styleProperty('adv_template_normaltitlefield_width');		
		$params['advtoolbar_template_phrase_auto'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_template_auto');

		/*Premium & private tags*/
		if ($xenOptions->sedo_adv_premium_tag1)
		{
			$params['advtoolbar_AdvPREM'] = $xenOptions->sedo_adv_premium_tag1;
		}
		if ($xenOptions->sedo_adv_premium_tag2)
		{
			$params['advtoolbar_AdvPREM2'] = $xenOptions->sedo_adv_premium_tag2;
		}
		if ($xenOptions->sedo_adv_private_tag1)
		{
			$params['advtoolbar_AdvPV'] = $xenOptions->sedo_adv_private_tag1;
		}
		if ( $xenOptions->sedo_adv_private_tag2)
		{
			$params['advtoolbar_AdvPV2'] = $xenOptions->sedo_adv_private_tag2;
		}
			
		/*Colors*/
		$params['advtoolbar_Hl_Norm_Open'] = XenForo_Template_Helper_Core::styleProperty('adv_highlight_normal_tags_open');
		$params['advtoolbar_Hl_Norm_Options'] = XenForo_Template_Helper_Core::styleProperty('adv_highlight_normal_tags_options');
		$params['advtoolbar_Hl_Norm_Close'] = XenForo_Template_Helper_Core::styleProperty('adv_highlight_normal_tags_close');
		$params['advtoolbar_Hl_Spe_Open'] = XenForo_Template_Helper_Core::styleProperty('adv_highlight_special_tags_open');
		$params['advtoolbar_Hl_Spe_Content'] = XenForo_Template_Helper_Core::styleProperty('adv_highlight_special_tags_content');
		$params['advtoolbar_Hl_Spe_Close'] = XenForo_Template_Helper_Core::styleProperty('adv_highlight_special_tags_close');
		$params['advtoolbar_Hl_Tag_Separator'] = XenForo_Template_Helper_Core::styleProperty('adv_highlight_tag_options_separator');

		$br = "\r\n\t\t\t\t"; //Carriage return & tabs for a proper display in Zend_Debug::dump
		$output = '';
		
      		foreach ($params as $key => $param)
      		{
      			$output .= "$br $key: '$param', ";
      		}
		
		$output .= "$br $br";
		
		return $output;
	}
	
	/***
	*  POST RENDER LISTENERS
	**/
	public static function postrender($templateName, &$content, array &$containerData, XenForo_Template_Abstract $template)
	{
		switch ($templateName) 
		{
			case 'style_property_list':
				if($template instanceof XenForo_Template_Admin)
				{
					/*Auto Heigh for property list*/
					$content = $template->create('style_property_list_atamh_AdvBBcodeBar', array()) . $content;
				}
			break;
			case 'PAGE_CONTAINER':

				if ($template instanceof XenForo_Template_Admin && !XenForo_Application::get('options')->get('AdvBBcodeBar_ModifAdmin'))
				{
					break;
				}
	
				$content .= $template->create('sedo_adv_xenhook', array());
			break;
		}
	}
}
//	Zend_Debug::dump($abc);