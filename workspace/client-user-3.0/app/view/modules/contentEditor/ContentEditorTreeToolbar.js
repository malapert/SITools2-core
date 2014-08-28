/*******************************************************************************
 * Copyright 2010-2014 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
 * 
 * This file is part of SITools2.
 * 
 * SITools2 is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * SITools2 is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * SITools2. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
/*global Ext, sitools, i18n, loadUrl, projectGlobal */

Ext.namespace('sitools.user.view.modules.contentEditor');
/**
 * Toolbar used in the cms
 * @class sitools.user.view.modules.contentEditor.ContentEditorTreeToolbar
 * @cfg cms the parent cms of the toolbar
 * @cfg textTooltip the text tooltip for the copy button
 * @cfg allowDataPublish display or not publish button
 * @extends Ext.Toolbar
 */
Ext.define('sitools.user.view.modules.contentEditor.ContentEditorTreeToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	
    initComponent : function () {
        var storeLanguage = Ext.create('Ext.data.JsonStore', {
            fields : [ 'text', 'locale']
        });
        
        var jsonLanguage = [];
        Ext.each(Project.languages, function (language) {
            jsonLanguage.push({
                text : language.displayName,
                locale : language.localName
            });
        });
        
        storeLanguage.loadData(jsonLanguage);
        
        this.comboLanguage = Ext.create('Ext.form.field.ComboBox', {
            store : storeLanguage,
            displayField : 'text',
            valueField : 'locale',
            typeAhead : true,
            queryMode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : i18n.get('label.selectLanguage'),
            selectOnFocus : true,
            width : 100,
            listeners : {
                scope : this,
                select : function (combo, recs, index) {
                    var locale = recs[0].data.locale;
                    this.cms.changeLanguage(locale);
                }
            }
        });
        
        this.comboLanguage.setValue(locale.getLocale());
        
        this.labelUpToDate = Ext.create('Ext.form.Label');
        
        this.items = [ this.comboLanguage, '->', 
                       this.labelUpToDate, "&nbsp;",
	        {
	            xtype : 'button',
	            iconAlign : 'right',
	            icon : loadUrl.get('APP_URL') + '/common/res/images/icons/refresh.png',
	            tooltip : i18n.get('label.refresh'),
	            scope : this.cms,
	            handler : this.cms.refreshTree
	        }, {
	            xtype : 'button',
	            iconAlign : 'right',
	            text : i18n.get('label.storageRunCopy'),
	            icon : loadUrl.get('APP_URL') + '/common/res/images/icons/converter.png',
	            tooltip : this.textTooltip,
	            scope : this.cms,
	            hidden : !this.allowDataPublish, // if false, publishing is allowed
	            handler : this.cms.runCopy
	        }];
    
        this.callParent(arguments);
    },
    

    setTreeUpToDate : function (upToDate, dateStr) {
        var date = Ext.Date.parse(dateStr, SITOOLS_DEFAULT_IHM_DATE_FORMAT);
        if (!upToDate) {
            this.labelUpToDate.update(String.format("<span class='sitools-userProfile-warning-text'>{0}{1}</span>", i18n.get("label.lastUpdate"), date));
            this.labelUpToDate.addClass("x-status-warning");
        } else {
            this.labelUpToDate.update(String.format("<span>{0}{1}</span>", i18n.get("label.lastUpdate"), date));
            this.labelUpToDate.removeClass("x-status-warning");
        }
        
    }
    
    
});