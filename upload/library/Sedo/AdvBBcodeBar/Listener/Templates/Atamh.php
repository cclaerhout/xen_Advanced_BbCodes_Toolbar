<?php
class Sedo_AdvBBcodeBar_Listener_Templates_Atamh
{
	public static function postrender($templateName, &$content, array &$containerData, XenForo_Template_Abstract $template)
	{
		if($template instanceof XenForo_Template_Admin && $templateName == 'style_property_list')
		{
			if(!preg_match('#atamh_mini\.js#i', $content))
			{
				$Params = array(
						'javaScriptSource' => XenForo_Application::$javaScriptUrl
				);
				$content = $template->create('style_property_list_atamh_AdvBBcodeBar', $Params) . $content;
			}
		}
	}
}