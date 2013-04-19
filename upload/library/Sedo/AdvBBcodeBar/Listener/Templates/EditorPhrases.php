<?php
class Sedo_AdvBBcodeBar_Listener_Templates_EditorPhrases
{
	public static function Add_Phrases($hookName, &$contents, array $hookParams, XenForo_Template_Abstract $template)
	{
		switch ($hookName) 
		{
			case 'editor_js_setup':

				$options = XenForo_Application::get('options');

				if ($template instanceof XenForo_Template_Admin && !$options->AdvBBcodeBar_ModifAdmin)
				{
					break;
				}
				
				if(empty($options->AdvBBcodeBar_activate_bar))
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
}



//	Zend_Debug::dump($abc);