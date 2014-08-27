/***************************************
* Copyright 2010-2014 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
* 
* This file is part of SITools2.
* 
* SITools2 is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* SITools2 is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with SITools2.  If not, see <http://www.gnu.org/licenses/>.
***************************************/
/*global Ext, sitools, i18n, document, projectGlobal, SitoolsDesk, userLogin, DEFAULT_PREFERENCES_FOLDER, loadUrl*/
/*
 */

Ext.namespace('sitools.user.view.component.datasets.services');

Ext.define('sitools.user.view.component.datasets.services.ServiceToolbarView', {
    extend : 'Ext.toolbar.Toolbar',
    
    config : {
        store : null,
        guiServiceStore : null
    },
    border : false,
    
    initComponent : function () {
        var store = Ext.create("sitools.user.store.DatasetServicesStore", {
            datasetUrl : this.datasetUrl  
        });
        
        this.setStore(store);
        
        store.load({
            scope : this,
            callback : this.onLoadServices
        });
        
        
        var guiServiceStore = Ext.create("sitools.user.store.GuiServicesStore", {
            datasetUrl : this.datasetUrl 
        });
        
        this.setGuiServiceStore(guiServiceStore);
        
        guiServiceStore.load();
        
        this.callParent(arguments);
    },
    
    afterRenderToolbar : function (grid) {
        var customToolbarButtons = grid.getCustomToolbarButtons();
        var toolbar = grid.getDockedItems('toolbar[dock="top"]')[0];
        toolbar.add(customToolbarButtons);
    },
    
    onLoadServices : function (records, operation, success) {
        
        records = this.sortServices(records);
        
        var icon, category, menu = this, btn = {};
        Ext.each(records, function (item) {
            menu = this;
            
            if (item instanceof Ext.toolbar.Item || !this.isService(item)) {
                menu.add(item);
                return;
            }
            
            if (!item.get('visible')) {
                return;
            }
            
            if (!this.isSelectionOK(item.get('dataSetSelection'))) {
                return;
            }
            
            if (!Ext.isEmpty(category = item.get('category'))) {
                menu = this.getMenu(category);
            }
            
            
            if (!Ext.isEmpty(icon = item.get('icon'))) {
                Ext.apply(btn, {
                    iconCls : 'btn-format-icon',
                    icon : icon
                });
            }
            
            Ext.apply(btn, {
                idService : item.get('id'),
                typeService : item.get('type'),
                text : i18n.get(item.get('label')),
                cls : 'services-toolbar-btn',
                icon : icon
            });
            
            menu.add(btn);
            
            if (this.id === menu.id) {
                this.add(' ');
            }
            
        }, this);
    },
    
    /**
     * Update the toolbar according to the dataview selection 
     */
    updateContextToolbar : function () {
        if (this.store.getTotalCount() === 0) {
            return;
        }
        
        var records = [];
        this.removeAll();
        
        this.store.each(function (rec) {
            records.push(rec); 
        });
        this.onLoadServices(records);
    },
    
    isService : function (item) {
        return item instanceof sitools.user.model.DatasetServicesModel;
    },
    
    getMenu : function (category) {
        var buttonSearch = this.down('button[category=' + category + ']');
        var button;
        if (Ext.isEmpty(buttonSearch)) {
            button = new Ext.Button({
                category : category,
                text : category,
                cls : 'services-toolbar-btn',
                menu : new Ext.menu.Menu({
                	border : false,
                    showSeparator : false
                }),
                iconAlign : "right",
                clickEvent : 'mousedown'
            });
            this.add(button);
            this.add(' ');
        } else {
            button = buttonSearch;
        }
        return button.menu;
    },
    
    /**
     * Sort all services in the right order before being displayed
     * @param records
     *          
     * @returns Tab of records
     */
    sortServices : function (records) {
        var tbRight = [], tb = [];
        tb.push(this.addAdditionalButton());
        Ext.each(records, function (item) {
            if (item.get('position') === 'left' || Ext.isEmpty(item.get('position'))) {
                tb.push(item);
            } else {
                tbRight.push(item);
            }
        });
        tb.push(Ext.create("Ext.toolbar.Fill"));
        
        return tb.concat(tbRight);
    },
    
    /**
     * Return a array with the column filter button
     */
    addAdditionalButton : function () {
        var dataview = this.up('livegridView');
        return dataview.getCustomToolbarButtons();
    },
    
    /**
     * Return true if the datasetSelection match the dataview selection
     * 
     * @param selectionString
     *          the datasetSelection string (NONE, SINGLE, MULTIPLE, ALL)
     * @returns {Boolean}
     */
    isSelectionOK : function (selectionString) {
        var selectionOK = false;
        var dataview = this.up('livegridView');
        var nbRowsSelected = dataview.getNbRowsSelected();
        switch (selectionString) {

        case "NONE":
            selectionOK = true;            
            break;
            
        case "SINGLE":
            if (!Ext.isEmpty(nbRowsSelected) && nbRowsSelected === 1) {
                selectionOK = true;
            }
            break;
            
        case "MULTIPLE":
            if (!Ext.isEmpty(nbRowsSelected) && nbRowsSelected >= 1) {
                selectionOK = true;
            }
            break;
            
        case "ALL":
            if (!Ext.isEmpty(nbRowsSelected) && dataview.isAllSelected()) {
                selectionOK = true;
            }
            break;
        }
        return selectionOK;
    }
    
    
    
    
});
