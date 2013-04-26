<?php

class Sedo_AdvBBcodeBar_Controller_Editor extends XFCP_Sedo_AdvBBcodeBar_Controller_Editor
{
	public function actionPicasa()
	{
		$url = $this->_input->filterSingle('source', XenForo_Input::STRING);
	    	$url = urldecode($url);
	  	$xenOptions = XenForo_Application::get('options');
		$grabber = $xenOptions->sedo_adv_picasa_grabber;

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
	      					$error = new XenForo_Phrase('sedo_adv_picasa_error_rss_not_found');
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
	      					$error = new XenForo_Phrase('sedo_adv_picasa_error_img_problem');
	      				}
	      			}
	      		}
	      		else
	      		{
	      			$error = new XenForo_Phrase('sedo_adv_picasa_error_not_picasa_url');
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
	      			$error = new XenForo_Phrase('sedo_adv_picasa_error_dont_use_direct_link');
	      		}
	      		else
	      		{
	      			//The url is neither a RSS Picassa URL, nor even a Picassa URL...
	      			$error = new XenForo_Phrase('sedo_adv_picasa_error_use_picasa_url');
	      		}
	      	}

		if ( empty($error) )
		{
			$viewParams = array('URL_OK' => nl2br($url));
		}
		else
		{
			$viewParams['URL_NOT_OK'] = $error;		
		}

		return $this->responseView('Sedo_AdvBBcodeBar_ViewPublic_Editor_Picasa', '', $viewParams);
	}
}