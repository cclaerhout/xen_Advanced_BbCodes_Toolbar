<?php

	class Sedo_AdvBBcodeBar_Option_Factory
	{

		public static function render_usergroups(XenForo_View $view, $fieldPrefix, array $preparedOption, $canEdit)
		{
			$preparedOption['formatParams'] = XenForo_Model::create('Sedo_AdvBBcodeBar_Model_GetUsergroups')->getUserGroupOptions($preparedOption['option_value']);

			return XenForo_ViewAdmin_Helper_Option::renderOptionTemplateInternal('option_list_option_checkbox', $view, $fieldPrefix, $preparedOption, $canEdit);

		}
		public static function render_styles(XenForo_View $view, $fieldPrefix, array $preparedOption, $canEdit)
		{

			$preparedOption['formatParams'] = XenForo_Model::create('Sedo_AdvBBcodeBar_Model_GetStyles')->getStylesOptions($preparedOption['option_value']);

			return XenForo_ViewAdmin_Helper_Option::renderOptionTemplateInternal('option_list_option_checkbox', $view, $fieldPrefix, $preparedOption, $canEdit);

		}
		
		public static function render_buttons(XenForo_View $view, $fieldPrefix, array $preparedOption, $canEdit)
		{
			$choices = $preparedOption['option_value'];
			$editLink = $view->createTemplateObject('option_list_option_editlink', array(
				'preparedOption' => $preparedOption,
				'canEditOptionDefinition' => $canEdit
			));

			return $view->createTemplateObject('option_template_sedoAdvBBcodes_buttons', array(
				'fieldPrefix' => $fieldPrefix,
				'listedFieldName' => $fieldPrefix . '_listed[]',
				'preparedOption' => $preparedOption,
				'formatParams' => $preparedOption['formatParams'],
				'editLink' => $editLink,

				'choices' => $choices,
				'nextCounter' => count($choices) + 1
			));
		}
		
		public static function verify_buttons(array &$buttons, XenForo_DataWriter $dw, $fieldName)
		{
			$debug = false;
			
			if($debug === true)
			{
				Zend_Debug::dump($buttons);
			}

			$max = array();
			$buttons_raw = $buttons;
			$buttons_save = $buttons;			
			
			/*
				I-Check PARAMETERS and correct them if needed
			*/
			foreach ($buttons_raw AS $key => &$button)
			{
				if (empty($button['tag']))
				{
					unset($buttons_raw[$key]);
				}
				else
				{
					//Check TAG
					$button['tag'] = preg_replace('#[^\w\#]#i', '', $button['tag']);
					$button['tag'] = strtolower($button['tag']);

					//Check DUPLICATED TAGS
					if($button['tag'] != 'separator')
					{
						$p = 0;
						$counter = array();
						while($p < $key)
						{
							if(isset($buttons_save[$p]['tag']) AND $buttons_save[$p]['tag'] == $button['tag'])
							{
								$counter[] = true;
							}
							$p++;
						}
						$counter = count($counter);
					
						if(!empty($counter))
						{
						$button['tag'] .= "#$counter";
						}
					}
					
					//Check OPTION
					if(isset($button['option']) AND !empty($button['option']))
					{
						$button['option'] = preg_replace('#[\[\]=]#i', '', $button['option']);				
					}					

					//Check ORDER
					if(ctype_digit($button['order']))
					{
						$button['order'] = intval($button['order']);
					}
					
					//Preparation for step II
					if(is_int($button['order']))
					{
						$max[] = $button['order'];
					}
				}
			}

			if($debug === true)
			{
				Zend_Debug::dump($buttons_raw);
			}


			/*
				II- Manage max order value and create value for blank fields
			*/

			if(!empty($max))
			{
				$i = max($max) + 1;
			}
			else
			{
				$i = 1;
			}
			
			unset($button);
			foreach ($buttons_raw AS &$button)
			{			
				if( !empty($button['tag']) AND (empty($button['order']) OR !is_int($button['order'])) )
				{
					$button['order'] = $i;
					$i++;
				}
			}			

			if($debug === true)
			{
				Zend_Debug::dump($buttons_raw);
			}


			/*
				III- SORT LIST
			*/
			
			$buttons_final = array();
			unset($button); // Important !
			
			foreach ($buttons_raw AS $button)
			{
				if( !empty($button['tag']))
				{
					$i = $button['order'];
					while(isset($buttons_final[$i]))
					{
						$i++;
					}
					$buttons_final[$i] = $button;
				}
			}

			if($debug === true)
			{			
				Zend_Debug::dump($buttons_final);
				break;
			}
			

			/*
				IV- FINAL
			*/
			ksort($buttons_final);
			$buttons_final = array_values($buttons_final);
			$buttons = $buttons_final;
			return true;
		}				
	}