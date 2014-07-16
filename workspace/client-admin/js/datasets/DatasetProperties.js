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
/*global Ext, sitools, SITOOLS_DEFAULT_IHM_DATE_FORMAT, ID, i18n, document, showResponse, alertFailure, LOCALE, ImageChooser*/
Ext.namespace('sitools.admin.datasets');


/**
 * Define the dataset properties gridPanel 
 * @class sitools.admin.datasets.datasetProperties
 * @extends Ext.grid.GridPanel
 */
// ExtJS4.3 'Ext.grid.EditorGridPanel'
Ext.define('sitools.admin.datasets.datasetProperties', { 
    extend : 'Ext.grid.Panel',
    
    initComponent : function () {
		
		var storeProperties = Ext.create('Ext.data.JsonStore', {
		    autoLoad : false,
		    proxy : {
		        type : 'memory'
		    },
            fields : [{
                name : 'name',
                type : 'string'
            }, {
                name : 'type',
                type : 'string'
            }, {
                name : 'value',
                type : 'string'
            }],
        });
		
        var smProperties = Ext.create('Ext.selection.RowModel', {
            mode : 'SINGLE'
        });
        
        var storeTypesProperties = Ext.create('Ext.data.JsonStore', {
            fields : ['name'],
            data : [{name : "String"}, {name : "Enum"}, {name : "Numeric"}, {name : "Date"}]
        });
        
	    var comboTypesProperties = Ext.create('Ext.form.field.ComboBox', {
	        store : storeTypesProperties, 
	        queryMode : 'local',
	        typeAhead : true,
	        triggerAction : 'all',
	        forceSelection : true,
	        selectOnFocus : true,
	        dataIndex : 'orderBy',
//	        listClass : 'x-combo-list-small',
	        valueField : 'name',
	        displayField : 'name',
	        width : 55
	    });

        var columns = [{
            header : i18n.get('headers.name'),
            dataIndex : 'name',
            editor : {
                xtype : 'textfield'
            }
        }, {
            header : i18n.get('headers.type'),
            dataIndex : 'type', 
            editor : comboTypesProperties
        }, {
            header : i18n.get('headers.value'),
            dataIndex : 'value',
            editor : {
                xtype : 'textfield'
            }
        }];
        
        var tbar = {
            defaults : {
                scope : this
            },
            items : [ {
                text : i18n.get('label.create'),
                icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_create.png',
                handler : this.onCreateProperty
            }, {
                text : i18n.get('label.delete'),
                icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_delete.png',
                handler : this.onDeleteProperty
            } ]
        };
        
        Ext.apply(this, {
            title : i18n.get('title.properties'),
            id : 'componentGridProperties',
            tbar : tbar, 
            anchor : "95%", 
            height : 180,
            store : storeProperties,
            columns : columns,
            selModel : smProperties,
            forceFit : true,
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })], 
            listeners : {
				scope : this, 
				activate : function (panel) {
                    if (this.action == 'view') {
						panel.getEl().mask();
					}
                },
				beforeedit : function (e) {
					//Créer l'éditeur en fonction du type 
					if (e.column == 2) {
						var grid = e.grid;
						var rec = e.record;
						var column = grid.getColumnModel().columns[e.column];
						if (Ext.isEmpty(rec.get("type"))) {
							return false;
						}
						var editor;
						switch (rec.get('type')) {
						case "String" : 
							editor = new Ext.form.TextField();
							break;
						
						case "Numeric" : 
							editor = new Ext.form.NumberField();
							break;
						case "Date" : 
							editor = new Ext.form.DateField({
								format : SITOOLS_DEFAULT_IHM_DATE_FORMAT, 
								showTime : true
							});
							break;
						case "Enum" : 
							editor = new Ext.form.TextField();
							break;
						}
						
						column.setEditor(editor);
					}
					return true;
				}, 
				afteredit : function (e) {
					//Formatter en string
					if (e.column == 2) {
						var grid = e.grid;
						var rec = e.record;
						var column = grid.getColumnModel().columns[e.column];
						var value = e.value;
						if (Ext.isEmpty(rec.get("type"))) {
							return false;
						}
						switch (rec.get('type')) {
						case "String" : 
							value = Ext.String.format(value);
							break;
						
						case "Numeric" : 
							value = Ext.util.Format.number(value, "0.00");
							break;
						case "Date" : 
							value = value.format(SITOOLS_DEFAULT_IHM_DATE_FORMAT);
							break;
						case "Enum" : 
							value = Ext.String.format(value);
							break;
						}
						rec.set("value", value);	
					}
					
				}
            }
        
        });
        
		sitools.admin.datasets.datasetProperties.superclass.initComponent.call(this);
    }, 
    /**
     * A method called on create button of the property grid. 
     * Creates a new record with a String default type 
     */
    onCreateProperty : function () {
        var e = {
			type : "String"
        };
        this.getStore().insert(0, e);
    },
    /**
     * Called on delete button of the property grid. 
     * Deletes all selected records. 
     */
    onDeleteProperty : function () {
        var recs = this.getSelectionModel().getSelection();
        if (Ext.isEmpty(recs)) {
            popupMessage("", i18n.get('warning.noselection'), loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/msgBox/16/icon-info.png');
            return;
        }
        this.getStore().remove(recs);
    }

});
