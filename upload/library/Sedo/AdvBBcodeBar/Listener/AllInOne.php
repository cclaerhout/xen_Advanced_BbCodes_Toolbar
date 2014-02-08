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
	public static function MceIntegration($mceConfigObj)
	{
		if(is_array($mceConfigObj))
		{
			return false;
		}
		$xenOptions = XenForo_Application::get('options');
		
		if($mceConfigObj->buttonIsEnabled('tags_highlighter'))
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
			
			$mceConfigObj->addMcePlugin('xenadvhl');
			$mceConfigObj->addBulkMceParams($hlParams);
		}

		if($xenOptions->sedo_bbm_adv_tinyquattro_menu_integration)
		{
			$menuItems = array(
				'bbm_sedo_bimg', 'bbm_sedo_slides', '|',
				'bbm_sedo_article', 'bbm_sedo_fieldset', 'bbm_sedo_encadre', 'bbm_sedo_spoilerbb', '|', 
				'bbm_sedo_latex', 'bbm_sedo_gview', 'bbm_sedo_picasa');
				 
			$mceConfigObj->addMenu('adv_insert', 'insert',  'Advanced Insert', $menuItems);
			
			$mceConfigObj->addMenuItem('tags_highlighter', 'view', '@view_1', true);
		}
		
		//Zend_Debug::dump($mceConfigObj->getMenusGrid());
		//Zend_Debug::dump($mceConfigObj->getAvailableButtons());
	}
}
//Zend_Debug::dump($abc);
