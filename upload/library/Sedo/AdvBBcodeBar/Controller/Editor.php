<?php

class Sedo_AdvBBcodeBar_Controller_Editor extends XFCP_Sedo_AdvBBcodeBar_Controller_Editor
{
	public function actionPicasa()
	{
		$url = $this->_input->filterSingle('source', XenForo_Input::STRING);

		if (method_exists('Sedo_Picasa_BbCode_Formatter_Picasa', 'MatchPicasaUrl'))
		{
			$result = Sedo_Picasa_BbCode_Formatter_Picasa::MatchPicasaUrl($url);
			
			if ($result['type'] == 'error')
			{
				if ($result['code'] == 'code1')
				{
					$error_message = new XenForo_Phrase('Sedo_Picasa_Code1');
				}
				elseif ($result['code'] == 'code2')
				{
					$error_message = new XenForo_Phrase('Sedo_Picasa_Code2');
				}
				elseif ($result['code'] == 'code3')
				{
					$error_message = new XenForo_Phrase('Sedo_Picasa_Code3');
				}
				elseif ($result['code'] == 'code4')
				{
					$error_message = new XenForo_Phrase('Sedo_Picasa_Code4');
				}
				elseif ($result['code'] == 'code5')
				{
					$error_message = new XenForo_Phrase('Sedo_Picasa_Code5');
				}
			}
		}
		else
		{
			$error_message = new XenForo_Phrase('Sedo_AdvBBcodeBar_php_picasa_filesunvailable');
		}

		if ( empty($error_message) )
		{
			$viewParams = array('URL_OK' => nl2br($url));
		}
		else
		{
			$viewParams['URL_NOT_OK'] = $error_message;		
		}

		return $this->responseView('Sedo_AdvBBcodeBar_ViewPublic_Editor_Picasa', '', $viewParams);
	}
}