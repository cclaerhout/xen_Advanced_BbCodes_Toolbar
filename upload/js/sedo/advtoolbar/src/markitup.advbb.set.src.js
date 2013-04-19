//Advanced BBCodes Toolbar buttons set for for XenForo MarkItUp
//By Cédric CLAERHOUT

(function($) {
	XenForo.miuAdvBB = {
		picasaManager: function(miu)
		{
			XenForo.MiuFramework._overlay_callbacks(XenForo.miuAdvBB, miu, 'picasaManager_ontrigger');
			XenForo.ajax('index.php?editor/miu-dialog',  { dialog: 'Adv_Picasa'}, XenForo.MiuFramework._overlay_success);
		},
		picasaManager_ontrigger: function(miu, inputs)
		{
			AdvPicasaDialog.submit(inputs, 'isMiu');
		},
		latexManager: function(miu)
		{
			XenForo.MiuFramework._overlay_callbacks(XenForo.miuAdvBB, miu, 'latexManager_ontrigger');
			XenForo.ajax('index.php?editor/miu-dialog',  { dialog: 'Adv_Latex'}, XenForo.MiuFramework._overlay_success);
		},
		latexManager_ontrigger: function(miu, inputs)
		{
			AdvLatexDialog.submit(inputs, 'isMiu');
		},
		fieldsetManager: function(miu)
		{
			XenForo.MiuFramework._overlay_callbacks(XenForo.miuAdvBB, miu, 'fieldsetManager_ontrigger');
			XenForo.ajax('index.php?editor/miu-dialog',  { dialog: 'Adv_Fieldset'}, XenForo.MiuFramework._overlay_success);
		},
		fieldsetManager_ontrigger: function(miu, inputs)
		{
			AdvFieldsetDialog.submit(inputs, 'isMiu');
		},
		encManager: function(miu)
		{
			XenForo.MiuFramework._overlay_callbacks(XenForo.miuAdvBB, miu, 'encManager_ontrigger');
			XenForo.ajax('index.php?editor/miu-dialog',  { dialog: 'Adv_Enc'}, XenForo.MiuFramework._overlay_success);
		},
		encManager_ontrigger: function(miu, inputs)
		{
			AdvEncDialog.submit(inputs, 'isMiu');
		},
		articleManager: function(miu)
		{
			XenForo.MiuFramework._overlay_callbacks(XenForo.miuAdvBB, miu, 'articleManager_ontrigger');
			XenForo.ajax('index.php?editor/miu-dialog',  { dialog: 'Adv_Article'}, XenForo.MiuFramework._overlay_success);
		},
		articleManager_ontrigger: function(miu, inputs)
		{
			AdvArticleDialog.submit(inputs, 'isMiu');
		},
		bimgManager: function(miu)
		{
			XenForo.MiuFramework._overlay_callbacks(XenForo.miuAdvBB, miu, 'bimgManager_ontrigger');
			XenForo.ajax('index.php?editor/miu-dialog',  { dialog: 'Adv_Bimg'}, XenForo.MiuFramework._overlay_success);
		},
		bimgManager_ontrigger: function(miu, inputs)
		{
			AdvBimgDialog.submit(inputs, 'isMiu');
		},
		accordionManager: function(miu)
		{
			XenForo.MiuFramework._overlay_callbacks(XenForo.miuAdvBB, miu, 'accordionManager_ontrigger');
			XenForo.ajax('index.php?editor/miu-dialog',  { dialog: 'Adv_Accordion'}, XenForo.MiuFramework._overlay_success);
		},
		accordionManager_ontrigger: function(miu, inputs)
		{
			AdvAccordionDialog.submit(inputs, 'isMiu');
		}
	};
})(jQuery);