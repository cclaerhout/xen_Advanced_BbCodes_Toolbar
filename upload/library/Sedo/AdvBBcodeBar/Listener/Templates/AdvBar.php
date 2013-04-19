<?php

class Sedo_AdvBBcodeBar_Listener_Templates_AdvBar
{
	public static function ManageBar($hookName, &$contents, array $hookParams, XenForo_Template_Abstract $template)
	{
		switch ($hookName) 
		{
			case 'miu_integrator_global':
				$options = XenForo_Application::get('options');
			
				if ($template instanceof XenForo_Template_Admin && !$options->AdvBBcodeBar_ModifAdmin)
				{
					break;
				}

				if(!$options->AdvBBcodeBar_JsMiu)
				{
					break;
				}
			
				$jsUrl = XenForo_Application::$javaScriptUrl;
	
				if($options->markitup_integration_debug_devmode)
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
			
				$options = XenForo_Application::get('options');
			
				if ($template instanceof XenForo_Template_Admin && !$options->AdvBBcodeBar_ModifAdmin)
				{
					break;
				}

				if(empty($options->AdvBBcodeBar_activate_bar))
				{
					break;
				}
				
				//Permissions
		        	$visitor = XenForo_Visitor::getInstance();
				$visitorUserGroupIds = array_merge(array((string)$visitor['user_group_id']), (explode(',', $visitor['secondary_group_ids'])));
		
				if ($options->AdvBBcodeBar_display_usergroups)
				{
					$AdvBBcodeBar_usr = array_intersect($visitorUserGroupIds, $options->AdvBBcodeBar_display_usergroups);
				}
		
		        	if (!$AdvBBcodeBar_usr)
		        	{
					break;
				}

      				if(!empty($options->AdvBBcodeBar_display_bar))
      				{
      			        	//Get text direction Param
      			        	$IsRtl = $template->getParam('pageIsRtl');
      	
      					//Find if another addon has modified the template
      					preg_match_all('#theme_xenforo_buttons(\d)#i', $contents, $IsNotAlone);
      	
      					//If the template is modified, get the maximum editor buttons line number
      					if (!empty($IsNotAlone[1]))
      					{
      						$IsNotAlone['max'] = max($IsNotAlone[1]);
      					}
      	
      					//Init the ToolBar
      					$ToolBar = self::InitToolBar($IsNotAlone, $IsRtl);
      	
      					//If template is modified let's make some changes
      					if (isset($IsNotAlone['max']))
      					{
      						$contents = self::InitOtherMod($contents, $IsRtl, $ToolBar);
      					}
      				}
      
      				//Bake Parameters
      				$params = self::initParams();
      	
      				//Add the ToolBar
      				if(!empty($options->AdvBBcodeBar_display_bar))
      				{
      					$contents = preg_replace('#xenforo_smilies:#', $ToolBar['buttons'] . $params . '$0', $contents);
      				}
      				else
      				{
      					$contents = preg_replace('#xenforo_smilies:#', $params . '$0', $contents);						
      				}
      					
      		        	if (!empty($options->AdvBBcodeBar_debug_displayhook))
      		        	{
      					Zend_Debug::dump($contents);
      			        }
      			break;
		}
	}

	public static function initParams()
	{
		$options = XenForo_Application::get('options');
		$hasPerms = Sedo_AdvBBcodeBar_Helper_Sedo::BakePrivateAndPremiumPermissions();
		
		//Carriage return & tabs for a proper display in Zend_Debug::dump
		$br = "\r\n\t\t\t\t";

		//Configure defaut parameters
		$param = array();
		
		$params['advtoolbar_Advimgx'] = $options->AdvBBcodeBar_imgdefault;
		$params['advtoolbar_AdvFieldset'] = $options->AdvBBcodeBar_fieldsetdefault;
		$params['advtoolbar_AdvEncadrex'] = $options->AdvBBcodeBar_encdefault;
		$params['advtoolbar_template_strechedtitlewidth'] = XenForo_Template_Helper_Core::styleProperty('adv_template_stretchedtitlefield_width');
		$params['advtoolbar_template_normaltitlewidth'] = XenForo_Template_Helper_Core::styleProperty('adv_template_normaltitlefield_width');		
		$params['advtoolbar_template_phrase_auto'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_template_auto');

		if ($hasPerms['premium'] AND isset($options->PremiumMembersBBcode_Tag_1))
		{
			$params['advtoolbar_AdvPREM'] = $options->PremiumMembersBBcode_Tag_1;
		}
		if ($hasPerms['private'] AND isset($options->PremiumMembersBBcode_Tag_2))
		{
			$params['advtoolbar_AdvPV'] = $options->PremiumMembersBBcode_Tag_2;
		}
		if ($hasPerms['premium2'] AND isset($options->PremiumMembersBBcode_Tag_1b))
		{
			$params['advtoolbar_AdvPREM2'] = $options->PremiumMembersBBcode_Tag_1b;
		}
		if ($hasPerms['private2'] AND isset($options->PremiumMembersBBcode_Tag_2b))
		{
			$params['advtoolbar_AdvPV2'] = $options->PremiumMembersBBcode_Tag_2b;
		}
			
		if (isset($options->AdvBBcodeBar_button_highlight) AND !empty($options->AdvBBcodeBar_button_highlight))
		{
			//Send color settings to the editor
			$param_hl_norm_open = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_highlight_normal_tags_open', '#ffff99');
			$params['advtoolbar_Hl_Norm_Open'] = $param_hl_norm_open['hexa'];
			$param_hl_norm_options = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_highlight_normal_tags_options', '#f9f9eb');
			$params['advtoolbar_Hl_Norm_Options'] = $param_hl_norm_options['hexa'];
			$param_hl_norm_close = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_highlight_normal_tags_close', '#f3f38e');
			$params['advtoolbar_Hl_Norm_Close'] = $param_hl_norm_close['hexa'];
			$param_hl_spe_open = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_highlight_special_tags_open', '#ffd34e');
			$params['advtoolbar_Hl_Spe_Open'] = $param_hl_spe_open['hexa'];
			$param_hl_spe_content = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_highlight_special_tags_content', '#d5d5d5');
			$params['advtoolbar_Hl_Spe_Content'] = $param_hl_spe_content['hexa'];
			$param_hl_spe_close = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_highlight_special_tags_close', '#e4bb41');
			$params['advtoolbar_Hl_Spe_Close'] = $param_hl_spe_close['hexa'];
			$param_hl_tag_separator = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_highlight_tag_options_separator', '#f90000');
			$params['advtoolbar_Hl_Tag_Separator'] = $param_hl_tag_separator['hexa'];
		}

		$output = '';
		
			foreach ($params as $key => $param)
			{
				$output .= "$br $key: '$param', ";
			}
		
		$output .= "$br $br";
		
		return $output;
	}

	public static function InitToolBar($IsNotAlone, $IsRtl)
	{
		/****
		*	MEMO: 	This function will only execute if Advanced BBcodes Bar has been activated AND if user has permission
		*		The $IsRtl is for text direction 
		*		The $IsNotAlone is to check if another addon has already modified the editor
		***/
		
		$options = XenForo_Application::get('options');
		$hasPerms = Sedo_AdvBBcodeBar_Helper_Sedo::BakePrivateAndPremiumPermissions();
		
		$visitor = XenForo_Visitor::getInstance();
		$visitorUserGroupIds = array_merge(array((string)$visitor['user_group_id']), (explode(',', $visitor['secondary_group_ids'])));

		if (!empty($options->AdvBBcodeBar_custombb_activated) AND $options->AdvBBcodeCustomBar_display_usergroups)
		{
			$AdvBBcodeCustomBar_usr = array_intersect($visitorUserGroupIds, $options->AdvBBcodeCustomBar_display_usergroups);
		}

		//Carriage return & tabs for a proper display in Zend_Debug::dump
		$br = "\r\n\t\t\t\t";

		//Configure Advanced BBcodes Bar buttons display

			//Normal Image Block (bimg, bimgx)
			$nib = '';
				if ($IsRtl === false)
				{
					if ($options->AdvBBcodeBar_XenAdv_Integration == 'on')
					{
						$nib .= 'image,';
					}
					if ($options->AdvBBcodeBar_button_bimg)
					{
						$nib .= 'adv_bimg,';
					}
					if ($options->AdvBBcodeBar_XenAdv_Integration == 'on')
					{
						$nib .= 'xenforo_media,';
					}
				}
				else
				{
					if ($options->AdvBBcodeBar_XenAdv_Integration == 'on')
					{
						$nib .= 'xenforo_media,';
					}
					if ($options->AdvBBcodeBar_button_bimg)
					{
						$nib .= 'adv_bimg,';
					}
					if ($options->AdvBBcodeBar_XenAdv_Integration == 'on')
					{
						$nib .= 'image,';
					}
				}
				if (!empty($nib))
				{
					$nib .= '|,';
				}

			//Text Box Block (article, encadre, fieldset)
			$tbb = '';
				if ($IsRtl === false)
				{
					if ($options->AdvBBcodeBar_button_article)
					{
						$tbb .= 'adv_article,';
					}
					if ($options->AdvBBcodeBar_button_enc)
					{
						$tbb .= 'adv_encadre,';
					}
					if ($options->AdvBBcodeBar_button_fieldset)
					{
						$tbb .= 'adv_fieldset,';
					}					
				}
				else
				{
					if ($options->AdvBBcodeBar_button_fieldset)
					{
						$tbb .= 'adv_fieldset,';
					}
					if ($options->AdvBBcodeBar_button_enc)
					{
						$tbb .= 'adv_encadre,';
					}
					if ($options->AdvBBcodeBar_button_article)
					{
						$tbb .= 'adv_article,';
					}
				}
				if (!empty($tbb))
				{
					$tbb .= '|,';
				}

			//Text Tools Block (spoiler, latex)
			$tlb = '';
				if ($options->AdvBBcodeBar_button_spoiler)
				{
					$tlb .= 'adv_spoiler,';
				}
				if ($options->AdvBBcodeBar_button_accordion)
				{
					$tlb .= 'adv_accordion,';
				}				
				if ($options->AdvBBcodeBar_button_latex)
				{
					$tlb .= 'adv_latex,';
				}
				if (!empty($tlb))
				{
					$tlb .= '|,';
				}

			//Google Tools Block (gview, picasa)
			$gtb = '';
				if ($options->AdvBBcodeBar_button_gview)
				{
					$gtb .= 'adv_gview,';
				}
				if ($options->AdvBBcodeBar_button_picasa)
				{
					$gtb .= 'adv_picasa,';
				}
				if (!empty($gtb))
				{
					$gtb .= '|,';
				}

			//Private & Premium Block (private, private2, premium, premium2)
			$ppb = '';

				if ($IsRtl === false)
				{
					if ($options->AdvBBcodeBar_button_premium AND $hasPerms['premium'])
					{
						$ppb .= 'adv_premium,';
					}
					if ($options->AdvBBcodeBar_button_premium2 AND $hasPerms['premium2'])
					{
						$ppb .= 'adv_premium2,';
					}
					if ($options->AdvBBcodeBar_button_private AND $hasPerms['private'])
					{
						$ppb .= 'adv_private,';
					}
					if ($options->AdvBBcodeBar_button_private2 AND $hasPerms['private2'])
					{
						$ppb .= 'adv_private2,';
					}
				}
				else
				{
					if ($options->AdvBBcodeBar_button_premium2 AND $hasPerms['premium2'])
					{
						$ppb .= 'adv_premium2,';
					}
					if ($options->AdvBBcodeBar_button_premium AND $hasPerms['premium'])
					{
						$ppb .= 'adv_premium,';
					}
					if ($options->AdvBBcodeBar_button_private2 AND $hasPerms['private2'])
					{
						$ppb .= 'adv_private2,';
					}
					if ($options->AdvBBcodeBar_button_private AND $hasPerms['private'])
					{
						$ppb .= 'adv_private,';
					}
				}
				if (!empty($ppb))
				{
					$ppb .= '|,';
				}

			//Other Utilities Block (justif)
			$oub = '';
				if ($options->AdvBBcodeBar_button_justif AND $options->AdvBBcodeBar_XenAdv_Integration == 'off')
				{
					$oub .= 'adv_justif,';
				}

		$buttons_grid_x = $nib . $tbb . $tlb . $gtb . $ppb . $oub;
		$buttons_grid_x = Sedo_AdvBBcodeBar_Helper_Sedo::Avoid_IE_JS_BUG($buttons_grid_x);
		
		//Configure the first and second line of XenForo BBcodes IF integration has been selected (condition in buttons builder)
		if ($IsRtl === false)
		{
			$alignbuttons = 'justifyleft,justifycenter,justifyright,adv_justif';
			$indentOutdentButtons = 'outdent,indent';
			$undoRedoButtons = 'undo,redo';
		}
		else
		{
			$alignbuttons = 'adv_justif,justifyright,justifycenter,justifyleft';
			$indentOutdentButtons = 'indent,outdent';
			$undoRedoButtons = 'redo,undo';
		}

		$buttons_grid_1 = 'removeformat,adv_highlight,|,fontselect,fontsizeselect,forecolor,xenforo_smilies,|,' . $undoRedoButtons;
		$buttons_grid_2 = 'bold,italic,underline,strikethrough,|,'. $alignbuttons . ',|,bullist,numlist,' . $indentOutdentButtons . ',|,link,unlink,|,xenforo_code,xenforo_custom_bbcode';


		//Configure the custom bbcodes buttons
				
		if ($options->AdvBBcodeBar_custombb_bbcodes AND is_array($options->AdvBBcodeBar_custombb_bbcodes) AND $AdvBBcodeCustomBar_usr)
	        {
	       		$buttons_grid_custom = '';

	       		foreach ($options->AdvBBcodeBar_custombb_bbcodes as $key => $temp)
	       		{
				if($key != 0)
				{
					$buttons_grid_custom .= ',';				
				}
				
				if($temp['tag'] == 'separator')
				{
					$buttons_grid_custom .= '|';
				}
				else
				{
					$buttons_grid_custom .= 'adv_cust_' . $temp['tag'];
				}
			}
    		
	       		unset($temp);
	        }

		//Buttons Builder
		$output['buttons'] = '';

		if ( !in_array($options->AdvBBcodeBar_XenAdv_GridLine, array(1, 2)) )
		{
			//Normal behaviour (not on line 1 or line 2)
			
			if ( $options->AdvBBcodeBar_XenAdv_Integration == 'on' AND !isset($IsNotAlone['max']) )
			{
				//Only perform theses modifications (customized line 1 & line2) if integration is activated AND if no other addon modifies the template
				$output['buttons'] .= "theme_xenforo_buttons1 : '$buttons_grid_1',$br";
				$output['buttons'] .= "theme_xenforo_buttons2 : '$buttons_grid_2',$br";
			}
			if (!isset($IsNotAlone['max']))
			{
				//If no other addon modifies the template, set the default line to 3
				$grid_number = 3;
			}
			elseif ($options->AdvBBcodeBar_XenAdv_GridLine == 'auto')
			{
				//If another addon modifies the template and IF administrator has selected the auto format function, get the last line number and increment it (+1)
				$grid_number = $IsNotAlone['max'] + 1;
			}
			else
			{
				//If another addon modifies the template and IF administrator has selected a line number, get its number; 
				$grid_number = $options->AdvBBcodeBar_XenAdv_GridLine;
				$output['manual_number'] = $grid_number; // => create a new element in array that will be used in the function 'InitOtherMod '
			}

			$output['buttons'] .= "theme_xenforo_buttons" . $grid_number . " : '$buttons_grid_x',$br";
		
			//Configure the custom bbcodes buttons
			
			if ($AdvBBcodeCustomBar_usr)
			{
				$output['buttons'] .= "theme_xenforo_buttons" . ($grid_number + 1) . " : '$buttons_grid_custom',$br";
			}			
		}
		elseif ($options->AdvBBcodeBar_XenAdv_GridLine == 1)
		{
			//Display bar on line 1 behaviour
			
			$output['buttons'] .= "theme_xenforo_buttons1 : '$buttons_grid_x',$br";

			if ($AdvBBcodeCustomBar_usr)
			{
				$output['buttons'] .= "theme_xenforo_buttons2 : '$buttons_grid_custom',$br";
			}			

			if (!isset($IsNotAlone['max']))
			{
				
				if (!$AdvBBcodeCustomBar_usr)
			        {
					//If no other addon modifies the template set the line 2 to Xenforo First tools bar and line 2 to Xenforo Second tools bar
					$output['buttons'] .= "theme_xenforo_buttons2 : '$buttons_grid_1',$br";
					$output['buttons'] .= "theme_xenforo_buttons3 : '$buttons_grid_2',$br";
				}
				else
				{
					$output['buttons'] .= "theme_xenforo_buttons3 : '$buttons_grid_1',$br";
					$output['buttons'] .= "theme_xenforo_buttons4 : '$buttons_grid_2',$br";
				}

			}
			else
			{
				//If another addon modifies the template, create a new element in the output array that will be used in the function 'InitOtherMod ' (value: 1)
				$output['override'] = 1;
			}
		}
		elseif ($options->AdvBBcodeBar_XenAdv_GridLine == 2)
		{
			$output['buttons'] .= "theme_xenforo_buttons2 : '$buttons_grid_x',$br";
			
			if ($AdvBBcodeCustomBar_usr)
			{
				$output['buttons'] .= "theme_xenforo_buttons3 : '$buttons_grid_custom',$br";
			}
			
			if (!isset($IsNotAlone['max']))
			{
				if (!$AdvBBcodeCustomBar_usr)
			        {
			        	//If no other addon modifies the template set the line 1 to Xenforo First tools bar and line 3 to Xenforo Second tools bar
					$output['buttons'] .= "theme_xenforo_buttons1 : '$buttons_grid_1',$br";
					$output['buttons'] .= "theme_xenforo_buttons3 : '$buttons_grid_2',$br";
				}
				else
				{
					$output['buttons'] .= "theme_xenforo_buttons1 : '$buttons_grid_1',$br";
					$output['buttons'] .= "theme_xenforo_buttons4 : '$buttons_grid_2',$br";					
				}
			}
			else
			{
				//If another addon modifies the template, create a new element in the output array that will be used in the function 'InitOtherMod ' (value: 2)
				$output['override'] = 2;
			}
		}

		return $output;
	}

	public static function InitOtherMod($contents, $IsRtl, $ToolBar)
	{
		$options = XenForo_Application::get('options');

		$visitor = XenForo_Visitor::getInstance();
		$visitorUserGroupIds = array_merge(array((string)$visitor['user_group_id']), (explode(',', $visitor['secondary_group_ids'])));

		if (!empty($options->AdvBBcodeBar_custombb_activated) AND $options->AdvBBcodeCustomBar_display_usergroups)
		{
			$AdvBBcodeCustomBar_usr = array_intersect($visitorUserGroupIds, $options->AdvBBcodeCustomBar_display_usergroups);
		}		

		// If the integration option is activated, add some buttons, delete others and if needed change line position
		if ($options->AdvBBcodeBar_XenAdv_Integration == 'on')
		{
			$proceed = true;
			$search[] = '#((?=theme_xenforo_buttons2).+?)image,#'; //delete image button
			$replace[] = '$1';

			$search[] = '#((?=theme_xenforo_buttons2).+?)xenforo_media,#'; //delete media button
			$replace[] = '$1';

			if ($options->AdvBBcodeBar_button_justif)
			{

				$search[] = '#((?=theme_xenforo_buttons2).+?)(justifyright)#'; // add full justify button

				if ($IsRtl === false)
				{
					$replace[] = '$1$2,adv_justif';
				}
				else
				{
					$replace[] = '$1adv_justif,$2';
				}
			}

			if ($options->AdvBBcodeBar_button_highlight)
			{
				$search[] = '#((?=theme_xenforo_buttons1).+?)(removeformat)#'; //add highlight button
				$replace[] = '$1$2,adv_highlight';
			}
		}

		// If one of the first two Xenforo lines numbers has been overriding by user
		if (isset($ToolBar['override']))
		{
			$proceed = true;

			if($ToolBar['override'] == 2)
			{
				if (!$AdvBBcodeCustomBar_usr)
			        {
					//Advanced Bar is on line 2, so protect line 1 and increment all other existing lines +1
					$search[] = '#(theme_xenforo_buttons)((?!1)\d)#e';
					$replace[] = '"$1" . ("$2" + 1)';
				}
				else
				{
					//Advanced Bar is on line 2, Custom bar on line 3, so inscrement all other existing lines +2
					$search[] = '#(theme_xenforo_buttons)((?!1)\d)#e';
					$replace[] = '"$1" . ("$2" + 2)';				
				}
			}
			else
			{
				if (!$AdvBBcodeCustomBar_usr)
			        {
					//Advanced Bar is on line 1, so increment all existing lines +1
					$search[] = '#(theme_xenforo_buttons)(\d)#e';
					$replace[] = '"$1" . ("$2" + 1)';
				}
				else
				{
					//Advanced Bar is on line 1, Custom bar on line 2, so increment all other existing lines +2
					$search[] = '#(theme_xenforo_buttons)(\d)#e';
					$replace[] = '"$1" . ("$2" + 2)';				
				}
			}
		}

		// If user has set up a manual line number for Advanced BBcodes bar, check if there's no conflict. If there is, increment other lines
		if (isset($ToolBar['manual_number']) AND preg_match('#theme_xenforo_buttons' . $ToolBar['manual_number'] . '#', $contents))
		{
			$proceed = true;

			//Protect all line numbers before the one manually set up from incrementation (will be used in the below regex)
			$max_range = $ToolBar['manual_number'] - 1;
			
			$protect = '[';

			foreach (range(1, $max_range) as $number) {
				$protect .= $number; 
			}

			$protect .= ']';

			//[REGEX] Increment all line numbers except the one inside $protect
			if (!$AdvBBcodeCustomBar_usr)
			{
				$search[] = '#(theme_xenforo_buttons)((?!' . $protect . ')\d)#e';
				$replace[] = '"$1" . ("$2" + 1)';
			}
			else
			{
				$search[] = '#(theme_xenforo_buttons)((?!' . $protect . ')\d)#e';
				$replace[] = '"$1" . ("$2" + 2)';			
			}
		}

		if ($proceed === true)
		{
			$contents = preg_replace($search, $replace, $contents);
		}

		return $contents;
	}
}
//	Zend_Debug::dump($abc);