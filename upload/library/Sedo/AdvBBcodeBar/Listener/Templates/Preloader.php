<?php
class Sedo_AdvBBcodeBar_Listener_Templates_Preloader
{
	public static function CacheTemplates($templateName, array &$params, XenForo_Template_Abstract $template)
	{
		if ($template instanceof XenForo_Template_Admin && $templateName == 'style_property_list')
		{
			$template->preloadTemplate('style_property_list_atamh_AdvBBcodeBar');
		}
	}
}