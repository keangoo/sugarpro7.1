{*
/*********************************************************************************
 * By installing or using this file, you are confirming on behalf of the entity
 * subscribed to the SugarCRM Inc. product ("Company") that Company is bound by
 * the SugarCRM Inc. Master Subscription Agreement (“MSA”), which is viewable at:
 * http://www.sugarcrm.com/master-subscription-agreement
 *
 * If Company is not bound by the MSA, then by installing or using this file
 * you are agreeing unconditionally that Company will be bound by the MSA and
 * certifying that you have authority to bind Company accordingly.
 *
 * Copyright (C) 2004-2013 SugarCRM Inc.  All rights reserved.
 ********************************************************************************/

*}
<script type="text/javascript" src='{sugar_getjspath file="include/SugarFields/Fields/Address/SugarFieldAddress.js"}'></script>
{{assign var="key" value=$displayParams.key|upper}}
{{assign var="street" value=$displayParams.key|cat:'_address_street'}}
{{assign var="city" value=$displayParams.key|cat:'_address_city'}}
{{assign var="state" value=$displayParams.key|cat:'_address_state'}}
{{assign var="country" value=$displayParams.key|cat:'_address_country'}}
{{assign var="postalcode" value=$displayParams.key|cat:'_address_postalcode'}}
<legend>{sugar_translate label='LBL_{{$key}}_ADDRESS' module='{{$module}}'}</legend>
<table border="0" cellspacing="1" cellpadding="0" class="edit" width="100%">
<tr>
<td valign="top" id="{{$street}}_label" width='25%' scope='row' >
{sugar_translate label='LBL_STREET' module='{{$module}}'}:
{if $fields.{{$street}}.required || {{if $street|lower|in_array:$displayParams.required}}true{{else}}false{{/if}}}
<span class="required">{$APP.LBL_REQUIRED_SYMBOL}</span>
{/if}
</td>
<td width="*">
{{if $displayParams.maxlength}}
<textarea id="{{$street}}" name="{{$street}}" maxlength="{{$displayParams.maxlength}}" rows="{{$displayParams.rows|default:4}}" cols="{{$displayParams.cols|default:60}}" tabindex="{{$tabindex}}">{$fields.{{$street}}.value}</textarea> 
{{else}}
<textarea id="{{$street}}" name="{{$street}}" rows="{{$displayParams.rows|default:4}}" cols="{{$displayParams.cols|default:60}}" tabindex="{{$tabindex}}">{$fields.{{$street}}.value}</textarea> 
{{/if}}
</td> 
</tr> 
 
<tr> 
 
<td id="{{$city}}_label" width='{{$def.templateMeta.widths[$smarty.foreach.colIteration.index].label}}%' scope='row' > 
{sugar_translate label='LBL_CITY' module='{{$module}}'}:
{if $fields.{{$city}}.required || {{if $city|lower|in_array:$displayParams.required}}true{{else}}false{{/if}}}
<span class="required">{$APP.LBL_REQUIRED_SYMBOL}</span> 
{/if}
</td> 
<td> 
<input type="text" name="{{$city}}" id="{{$city}}" size="{{$displayParams.size|default:30}}" {{if !empty($vardef.len)}}maxlength='{{$vardef.len}}'{{/if}} value='{$fields.{{$city}}.value}' tabindex="{{$tabindex}}"> 
</td> 
</tr>

<tr>
    <td id="{{$state}}_label" width='{{$def.templateMeta.widths[$smarty.foreach.colIteration.index].label}}%' scope='row' >
        <label for='{{$state}}'>{sugar_translate label='LBL_STATE' module='{{$module}}'}:</label>
    {if $fields.{{$state}}.required || {{if $state|lower|in_array:$displayParams.required}}true{{else}}false{{/if}}}
        <span class="required">{$APP.LBL_REQUIRED_SYMBOL}</span>
    {/if}
    </td>
    <td>
        <input type="text" name="{{$state}}" id="{{$state}}" size="{{$displayParams.size|default:30}}" {{if !empty($vardef.len)}}maxlength='{{$vardef.len}}'{{/if}} value='{$fields.{{$state}}.value}'  {{if !empty($tabindex)}} tabindex="{{$tabindex}}" {{/if}}>
    </td>
</tr>
 
<tr> 
 
<td id="{{$postalcode}}_label" width='{{$def.templateMeta.widths[$smarty.foreach.colIteration.index].label}}%' scope='row' > 
 
{sugar_translate label='LBL_POSTAL_CODE' module='{{$module}}'}:
{if $fields.{{$postalcode}}.required || {{if $postalcode|lower|in_array:$displayParams.required}}true{{else}}false{{/if}}}
<span class="required">{$APP.LBL_REQUIRED_SYMBOL}</span> 
{/if}
</td> 
<td> 
<input type="text" name="{{$postalcode}}" id="{{$postalcode}}" size="{{$displayParams.size|default:30}}" {{if !empty($vardef.len)}}maxlength='{{$vardef.len}}'{{/if}} value='{$fields.{{$postalcode}}.value}' tabindex="{{$tabindex}}"> 
</td> 
</tr> 
 
<tr> 
 
<td id="{{$country}}_label" width='{{$def.templateMeta.widths[$smarty.foreach.colIteration.index].label}}%' scope='row' > 
 
{sugar_translate label='LBL_COUNTRY' module='{{$module}}'}:
{if $fields.{{$country}}.required || {{if $country|lower|in_array:$displayParams.required}}true{{else}}false{{/if}}}
<span class="required">{$APP.LBL_REQUIRED_SYMBOL}</span> 
{/if}
</td> 
<td> 
<input type="text" name="{{$country}}" id="{{$country}}" size="{{$displayParams.size|default:30}}" {{if !empty($vardef.len)}}maxlength='{{$vardef.len}}'{{/if}} value='{$fields.{{$country}}.value}' tabindex="{{$tabindex}}"> 
</td> 
</tr> 
 
{{if $displayParams.copy}}
<tr> 
<td scope='row' NOWRAP> 
{sugar_translate label='LBL_COPY_ADDRESS_FROM_LEFT' module=''}:
</td> 
<td> 
<input id="{{$displayParams.key}}_checkbox" name="{{$displayParams.key}}_checkbox" type="checkbox" onclick="syncFields('{{$displayParams.copy}}', '{{$displayParams.key}}');"> 
</td> 
</tr> 
{{else}}
<tr> 
<td colspan='2' NOWRAP>&nbsp;</td>
</tr> 
{{/if}}
</table> 
</fieldset> 
<script type="text/javascript"> 
    var fromKey = '{{$displayParams.copy}}';
    var toKey = '{{$displayParams.key}}';
    var checkbox = toKey + "_checkbox";
    var obj = new TestCheckboxReady(checkbox);
</script> 
</textarea> 