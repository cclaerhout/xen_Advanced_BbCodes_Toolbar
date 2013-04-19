<?php

class Sedo_AdvBBcodeBar_Listener_Templates_Custom
{
	public static function SetCustomButtons($hookName, &$contents, array $hookParams, XenForo_Template_Abstract $template)
	{
		switch ($hookName) 
		{
			case 'editor_tinymce_init':

				$options = XenForo_Application::get('options');
			
				if ($template instanceof XenForo_Template_Admin && !$options->AdvBBcodeBar_ModifAdmin)
				{
					break;
				}

				if (empty($options->AdvBBcodeBar_activate_bar))
				{
					break;
				}
				
		        	$visitor = XenForo_Visitor::getInstance();
				$visitorUserGroupIds = array_merge(array((string)$visitor['user_group_id']), (explode(',', $visitor['secondary_group_ids'])));
		
				if ($options->AdvBBcodeBar_display_usergroups)
				{
					$AdvBBcodeBar_usr = array_intersect($visitorUserGroupIds, $options->AdvBBcodeBar_display_usergroups);
				}
		
				if ($options->AdvBBcodeBar_custombb_activated AND $options->AdvBBcodeCustomBar_display_usergroups)
				{
					$AdvBBcodeCustomBar_usr = array_intersect($visitorUserGroupIds, $options->AdvBBcodeCustomBar_display_usergroups);
				}
	
		        	if ($AdvBBcodeBar_usr AND $AdvBBcodeCustomBar_usr AND $options->AdvBBcodeBar_custombb_bbcodes)
		        	{
	
					//Find if another addon has modified the template
					$check = preg_match('#setup\s+?:#i', $contents);
					
					//Init Custom buttons
					$setup = self::InitCustomButtons($check);
					
					if (empty($check))
					{
						$contents = preg_replace('#xenforo_smilies:#', $setup . '$0', $contents);
					}
					else
					{
						$contents = preg_replace('#setup\s+?:.+?{#i', '$0' . $setup, $contents);
					}
				}
			break;
		}
	}
	
	public static function InitCustomButtons($check)
	{
		$options = XenForo_Application::get('options');

		$server_root = preg_replace('#/\w+?\.\w{3,4}$#', '', $_SERVER["SCRIPT_FILENAME"]);
		$icons_folder = $server_root . '/styles/sedo/editor/';


		$br = "\r\n\t\t\t\t";
		$output = '';

		if(empty($check))
		{
			$output = "setup : function(ed) { $br";
		}
		

		$params = $options->AdvBBcodeBar_custombb_bbcodes;

		if (is_array($params))
		{
			foreach ($params as $param)
			{
				if($param['tag'] != 'separator')
				{
					//Icon Management
					if (file_exists($icons_folder . $param['tag'] . '.png'))
					{
						$icon_url = $options->boardUrl . '/styles/sedo/editor/' . $param['tag'] . '.png';
					}
					elseif (file_exists($icons_folder . $param['tag'] . '.gif'))
					{
						$icon_url = $options->boardUrl . '/styles/sedo/editor/' . $param['tag'] . '.gif';
					}
					elseif (file_exists($icons_folder . 'default.png'))
					{
						$icon_url = $options->boardUrl . '/styles/sedo/editor/default.png';
					}
					else
					{
						$icon_url = $options->boardUrl . '/styles/sedo/editor/' . $param['tag'] . '.png';
					}
			
					//Button Title Management
					if(!empty($param['title']))
					{
						$phrase = self::DetectPhrase($param['title']);
		
					}
					else
					{
						$phrase = '';
					}

					//Opening Tag Management
					if(empty($param['option']))
					{
						$opening = $param['tag'];
					}
					else
					{
						$opening_option = self::DetectPhrase($param['option']);
						$opening = $param['tag'] . '=' . $opening_option;
					}

					//Content Management
					if(empty($param['content']))
					{
						$content = "ed.selection.getContent()";
					}
					else
					{
						$content_replace = self::DetectPhrase($param['content']);
						$content = "'$content_replace'";
					}			
			
					//Button and Command Management
					$ext = $param['tag'];
					$output .= "
					ed.addCommand('AdvCustom_$ext', function() {
						ed.focus();
						ed.selection.setContent('[$opening]' + $content + '[/$ext]');
        	        		});
	        	        	ed.addButton('adv_cust_$ext', {
        	        	        	        title : '$phrase',
                	        	        	cmd : 'AdvCustom_$ext',
	                        	        	image : '$icon_url'
			                });
				        ";
				}
			}
		}

		if(empty($check))
		{
			$output .= "$br},$br $br";
		}
		
		return $output;	
	}

	public static function DetectPhrase($string)
	{
		//Can be improved to fetch all tags {phrase:} and not just one. But I'm not sure it would be usefull
		//2013-01: has been done in the button manager - I don't update here since I presume nobody is using this now

		if(preg_match('#{phrase:(.+?)}#i', $string, $capture))
		{
			$phrase = new XenForo_Phrase($capture[1]);
			$string = str_replace($capture[0], $phrase, $string);
		}

		return addslashes($string);
	}	
}
//	Zend_Debug::dump($abc);