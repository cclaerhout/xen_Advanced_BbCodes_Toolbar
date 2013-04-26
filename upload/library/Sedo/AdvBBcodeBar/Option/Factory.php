<?php
class Sedo_AdvBBcodeBar_Option_Factory
{
	public static function render_usergroups(XenForo_View $view, $fieldPrefix, array $preparedOption, $canEdit)
	{
		$preparedOption['formatParams'] = XenForo_Model::create('Sedo_AdvBBcodeBar_Model_GetUsergroups')->getUserGroupOptions($preparedOption['option_value']);
		return XenForo_ViewAdmin_Helper_Option::renderOptionTemplateInternal('option_list_option_checkbox', $view, $fieldPrefix, $preparedOption, $canEdit);
	}

	public static function render_styles(XenForo_View $view, $fieldPrefix, array $preparedOption, $canEdit)
	{
		$preparedOption['formatParams'] = XenForo_Model::create('Sedo_AdvBBcodeBar_Model_GetStyles')->getStylesOptions($preparedOption['option_value']);
		return XenForo_ViewAdmin_Helper_Option::renderOptionTemplateInternal('option_list_option_checkbox', $view, $fieldPrefix, $preparedOption, $canEdit);
	}

	public static function check_grabber(XenForo_View $view, $fieldPrefix, array $preparedOption, $canEdit)
	{		
		$grabber_options = array();
		$grabber_options['none'] = new XenForo_Phrase('sedo_adv_grabber_manual_rss');

		if (function_exists('curl_version'))
		{
			$grabber_options['curl'] = new XenForo_Phrase('sedo_adv_grabber_curl');
		}
		else
		{
			$grabber_options['nocurl'] = new XenForo_Phrase('sedo_adv_grabber_nocurl');
		}

		if (file_get_contents(__FILE__) AND @file_get_contents('http://www.google.com'))
		{
			$grabber_options['fgc'] = new XenForo_Phrase('sedo_adv_grabber_fgc');
		}
		elseif (file_get_contents(__FILE__) AND !ini_get('allow_url_fopen'))
		{
			$grabber_options['nofgc'] =  new XenForo_Phrase('sedo_adv_grabber_nofgc_auf');
		}
		else
		{
			$grabber_options['nofgc'] = new XenForo_Phrase('sedo_adv_grabber_nofgc');
		}

		$preparedOption['formatParams'] = $grabber_options;
		return XenForo_ViewAdmin_Helper_Option::renderOptionTemplateInternal('option_list_option_select', $view, $fieldPrefix, $preparedOption, $canEdit);
	}	
}