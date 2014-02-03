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

$module_name = 'Leads';
$viewdefs[$module_name]['base']['menu']['quickcreate'] = array(
    'layout' => 'create',
    'label' => 'LNK_NEW_LEAD',
    'visible' => true,
    'related' => array(
        array(
            'module' => 'Accounts',
            'link' => 'leads',
        ),
        array(
            'module' => 'Contacts',
            'link' => 'leads',
        ),
        array(
            'module' => 'Opportunities',
            'link' => 'leads',
        ),
    ),
);
