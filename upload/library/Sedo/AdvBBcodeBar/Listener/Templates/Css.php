<?php

class Sedo_AdvBBcodeBar_Listener_Templates_Css
{
	public static function ManageCss($hookName, &$contents, array $hookParams, XenForo_Template_Abstract $template)
	{
		switch ($hookName) 
		{
			case 'page_container_head':
				$options = XenForo_Application::get('options');
				
				if ($template instanceof XenForo_Template_Admin && !$options->AdvBBcodeBar_ModifAdmin)
				{
					break;
				}
	
				//Get CSS per Browser (select which template will be added to to page_container_head)
				$Cssextension = self::CssBaker();
				$CssByBrowserTemplate = 'AdvBBcodeBar_css_' . $Cssextension;
				$contents .= $template->create($CssByBrowserTemplate, $template->getParams());
			break;
	        }
	}

	public static function ManageAdminCssPost($templateName, &$content, array &$containerData, XenForo_Template_Abstract $template)
	{
		switch ($templateName) 
		{
			case 'PAGE_CONTAINER':
				$options = XenForo_Application::get('options');
				
				if (!$template instanceof XenForo_Template_Admin && !$options->AdvBBcodeBar_ModifAdmin)
				{
					break;
				}
	
				$Cssextension = self::CssBaker();
				$CssByBrowserTemplate = 'AdvBBcodeBar_css_' . $Cssextension;
				$content .= $template->create($CssByBrowserTemplate, $template->getParams());
			break;
	        }
	}

	public static function CssBaker()
	{
		if(!isset($_SERVER['HTTP_USER_AGENT']))
		{
			return 'normal';
		}

		$useragent = $_SERVER['HTTP_USER_AGENT'];

		if(preg_match('/(?i)msie/', $useragent))
       		{
       			if(preg_match('/(?i)Trident\/4/', $useragent) OR preg_match('/(?i)msie [1-7]/', $useragent))
       			{
       				//IE1 to IE8
      				$bbaddon = 'normal_ie';
       			}
       			else
       			{
       				//IE9 +
       				$bbaddon = 'normal';
       			}
       		}
       		else
       		{
       			$bbaddon = 'normal';
       		}

       		return $bbaddon;
	}
}

//	Zend_Debug::dump($abc);