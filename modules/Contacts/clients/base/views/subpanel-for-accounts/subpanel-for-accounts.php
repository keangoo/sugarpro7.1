<?php
/*
 * By installing or using this file, you are confirming on behalf of the entity
 * subscribed to the SugarCRM Inc. product ("Company") that Company is bound by
 * the SugarCRM Inc. Master Subscription Agreement (\“MSA\”), which is viewable at:
 * http://www.sugarcrm.com/master-subscription-agreement
 *
 * If Company is not bound by the MSA, then by installing or using this file
 * you are agreeing unconditionally that Company will be bound by the MSA and
 * certifying that you have authority to bind Company accordingly.
 *
 * Copyright  2004-2013 SugarCRM Inc.  All rights reserved.
 */
$viewdefs['Contacts']['base']['view']['subpanel-for-accounts'] = array(
  'type' => 'subpanel-list',
  'panels' =>
  array(
    array(
      'name' => 'panel_header',
      'label' => 'LBL_PANEL_1',
      'fields' =>
      array(
        array(
            'name' => 'full_name',
            'type' => 'fullname',
            'fields' => array(
                'salutation',
                'first_name',
                'last_name',
            ),
            'link' => true,
          'css_class' => 'full-name',
          'width' =>  49,
          'label' => 'LBL_LIST_NAME',
          'enabled' => true,
          'default' => true,
        ),
        array(
          'name' => 'primary_address_city',
          'label' => 'LBL_LIST_CITY',
          'enabled' => true,
          'default' => true,
        ),
        array(
          'name' => 'primary_address_state',
          'label' => 'LBL_LIST_STATE',
          'enabled' => true,
          'default' => true,
        ),
        array(
          'name' => 'email',
          'label' => 'LBL_LIST_EMAIL',
          'enabled' => true,
          'default' => true,
          'sortable' => false,
        ),
        array(
          'name' => 'phone_work',
          'label' => 'LBL_LIST_PHONE',
          'enabled' => true,
          'default' => true,
        ),
      ),
    ),
  ),
);
