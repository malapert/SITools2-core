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
/*global Ext, sitools, ID, i18n, document, showResponse, alertFailure, LOCALE, ImageChooser, 
 showHelp, loadUrl*/
/*
 * @include "../id.js"
 * @include "../forms/FormGridComponents.js"
 * @include "../forms/ComponentsDisplayPanel.js"
 */
Ext.namespace('sitools.admin.multiDs');

/**
 * Create, or Edit a MultiDataset 
 * @cfg {String} urlMultiDs the url to request the project,
 * @cfg {string} action should be "view", "modify", "create"
 * @cfg {Ext.data.Store} store the store that contains all projects
 * @cfg {string} projectId the id of the selected project
 * @cfg {string} formId the id of the multiDs form if action != "create". 
 * @cfg {} collection the collection object in modification mode
 * @cfg {} dictionary the dictionary object in modification mode
 * @class sitools.admin.multiDs.MultiDsPropPanel
 * @extends Ext.Window
 */
Ext.define('sitools.admin.multiDs.MultiDsPropPanel', { extend : 'Ext.Window',
    width : 700,
    height : 700,
    modal : true,
    pageSize : 10,
    id : ID.COMPONENT_SETUP.MULTIDS,
	collectionId : null, 
	dictionaryId : null, 
	urlCollections : null, 
    propServiceDefaultUrl : "/propService", 
    multiDSServiceDefaultUrl : "/multiDsService", 
    formSize : {
		width : 500, 
		height : 600
    }, 
    
    initComponent : function () {
        this.urlCollections = loadUrl.get('APP_URL') + loadUrl.get('APP_COLLECTIONS_URL');
        this.urlDictionnaires = loadUrl.get('APP_URL') + loadUrl.get('APP_DICTIONARIES_URL');
        var action = this.action;
        if (this.action == 'modify') {
            this.title = i18n.get('label.modifyForm');            
        }
        if (this.action == 'create') {
            this.title = i18n.get('label.createForm');
        }

        var storeCollections = new Ext.data.JsonStore({
            id : 'storeCollections',
            restful : true, 
            url : this.urlCollections, 
            root : "data", 
            fields : [ {
                name : 'id',
                type : 'string'
            }, {
                name : 'name',
                type : 'string'
            }, {
                name : 'description',
                type : 'string'
            }, {
                name : 'dataSets'
            }], 
            autoLoad : true, 
            listeners : {
				scope : this, 
				load : function (store) {
					this.fireEvent("collectionStoreLoaded", store);
				}
            }
        });
        /**
         * Combo to select Datasets Views.
         * Uses the storeDatasetViews. 
         */
        this.comboCollections = new Ext.form.ComboBox({
            disabled : false, 
            id : "comboCollections",
            store : storeCollections,
            fieldLabel : i18n.get('label.collection'),
            mode : 'local',
            displayField : 'name',
            valueField : 'name',
            typeAhead : true,
            name : 'comboCollections',
            forceSelection : true,
            triggerAction : 'all',
            editable : false,
            emptyText : i18n.get('label.CollectionsSelect'),
            selectOnFocus : true,
            anchor : '95%',    
            itemSelector : 'div.search-item',
            allowBlank : false,
            autoSelect : true, 
            maxHeight : 200,
            tpl : new Ext.XTemplate(
	            '<tpl for=".">',
	            '<div class="search-item combo-datasetview"><div class="combo-datasetview-name">{name}</div>',
	            '<tpl if="this.descEmpty(description) == false" ><div class="sitoolsDescription-datasetview"><div class="sitoolsDescriptionHeader">Description :&nbsp;</div><p class="sitoolsDescriptionText"> {description} </p></div></tpl>',
	            '</div></tpl>',
	            {
					compiled : true, 
					descEmpty : function (description) {
					    return Ext.isEmpty(description);
					}
	            }
	        ), 
	        listeners : {
				change : function (field, newValue, oldValue) {
                    this.getBubbleTarget().fireEvent("collectionChanged", field, newValue, oldValue);
                }, 
                beforeselect : function (field, record) {
                    var newValue = record.get("name");
                    var oldValue = field.getValue();
                    this.getBubbleTarget().fireEvent("collectionChanged", field, newValue, oldValue);
                }
            }
        });

		var storeDictionnaires = new Ext.data.JsonStore({
            id : 'storeDictionnaires',
            restful : true, 
            url : this.urlDictionnaires, 
            root : "data", 
            fields : [ {
                name : 'id',
                type : 'string'
            }, {
                name : 'name',
                type : 'string'
            }, {
                name : 'description',
                type : 'string'
            }], 
            autoLoad : true, 
            listeners : {
				scope : this, 
				load : function (store) {
					this.fireEvent("dictionaryStoreLoaded", store);
				}
            }
        });
        /**
         * Combo to select Dictionnaires.
         * Uses the storeDictionnaires. 
         */
        this.comboDictionnaires = new Ext.form.ComboBox({
            disabled : false, 
            id : "comboDictionnaires",
            store : storeDictionnaires,
            fieldLabel : i18n.get('label.dictionary'),
            displayField : 'name',
            valueField : 'name',
            typeAhead : true,
            name : 'comboDictionnaires',
            forceSelection : true,
            triggerAction : 'all',
            editable : false,
            emptyText : i18n.get('label.DictionarySelect'),
            selectOnFocus : true,
            anchor : '95%',    
            itemSelector : 'div.search-item',
            allowBlank : false,
            autoSelect : true, 
            maxHeight : 200,
            tpl : new Ext.XTemplate(
	            '<tpl for=".">',
	            '<div class="search-item combo-datasetview"><div class="combo-datasetview-name">{name}</div>',
	            '<tpl if="this.descEmpty(description) == false" ><div class="sitoolsDescription-datasetview"><div class="sitoolsDescriptionHeader">Description :&nbsp;</div><p class="sitoolsDescriptionText"> {description} </p></div></tpl>',
	            '</div></tpl>',
	            {
					compiled : true, 
					descEmpty : function (description) {
					    return Ext.isEmpty(description);
					}
	            }
	        ), 
	        listeners : {
				change : function (field, newValue, oldValue) {
                    this.getBubbleTarget().fireEvent("dictionaryChanged", field, newValue, oldValue);
                }, 
                beforeselect : function (field, record) {
                    var newValue = record.get("name");
                    var oldValue = field.getValue();
                    this.getBubbleTarget().fireEvent("dictionaryChanged", field, newValue, oldValue);
                }
            } 
        });
        /**
         * {Ext.FormPanel} formProject The main Form 
         */
        this.mainForm = new Ext.FormPanel({
            xtype : 'form',
            border : false,
            padding : 10,
            trackResetOnLoad : true,
            id : "formMainFormId",
            autoScroll : true,
            items : [ {
                xtype : 'hidden',
                name : 'id'
            }, {
                xtype : 'textfield',
                name : 'name',
                fieldLabel : i18n.get('label.name'),
                anchor : '100%',
                maxLength : 30,
                allowBlank : false,  
                vtype : "name",
                listeners : {
					scope : this, 
					blur : function (field) {
						if (field.isValid()) {
						    var name = field.getValue().replace(/\s/g, "_");
							var urlPropField = field.ownerCt.getForm().findField("urlServicePropertiesSearch");
							if (Ext.isEmpty(urlPropField.getValue())) {
								urlPropField.setValue("/" + name + this.propServiceDefaultUrl);
							}
							var urlMultiDsField = field.ownerCt.getForm().findField("urlServiceDatasetSearch");
							if (Ext.isEmpty(urlMultiDsField.getValue())) {
								urlMultiDsField.setValue("/" + name + this.multiDSServiceDefaultUrl);
							}
						}
					}
                }
            }, {
                xtype : 'textfield',
                name : 'description',
                fieldLabel : i18n.get('label.description'),
                anchor : '100%'
            }, {
                xtype : 'textfield',
                vtype : "attachment",
                name : 'urlServicePropertiesSearch',
                fieldLabel : i18n.get('label.urlServicePropertiesSearch'),
                anchor : '100%',
                maxLength : 100
            }, {
                xtype : 'textfield',
                vtype : "attachment",
                name : 'urlServiceDatasetSearch',
                fieldLabel : i18n.get('label.urlServiceDatasetSearch'),
                anchor : '100%',
                maxLength : 100
            }, {
                xtype : 'textfield',
                name : 'css',
                fieldLabel : i18n.get('label.css'),
                anchor : '100%',
                maxLength : 100
            }, {
                xtype : 'textfield',
                name : 'nbDatasetsMax',
                fieldLabel : i18n.get('label.nbDatasetsMax'),
                anchor : '100%',
                maxLength : 100
            }, this.comboCollections, this.comboDictionnaires, {
                xtype : 'hidden',
                name : 'idServicePropertiesSearch'
            }, {
                xtype : 'hidden',
                name : 'idServiceDatasetSearch'
            }], 
            listeners : {
				"activate" : function () {
					if (action == 'view') {
						this.getEl().mask();
					}
				}, 
				collectionChanged : function (field, newValue, oldValue) {
					this.getBubbleTarget().fireEvent("collectionChanged", field, newValue, oldValue);
				}, 
				dictionaryChanged : function (field, newValue, oldValue) {
					this.getBubbleTarget().fireEvent("dictionaryChanged", field, newValue, oldValue);
				}
            }, 
            flex : 1

        });
        var httpProxyConcepts = new Ext.data.HttpProxy({
			url : this.action == "create" ? "/tmp" : loadUrl.get('APP_URL') + loadUrl.get('APP_COLLECTIONS_URL') + "/" + this.collection.id + "/concepts/" + this.dictionary.id, 
			restful : true
        });
        var storeConcepts = new Ext.data.JsonStore({
	        root : 'data',
//	        url : loadUrl.get('APP_URL') + loadUrl.get('APP_COLLECTIONS_URL') + "/" + config.collectionId + "/concepts/" + config.dictionaryId, 
	        proxy : httpProxyConcepts, 
	        restful : true, 
	        remoteSort : false,
	        fields : [ {
	            name : 'id',
	            type : 'string'
	        }, {
	            name : 'name',
	            type : 'string'
	        }, {
	            name : 'description',
	            type : 'string'
	        }], 
	        autoLoad : this.action != "create"
	    });	
	    var cmConcepts = new Ext.grid.ColumnModel({
			columns : [{
				header : i18n.get("label.name"), 
				dataIndex : 'name', 
				type : 'string'
			}, {
				header : i18n.get("label.description"), 
				dataIndex : 'description', 
				type : 'string'
			}]
	    });
	    this.gridConcepts = new Ext.grid.GridPanel({
			store : storeConcepts, 
			cm : cmConcepts, 
			title : i18n.get('label.sharedConcepts'), 
			flex : 1, 
			viewConfig : {
				forceFit : true
			}
	    });

        
        var firstPanel = new Ext.Panel({
			title : i18n.get('label.FormInfo'),
            layout : "vbox", 
            layoutConfig : {
				align : "stretch"
            },
			items : [this.mainForm, this.gridConcepts], 
            listeners : {
				collectionChanged : function (field, newValue, oldValue) {
					this.getBubbleTarget().fireEvent("collectionChanged", field, newValue, oldValue);
				}, 
				dictionaryChanged : function (field, newValue, oldValue) {
					this.getBubbleTarget().fireEvent("dictionaryChanged", field, newValue, oldValue);
				}
            } 
        });
        
        var storeProperties = new Ext.data.JsonStore({
            fields : [ {
                name : 'name',
                type : 'string'
            }, {
                name : 'type',
                type : 'string'
            }],
            autoLoad : false
        });
        var smProperties = Ext.create('Ext.selection.RowModel',{
            mode : 'SINGLE'
        });

        var storeTypesProperties = new Ext.data.JsonStore({
            fields : ['name'],
            data : [{name : "TEXTFIELD"}, {name : "NUMERIC_BETWEEN"}, {name : "DATE_BETWEEN"}, {name : "NUMBER_FIELD"}]
        });
	    var comboTypesProperties = new Ext.form.ComboBox({
	        store : storeTypesProperties, 
	        mode : 'local',
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
        
        /*
         * Proxy used to request a datasource
         * @type Ext.data.HttpProxy
         */
        var httpProxyProperties = new Ext.data.HttpProxy({
            url : this.urlCollections + "/" + this.collectionId + "/properties",
            restful : true,
            method : 'GET'
        });
        
        /**
         * A store to request all properties from a collection. 
         * The url to request properties is build as 
         *  /sitools/collections/collectionId/properties
         */
        this.storeComboProperties = new Ext.data.JsonStore({
            fields : [ 'id', 'name', 'description' ],
            proxy : httpProxyProperties, 
            root : "data"
        });
        
        /*
         * Combo to select Properties.
         */
        var comboProperties = new Ext.form.ComboBox({
            disabled : false, 
            id : "comboProperties",
            store : this.storeComboProperties,
            displayField : 'name',
            valueField : 'name',
            typeAhead : true,
            mode : 'local',
            name : 'comboProperties',
            forceSelection : true,
            triggerAction : 'all',
            editable : false,
            emptyText : i18n.get('label.comboPropertiesSelect'),
            selectOnFocus : true,
            allowBlank : false,
            autoSelect : true
        });

        var cmProperties = new Ext.grid.ColumnModel({
            columns : [ {
                header : i18n.get('headers.name'),
                dataIndex : 'name',
                editor : comboProperties
            }, {
                header : i18n.get('headers.type'),
                dataIndex : 'type',
                editor : comboTypesProperties
            }],
            defaults : {
                sortable : false,
                width : 400
            }
        });
        
        var tbar = {
            xtype : 'sitools.widget.GridSorterToolbar',
            gridId : "gridProperties",            
            items : [ {
                text : i18n.get('label.create'),
                icon : loadUrl.get('APP_URL') + '/common/res/images/icons/toolbar_create.png',
                handler : function () {
			        var grid = this.gridProperties;
			        grid.getStore().insert(0, {});
			    },
                scope : this
            }, {
                text : i18n.get('label.delete'),
                icon : loadUrl.get('APP_URL') + '/common/res/images/icons/toolbar_delete.png',
                handler : function () {
			        var grid = this.gridProperties;
			        var s = grid.getSelectionModel().getSelections();
			        var i, r;
			        for (i = 0; s[i]; i++) {
			            r = s[i];
			            grid.getStore().remove(r);
			        }
                }, 
                scope : this
            } ]
        };

        /**
         * The grid to display, create, edit properties on a multiDS search form. 
         * When activating this panel, the storeComboProperties url is build and the store is loaded.
         */
        this.gridProperties = new Ext.grid.EditorGridPanel({
            layout : "fit", 
            title : i18n.get('title.properties'),
            id : 'gridProperties',
            store : storeProperties,
            tbar : tbar,
            cm : cmProperties,
            selModel : smProperties,
            forceFit : true,
            listeners : {
				scope : this, 
				activate : function () {
					this.storeComboProperties.proxy.url = this.urlCollections + "/" + this.collectionId + "/properties";
					this.storeComboProperties.reload();
				}
            }
            
        });

        this.zoneStore = new Ext.data.JsonStore({
            root : 'data',
            idProperty : 'id',
            fields : [ {
                id : 'id',
                type : 'string'
            }, {
                name : 'title',
                type : 'string'
            }, {
                name : 'height',
                type : 'int'
            }, {
                name : 'css',
                type : 'string'
            }, {
                name : 'position',
                type : 'string'
            }, {
                name : 'collapsible',
                type : 'boolean'
            }, {
                name : 'collapsed',
                type : 'boolean'
            }, {
                name : 'params'
            }, {
                name : 'containerPanelId',
                type : 'string'
            }],
            listeners : {
                scope : this,
                remove : function (store, rec, ind) {
                    store.commitChanges();
                    this.absoluteLayout.fireEvent('activate');
                }
            }
        });
        /**
         * A Store to store all components of this form. 
         * This object is the reference of all components. 
         */
        this.formComponentsStore = new Ext.data.JsonStore({
            root : 'data',
            fields : [ {
                name : 'id',
                type : 'string'
            }, {
                name : 'label',
                type : 'string'
            }, {
                name : 'type',
                type : 'string'
            }, {
                name : 'code',
                type : 'string'
            }, {
                name : 'values'
            }, {
                name : 'width',
                type : 'int'
            }, {
                name : 'height',
                type : 'int'
            }, {
                name : 'xpos',
                type : 'int'
            }, {
                name : 'ypos',
                type : 'int'
            }, {
                name : 'css',
                type : 'string'
            }, {
                name : 'jsAdminObject',
                type : 'string'
            }, {
                name : 'jsUserObject',
                type : 'string'
            }, {
                name : 'defaultValues'
            }, {
                name : 'valueSelection',
                type : 'string'
            }, {
                name : 'autoComplete', 
                type : 'boolean'
            }, {
                name : 'parentParam'
            }, {
                name : 'dimensionId',
                type : 'string'
            }, {
                name : 'unit'
            }, {
				name : 'extraParams'
            }],
            autoLoad : false
        });

        /**
         * An absolute panel to display the components. 
         */
        this.absoluteLayout = new sitools.admin.forms.ComponentsDisplayPanel({
        	zoneStore : this.zoneStore,
        	formComponentsStore : this.formComponentsStore, 
			storeConcepts : this.gridConcepts.getStore(), 
			context : "project",
			formSize : this.formSize,
			action : this.action
        });
        
        var absContainer = new Ext.Panel({
            title : i18n.get('label.disposition'),
			flex : 1, 
			autoScroll : true,
			tbar : new Ext.Toolbar({
                items : [{
                    scope : this,
                    text : i18n.get('label.changeFormSize'),
                    icon : loadUrl.get('APP_URL') + '/common/res/images/icons/sva_exe_synchrone.png',
                    handler : this._sizeUp
                }, {
                    scope : this,
                    text : i18n.get('label.addAdvancedCritera'),
                    icon : loadUrl.get('APP_URL') + '/common/res/images/icons/tree_forms.png',
                    handler : this._addPanel
                }]
    
            }),
			items : [this.absoluteLayout]
        });
        
        /**
         * The list with all components type. 
         * It is used to create new form Component by drag & drop. 
         */
        this.componentListPanel = new sitools.admin.forms.componentsListPanel({
            formComponentsStore : this.formComponentsStore,
            action : 'create', 
            context : "project", 
            storeConcepts : this.gridConcepts.getStore()
        });
        
        var dispPanel = new Ext.Panel({
			layout : "hbox", 
			title : i18n.get('label.disposition'),
			layoutConfig : {
				align : "stretch"
			}, 
			items : [this.componentListPanel, absContainer], 
			listeners : {
				scope : this, 
				activate : function () {
					this.absoluteLayout.fireEvent('activate');
					var absoluteLayout = this.absoluteLayout;
//					var displayPanelDropTargetEl =  absoluteLayout.body.dom;
//					var formComponentsStore = this.formComponentsStore;
//					var storeConcepts = this.storeConcepts;
//					var gridConcepts = this.gridConcepts;
//					var displayPanelDropTarget = new Ext.dd.DropTarget(displayPanelDropTargetEl, {
//						ddGroup     : 'gridComponentsList',
//						notifyDrop  : function (ddSource, e, data) {
//							var xyDrop = e.xy;
//							var xyRef = Ext.get(absoluteLayout.body).getXY();
//							
//							var xyOnCreate = {
//								x : xyDrop[0] - xyRef[0], 
//								y : xyDrop[1] - xyRef[1]
//							};
//							// Reference the record (single selection) for readability
//							var rec = ddSource.dragData.selections[0];
//					        var ComponentWin = new sitools.admin.forms.componentPropPanel({
//					            urlAdmin : rec.data.jsonDefinitionAdmin,
//					            ctype : rec.data.type,
//					            action : "create",
//					            componentDefaultHeight : rec.data.componentDefaultHeight,
//					            componentDefaultWidth : rec.data.componentDefaultWidth,
//					            dimensionId : rec.data.dimensionId,
//					            unit : rec.data.unit,
//					            extraParams : rec.data.extraParams, 
//					            jsAdminObject : rec.data.jsAdminObject, 
//					            jsUserObject : rec.data.jsUserObject, 
//					            context : "project", 
//					            storeConcepts : gridConcepts.getStore(), 
//					            absoluteLayout : absoluteLayout, 
//					            record : rec, 
//					            formComponentsStore : formComponentsStore, 
//					            xyOnCreate : xyOnCreate
//					        });
//					        ComponentWin.show();
//						}
//					});
					
				}
			}
			
		});

        
        /**
         * The main tapPanel of the window. 
         */
        this.tabPanel = new Ext.TabPanel({
            height : 550,
            activeTab : 0,
            items : [firstPanel, this.gridProperties, dispPanel],
            buttons : [ {
                text : i18n.get('label.ok'),
                scope : this,
                handler : this.onValidate, 
                hidden : this.action == "view"
            }, {
                text : i18n.get('label.cancel'),
                scope : this,
                handler : function () {
                    this.close();
                }
            } ], 
            listeners : {
				scope : this, 
				collectionChanged : function (field, newValue, oldValue) {
					var index = field.getStore().find("name", newValue);
					var rec = field.getStore().getAt(index);
					
					if (!Ext.isEmpty(oldValue) && newValue != oldValue && this.formComponentsStore.getCount() > 0) {
						var tot = Ext.Msg.show({
                            title : i18n.get('label.delete'),
                            buttons : Ext.Msg.YESNO,
                            msg : i18n.get('warning.changeCollection'),
                            scope : this,
                            fn : function (btn, text) {
                                if (btn == 'yes') {
//                                    this.gridFormComponents.fireEvent("collectionChanged", rec.data.id);
					                this.collectionId = rec.data.id;
									this.loadConcepts();
					                this.eraseComponents();
					                this.eraseProperties();
                                } else {
                                    field.setValue(oldValue);
                                }
                            }

                        });
                    }
                    else {
						this.collectionId = rec.data.id;
						this.loadConcepts();
                    }
                    
				}, 
				dictionaryChanged : function (field, newValue, oldValue) {
					var index = field.getStore().find("name", newValue);
					var rec = field.getStore().getAt(index);
					if (!Ext.isEmpty(oldValue) && newValue != oldValue && this.formComponentsStore.getCount() > 0) {
						var tot = Ext.Msg.show({
                            title : i18n.get('label.delete'),
                            buttons : Ext.Msg.YESNO,
                            msg : i18n.get('warning.changeDictionary'),
                            scope : this,
                            fn : function (btn, text) {
                                if (btn == 'yes') {
                                    this.dictionaryId = rec.data.id;
									this.loadConcepts();
					                this.eraseComponents();
                                } else {
                                    field.setValue(oldValue);
                                }
                            }

                        });
                    }
                    else {
						this.dictionaryId = rec.data.id;
						this.loadConcepts();
                    }
				}
            }
        });
        
        this.items = [this.tabPanel];
		
		/**
		 * Adds the events listeners : 
		 * dictionaryStoreLoaded : Loads the shared Concept if possible, 
		 * collectionStoreLoaded : Loads the shared Concept if possible
		 */
		this.listeners = {
			scope : this, 
			resize : function (window, width, height) {
				var size = window.body.getSize();
				this.tabPanel.setSize(size);
			}, 
			dictionaryStoreLoaded : function (store) {
				var index = store.find("name", this.comboCollections.getValue());
				var rec = this.comboCollections.getStore().getAt(index);
				if (Ext.isEmpty(rec)) {
					return;
				}
				this.collectionId = rec.data.id;
				if (! Ext.isEmpty(this.collectionId) && !Ext.isEmpty(this.dictionaryId)) {
					this.loadConcepts();
				}
			}, 
			collectionStoreLoaded : function (store) {
				var index = store.find("name", this.comboDictionnaires.getValue());
				var rec = this.comboDictionnaires.getStore().getAt(index);
				if (Ext.isEmpty(rec)) {
					return;
				}
				this.dictionaryId = rec.data.id;
				if (! Ext.isEmpty(this.collectionId) && !Ext.isEmpty(this.dictionaryId)) {
					this.loadConcepts();
				}
			}

        };        
        sitools.component.projects.ProjectsPropPanel.superclass.initComponent.call(this);
    },
    /**
     * Load the conceptsGrid store with the right url
     */
    loadConcepts : function () {
		var url = loadUrl.get('APP_URL') + loadUrl.get('APP_COLLECTIONS_URL') + "/" + this.collectionId + "/concepts/" + this.dictionaryId;
		this.gridConcepts.getStore().proxy.url = url;
		this.gridConcepts.getStore().load();
    }, 
    /**
     * Erase all form components
     */
    eraseComponents : function () {
		this.formComponentsStore.removeAll();

    },
    /**
     * Erase all form Properties
     */
    eraseProperties : function () {
		this.gridProperties.getStore().removeAll();
    },
    
    _sizeUp : function () {
        var panelProp = new sitools.admin.forms.absoluteLayoutProp({
            absoluteLayout : this.absoluteLayout,
            tabPanel : this.absoluteLayout.ownerCt.ownerCt.ownerCt,
            win : this,
            formSize : this.formSize
        });
        panelProp.show();
    },
    
    _addPanel : function () {
        var setupAdvancedPanel = new sitools.admin.forms.setupAdvancedFormPanel({
            parentContainer : this.absoluteLayout,
            currentPosition : this.absoluteLayout.position
        });
        setupAdvancedPanel.show();
       
        this.absoluteLayout.doLayout();

    },
    /**
     * Check the validity of form
     * and call onSaveProject method
     * @return {Boolean}
     */
    onValidate : function () {
		var f = this.down('form').getForm();
        if (!f.isValid()) {
            Ext.Msg.alert(i18n.get('label.error'), i18n.get('warning.invalidForm'));
            return false;
        }
		var putObject = {};
        Ext.iterate(f.getValues(), function (key, value) {
            var rec, index;
            if (key == 'comboCollections') {
                index = this.comboCollections.getStore().find("name", this.comboCollections.getValue());
                rec = this.comboCollections.getStore().getAt(index);
                var collection = {
					name : rec.data.name,
					id : rec.data.id, 
					description : rec.data.description
				};
				putObject.collection = collection;
                
            } else if (key == "comboDictionnaires") {
                index = this.comboDictionnaires.getStore().find("name", this.comboDictionnaires.getValue());
                rec = this.comboDictionnaires.getStore().getAt(index);
                var dictionary = {
					name : rec.data.name,
					id : rec.data.id, 
					description : rec.data.description
				};
				putObject.dictionary = dictionary;
                
            }
            else {
				putObject[key] = value;
            }
        }, this);
        
        var width = this.formSize.width;
        var height = this.formSize.height;
                
        putObject.width = width;
        putObject.height = height;
		
        var storeProperties = this.gridProperties.getStore();
        if (storeProperties.getCount() > 0) {
            putObject.properties = [];
        }
        storeProperties.each(function (rec) {
			putObject.properties.push(rec.data);
        });
        
        
        /** ajout */
        if (this.zoneStore.getCount() > 0) {
            putObject.zones = [];
        }
        proppanel = this;
        this.zoneStore.each(function (component) {
       	
            var paramObject = {};
            var paramstore = proppanel.formComponentsStore;
            if (paramstore.getCount() > 0) {
                paramObject = [];
                paramstore.each(function (param) {
                    if (param.data.containerPanelId == component.data.containerPanelId){
                        paramObject.push({
                            type : param.data.type,
                            code : param.data.code,
                            label : param.data.label,
                            values : param.data.values,
                            width : param.data.width,
                            height : param.data.height,
                            xpos : param.data.xpos,
                            ypos : param.data.ypos,
                            id : param.data.id,
                            css : param.data.css,
                            jsAdminObject : param.data.jsAdminObject,
                            jsUserObject : param.data.jsUserObject,
                            defaultValues : param.data.defaultValues,
                            valueSelection : param.data.valueSelection, 
                            autoComplete : param.data.autoComplete, 
                            parentParam : param.data.parentParam, 
                            dimensionId : param.data.dimensionId, 
                            unit : param.data.unit, 
                            extraParams : param.data.extraParams,
                            containerPanelId : param.data.containerPanelId
                        });
                    }
                });
                
                if (!Ext.isEmpty(paramObject)){
                    putObject.zones.push({
                        id : component.data.containerPanelId,
                        height : component.data.height,
                        position : component.data.position,
                        css : component.data.css,
                        collapsible : component.data.collapsible,
                        collapsed : component.data.collapsed,
                        title : component.data.title,
                        params : paramObject
                    });
                }
            }
        });
        
        
        var store = this.formComponentsStore;

//        if (store.getCount() > 0) {
//            putObject.parameters = [];
//        }
//        store.each(function (component) {
//
//            putObject.parameters.push({
//                type : component.data.type,
//                code : component.data.code,
//                label : component.data.label,
//                values : component.data.values,
//                width : component.data.width,
//                height : component.data.height,
//                xpos : component.data.xpos,
//                ypos : component.data.ypos,
//                id : component.data.id,
//                css : component.data.css,
//                jsAdminObject : component.data.jsAdminObject,
//                jsUserObject : component.data.jsUserObject,
//                defaultValues : component.data.defaultValues,
//                valueSelection : component.data.valueSelection, 
//                autoComplete : component.data.autoComplete, 
//                parentParam : component.data.parentParam, 
//                dimensionId : component.data.dimensionId, 
//                unit : component.data.unit, 
//                extraParams : component.data.extraParams
//            });
//        });
        
        var method = (this.action == 'modify') ? "PUT" : "POST";
		var url = (this.action == 'modify') ? this.urlMultiDs + "/" + this.formId : this.urlMultiDs;
        Ext.Ajax.request({
			url : url,
			method : method,
			scope : this,
			jsonData : putObject,
			success : function (ret) {
				var data = Ext.decode(ret.responseText);
				if (data.success === false) {
					Ext.Msg.alert(i18n.get('label.warning'), i18n
									.get(data.message));
				} else {
					this.close();
					this.store.reload();
				}
				// Ext.Msg.alert(i18n.get('label.information'),
				// i18n.get('msg.uservalidate'));
			},
			failure : alertFailure
		});
	}, 
    /**
     * Loads the form as defined if in modification mode. 
     */
    onRender : function () {
        sitools.admin.multiDs.MultiDsPropPanel.superclass.onRender.apply(this, arguments);
        if (this.formId) {
            // Si l'objet est en modification, on charge l'objet en question
            if (this.action == 'modify') {
                Ext.Ajax.request({
                    url : this.urlMultiDs + "/" + this.formId,
                    method : 'GET',
                    scope : this,
                    success : function (ret) {
                        var Json = Ext.decode(ret.responseText);
                        if (!Json.success) {
                            this.close();
                            Ext.Msg.alert(i18n.get('label.warning'), Json.message);
                            return;
                        }

                        var f = this.down('form').getForm();
                        var data = Json.formProject;
                        if (!Ext.isEmpty(data.width)) {
                            this.formSize.width = data.width;
                        }
                        if (!Ext.isEmpty(data.height)) {
                            this.formSize.height = data.height;
                        }
                        
                        this.absoluteLayout.setSize(this.formSize);
                        
                        var rec = {};
                        rec.id = data.id;
                        rec.name = data.name;
                        rec.description = data.description;
                        rec.css = data.css;
                        rec.nbDatasetsMax = data.nbDatasetsMax;
                        rec.urlServicePropertiesSearch = data.urlServicePropertiesSearch;
                        rec.urlServiceDatasetSearch = data.urlServiceDatasetSearch;
                        rec.idServiceDatasetSearch = data.idServiceDatasetSearch;
                        rec.idServicePropertiesSearch = data.idServicePropertiesSearch;
                        
                        f.setValues(rec);
						
                        this.comboCollections.setValue(data.collection.name);
                        this.comboDictionnaires.setValue(data.dictionary.name);
                        this.collectionId = data.collection.id;
                        this.dictionaryId = data.dictionary.id;
                                                
                        if (data.properties) {
							var properties = data.properties;
							var storeProperties = this.gridProperties.getStore();
							Ext.each(properties, function (prop) {
								storeProperties.add(prop);
							});
                        }
                        
                        var globalParameters = {};
                        if (!Ext.isEmpty(data.parameters)) {
                            globalParameters.oldParams = data.parameters;
                        }
                        else {
                            globalParameters.formZones = data.zones;
                        }
                        
                        
                        if (!Ext.isEmpty(globalParameters.formZones)) {
                            Ext.each(globalParameters.formZones, function (zone) {
                                this.zoneStore.add({
                                    containerPanelId : zone.id,
                                    title : zone.title,
                                    height : zone.height,
                                    collapsible : zone.collapsible,
                                    collapsed : zone.collapsed,
                                    css : zone.css,
                                    position : zone.position,
                                    params : zone.params
                                });

                                if (!Ext.isEmpty(zone.params)) {
                                    Ext.each(zone.params, function (param) {
                                        this.formComponentsStore.add({
                                            type : param.type,
                                            code : param.code,
                                            label : param.label,
                                            values : param.values,
                                            width : param.width,
                                            height : param.height,
                                            xpos : param.xpos,
                                            ypos : param.ypos,
                                            id : param.id,
                                            css : param.css,
                                            jsAdminObject : param.jsAdminObject,
                                            jsUserObject : param.jsUserObject,
                                            defaultValues : param.defaultValues,
                                            valueSelection : param.valueSelection,
                                            autoComplete : param.autoComplete,
                                            parentParam : param.parentParam,
                                            dimensionId : param.dimensionId,
                                            unit : param.unit,
                                            extraParams : param.extraParams,
                                            containerPanelId : param.containerPanelId
                                        });
                                    }, this);
                                }
                            }, this);
                        } else if (!Ext.isEmpty(globalParameters.oldParams)) {
                            var idGen = Ext.id();
                            this.zoneStore.add({
                                containerPanelId : idGen,
                                title : data.name,
                                height : data.height,
                                css : data.css,
                                position : 0,
                                params : globalParameters.oldParams
                            });
                            
                            if (!Ext.isEmpty(globalParameters.oldParams)) {
                                var parameters = globalParameters.oldParams;
                                for (var i = 0; i < parameters.length; i++) {
                                    this.formComponentsStore.add({
                                        type : parameters[i].type,
                                        code : parameters[i].code,
                                        label : parameters[i].label,
                                        values : parameters[i].values,
                                        width : parameters[i].width,
                                        height : parameters[i].height,
                                        xpos : parameters[i].xpos,
                                        ypos : parameters[i].ypos,
                                        id : parameters[i].id,
                                        css : parameters[i].css,
                                        jsAdminObject : parameters[i].jsAdminObject,
                                        jsUserObject : parameters[i].jsUserObject,
                                        defaultValues : parameters[i].defaultValues,
                                        valueSelection : parameters[i].valueSelection, 
                                        autoComplete : parameters[i].autoComplete, 
                                        parentParam : parameters[i].parentParam, 
                                        dimensionId : parameters[i].dimensionId, 
                                        unit : parameters[i].unit, 
                                        extraParams : parameters[i].extraParams,
                                        containerPanelId : idGen
                                    });
                                }
                            }
                        }
                        
//                        if (data.parameters) {
//                            var parameters = data.parameters;
//                            var storeTablesComponents = this.formComponentsStore;
//                            var i;
//                            for (i = 0; i < parameters.length; i++) {
//                                storeTablesComponents.add(new Ext.data.Record({
//                                    type : parameters[i].type,
//                                    code : parameters[i].code,
//                                    label : parameters[i].label,
//                                    values : parameters[i].values,
//                                    width : parameters[i].width,
//                                    height : parameters[i].height,
//                                    xpos : parameters[i].xpos,
//                                    ypos : parameters[i].ypos,
//                                    id : parameters[i].id,
//                                    css : parameters[i].css,
//                                    jsAdminObject : parameters[i].jsAdminObject,
//                                    jsUserObject : parameters[i].jsUserObject,
//                                    defaultValues : parameters[i].defaultValues,
//                                    valueSelection : parameters[i].valueSelection, 
//                                    autoComplete : parameters[i].autoComplete, 
//                                    parentParam : parameters[i].parentParam, 
//                                    dimensionId : parameters[i].dimensionId, 
//                                    unit : parameters[i].unit, 
//                                    extraParams : parameters[i].extraParams
//                                }));
//
//                            }
//                        }
                        this.doLayout();

                    },
                    failure : function (ret) {
                        var data = Ext.decode(ret.responseText);
                        Ext.Msg.alert(i18n.get('label.warning'), data.errorMessage);
                    }

                });
            }
        }
    }	
});
