<?php
/*
 * By installing or using this file, you are confirming on behalf of the entity
 * subscribed to the SugarCRM Inc. product ("Company") that Company is bound by
 * the SugarCRM Inc. Master Subscription Agreement ("MSA"), which is viewable at:
 * http://www.sugarcrm.com/master-subscription-agreement
 *
 * If Company is not bound by the MSA, then by installing or using this file
 * you are agreeing unconditionally that Company will be bound by the MSA and
 * certifying that you have authority to bind Company accordingly.
 *
 * Copyright  2004-2013 SugarCRM Inc.  All rights reserved.
 */
$viewdefs['Emails']['base']['view']['compose-addressbook-headerpane'] = array(
    'template' => 'headerpane',
    'title'    => 'LBL_COMPOSE_ADDRESSBOOK',
    'buttons'  => array(
        array(
            'name'      => 'cancel_button',
            'type'      => 'button',
            'label'     => 'LBL_CANCEL_BUTTON_LABEL',
            'css_class' => 'btn-invisible btn-link',
        ),
        array(
            'name'      => 'done_button',
            'type'      => 'button',
            'label'     => 'LBL_DONE_BUTTON_LABEL',
            'css_class' => 'btn-primary',
        ),
        array(
            'name' => 'sidebar_toggle',
            'type' => 'sidebartoggle',
        ),
    ),
);
