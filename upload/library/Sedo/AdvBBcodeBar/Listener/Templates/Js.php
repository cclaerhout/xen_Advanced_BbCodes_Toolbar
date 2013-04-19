<?php

class Sedo_AdvBBcodeBar_Listener_Templates_Js
{
	public static function ManageJsHook($hookName, &$contents, array $hookParams, XenForo_Template_Abstract $template)
	{
	        if ($hookName == 'page_container_head')
       		{
			$options = XenForo_Application::get('options');	

			if($options->AdvBBcodeBar_JsHook_global == true)
			{
				$contents .= $template->create('AdvBBcodeBar_js', $template->getParams());
		        }
		}
	}

	public static function ManageJsPostRender($templateName, &$content, array &$containerData, XenForo_Template_Abstract $template)
	{	
		if($templateName == 'conversation_view' || $templateName == 'thread_view' || ($template instanceof XenForo_Template_Admin && $templateName == 'PAGE_CONTAINER'))
		{
			$options = XenForo_Application::get('options');	

			if($options->AdvBBcodeBar_JsHook_global != true || $options->AdvBBcodeBar_ModifAdmin)
			{
				$Params = array(
					//'javaScriptSource' => XenForo_Application::$javaScriptUrl
				);
				$content = $template->create('AdvBBcodeBar_js', $Params) . $content;
			}
		}
	}
}
//	Zend_Debug::dump($abc);