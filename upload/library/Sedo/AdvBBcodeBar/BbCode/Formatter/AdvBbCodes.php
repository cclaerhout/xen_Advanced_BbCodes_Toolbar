<?php

class Sedo_AdvBBcodeBar_BbCode_Formatter_AdvBbCodes
{
	public static function parseTagBimg(&$content, array &$options, &$templateName, &$fallBack, array $rendererStates, $parentClass)
	{
		$xenOptions = XenForo_Application::get('options');
		$visitor = XenForo_Visitor::getInstance();
		
		/* Default Options */
		$width = $xenOptions->AdvBBcodeBar_imgdefault;
		$widthImg = $width . 'px';
		$widthType = 'px';
		$blockAlign = 'bleft';
		$hasCaption = false;
		$caption = array(
				'text' => '',
				'position' => 'bottom',
				'type' => 'outside',
				'align' => 'left'
		);

		/* Browse Options */
		foreach($options as $option)
		{
			$original = $option;
			$option = self::_cleanOption($option);
			
			if (preg_match('#^\d+(px)?$#i', $option))
			{
				$width = str_replace(array('px', '%'), '', $option);
				$widthType = 'px';
				$widthImg = $width . 'px';				
			}
			elseif (preg_match('#^\d+%$#i', $option))
			{
				$width = str_replace(array('px', '%'), '', $option);
				$widthType = '%';
				$widthImg = '100%';
			}
			elseif($option == 'top')
			{
				$caption['position'] = 'top';
			}
			elseif($option == 'bottom')
			{
				$caption['position'] = 'bottom';
			}
			elseif($option == 'left')
			{
				$caption['align'] = 'left';
			}
			elseif($option == 'center')
			{
				$caption['align'] = 'center';
			}
			elseif($option == 'right')
			{
				$caption['align'] = 'right';
			}
			elseif($option == 'bleft')
			{
				$blockAlign = 'bleft';
			}
			elseif($option == 'bcenter')
			{
				$blockAlign = 'bcenter';
			}
			elseif($option == 'bright')
			{
				$blockAlign = 'bright';
			}
			elseif($option == 'inside')
			{
				$caption['type'] = 'inside';
			}
			elseif($option == 'fleft')
			{
				$blockAlign = 'fleft';
			}
			elseif($option == 'fright')
			{
				$blockAlign = 'fright';
			}
			elseif(!empty($option))
			{
				$hasCaption = true;
				$caption['text'] = $original;
			}
		}

		/* Check Options */
		if($widthType == '%' && $width > 100)
		{
			$width = 100;
		}

		if( 	(!preg_match('#^\d{2,3}$#', $width)) 
			|| 
			($widthType == 'px' && $width > $xenOptions->AdvBBcodeBar_imgmax)
		){
			$width = $xenOptions->AdvBBcodeBar_imgdefault;
			$widthType = 'px';
			$widthImg = $width . 'px';
		}
		
		/* Confirm Options */
		$options['width'] = $width;
		$options['widthType'] = $widthType;
		$options['widthImg'] = $widthImg;		
		$options['blockAlign'] = $blockAlign;
		$options['hasCaption'] = $hasCaption;
		$options['caption'] = $caption;
		$options['isBadIE'] = self::_isBadIE();

		/* Content Management */
		$regex_attach_direct_id = '#^\d+$#';
		$regex_attach_parsedimg = '#<img.+?src="(.+?)"#ui';

			/*** XenForo Attachement ***/
			if(preg_match($regex_attach_direct_id, $content))
			{
				$content = XenForo_Link::buildPublicLink('attachments', array('attachment_id' => self::_cleanOption($content)) );
			}
			elseif(preg_match($regex_attach_parsedimg, $content, $src))
			{
				$content = $src[1];
			}

			/*** Yellow picture trick ***/
			if ( 	isset($visitor['permissions']['forum']['viewAttachment']) 
				&& ($visitor['permissions']['forum']['viewAttachment'] === false
				&& $xenOptions->AdvBBcodeBar_bimg_yellowpic) 
			){
				$content = $xenOptions->boardUrl . '/styles/sedo/adv_bimg/bimg_visitors.png';		
			}
	}

	public static function parseTagEncadre(&$content, array &$options, &$templateName, &$fallBack, array $rendererStates, $parentClass)
	{
		$xenOptions = XenForo_Application::get('options');
		
		/* Default Options */
		$width = $xenOptions->AdvBBcodeBar_encdefault;
		$widthType = $xenOptions->AdvBBcodeBar_encdefault_defaultwidth_unit;
		$floatClass = 'fright';
		$skin2 = false;
		$title = '';

		/* Browse Options */
		foreach($options as $option)
		{
			$original = $option;
			$option = self::_cleanOption($option);
			
			if (preg_match('#^\d+(%)?$#', $option))
			{
				$width = str_replace(array('px', '%'), '', $option);
				$widthType = '%';
			}
			elseif (preg_match('#^\d+px$#', $option))
			{
				$width = str_replace(array('px', '%'), '', $option);
				$widthType = 'px';
			}
			elseif($option == 'skin2')
			{
				$skin2 = true;
			}
			elseif($option == 'fleft')
			{
				$floatClass = 'fleft';
			}
			elseif($option == 'fright')
			{
				$floatClass= 'fright';	
			}						
			elseif(!empty($option))
			{
				$title = $original;
			}
		}

		/* Check Options */
		if( 	(!preg_match('#^\d{2,3}$#', $width)) 
			|| 
			($widthType == 'px' && $width > $xenOptions->AdvBBcodeBar_encmax_px)
			||
			($widthType == '%' && $width > $xenOptions->AdvBBcodeBar_encmax)
		){
			$width = $xenOptions->AdvBBcodeBar_encdefault;
			$widthType = $xenOptions->AdvBBcodeBar_encdefault_defaultwidth_unit;
		}
		
		/* Confirm Options */
		$options['width'] = $width;
		$options['widthType'] = $widthType;
		$options['floatClass'] = $floatClass;
		$options['skin2'] = $skin2;
		$options['title'] = $title;
	}

	public static function parseTagArticle(&$content, array &$options, &$templateName, &$fallBack, array $rendererStates, $parentClass)
	{
		/* Default Options */
		$hasSource = false;
		$sourceText = false;
		$source = '';
		$url = '';

		/* Get Option */
		$source_data = ( isset($options[1]) ) ? $options[1] : '';
				
		if(!empty($source_data))
		{
			$hasSource = true;
			$source = $source_data;
			
			$source_data = self::_cleanOption($source_data);

			if (preg_match(self::$regexUrl, $source_data))
			{
				$sourceText = true;
				$url = $source_data;
			}
			elseif(preg_match('#[\s]*({URL=.+?})[\s]*#ui', $source_data))
			{
				$sourceText = true;
			}
		}

		/* Confirm Options */
		$options['hasSource'] = $hasSource;
		$options['sourceText'] = $sourceText;
		$options['source'] = $source;
		$options['url'] = $url;
		$options['badIE'] = self::_isBadIE();
	}

	public static function parseTagFieldset(&$content, array &$options, &$templateName, &$fallBack, array $rendererStates, $parentClass)
	{
		$xenOptions = XenForo_Application::get('options');
		$title = '';
		$browser = 'good';
		$width = $xenOptions->AdvBBcodeBar_fieldsetdefault;
		$widthType = $xenOptions->AdvBBcodeBar_fieldsetdefault_width_unit;
		$blockAlign = 'bleft';

		/* Check if browser is IE */
		if( isset($visitor->getBrowser['isIE']))
		{
			//Browser Detection (Mobile/MSIE) Addon
			if($visitor->getBrowser['isIE'])
			{
				$browser = ( $visitor->getBrowser['IEis'] < 8 ) ? 'ie67' : 'ie';
			}
		}
		else
		{
			//Manual helper
			if( Sedo_AdvBBcodeBar_Helper_Sedo::isBadIE('all') )
			{
				$browser = ( Sedo_AdvBBcodeBar_Helper_Sedo::isBadIE('target', '6-7') ) ? 'ie67' : 'ie';
			}
		}
		
		/* Browse Options */
		foreach($options as $option)
		{
			$original = $option;
			$option = self::_cleanOption($option);
			
			if (preg_match('#^\d+(%)?$#', $option))
			{
				$width = str_replace(array('px', '%'), '', $option);
				$widthType = '%';
			}
			elseif (preg_match('#^\d+px$#', $option))
			{
				$width = str_replace(array('px', '%'), '', $option);
				$widthType = 'px';
			}		
			elseif($option == 'bleft')
			{
				$blockAlign = 'bleft';
			}
			elseif($option == 'bcenter')
			{
				$blockAlign= 'bcenter';
			}
			elseif($option == 'bright')
			{
				$blockAlign = 'bright';
			}
			elseif(!empty($option))
			{
				$title = $original;
			}
		}

		/* Check Options */
		if( 	(!preg_match('#^\d{2,3}$#', $width)) 
			|| 
			($widthType == 'px' && $width > $xenOptions->AdvBBcodeBar_fieldsetmax_px)
			||
			($widthType == '%' && $width > $xenOptions->AdvBBcodeBar_fieldsetmax)
		){
			$width = $xenOptions->AdvBBcodeBar_fieldsetdefault;
			$widthType = $xenOptions->AdvBBcodeBar_fieldsetdefault_width_unit;
		}

		/* Confirm Options */
		$options['width'] = $width;
		$options['widthType'] = $widthType;
		$options['blockAlign'] = $blockAlign;
		$options['broswser'] =  $broswser;
		$options['title'] =  $title;
		$options['cssIE'] = self::_isBadIE();
	}

	public static function parseTagGview(&$content, array &$options, &$templateName, &$fallBack, array $rendererStates, $parentClass)
	{
		$xenOptions = XenForo_Application::get('options');
		
		/*Manage & confirm options*/
		$width = $xenOptions->AdvBBcodeBar_gview_width;
		$options['width'] = ($xenOptions->AdvBBcodeBar_gview_width_unit == 'fixed') ? $width : $width . '%';
		$options['height'] = $xenOptions->AdvBBcodeBar_gview_height;

		/*Manage Content*/
		if(preg_match('#https://docs\.google\.com/viewer\?(authuser=.+)#i', $content, $url))
		{
			$content = $url[1];
		}
		else
		{
			$content = 'url=' . rawurlencode($content) . '&embedded=true';
		}

		/*Manage Wrapper*/
		if($xenOptions->AdvBBcodeBar_gview_spoilerbox)
		{
			$caption = ( isset($options[1]) ) ? $options[1] : new XenForo_Phrase('Sedo_AdvBBcodeBar_text_gview');			
			$parentClass->addWrapper('spoiler', $caption); 
		}		
	}	
	
	public static function parseTagLatex(&$content, array &$options, &$templateName, &$fallBack, array $rendererStates, $parentClass)
	{
		$xenOptions = XenForo_Application::get('options');

		/*Manage Content*/
		$content = rawurlencode($content);
		
		/*Default Options*/
		$width = $options->AdvBBcodeBar_latex_defaultwidth;
		$widthType = $options->AdvBBcodeBar_latex_defaultwidthunit;
		$height = '100%';
		$blockalign = 'bleft';
		$title = '';
		
		/* Browse Options */
		foreach($options as $option)
		{
			$original = $option;
			$option = self::_cleanOption($option);

			if (preg_match('#^\d+(px)?$#', $option))
			{
				$width = str_replace(array('px', '%'), '', $option);
				$widthType = 'px';
			}
			elseif (preg_match('#^\d+%$#', $option))
			{
				$width = str_replace(array('px', '%'), '', $option);
				$widthType = '%';	
			}
			elseif (preg_match('#^(\d+?(px)?)x(\d+?)$#', $option, $matches))
			{
				$width =  str_replace(array('px', '%'), '',$matches[1]);
				$widthType = 'px';
				$height =  str_replace(array('px', '%'), '', $matches[3]);
			}
			elseif (preg_match('#^(\d+?%)x(\d+?)$#', $option, $matches))
			{
				$width =  str_replace(array('px', '%'), '', $matches[1]);
				$widthType = '%';	
				$height =  str_replace(array('px', '%'), '', $matches[2]);
			}
			elseif($option == 'bleft')
			{
				$blockAlign = 'bleft';
			}
			elseif($option == 'bcenter')
			{
				$blockAlign= 'bcenter';
			}
			elseif($option == 'bright')
			{
				$blockAlign = 'bright';
			}
			elseif($option == 'fleft')
			{
				$blockAlign = 'fleft';
			}
			elseif($option == 'fright')
			{
				$blockAlign = 'fright';
			}
			elseif(!empty($option))
			{
				$title = $original;
			}
		}	
	
		/* Confirm Options */
		$options['width'] = $width;
		$options['widthType'] = $widthType;
		$options['height'] = $height;
		$options['blockAlign'] = $blockAlign;
		$options['title'] = $title;
	}

	public static function parseTagAccordion(&$content, array &$options, &$templateName, &$fallBack, array $rendererStates, $parentClass)
	{
		$xenOptions = XenForo_Application::get('options');

		/*Default Master Options*/
		$width = $xenOptions->AdvBBcodeBar_accordion_defaultwidth;
		$widthType = $xenOptions->AdvBBcodeBar_accordion_defaultwidth_unit;	
		$blockAlign = 'bleft';
		$globalHeight = false;
		
		/*Browse Master Options*/
		foreach($options as $option)
		{
			$original = $option;
			$option = self::_cleanOption($option);
					
			if (preg_match('#^\d+(px)?$#', $option))
			{
				$width = str_replace(array('px', '%'), '',$option);
				$widthType = 'px';
			}
			elseif (preg_match('#^\d+%$#', $option))
			{
				$width = str_replace(array('px', '%'), '',$option);
				$widthType = '%';				
			}
			elseif (preg_match('#^(\d+?(px)?)x(\d+?)$#', $option, $matches))
			{
				$width = str_replace(array('px', '%'), '', $matches[1]);
				$widthType = 'px';
				$globalHeight = str_replace(array('px', '%'), '',$matches[3]);
			}
			elseif (preg_match('#^(\d+?%)x(\d+?)$#', $option, $matches))
			{
				$width = str_replace(array('px', '%'), '',$matches[1]);
				$widthType = '%';	
				$globalHeight = str_replace(array('px', '%'), '',$matches[2]);
			}
			elseif($option == 'bleft')
			{
				$blockAlign = 'bleft';
			}
			elseif($option == 'bcenter')
			{
				$blockAlign= 'bcenter';
			}
			elseif($option == 'bright')
			{
				$blockAlign = 'bright';
			}
			elseif($option == 'fleft')
			{
				$blockAlign = 'fleft';
			}
			elseif($option == 'fright')
			{
				$blockAlign = 'fright';
			}
		}

		/* Check Options */
		if($widthType == '%' && $width > 100)
		{
			$width = 100;
		}

		if( 	(!preg_match('#^\d{2,3}$#', $width)) 
			|| 
			($widthType == 'px' && $width > $xenOptions->AdvBBcodeBar_accordion_maxwidth)
		){
			$width = $xenOptions->AdvBBcodeBar_accordion_defaultwidth;
			$widthType = $xenOptions->AdvBBcodeBar_accordion_defaultwidth_unit;
		}

		if($globalHeight !== false && $globalHeight > $xenOptions->AdvBBcodeBar_accordion_slides_maxheight)
		{
			$globalHeight = $xenOptions->AdvBBcodeBar_accordion_slides_maxheight;
		}
		
		/*Get slides from content*/
		preg_match_all('#{slide(=(\[([\w\d]+)(?:=.+?)?\].+?\[/\3\]|[^{}]+)+?)?}(.+?){/slide}(?!(?:\W+)?{/slide})#is', $content, $wip, PREG_SET_ORDER);
		$content = ''; //Raz content
		
		
		$slides = array();
		foreach($wip as $slide)
		{
			$slide_content = $slide[4];
			$slide_attributes = $slide[2];
			$height = $globalHeight;
			
			if($slide_attributes)
			{
				$slideOptions = explode('|', $slide_attributes);
				
				/*Default Slave Options*/
				$align = $xenOptions->AdvBBcodeBar_accordion_slides_titles_defaultalign;
				$title = '';
				$open = '';
				$class_open = '';

				/*Browse Slave Options*/
				foreach($slideOptions as $slideOption)
				{
					$original = $slideOption;
					$slideOption = self::_cleanOption($slideOption);
					
					if (preg_match('#^\d+$#', $slideOption))
					{
						$height = $slideOption;
					}
					elseif($slideOption == 'left')
					{
						$align = 'left';
					}
					elseif($slideOption == 'center')
					{
						$align = 'center';
					}
					elseif($slideOption == 'right')
					{
						$align = 'right';
					}
					elseif($slideOption == 'open')
					{
						$open = ' AdvSlideOpen';
						$class_open = ' AdvSlideActive';
					}				
					elseif(!empty($slideOption))
					{
						$title = $original;
					}
				}
			}
			
			if($height !== false && $height < 22)
			{
				$height = 22; //Min-height must be 22px to make overflow scroller visible
			}
			
			if($height !== false && $height > $xenOptions->AdvBBcodeBar_accordion_slides_maxheight)
			{
				$height = $xenOptions->AdvBBcodeBar_accordion_slides_maxheight; //Max-height Safety
			}
			
			/*Add slide to slides array*/
			$slides[] = array(
				'height' => $height,
				'content' => $slide_content,
				'align' => $align,
				'title' => $title,
				'open' => $open,
				'class_open' => $class_open
			);
		}
		
		/* Confirm Options */
		$options['uniqid'] = uniqid('adv_accordion_');
		$options['width'] = $width;
		$options['widthType'] = $widthType;
		$options['blockAlign'] = $blockAlign;
		$options['slides'] = $slides;
	}

	public static function parseTagPicasa(&$content, array &$options, &$templateName, &$fallBack, array $rendererStates, $parentClass)
	{
		$xenOptions = XenForo_Application::get('options');

		/***
			No View Permission
		**/
      		if(!isset($rendererStates['canViewBbCode']) || !$rendererStates['canViewBbCode'])
      		{
     			$options['contentIsUrl'] = (preg_match(self::$regexUrl, htmlspecialchars_decode($content))) ? true : false;
     			return false;
      		}

		/***
			Browser & Manage options
			=> need to keep the old way to manage width & height for compatibility
			
			Available variables: width (set value), height (set value) & interval (can stay null)
		**/
		$width =  $xenOptions->sedo_adv_picasa_default_width;
		$height = null;
		$interval = null;
		
		foreach($options as $k => $option)
		{
			$original = $option;
			$option = self::_cleanOption($option);
					
			if (preg_match('#\d{1,2}s#', $option))
			{
				$interval = str_replace('s', '', $option);
			}
			elseif(preg_match('#\d{2,3}#', $option))
			{
				if($k == 1)
				{
					$width = $option;
				}
				else
				{
					$height = $option;
				}
			}
		}

		if($interval && $interval > $xenOptions->sedo_adv_picasa_max_interval)
		{
			$interval = $xenOptions->sedo_adv_picasa_default_interval;
		}

		if ($width > $xenOptions->sedo_adv_picasa_max_width)
		{
			$width = $xenOptions->sedo_adv_picasa_default_width;
		}

		if (!$height)
		{
			$height = round($width / 1.5);
		}

		if ($height > $xenOptions->sedo_adv_picasa_max_height)
		{
			$height = $xenOptions->sedo_adv_picasa_default_height;
		}

		/***
			Grab Picasa page
			Available options: url, type, error, image
			
			$alreadyGrabbed is a mini&basic cache system that avoids to connect several times on an external page
			if the same url is repeated several times in the page ; $ref is just the checksum of the url that will
			be used as a key in a parent array variable specific to this picasa tag
		**/
		$ref = crc32(trim(strtolower($content)));
		$ref = sprintf("%u\n", $ref);

		$grabber = $xenOptions->sedo_adv_picasa_grabber;
		$url = urldecode($content);
		$type = '';
		$error = '';
		$image = '';

		$alreadyGrabbed = $parentClass->getTagExtra('grabber', $ref); 
				
		if(!$alreadyGrabbed)
		{
			if (!in_array($grabber, array('none', 'nocurl', 'nofgc')))
			{
				if (preg_match('#data/feed/base/user#', $url))
				{
					$type = 'album'; //The url is already a Picassa RSS link
				}
				elseif (preg_match('#https?://picasaweb\.google\.com/(?:.+\#(?P<id>\d+))?#', $url, $photo))
				{
					if ($grabber == 'curl')
					{
						$ch = curl_init();
						curl_setopt ($ch, CURLOPT_URL, $url);
						curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 10); // 10 seconds of timeout
						ob_start();
						curl_exec($ch);
						curl_close($ch);
						$file_content = ob_get_contents();
						ob_end_clean();
					}
					elseif ($grabber == 'fgc')
					{
						$file_content = file_get_contents($url);
					}
	
					if(!isset($photo['id']))
					{
						/*** 
							The URL was a Picaca Album
							Let's pick up now the RSS link inside the html code
						**/
						$search = '#title="RSS Album Feed\." href="(?P<rss>https?://picasa(.+?)data/feed/base/user/.+?)"#s';
		
						if (preg_match($search, $file_content, $match))
						{
							$type = 'album';
							$url = $match['rss'];
						}
						else
						{
							$error = 'code1';
						}
					}
					else
					{
						/*** 
							The URL should be a Picaca Photo
						**/
						$search = '#gphoto\$id":"' . $photo['id'] . '".+?{"url":"(?<link>.+?/)(?<image>[^/]+?)"#s';
		
						if (preg_match($search, $file_content, $match))
						{
							//Confirmation: this is a Picasa photo link
							$type = 'photo';
							$url = $match['link'];
							$image = $match['image'];
						}
						else
						{
							//The Picasa Image URL has some problems
							$error = 'code5';
						}
					}
				}
				else
				{
					$error = 'code2';
				}
		    	}
			else
		   	{
			    	if (preg_match('#data/feed/base/user#', $url))
				{
					//The url seems to be a Picassa RSS link
					$type = 'album';
				}
				elseif (preg_match('#https?://picasaweb\.google\.com/#', $url))
				{
					//The url seems to be a direct link to a Picassa Album, warn the user to use the RSS link
					$error = 'code3';
				}
				else
				{
					//The url is neither a RSS Picassa URL, nor even a Picassa URL...
					$error = 'code4';
				}
			}

			$extraTag[$ref] = array(
				'url' => $url,
				'type' => $type,
				'error' => $error,
				'image' => $image
			);
			
			$parentClass->addTagExtra('grabber', $extraTag);
		}
		else
		{
			//Datas extracted from the mini cache
			$url = $alreadyGrabbed['url'];
			$type = $alreadyGrabbed['type'];
			$error = $alreadyGrabbed['error'];
			$image = $alreadyGrabbed['image'];
		}

		if($error)
		{
			$options['type'] = 'error';
			$options['error'] = $error;
			return false;
		}

      		/***
      			Prepare Common options
      		**/
      		
		if(in_array($type, array('album', 'photo')))
		{
			$options['id'] = uniqid("picasa_$type");
			$options['type'] = $type;
			$options['width'] = $width;
			$options['height'] = $height;
		}

      		/***
      			Prepare Options for slideshows
      		**/
		if($type == 'album')
		{
			/***
				Get Picasa Datas
				Available datas: user, albumid, authkey
			**/
			$user = '';
			$albumid = '';
			$authkey = '';
	
			preg_match('/user\/(.*)\/albumid/', $url, $picasa_user);
			preg_match('/albumid\/(\d.*)\?/', $url, $picasa_albumid);
			preg_match('/authkey=(\S.+)&/', $url, $picasa_authkey);
	
			$user = trim($picasa_user[1]);
			$albumid = trim($picasa_albumid[1]);

			if(isset($picasa_authkey[1]))
			{
				$authkey = '%26authkey%3D' . trim($picasa_authkey[1]);
			}


			/***
				Create a Picasa extra string
				Available data: extra
			**/
			$extra = '';
			
			if($interval)
			{
				$extra .= "&amp;interval=" . $interval;
	
			}
			if ($xenOptions->sedo_adv_picasa_noautoplay)
			{
				$extra .= "&amp;noautoplay=1";
			}
			if (!$options->sedo_adv_picasa_captions)
			{
				$extra .= "&amp;captions=1";
			}
	
			/***
				Get Background Color
				Available data: backgroundColor
			**/
			$backgroundColor = XenForo_Template_Helper_Core::styleProperty('advbbcodebar_picasa_background');
			$backgroundColor = (preg_match('#rgba#i', $background)) ? XenForo_Helper_Color::unRgba($background) : $backgroundColor;
			$backgroundColor = self::_rgb2hex($backgroundColor);
	
			/*Prepare options*/
			$options['extra'] = $extra;
			$options['hexaColor'] = $backgroundColor;
			$options['user'] = $user;
			$options['albumid'] = $albumid;
			$options['authkey'] = $authkey;			
		}

      		/***
      			Prepare Options for photos
      		**/		
		if($type == 'photo')
		{
			$options['img_urlLink'] = $url . 's2000/' . $image;
			$options['img_urlImg'] = $url . 's' . $width . '/' . $image;
		}
	}

	protected static function _cleanOption($string)
	{
		$string = mb_convert_kana($string, 'a', 'UTF-8');
		return $string;
	}
	
	protected static function _isBadIE()
	{
		$visitor = XenForo_Visitor::getInstance();
		if(isset($visitor->getBrowser['IEis']))
		{
			//Browser Detection (Mobile/MSIE) Addon
			if($visitor->getBrowser['isIE'] && $visitor->getBrowser['IEis'] < 9)
			{
				return true;
			}
		}
		else
		{
			//Manual helper
			if(Sedo_AdvBBcodeBar_Helper_Sedo::isBadIE('target', '6-8'))
			{
				return true;
			}
		}
		
		return false;
	}

	public static $regexUrl = '#^(?:(?:https?|ftp|file)://|www\.|ftp\.)[-\p{L}0-9+&@\#/%=~_|$?!:,.]*[-\p{L}0-9+&@\#/%=~_|$]$#ui';

	protected static function _rgb2hex($color)
	{
		//Match R, G, B values
		preg_match('#^rgb\((?P<r>\d{1,3}).+?(?P<g>\d{1,3}).+?(?P<b>\d{1,3})\)$#i', $color, $rgb);
		//Convert them in hexa
		//Code source: http://forum.codecall.net/php-tutorials/22589-rgb-hex-colors-hex-colors-rgb-php.html				
		$output = sprintf("%x", ($rgb['r'] << 16) + ($rgb['g'] << 8) + $rgb['b']);
		
	       	return $output;
	}	
}
//Zend_Debug::dump($abc);