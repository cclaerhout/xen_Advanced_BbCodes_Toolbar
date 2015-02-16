!function($, window, document, _undefined)
{    
	XenForo.Atamh = function($element)
	{
		$target = $element.find('fieldset.propertyCss');
		if($target.length != 0)
		{
			var	tab_total = $target.length,
				tab_original_height = parseInt($target.children("div.styleProperty").css( "min-height").replace("px", "")),
				tab_fixed_height,
				tab_over = 16,       
				tab_coeff = 20; // fixed height per supplementary tab

			if(tab_total > tab_over){
				tab_fixed_height = tab_original_height+(tab_total-tab_over)*tab_coeff;
				$target.children("div.styleProperty").css( "min-height", tab_fixed_height );
				$("#propertyScalars").css( "min-height", tab_fixed_height );
			}
		}
	}

	 XenForo.register('#PropertyForm', 'XenForo.Atamh');
}
(jQuery, this, document);