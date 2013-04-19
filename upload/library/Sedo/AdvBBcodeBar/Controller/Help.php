<?php

class Sedo_AdvBBcodeBar_Controller_Help extends XFCP_Sedo_AdvBBcodeBar_Controller_Help
{
	public function actionBbCodes()
	{
		$response = parent::actionBbCodes();
		$options = XenForo_Application::get('options');

		if(isset($options->AdvBBcodeBar_hide_oldies) AND !empty($options->AdvBBcodeBar_hide_oldies))
		{
			if(isset($response->subView->params['customBbCodes']['igauche']))
			{
				unset($response->subView->params['customBbCodes']['igauche']);
			}

			if(isset($response->subView->params['customBbCodes']['igauchex']))
			{
				unset($response->subView->params['customBbCodes']['igauchex']);
			}

			if(isset($response->subView->params['customBbCodes']['idroite']))
			{
				unset($response->subView->params['customBbCodes']['idroite']);
			}

			if(isset($response->subView->params['customBbCodes']['idroitex']))
			{
				unset($response->subView->params['customBbCodes']['idroitex']);
			}

			if(isset($response->subView->params['customBbCodes']['bimgx']))
			{
				unset($response->subView->params['customBbCodes']['bimgx']);
			}

			if(isset($response->subView->params['customBbCodes']['encadrex']))
			{
				unset($response->subView->params['customBbCodes']['encadrex']);
			}

			if(isset($response->subView->params['customBbCodes']['wrong']))
			{
				unset($response->subView->params['customBbCodes']['wrong']);
			}			
		}

		return $response;
	}
}