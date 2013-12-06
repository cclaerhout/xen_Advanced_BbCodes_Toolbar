<?php
class Sedo_AdvBBcodeBar_Listener_View
{
	public static function rm_resource_description($class, array &$extend)
	{
		if ($class == 'XenResource_ViewPublic_Resource_Description')
		{
			$extend[] = 'Sedo_AdvBBcodeBar_XenResource_ViewPublic_Resource_Description';
		}
	} 
}
