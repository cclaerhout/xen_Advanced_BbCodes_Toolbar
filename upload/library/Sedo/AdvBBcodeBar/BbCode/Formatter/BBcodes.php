<?php

class Sedo_AdvBBcodeBar_BbCode_Formatter_BBcodes
{
//Accordion - BROWSERS TEST Opera OK, Chrome OK, Firefox OK, IE10 OK, IE9 OK, IE8 OK, IE7 OK, IPAD OK but overflow scrollbar not visible (default behaviour...)

	protected static $Accordion_ID = -1;
	protected static $Accordion_PREV_ID = 0;
	protected static $Accordion_ID_CHECK = -1;
	protected static $Accordion_PREV_DELTA = null;
	protected static $Accordion_FIX = null;
	protected static $global_attributes_Accordion = null;

	public static function parseTagAccordion(array $tag, array $rendererStates, &$parentClass)
	{
		self::$Accordion_ID++; 
		$options = XenForo_Application::get('options');
		
		$formatter['code'] = '<dl id="' . uniqid('adv_accordion_') . '" class="adv_accordion" data-easing="' . $options->AdvBBcodeBar_accordion_slides_easing_effect . '" data-duration="' . $options->AdvBBcodeBar_accordion_slides_easing_duration . '" style="display:block;width:{$width}{$widthType};{$align}">{$content}</dl>';

		$formatter['hasoptions'] = true;
		$formatter['content_callback'] = 'parseTagAccordion_content';

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}

	public static function parseTagAccordion_attributes(array $tag, $bboptions, $options, $parentClass)
	{
		//Fetch options
		$attributes['align'] = '';
		
		foreach($bboptions as $bboption)
		{
			if (preg_match('#^\d+(px)?$#', $bboption))
			{
				$attributes['width'] = $bboption;
				$attributes['widthType'] = 'px';
			}
			elseif (preg_match('#^\d+%$#', $bboption))
			{
				$attributes['width'] = $bboption;
				$attributes['widthType'] = '%';				
			}
			elseif (preg_match('#^(\d+?(px)?)x(\d+?)$#', $bboption, $matches))
			{
				$attributes['width'] = $matches[1];
				$attributes['widthType'] = 'px';
				$attributes['height'] = $matches[3];				
			}
			elseif (preg_match('#^(\d+?%)x(\d+?)$#', $bboption, $matches))
			{
				$attributes['width'] = $matches[1];
				$attributes['widthType'] = '%';	
				$attributes['height'] = $matches[2];				
			}			
			elseif(preg_match('#^bleft$#', $bboption))
			{
				$attributes['align'] = 'margin-left:0 !important;margin-right:auto !important;';
			}
			elseif(preg_match('#^bcenter$#', $bboption))
			{
				$attributes['align'] = 'margin-left:auto !important;margin-right:auto !important;';
			}
			elseif(preg_match('#^bright$#', $bboption))
			{
				$attributes['align'] = 'margin-left:auto !important;margin-right:0 !important;';
			}
			elseif(preg_match('#^fleft$#', $bboption))
			{
				$attributes['align'] = 'float:left;margin:1px 10px 0 0 !important;';
			}
			elseif(preg_match('#^fright$#', $bboption))
			{
				$attributes['align'] = 'float:right;margin:1px 0 0 10px !important;';
			}
		}

		//Width Management
		if (isset($attributes['width']))
		{
			//Easiest way to only get digit and check them
			$attributes['width'] = str_replace(array('px', '%'), '', $attributes['width']);

			if(!preg_match('#^\d{2,3}$#', $attributes['width']))
			{
				$safety['width'] = true;
			}
			
			if($attributes['widthType'] == '%' AND $attributes['width'] > 100)
			{
				$attributes['width'] = 100;
			} 
			
			if($attributes['widthType'] == 'px' AND $attributes['width'] > $options->AdvBBcodeBar_accordion_maxwidth)
			{
				$safety['width'] = true;
			}
		}
		else
		{
			$safety['width'] = true;
		}

		if (isset($safety['width']))
		{
			$attributes['width'] = $options->AdvBBcodeBar_accordion_defaultwidth;
			$attributes['widthType'] = $options->AdvBBcodeBar_accordion_defaultwidth_unit;
		}
		
		//Max-height Safety
		if(isset($attributes['height']) AND $attributes['height'] > $options->AdvBBcodeBar_accordion_slides_maxheight)
		{
			$attributes['height'] = $options->AdvBBcodeBar_accordion_slides_maxheight;
		}

		self::$global_attributes_Accordion[] = $attributes;

		return $attributes;
	}

	public static function parseTagAccordion_attributes_default(array $tag, $options, $parentClass)
	{
		$default['align'] = '';
		$default['width'] = $options->AdvBBcodeBar_accordion_defaultwidth;
		$default['widthType'] = $options->AdvBBcodeBar_accordion_defaultwidth_unit;		
	
		return $default;
	}

	public static function parseTagAccordion_content($content)
	{
		preg_match_all('#{slide(=(\[([\w\d]+)(?:=.+?)?\].+?\[/\3\]|[^{}]+)+?)?}(.+?){/slide}(?!(?:\W+)?{/slide})#is', $content, $wip, PREG_SET_ORDER);
		$content = '';
		
		$global_attributes = self::Accordion_Bake_GlobalAttributes();

		$num = count($wip);
		$i = 1;
		foreach($wip as $slide)
		{

			//Bake slide content & options
			$slide_content = $slide[4]; 
				//Slide[4] being the content of the slide
			$options = self::bake_SlidesOptions($slide[2], $global_attributes, $i, new XenForo_Phrase('Sedo_AdvBBcodeBar_text_slide')); 
				//Slide[2] being the options of the Slave tag {slide=options}...{/slide} ; $attributes being the options of the Master tag
		
			//Create some slide class based on slide position
			if($i == 1)
			{
				$class= 'first';
			}
			elseif($i == $num)
			{
				$class = 'last';
			}
			else
			{
				$class = 'between';
			}
			
			//Create slide	
			if(isset($options['height']))
			{
				$content .= '<dt class="' . $class . $options['class_open'] . '" style="text-align:' . $options['align'] . ';">' . $options['title'] . '</dt><dd class="' . $class . $options['open'] . $options['class_open'] . '" style="height:' . $options['height'] . 'px;overflow-x:hidden;overflow-y:auto;">' . $slide_content . '</dd>'; // display:block;position:relative; => Fix IE7 in template CSS
			}
			else
			{
				$content .= '<dt class="' . $class . $options['class_open'] . '" style="text-align:' . $options['align'] . ';">' . $options['title'] . '</dt><dd class="' . $class . $options['open'] . $options['class_open'] . '">' . $slide_content . '</dd>';			
			}

			$i++;			
		}


		return $content;
	}

	public static function bake_SlidesOptions($slide_attributes, $global_attributes = null, $counter = null, $slidephrase = 'Slide ')
	{
		$options = XenForo_Application::get('options');
		
		$attributes['title'] = (isset($counter))? $slidephrase . $counter : $slidephrase;
		$attributes['align'] = $options->AdvBBcodeBar_accordion_slides_titles_defaultalign;
		$attributes['open'] = '';
		$attributes['class_open'] = '';		
		
		if(isset($global_attributes['height']))
		{
			$attributes['height'] = $global_attributes['height'];
		}

		if(!empty($slide_attributes))
		{
			$bboptions = explode('|', $slide_attributes);

			foreach($bboptions as $bboption)
			{
				if (preg_match('#^\d+$#', $bboption))
				{
					$attributes['height'] = $bboption;
				}
				elseif(preg_match('#^left$#', $bboption))
				{
					$attributes['align'] = 'left';
				}
				elseif(preg_match('#^center$#', $bboption))
				{
					$attributes['align'] = 'center';
				}
				elseif(preg_match('#^right$#', $bboption))
				{
					$attributes['align'] = 'right';
				}
				elseif(preg_match('#^open$#', $bboption))
				{
					$attributes['open'] = ' AdvSlideOpen';
					$attributes['class_open'] = ' AdvSlideActive';
				}				
				elseif(!empty($bboption))
				{
					if($options->AdvBBcodeBar_accordion_slides_rawtitles)
					{
						$attributes['title'] = strip_tags($bboption); // Strip_tags OK
					}
					else
					{
						$attributes['title'] = $bboption;					
					}
				}

			}
		}
		
		//Min-height must be 22px to make overflow scroller visible
		if(isset($attributes['height']) AND $attributes['height'] < 22)
		{
			$attributes['height'] = 22;
		}
		//Max-height Safety
		if(isset($attributes['height']) AND $attributes['height'] > $options->AdvBBcodeBar_accordion_slides_maxheight)
		{
			$attributes['height'] = $options->AdvBBcodeBar_accordion_slides_maxheight;
		}

		return $attributes;
	}

	public static function Accordion_Bake_GlobalAttributes()
	{
		/*	
			Nightmare to allow nested accordion tags with global options (only use for widthxheight actually)
			Nobody will use this, but the code is complete
		*/
		
		$global_attributes_temp = self::$global_attributes_Accordion;
		self::$Accordion_PREV_DELTA = self::$Accordion_ID - self::$Accordion_ID_CHECK;
		self::$Accordion_ID_CHECK++;
		$c = self::$Accordion_ID - self::$Accordion_PREV_ID;

		//Normal behaviour
		if($c == 1)
		{
			$global_attributes = $global_attributes_temp[self::$Accordion_ID];
		}
		//Normal behaviour + Record change
		elseif ($c > 1)
		{
			$global_attributes = $global_attributes_temp[self::$Accordion_ID];
			$i = $c;
			for ($d = 1; $i > 1;  $i--, $d++) {
				self::$Accordion_FIX[$i] = self::$Accordion_ID - $d;
			}
			unset($i, $d);
		}
		//Special behaviour based on recorded datas
		elseif ($c == 0)
		{
			if(self::$Accordion_PREV_DELTA != 1)
			{
				$global_attributes = $global_attributes_temp[self::$Accordion_FIX[self::$Accordion_PREV_DELTA]];
			}
			else
			{
				$global_attributes = $global_attributes_temp[0];
				$reset = true;
			}
		}

		self::$Accordion_PREV_ID = self::$Accordion_ID;

		/*	//Tests
				Zend_Debug::dump($global_attributes_temp);
				Zend_Debug::dump(self::$Accordion_ID);
				Zend_Debug::dump(self::$Accordion_ID_CHECK);
				Zend_Debug::dump($global_attributes);
		*/
		
		if(isset($reset))
		{		
			$global_attributes_temp = '';
			self::$Accordion_ID = -1;
			self::$Accordion_PREV_ID = 0;
			self::$Accordion_ID_CHECK = -1;
			self::$Accordion_PREV_DELTA = null;
			self::$Accordion_FIX = null;
			self::$global_attributes_Accordion = null;
		}
		
		return $global_attributes;
	}


//NEW BIMG (6in1) = BIMG + BIMGX + IGAUCHE + IGAUCHEX + IDROITE + IDROITEX
//IE6 OK; IE7 OK; IE8 OK IE9 OK; FIREFOX OK; CHROME OK; IPAD OK - 2012/09/16

	public static function parseTagBimg(array $tag, array $rendererStates, &$parentClass)
	{
		$options = XenForo_Application::get('options');
	
		$formatter['code'] = '<div class="adv_bimg_block" style="display:block;z-index:1;"><div class="adv_bimg" style="display:block;position:relative;width:{$width}{$widthType};{$blockalign}{$align_default}{$float}">{$caption_top}<a href="{$content}" target="_blank" class="LbTrigger" data-href="index.php?misc/lightbox"><img class="bbCodeImage LbImage" src="{$content}" style="width:{$widthIMG}" data-src="{$content}" /></a><br />{$caption_bottom}<span {$class_link}><a href="{$content}" target="_blank" class="LbTrigger" data-href="index.php?misc/lightbox"><img style="width:{$widthIMG};display:none;" class="bbCodeImage LbImage" src="{$content}" data-src="{$content}" />{$link}</a></span></div></div>';

		$formatter['hasoptions'] = true;
		$formatter['content_callback'] = 'parseTagBimg_content';		

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}

	public static function parseTagBimg_attributes(array $tag, $bboptions, $options, $parentClass)
	{

		//Init
		$visitor = XenForo_Visitor::getInstance();
		$attributes['align_default'] = '';
		$attributes['blockalign'] = '';
		$attributes['textalign'] = 'left';

		//Fetch options
		foreach($bboptions as $bboption)
		{
			if (preg_match('#^\d+(px)?$#', $bboption))
			{
				$attributes['width'] = $bboption;
				$attributes['widthType'] = 'px';
				$attributes['widthIMG'] = $attributes['width'] . 'px';
			}
			elseif (preg_match('#^\d+%$#', $bboption))
			{
				$attributes['width'] = $bboption;
				$attributes['widthType'] = '%';	
				$attributes['widthIMG'] = '100%';
			}
			elseif(preg_match('#^top$#', $bboption))
			{
				$attributes['caption_top'] = true;
				$attributes['caption_bottom'] = false;
			}
			elseif(preg_match('#^bottom$#', $bboption))
			{
				$attributes['caption_bottom'] = true;
				$attributes['caption_top'] = false;
			}
			elseif(preg_match('#^left$#', $bboption))
			{
				$attributes['textalign'] = 'left'; //Used inside function
			}
			elseif(preg_match('#^center$#', $bboption))
			{
				$attributes['textalign'] = 'center'; //Used inside function
			}
			elseif(preg_match('#^right$#', $bboption))
			{
				$attributes['textalign'] = 'right'; //Used inside function
			}
			elseif(preg_match('#^bleft$#', $bboption))
			{
				$attributes['blockalign'] = 'margin-right:auto;'; //Used inside function
			}
			elseif(preg_match('#^bcenter$#', $bboption))
			{
				$attributes['blockalign'] = 'margin-left:auto;margin-right:auto;'; //Used inside function
			}
			elseif(preg_match('#^bright$#', $bboption))
			{
				$attributes['blockalign'] = 'margin-left:auto;'; //Used inside function
			}
			elseif(preg_match('#^inside$#', $bboption))
			{
				$attributes['inside'] = true;
			}
			elseif(preg_match('#^fleft$#', $bboption))
			{
				$attributes['float'] = 'left';
			}
			elseif(preg_match('#^fright$#', $bboption))
			{
				$attributes['float'] = 'right';
			}
			elseif(!empty($bboption))
			{
				if ( isset($visitor['permissions']['forum']['viewAttachment']) && ($visitor['permissions']['forum']['viewAttachment'] === false && $options->AdvBBcodeBar_bimg_yellowpic) ) 
				{
					$attributes['caption'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_text_notmember');		
				}
				else
				{
					$attributes['caption'] = htmlspecialchars($bboption);
	
					/*
						Need to call the ParseMyBBcodesOptions function from the stopautolinking Patch 
						because some html code will be injected after to that option
						
					*/
					
					if (method_exists($parentClass, 'ParseMyBBcodesOptions'))
					{
						$attributes['caption'] =  $parentClass->ParseMyBBcodesOptions($attributes['caption']);
					}
				}
			}
		}


		//Width Management
		if (isset($attributes['width']))
		{
			//Easiest way to only get digit and check them
			$attributes['width'] = str_replace(array('px', '%'), '', $attributes['width']);

			if(!preg_match('#^\d{2,3}$#', $attributes['width']))
			{
				$safety['width'] = true;
			}
			
			if($attributes['widthType'] == '%' AND $attributes['width'] > 100)
			{
				$attributes['width'] = 100;
			} 
			
			if($attributes['widthType'] == 'px' AND $attributes['width'] > $options->AdvBBcodeBar_imgmax)
			{
				$safety['width'] = true;
			}
		}
		else
		{
			$safety['width'] = true;
		}

		if (isset($safety['width']))
		{
			$attributes['width'] = $options->AdvBBcodeBar_imgdefault;
			$attributes['widthType'] = 'px';
			$attributes['widthIMG'] = $attributes['width'] . 'px';
		}

		//Bake Caption
		
		if(isset($attributes['caption']))
		{
			if(isset($attributes['caption_top']) AND !empty($attributes['caption_top']))
			{

				if(isset($attributes['inside']))
				{
					$caption_background = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_bimg_caption_background', 'black');
					$caption_text = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_bimg_caption_text', 'white');

					$attributes['caption_top'] = '<div class="adv_caption caption_inside" style="position:absolute; z-index:5; padding:1px 0 3px 0;  width:' . $attributes['widthIMG'] . '; background: ' . $caption_background['result'] . ';"><div class="caption_txt" style="text-align:' . $attributes['textalign'] . ';padding: 1px 5px 0 5px; color:' . $caption_text['rgb'] . ';">' . $attributes['caption'] . '</div></div>';
				}
				else
				{
					$attributes['caption_top'] = '<div class="caption_txt" style="text-align:' . $attributes['textalign'] . ';">' . $attributes['caption'] . '</div>';
				}


				$attributes['caption_bottom'] = '';
				$attributes['link'] = '';

			}
			else
			{
				if(isset($attributes['inside']))
				{
					$caption_background = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_bimg_caption_background', 'black');
					$caption_text = Sedo_AdvBBcodeBar_Helper_Sedo::GetDisplayValue('adv_bimg_caption_text', 'white');
					$isBadIE = Sedo_AdvBBcodeBar_Helper_Sedo::isBadIE();

					if($isBadIE === true)
					{
						$bottom = 0;
					}
					else
					{
						$bottom = '5px';
					}

					$attributes['caption_bottom'] = '<div class="adv_caption caption_inside" style="position:absolute; z-index:5; bottom: ' . $bottom . '; padding:1px 0 3px 0;  width:' . $attributes['widthIMG'] . '; background: ' . $caption_background['result'] . ';"><div class="caption_txt" style="text-align:' . $attributes['textalign'] . ';padding: 1px 5px 0 5px;color:' . $caption_text['rgb'] . ';">' . $attributes['caption'] . '</div></div>';

				}
				else
				{
					$attributes['caption_bottom'] = '<div class="caption_txt" style="text-align:' . $attributes['textalign'] . ';">' . $attributes['caption'] . '</div>';
				}


				$attributes['caption_top'] = '';
				$attributes['link'] = '';
			}

		}
		else
		{
				$attributes['align_default']= 'text-align:center;';
				$attributes['caption_bottom'] = '';
				$attributes['caption_top'] = '';
				
				if ( isset($visitor['permissions']['forum']['viewAttachment']) && ($visitor['permissions']['forum']['viewAttachment'] === false && $options->AdvBBcodeBar_bimg_yellowpic) ) 
				{
					$attributes['link'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_text_notmember');		
				}
				else
				{
					$attributes['link'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_text_clicktoexpand');				
				}
		}

		//If caption, hide the auto-text link
		if(empty($attributes['link']))
		{
			$attributes['class_link'] = "style='display:none'";
		}
		else
		{
			$attributes['class_link'] = '';
		}

		//Bake Float options
		if(isset($attributes['float']) AND $attributes['float'] == 'left')
		{
			$attributes['float'] = 'float:left;margin:1px 10px 0 0;';

		}
		elseif(isset($attributes['float']) AND $attributes['float'] == 'right')
		{

			$attributes['float'] = 'float:right;margin:1px 0 0 10px;';

		}
		else
		{
			$attributes['float'] = '';
		}

		return $attributes;
	}

	public static function parseTagBimg_attributes_default(array $tag, $options, $parentClass)
	{
		$visitor = XenForo_Visitor::getInstance();

		$default['width'] = $options->AdvBBcodeBar_imgdefault;
		$default['widthType'] = 'px';
		$default['align_default'] = 'text-align:center;';
		$default['blockalign']= '';
		$default['caption_top']= '';
		$default['caption_bottom']= '';
		$default['class_link']= '';
		$default['float']= '';

		if($default['widthType'] = 'px')
		{
			$default['widthIMG'] = $default['width'] . 'px';
		}
		else
		{
			$default['widthIMG'] = '100%';
		}

		if ( isset($visitor['permissions']['forum']['viewAttachment']) && ($visitor['permissions']['forum']['viewAttachment'] === false && $options->AdvBBcodeBar_bimg_yellowpic) ) 
		{
			$default['link'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_text_notmember');		
		}
		else
		{
			$default['link'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_text_clicktoexpand');				
		}

		return $default;
	}

	public static function parseTagBimg_content($content)
	{
		$options = XenForo_Application::get('options');

		/*** XenForo Attachements ***/
			//$regex_attach = '#(?:(?<=\[ATTACH|ATTACH=full\])\d+?(?=\[/ATTACH\])|^\d+$)#i'; can't use this, the attach tag is already parsed
			$regex_attach_direct_id = '#^\d+$#';
			$regex_attach_parsedimg = '#<img.+?src="(.+?)"#ui';
	
			if(preg_match($regex_attach_direct_id, $content, $id))
			{
				$content = XenForo_Link::buildPublicLink('attachments', array('attachment_id' => $id[0]));
			}
			elseif(preg_match($regex_attach_parsedimg, $content, $src))
			{
				$content = $src[1];		
			}

		/*** Yellow picture trick ***/
			$visitor = XenForo_Visitor::getInstance();
	
			if ( isset($visitor['permissions']['forum']['viewAttachment']) && ($visitor['permissions']['forum']['viewAttachment'] === false && $options->AdvBBcodeBar_bimg_yellowpic) )
			{
				$content = $options->boardUrl . '/styles/sedo/adv_bimg/bimg_visitors.png';		
			}
		
		return $content;
	}


//IGAUCHE + IGAUCHEX OK (for vB users)

	public static function parseTagIgauche(array $tag, array $rendererStates, &$parentClass)
	{
		$options = XenForo_Application::get('options');

		$formatter['code'] ='<div style="float:left;margin:0 10px 0 0;width:{$width}px;"><a href="{$content}" target="_blank" class="LbTrigger" data-href="index.php?misc/lightbox"><img style="width:{$width}px;" class="bbCodeImage LbImage" src="{$content}" data-src="{$content}" alt=""/></a></div>';

		$formatter['hasoptions'] = true;

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}

	public static function parseTagIgauche_attributes(array $tag, $bboptions, $options, $parentClass)
	{
		$attributes['width'] = $bboptions[0];

		if (!preg_match('#^\d{2,3}$#', $attributes['width']) OR $attributes['width'] > $options->AdvBBcodeBar_imgmax)
		{
			$attributes['width'] = $options->AdvBBcodeBar_imgdefault;
		}

		return $attributes;
	}

	public static function parseTagIgauche_attributes_default(array $tag, $options, $parentClass)
	{

		$default['width'] = $options->AdvBBcodeBar_imgdefault;

		return $default;
	}


//IDROITE + IDROITEX OK (for vB users)

	public static function parseTagIdroite(array $tag, array $rendererStates, &$parentClass)
	{
		$options = XenForo_Application::get('options');

		$formatter['code'] ='<div style="margin:0 0 0 10px;float:right;width:{$width}px;"><a href="{$content}" target="_blank" class="LbTrigger" data-href="index.php?misc/lightbox"><img style="width:{$width}px;" class="bbCodeImage LbImage" src="{$content}" data-src="{$content}" alt=""/></a></div>';

		$formatter['hasoptions'] = true;

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}

	public static function parseTagIdroite_attributes(array $tag, $bboptions, $options, $parentClass)
	{
		$attributes['width'] = $bboptions[0];

		if (!preg_match('#^\d{2,3}$#', $attributes['width']) OR $attributes['width'] > $options->AdvBBcodeBar_imgmax)
		{
			$attributes['width'] = $options->AdvBBcodeBar_imgdefault;
		}

		return $attributes;
	}

	public static function parseTagIdroite_attributes_default(array $tag, $options, $parentClass)
	{

		$default['width'] = $options->AdvBBcodeBar_imgdefault;

		return $default;
	}

//ENCADRE + ENCADREX OK

	public static function parseTagEncadre(array $tag, array $rendererStates, &$parentClass)
	{
		$formatter['code'] = '<div class="advbbcodebar_encadre{$class}" style="float:{$float};width:{$width}{$widthType};">{$abovefieldset}<div class="adv_enc_fieldset">{$title}<div class="adv_enc_content">{$content}</div></div></div>';

		$formatter['hasoptions'] = true;

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}

	public static function parseTagEncadre_attributes(array $tag, $bboptions, $options, $parentClass)
	{
		//Init Default
		$attributes['class'] = '';
		$attributes['abovefieldset'] = '';
		$attributes['title'] = '';
		$title = new XenForo_Phrase('Sedo_AdvBBcodeBar_text_encadre');
		$attributes['float'] = 'right';	
		$attributes['skin2'] = false;

		//Fetch options
		foreach($bboptions as $bboption)
		{
			if (preg_match('#^\d+(%)?$#', $bboption))
			{
				$attributes['width'] = $bboption;
				$attributes['widthType'] = '%';
			}
			elseif (preg_match('#^\d+px$#', $bboption))
			{
				$attributes['width'] = $bboption;
				$attributes['widthType'] = 'px';	
			}
			elseif(preg_match('#^skin2$#', $bboption))
			{
				$attributes['skin2'] = true;
				$attributes['class'] = '_skin2';
			}
			elseif(preg_match('#^fleft$#', $bboption))
			{
				$attributes['float'] = 'left';
			}
			elseif(preg_match('#^fright$#', $bboption))
			{
				$attributes['float'] = 'right';	
			}						
			elseif(!empty($bboption))
			{
				$title = htmlspecialchars($bboption);
	
				/*
					Need to call the ParseMyBBcodesOptions function from the stopautolinking Patch 
					because some html code will be injected after to that option
					
				*/
				if (method_exists($parentClass, 'ParseMyBBcodesOptions'))
				{
					$title =  $parentClass->ParseMyBBcodesOptions($title);
				}
				
			}
		}

		//Width Management
		if (isset($attributes['width']))
		{
			//Easiest way to only get digit and check them
			$attributes['width'] = str_replace(array('px', '%'), '', $attributes['width']);

			if(!preg_match('#^\d{2,3}$#', $attributes['width']))
			{
				$safety['width'] = true;
			}
			
			if($attributes['widthType'] == '%' AND $attributes['width'] > $options->AdvBBcodeBar_encmax)
			{
				$safety['width'] = true;
			} 
			
			if($attributes['widthType'] == 'px' AND $attributes['width'] > $options->AdvBBcodeBar_encmax_px)
			{
				$safety['width'] = true;
			}
		}
		else
		{
			$safety['width'] = true;
		}

		if (isset($safety['width']))
		{
			$attributes['widthType'] = $options->AdvBBcodeBar_encdefault_defaultwidth_unit;
			$attributes['width'] = $options->AdvBBcodeBar_encdefault;
		}


		if ($attributes['skin2'] === true)
		{
			$attributes['title'] = '<div class="adv_enc_title">' . $title . '</div>';
		}
		else
		{
			$attributes['abovefieldset'] = '<div class="adv_enc_abovefieldset">' . $title . '</div>';
		}

		if(isset($attributes['float']) AND $attributes['float'] == 'left')
		{
			if ($attributes['skin2'] === true)
			{
				$marginright = XenForo_Template_Helper_Core::styleProperty('advbbcodebar_encadre_wrapper.margin-right'); 
				$marginleft = XenForo_Template_Helper_Core::styleProperty('advbbcodebar_encadre_wrapper.margin-left');
			}
			else
			{
				$marginright = XenForo_Template_Helper_Core::styleProperty('advbbcodebar_encadre_wrapper_skin2.margin-right'); 
				$marginleft = XenForo_Template_Helper_Core::styleProperty('advbbcodebar_encadre_wrapper_skin2.margin-left');
			}

			$attributes['float'] .= ';margin-left:' . $marginright . ';margin-right:' . $marginleft;
		}


		return $attributes;
	}

	public static function parseTagEncadre_attributes_default(array $tag, $options, $parentClass)
	{
		$default['class'] = '';
		$default['width'] = $options->AdvBBcodeBar_encdefault;
		$default['widthType'] = $options->AdvBBcodeBar_encdefault_defaultwidth_unit;		
		$default['title'] = '';
		$default['abovefieldset'] = '<div class="adv_enc_abovefieldset">' . new XenForo_Phrase('Sedo_AdvBBcodeBar_text_encadre') . '</div>';
		$default['float'] = 'right';
		
		return $default;
	}

//ARTICLE OK

	public static function parseTagArticle(array $tag, array $rendererStates, &$parentClass)
	{
		$formatter['code'] = '<div class="advbbcodebar_article"><fieldset><legend>' . new XenForo_Phrase('Sedo_AdvBBcodeBar_text_article') . '</legend>{$content}</fieldset><div class="adv_source">{$source}</div></div>';

		$formatter['hasoptions'] = true;

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}

	public static function parseTagArticle_attributes(array $tag, $bboptions, $options, $parentClass)
	{

		$source_data = htmlspecialchars($bboptions[0]);
		$source_text = new XenForo_Phrase('Sedo_AdvBBcodeBar_text_source');

		if (preg_match('#^(http|www)#i', $source_data))
		{
			//Let's make the url functionnal (the above htmlspecialchars will cause problems) but for safety let's still use 'strip_tags'
			$source_url = strip_tags(htmlspecialchars_decode($source_data)); 

			$attributes['source']  =  $source_text . '<a class="externalLink" rel="nofollow"  target="_blank" href="' . $source_url . '"> ' . $source_data . '</a>';
		}
		elseif(preg_match('#[\s\S]*({URL=.+?})#i', $source_data, $capture))
		{
			//$source_data = str_replace($capture[1], $capture[1] . $source_text , $source_data);
			//I've changed my mind: better to put off the 'source' text from link
			$source_data =  $source_text . ' ' . $source_data;

			$attributes['source'] = $source_data;
		}
		elseif(!empty($source_data))
		{
			$attributes['source'] = $source_data;
		}

		return $attributes;
	}

	public static function parseTagArticle_attributes_default(array $tag, $options, $parentClass)
	{
		$default['source'] = '';

		return $default;
	}

//JUSTIF BBCODE OK

	public static function parseTagJustif(array $tag, array $rendererStates, &$parentClass)
	{
		$formatter['code'] = '<div style="text-align:justify;margin-right:5px;margin-left:5px;">{$content}</div>';

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}

//FIELDSET BBCODE OK

	public static function parseTagFieldset(array $tag, array $rendererStates, &$parentClass)
	{
		/*
			This IE fix will correct the fieldset display when its legend is too long (for a fielset... it should be very very rare)
			=>On IE6, it will give the correct width to legend with CSS
			=>On IE7, it will fix the display problems with CSS
			=>On other IE, it will fix the legend display problem with a CSS fix or a basic Jquery fix
		*/

		//IE FIX INIT 
		$checkIE67 = Sedo_AdvBBcodeBar_Helper_Sedo::isBadIE('target', '6-7');
		$checkIE = Sedo_AdvBBcodeBar_Helper_Sedo::isBadIE('all');
		$classIE = '';

		if($checkIE67 === true)
		{
			//IE6-IE7
			$formatter['code'] = '<div class="advbbcodebar_fieldset" style="width:{$width}{$widthType};{$blockalign}"><fieldset><legend><span class="advbbcodebar_fieldsetfix">{$title}</span></legend>{$content}</fieldset></div>';
		}
		elseif($checkIE67 === false AND $checkIE === true)
		{
			/*
				ALL IE EXCEPT IE6-IE7

				> {$widthIE} is a CSS fix to avoid to use the Jquery fix if fieldset width is in pixels
				> AdvFieldsetTrigger class calls a Jquery script that will fix the legend width if its bigger than then fieldset width (should occur only if fieldset width is in percentage)
				  The Jquery fix just get the real width of the block [.width()] and apply it to the legend (only if legend width is bigger than block width)
			*/
			
			$formatter['code'] = '<div class="advbbcodebar_fieldset AdvFieldsetTrigger" style="width:{$width}{$widthType};{$blockalign}"><fieldset><legend style="white-space:normal;"><div style="white-space:normal;width:{$widthIE}">{$title}</div></legend>{$content}</fieldset></div>';
		}
		else
		{
			$formatter['code'] = '<div class="advbbcodebar_fieldset" style="width:{$width}{$widthType};{$blockalign}"><fieldset><legend>{$title}</legend>{$content}</fieldset></div>';
		}

		$formatter['hasoptions'] = true;

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}


	public static function parseTagFieldset_attributes(array $tag, $bboptions, $options, $parentClass)
	{

		//Init
		$attributes['title'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_fieldset_title');
		$attributes['blockalign'] = '';			

		foreach($bboptions as $bboption)
		{
			if (preg_match('#^\d+(%)?$#', $bboption))
			{
				$attributes['width'] = $bboption;
				$attributes['widthType'] = '%';
			}
			elseif (preg_match('#^\d+px$#', $bboption))
			{
				$attributes['width'] = $bboption;
				$attributes['widthType'] = 'px';	
			}
			elseif(preg_match('#^bleft$#', $bboption))
			{
				$attributes['blockalign'] = 'margin-right:auto;'; //Used inside function
			}
			elseif(preg_match('#^bcenter$#', $bboption))
			{
				$attributes['blockalign'] = 'margin-left:auto;margin-right:auto;'; //Used inside function
			}
			elseif(preg_match('#^bright$#', $bboption))
			{
				$attributes['blockalign'] = 'margin-left:auto;'; //Used inside function
			}			
			elseif(!empty($bboption))
			{
				$attributes['title'] = htmlspecialchars($bboption);
			}
		}

		//Width Management
		if (isset($attributes['width']))
		{
			//Easiest way to only get digit and check them
			$attributes['width'] = str_replace(array('px', '%'), '', $attributes['width']);

			if(!preg_match('#^\d{2,3}$#', $attributes['width']))
			{
				$safety['width'] = true;
			}
			
			if($attributes['widthType'] == '%' AND $attributes['width'] > $options->AdvBBcodeBar_fieldsetmax)
			{
				$safety['width'] = true;
			} 
			
			if($attributes['widthType'] == 'px' AND $attributes['width'] > $options->AdvBBcodeBar_fieldsetmax_px)
			{
				$safety['width'] = true;
			}
		}
		else
		{
			$safety['width'] = true;
		}

		if (isset($safety['width']))
		{
			$attributes['widthType'] = $options->AdvBBcodeBar_fieldsetdefault_width_unit;
			$attributes['width'] = $options->AdvBBcodeBar_fieldsetdefault;
		}
	
		//IE CSS FIX
		if($attributes['widthType'] == 'px')
		{
			$attributes['widthIE'] = $attributes['width'] . 'px';
		}
		else
		{
			$attributes['widthIE'] = '100%';		
		}


		return $attributes;
	}

	public static function parseTagFieldset_attributes_default(array $tag, $options, $parentClass)
	{
		$default['title'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_fieldset_title');
		$default['width'] = $options->AdvBBcodeBar_fieldsetdefault;
		$default['widthType'] = $options->AdvBBcodeBar_fieldsetdefault_width_unit;
		$default['blockalign'] = '';

		//IE CSS FIX
		if($attributes['widthType'] == 'px')
		{
			$attributes['widthIE'] = $attributes['width'] . 'px';
		}
		else
		{
			$attributes['widthIE'] = '100%';		
		}

		return $default;
	}

//GVIEW BBCODE OK

	public static function parseTagGview(array $tag, array $rendererStates, &$parentClass)
	{

		$options = XenForo_Application::get('options');
		
		if($options->AdvBBcodeBar_gview_width_unit == 'fixed')
		{
			$width = $options->AdvBBcodeBar_gview_width;
		}
		else
		{
			$width = $options->AdvBBcodeBar_gview_width . '%';
		}

		$formatter['code'] = '<iframe src="https://docs.google.com/viewer?{$content}" width="' . $width . '" height="' . $options->AdvBBcodeBar_gview_height . '" style="border: none;"></iframe>';

		if ($options->AdvBBcodeBar_gview_spoilerbox)
		{
			$formatter['wrapper'] = 'spoiler';
			$formatter['wrapper_options'] = '{$caption}';
			$formatter['code'] = self::WrapperBBcode($tag, $rendererStates, $formatter, $parentClass);
		}

		$formatter['hasoptions'] = true;
		$formatter['content_callback'] = 'parseTagGview_content';

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}


	public static function parseTagGview_attributes(array $tag, $bboptions, $options, $parentClass)
	{

		if(!empty($bboptions[0]))
		{
			$attributes['caption'] = htmlspecialchars($bboptions[0]);
		}

		return $attributes;
	}

	public static function parseTagGview_attributes_default(array $tag, $options, $parentClass)
	{
		$default['caption'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_text_gview');

		return $default;
	}

	public static function parseTagGview_content($content)
	{
		if(preg_match('#https://docs\.google\.com/viewer\?(authuser=.+)#i', $content, $url))
		{
			$content = $url[1];
		}
		else
		{
			$content = rawurlencode($content);
			$content = 'url=' . $content . '&embedded=true';
		}

		return $content;
	}

//LATEX BBCODE OK

	public static function parseTagLatex(array $tag, array $rendererStates, &$parentClass)
	{
		$options = XenForo_Application::get('options');

		if (isset($options->AdvBBcodeBar_latex_initcmd))
		{
			$initcmd = $options->AdvBBcodeBar_latex_initcmd; 
			if (!empty($initcmd))
			{
				$initcmd = $initcmd . '%20'; //add final white space %20
			}
		}
		
		$formatter['code'] = '<div class="adv_latex_container" style="width:{$width}{$widthType};{$float}{$blockalign}">{$title}<div class="adv_latex" style="height:{$height};max-height:' . $options->AdvBBcodeBar_latex_maxheight . 'px;"><img src="' . $options->AdvBBcodeBar_latex_link . '?' . $initcmd . '{$content}" /></div></div>';


		$formatter['hasoptions'] = true;

		$formatter['content_callback'] = 'parseTagLatex_content';

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}

	public static function parseTagLatex_attributes(array $tag, $bboptions, $options, $parentClass)
	{
		//Init
		$attributes['title'] = '';
		$attributes['blockalign'] = '';
		$attributes['float'] = '';

		foreach($bboptions as $bboption)
		{
			if (preg_match('#^\d+(px)?$#', $bboption))
			{
				$attributes['width'] = $bboption;
				$attributes['widthType'] = 'px';
			}
			elseif (preg_match('#^\d+%$#', $bboption))
			{
				$attributes['width'] = $bboption;
				$attributes['widthType'] = '%';	
			}
			elseif (preg_match('#^(\d+?(px)?)x(\d+?)$#', $bboption, $matches))
			{
				$attributes['width'] = $matches[1];
				$attributes['widthType'] = 'px';
				$attributes['height'] = $matches[3];				
			}
			elseif (preg_match('#^(\d+?%)x(\d+?)$#', $bboption, $matches))
			{
				$attributes['width'] = $matches[1];
				$attributes['widthType'] = '%';	
				$attributes['height'] = $matches[2];
			}			
			elseif(preg_match('#^bleft$#', $bboption))
			{
				$attributes['blockalign'] = 'margin-right:auto;';
			}
			elseif(preg_match('#^bcenter$#', $bboption))
			{
				$attributes['blockalign'] = 'margin-left:auto;margin-right:auto;';
			}
			elseif(preg_match('#^bright$#', $bboption))
			{
				$attributes['blockalign'] = 'margin-left:auto;margin-right:15px';//Fast fix
			}
			elseif(preg_match('#^fleft$#', $bboption))
			{
				$attributes['float'] = 'float:left;margin-left:2px;margin-right:15px';//Fast fix
			}
			elseif(preg_match('#^fright$#', $bboption))
			{
				$attributes['float'] = 'float:right;margin-left:15px;margin-right:15px';//Fast fix
			}						
			elseif(!empty($bboption))
			{
				$attributes['title'] = '<span class="adv_latex_title">' . htmlspecialchars($bboption) . '</span>';
			}
		}

		//Width Management
		if (isset($attributes['width']))
		{
			//Easiest way to only get digit and check them
			$attributes['width'] = str_replace(array('px', '%'), '', $attributes['width']);

			if(!preg_match('#^\d{2,3}$#', $attributes['width']))
			{
				$safety['width'] = true;
			}
			
			if($attributes['widthType'] == '%' AND $attributes['width'] > $options->AdvBBcodeBar_latex_maxwidth_percent)
			{
				$safety['width'] = true;
			} 
			
			if($attributes['widthType'] == 'px' AND $attributes['width'] > $options->AdvBBcodeBar_latex_maxwidth_px)
			{
				$safety['width'] = true;
			}
		}
		else
		{
			$safety['width'] = true;
		}

		if (isset($safety['width']))
		{
			$attributes['width'] = $options->AdvBBcodeBar_latex_defaultwidth;
			$attributes['widthType'] = $options->AdvBBcodeBar_latex_defaultwidthunit;
		}

		if (!isset($attributes['height']) OR $attributes['height'] > $options->AdvBBcodeBar_latex_maxheight)
		{
			$attributes['height'] = '100%';
		}
		else
		{
			$attributes['height'] .= 'px';
		}

		return $attributes;
	}

	public static function parseTagLatex_attributes_default(array $tag, $options, $parentClass)
	{
		$default['width'] = $options->AdvBBcodeBar_latex_defaultwidth;
		$default['widthType'] = $options->AdvBBcodeBar_latex_defaultwidthunit;
		$default['title'] = '';
		$default['height'] = '100%';
		$default['blockalign'] = '';
		$attributes['float'] = '';		

		return $default;
	}


	public static function parseTagLatex_content($content)
	{
		$content = rawurlencode($content);
		return $content;
	}


//SPOILER BBCODE NEW OK

	//Fully rewritten with noscript compatibility

	public static function parseTagSpoiler(array $tag, array $rendererStates, &$parentClass)
	{
		$options = XenForo_Application::get('options');
		
		$formatter['code'] = '<div class="adv_spoilerbb AdvSpoilerbbCommand" data-easing="' . $options->AdvBBcodeBar_spoilerbb_easing_effect . '" data-duration="' . $options->AdvBBcodeBar_spoilerbb_easing_duration . '"><div class="adv_spoilerbb_title"><span class="adv_spoilerbb_caption">{$caption} </span><noscript><span class="adv_spoilerbb_noscript">' . new XenForo_Phrase('Sedo_AdvBBcodeBar_spoilerbb_noscript') . '</span></noscript><input class="adv_spoiler_display" type="button" value="' . new XenForo_Phrase('Sedo_AdvBBcodeBar_text_display') . '"><input  class="adv_spoiler_hidden" type="button" value="' . new XenForo_Phrase('Sedo_AdvBBcodeBar_text_hide') . '"></div><div class="adv_spoilerbb_content_box"><div class="adv_spoilerbb_content_noscript">{$content}</div></div></div>';
		

		$formatter['hasoptions'] = true;

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}


	public static function parseTagSpoiler_attributes(array $tag, $bboptions, $options, $parentClass)
	{

		if(!empty($bboptions[0]))
		{
			$attributes['caption'] = htmlspecialchars($bboptions[0]);
		}

		return $attributes;
	}

	public static function parseTagSpoiler_attributes_default(array $tag, $options, $parentClass)
	{
		$default['caption'] = new XenForo_Phrase('Sedo_AdvBBcodeBar_text_spoiler');

		return $default;
	}



//WRONG BBCODE (for vb Users) OK

	public static function parseTagWrong(array $tag, array $rendererStates, &$parentClass)
	{
		$formatter['code'] = '<span style="text-decoration:line-through;">{$content}</span>';

		return self::BakeBBcode(__FUNCTION__, $tag, $formatter, $rendererStates, $parentClass);
	}


/*
	!!!!!!!!! BBCODE BUILDER !!!!!!!!!!!!!!
	!!!!!!!!!   Dont touch !  !!!!!!!!!!!!!
*/

	/******
		#BakeBBcode - Main BBcode Builder function.

		You have to use the following variable: $formatter['code'] to setup what you want to do with your bbcode.

		Examples: $formatter['code'] = '<div>{$content}</div>';
		Or if your bbcodes have options: $formatter['code'] = '<div style="width={$width}px">{$content}</div>';

		If your bbcode is using options, you have to:

		1) Use the following command inside the main function of your BB code: $formatter['hasoptions'] = true;
		2) Create two new public static functions:
			 I- One to manage bbcode options ; function name:
			 	[your main bbcode function name] + _attributes
			II- One to setup the default value of these option ; function name:
			 	[your main bbcode function name] + _attributes_default

	***/

	public static function BakeBBcode($attributes_builder, array $tag, array $formatter, $rendererStates, $parentClass)
	{
		$options = XenForo_Application::get('options');

		$attributes['builder'] = $attributes_builder . '_attributes';
		$attributes['default'] = $attributes['builder'] . '_default';

      		if( isset($tag['option']) AND isset($formatter['hasoptions']) )
      		{
      			$formatter['options'] = explode('|', $tag['option']);
      			$formatter['options'] = self::$attributes['builder']($tag, $formatter['options'], $options, $parentClass);
      		}
      		elseif( isset($formatter['hasoptions']))
      		{
      			$formatter['options'] = self::$attributes['default']($tag, $options, $parentClass);
      		}

      		$formatter['content'] = $parentClass->renderSubTree( $tag['children'], $rendererStates);

      		$output = self::BakeFormatter($formatter, $parentClass);


		return $output;
	}


	/******
		#BakeFormatter

		This function will deal with your bbcode options and content.

		You can modified your BBcode content just before it replaces the formatter {$content} variable ;

		To do that, you need to
		1) use this command inside your BBcode main function:$formatter['content_callback'] = 'your_content_callback_name';
		2) create a new function public static function with the above callback name. Example:

			public static function your_content_callback_name($content)
			{
				$content = rawurlencode($content);
				return $content;
			}
	***/


	public static function BakeFormatter(array $formatter, $parentClass)
	{
		if (isset($formatter['options']))
		{
			foreach ($formatter['options'] as $key => $value)
			{
				if (method_exists($parentClass, 'ParseMyBBcodesOptions'))
				{
					$value =  $parentClass->ParseMyBBcodesOptions($value);
					//Fix for htmlspecialchars (no need to make it twice if it has already been done in options management)
					//This fix is now in the new StopAutoLinking Patch but let's put it here. It will be deleted later.
					$value = str_replace(array('&amp;lt;', '&amp;gt;', '&amp;amp;'), array('&lt;', '&gt;', '&amp;'), $value);
				}
				$formatter['code'] = preg_replace('#{\$'. $key . '}#', $value, $formatter['code']);
			}
		}

		if (isset($formatter['content_callback']))
		{
			$formatter['content'] = self::$formatter['content_callback']($formatter['content']);
		}

		$formatter['code'] = preg_replace('#{\$content}#', $formatter['content'], $formatter['code']);

		return $formatter['code'];
	}



	/*******
		#WrapperBBcode

		This function wraps your bbcode inside another of your choice. To do it, you have to code it this way:
		> One command to tell which bbcode you want to use to wrap your bbcode: $formatter['wrapper'] = 'the_wrapper_bbcode'
		> One command to add the bbcode option: $formatter['wrapper_options'] = '{$option}';
		> One command to activate

		Example:

			if ($YOUR_ACTIVATED_WRAPPER_OPTION)
			{
				$formatter['wrapper'] = 'spoiler';
				$formatter['wrapper_options'] = '{$option}';
				$formatter['code'] = self::WrapperBBcode($tag, $rendererStates, $formatter, $parentClass);
			}

		This code has to be added inside your main bbcode function.
	***/

	public static function WrapperBBcode(array $tag, array $rendererStates, array $formatter, $parentClass)
	{
		$wrapper = array();
		$wrapper['tag'] = $formatter['wrapper'];
		$wrapper['original'][0] = '[' . $formatter['wrapper'] . '=' . $formatter['wrapper_options'] . ']';
		$wrapper['original'][1] = '[/' . $formatter['wrapper'] . ']';
		$wrapper['children'][0] = '{$value}';

		if (isset($formatter['wrapper_options']))
		{
			$wrapper['option'] = $formatter['wrapper_options'];
		}

		$baker = $parentClass->replacementMethodRenderer($wrapper, $rendererStates);
		$output = str_replace('{$value}', $formatter['code'], $baker);

		return $output;
	}
}
//Zend_Debug::dump($abc);
?>