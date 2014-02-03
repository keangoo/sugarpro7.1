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

$module_name = 'OAuthKeys';
$viewdefs[$module_name]['base']['menu']['header'] = array(
    array(
        'route' => "#bwc/index.php?module=$module_name&action=EditView&return_module=$module_name&return_action=DetailView",
        'label' => 'LNK_NEW_RECORD',
        'acl_action' => 'create',
        'acl_module' => $module_name,
        'icon' => 'icon-plus',
    ),
    array(
        'route' => "#bwc/index.php?module=$module_name&action=index",
        'label' => 'LNK_LIST',
        'acl_action' => 'list',
        'acl_module' => $module_name,
        'icon' => 'icon-reorder',
    ),
);
