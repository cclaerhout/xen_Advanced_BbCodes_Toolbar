<?php
class Sedo_AdvBBcodeBar_Listener_AllInOne
{
	/***
	 *  CONTROLLER EDITOR
	 **/
	public static function editorController($class, array &$extend)
	{
		if ($class == 'XenForo_ControllerPublic_Editor')
		{
			$extend[] = 'Sedo_AdvBBcodeBar_Controller_Editor';
		}
	}

	/***
	 *  MCE INTEGRATION
	 **/	
	public static function MceIntegration(array &$plugins, array &$mceOptions, array &$mceBtnCss, array $extraValues)
	{
		if(in_array('tags_highlighter', $extraValues['availableButtons']))
		{
			$hlParams = array(
				'adv_hl_norm' => array(
					'open' => XenForo_Template_Helper_Core::styleProperty('adv_highlight_normal_tags_open'),
					'options' => XenForo_Template_Helper_Core::styleProperty('adv_highlight_normal_tags_options'),
					'close' => XenForo_Template_Helper_Core::styleProperty('adv_highlight_normal_tags_close')
				),
				'adv_hl_spe' => array(
					'open' => XenForo_Template_Helper_Core::styleProperty('adv_highlight_special_tags_open'),
					'options' => XenForo_Template_Helper_Core::styleProperty('adv_highlight_special_tags_options'),
					'close' => XenForo_Template_Helper_Core::styleProperty('adv_highlight_special_tags_close'),
					'content' => XenForo_Template_Helper_Core::styleProperty('adv_highlight_special_tags_content')
				),
				'adv_hl_tag_separator' => XenForo_Template_Helper_Core::styleProperty('adv_highlight_tag_options_separator')			
			);
			
			$plugins[] = 'xenadvhl';
			$mceOptions['params'] += $hlParams;
		}
	}
}
//Zend_Debug::dump($abc);
