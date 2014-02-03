<?php

/*
 * By installing or using this file, you are confirming on behalf of the entity
 * subscribed to the SugarCRM Inc. product ("Company") that Company is bound by
 * the SugarCRM Inc. Master Subscription Agreement (“MSA”), which is viewable at:
 * http://www.sugarcrm.com/master-subscription-agreement
 *
 * If Company is not bound by the MSA, then by installing or using this file
 * you are agreeing unconditionally that Company will be bound by the MSA and
 * certifying that you have authority to bind Company accordingly.
 *
 * Copyright  2004-2013 SugarCRM Inc.  All rights reserved.
 */

$viewdefs['Reports']['base']['view']['list'] = array(
    'panels' => array(
        array(
            'name' => 'panel_header',
            'label' => 'LBL_PANEL_1',
            'fields' => array(
                array (
                    'name'  => 'name',
                    'label' => 'LBL_REPORT_NAME',
                    'link' => true,
                    'enabled' => true,
                    'default' => true,
                ),
                array (
                    'name'  => 'module',
                    'label' => 'LBL_MODULE',
                    'default' => true,
                ),
                array(
                    'name' => 'report_type',
                    'label' => 'LBL_REPORT_TYPE',
                    'type' => 'enum',
                    'options' => 'dom_report_types',
                    'default' => true,
                ),
                array (
                    'name'  => 'assigned_user_name',
                    'label' => 'LBL_LIST_ASSIGNED_USER',
                    'default' => true,
                    'sortable' => false,
                ),
                array (
                    'name'  => 'date_entered',
                    'label' => 'LBL_DATE_ENTERED',
                    'default' => true,
                    'readonly' => true,
                ),
            ),
        ),
    ),
);
