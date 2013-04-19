<?php
class Sedo_AdvBBcodeBar_Listener_Controller
{
    public static function listenController($class, array &$extend)
    {
      	if ($class == 'XenForo_ControllerPublic_Help')
      	{
		$extend[] = 'Sedo_AdvBBcodeBar_Controller_Help';
      	}
      	if ($class == 'XenForo_ControllerPublic_Editor')
      	{
		$extend[] = 'Sedo_AdvBBcodeBar_Controller_Editor';
      	}      	
    } 
}
