<?php

    class Sedo_AdvBBcodeBar_Model_GetStyles extends XenForo_Model
    {
        public function getStylesOptions($selectedStyleIds)
        {

            $Styles = array();
            foreach ($this->getDbStyles() AS $style)
            {
		$Styles[] = array(
		'label' => $style['title'],
		'value' => $style['style_id'],
		'selected' => in_array($style['style_id'], $selectedStyleIds)
                );
            }

        return $Styles;

        }

        public function getDbStyles()
        {

            return $this->_getDb()->fetchAll('
		SELECT style_id, title
		FROM xf_style
		WHERE style_id
		ORDER BY style_id
            ');

        }

    }
    
    
