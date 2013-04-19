<?php

class Sedo_AdvBBcodeBar_Helper_Sedo
{
	public static function BakePrivateAndPremiumPermissions()
	{
		$options = XenForo_Application::get('options');
		$output = array();

        	$visitor = XenForo_Visitor::getInstance();
		$visitorUserGroupIds = array_merge(array((string)$visitor['user_group_id']), (explode(',', $visitor['secondary_group_ids'])));

		if(isset($options->AdvBBcodeBar_button_private_usr))
		{
			$output['private'] = array_intersect($visitorUserGroupIds, $options->AdvBBcodeBar_button_private_usr);
		}
		if(isset($options->AdvBBcodeBar_button_private2_usr))
		{
			$output['private2'] = array_intersect($visitorUserGroupIds, $options->AdvBBcodeBar_button_private2_usr);
		}
		if(isset($options->AdvBBcodeBar_button_premium_usr))
		{
			$output['premium'] = array_intersect($visitorUserGroupIds, $options->AdvBBcodeBar_button_premium_usr);
		}
		if(isset($options->AdvBBcodeBar_button_premium2_usr))
		{
			$output['premium2'] = array_intersect($visitorUserGroupIds, $options->AdvBBcodeBar_button_premium2_usr);
		}

		return $output;
	}

	//@ME: CHECK THIS FUNCTION :  $myproperty = XenForo_Template_Helper_Core::styleProperty('myproperty'); 
	/******
		#GetDisplayValue

		This function gets the visual value of a display property. The value is returned in the following array: $return['result']

		If it is a color, the following arrays are also available:
		- $return['rgba'], for the rgba color value
		- $return['rgb'], for the rgb color value
		- $return['hexa'], for the hexa color value

		For a color, $return['result'] will return the rgba value for all recent browsers
		and will automatically return the rgb value for the old version of Internet Explorer
	***/


	public static function GetDisplayValue($property, $defaultvalue)
	{
		$value = array();
		if (XenForo_Application::isRegistered('styles'))
		{
			$style = XenForo_Application::get('styles');
		}
		else
		{
			//ie: for XenForo_Template_Admin
			$style = XenForo_Model::create('XenForo_Model_Style')->getAllStyles();
			XenForo_Application::set('styles', $style);
		}

		$visitor = XenForo_Visitor::getInstance();
		$styleid = $visitor['style_id'];

		if($styleid == 0)
		{
			$options = XenForo_Application::get('options');
			$styleid = $options->defaultStyleId;
		}

		//Get current style properties
		if (isset($style[$styleid]['properties']))
		{
			$properties = $style[$styleid]['properties'];
			$properties = unserialize($properties);

			$value['result'] = $properties[$property];


		       	if (!is_array($value['result']) AND preg_match('#rgba#i', $value['result']))
       			{
				$isBadIE = self::isBadIE();

				$value['rgba'] = $value['result'];
				$value['rgb'] = XenForo_Helper_Color::unRgba($value['result']);
				$value['hexa'] = self::rgb2hex($value['rgb']);

				if ($isBadIE == true)
				{
					$value['result'] = $value['rgb'];
				}
		       	}
		       	elseif (!is_array($value['result']) AND preg_match('#rgb(?!a)#i', $value['result']))
       			{
				$value['rgba'] = XenForo_Helper_Color::rgba($value['result'], 1);
				$value['rgb'] = $value['result'];
				$value['hexa'] = self::rgb2hex($value['rgb']);
       			}
		       	elseif ( !is_array($value['result']) ) //don't forget the hexa value options !
       			{
				$value['rgba'] = XenForo_Helper_Color::rgba($value['result'], 1);
				$value['rgb'] = XenForo_Helper_Color::unRgba($value['rgba']);
				$value['hexa'] = self::rgb2hex($value['rgb']); 
       			}       			
		       	else
		       	{
				$value['rgba'] = $defaultvalue;
				$value['rgb'] = $defaultvalue;
				$value['hexa'] = $defaultvalue;
		       	}
		}
		else
	       	{
			$value['result'] = $defaultvalue;
			$value['rgba'] = $defaultvalue;
			$value['rgb'] = $defaultvalue;
			$value['hexa'] = $defaultvalue;
	       	}

	      	return $value;
	}


	/******
		#isBadIE

		This function checks if the users is using and old version of IE.
		Returns the bolean value 'true' if it is.
	***/

	public static function isBadIE($method = false, $range = false)
	{
		$useragent = $_SERVER['HTTP_USER_AGENT'];
		$output = false;

		if(preg_match('/(?i)msie/', $useragent))
       		{
			if($method == 'all')
			{
	       			$output = true;
	       		}
	       		elseif($method == 'target')
	       		{
	       			$first = $range[0];
	       			$last = substr($range, -1);
	       			$first_fix = $first - 4;
	       			$last_fix = $last - 4;
	       			
	       			if($first > 7 AND $last > 7)
	       			{
		       			if(preg_match('/(?i)Trident\/[' . $first_fix  . '-' . $last_fix  . ']/', $useragent))
       					{
      						$output = true;
	       				}	       			
	       			}
	       			elseif($first < 8 AND $last > 7)
	       			{
		       			if(preg_match('/(?i)Trident\/[4-' . $last_fix  . ']/', $useragent) OR preg_match('/(?i)msie [' . $first . '-7]/', $useragent))
       					{
      						$output = true;
	       				}	       			
	       			}
	       			elseif($last < 8)
	       			{
		       			if(preg_match('/(?i)msie [' . $first . '-' . $last . ']/', $useragent))
       					{
      						$output = true;
	       				}	       			
	       			}
	       		}
	       		else
	       		{
	       			if(preg_match('/(?i)Trident\/4/', $useragent) OR preg_match('/(?i)msie [1-7]/', $useragent))
       				{
       					//IE1 to IE8 width default option
      					$output = true;
	       			}
	       		}
       		}

       		return $output;
	}


	/*******
		#rgb2hex

		This function converts a rgb color to its hex code (with the #)
	***/

	public static function rgb2hex($color)
	{
		//Match R, G, B values
		preg_match('#^rgb\((?P<r>\d{1,3}).+?(?P<g>\d{1,3}).+?(?P<b>\d{1,3})\)$#i', $color, $rgb);
		//Convert them in hexa
		//Code source: http://forum.codecall.net/php-tutorials/22589-rgb-hex-colors-hex-colors-rgb-php.html
		$output = sprintf("#%06x", ($rgb['r'] << 16) + ($rgb['g'] << 8) + $rgb['b']);

	       	return $output;
	}
	
	/*******
		#Avoid_IE_JS_BUG

		Prevent a IE bug when a string is finishing with a coma
	***/

	public static function Avoid_IE_JS_BUG($string)
	{	
		$string_check = substr($string, -1); 

		if ($string_check == ',')
		{
			$string = substr($string, 0, -1);
		}
		
		return $string;
	}
}



//	Zend_Debug::dump($abc);