<?php

class Sedo_AdvBBcodeBar_ViewPublic_Editor_Picasa extends XenForo_ViewPublic_Base
{
	public function renderJson()
	{
		return XenForo_ViewRenderer_Json::jsonEncodeForOutput($this->_params);
	}
}