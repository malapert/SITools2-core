/*******************************************************************************
 * Copyright 2010-2013 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
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
/*global Ext, sitools, ID, i18n, document, showResponse, alertFailure, LOCALE,ImageChooser, loadUrl, extColModelToStorage*/

Ext.namespace('sitools.user.component.dataviews.services');

/**
 * GUI Service to download a data selection from the dataset
 * 
 * @required datasetId
 * @required datasetUrl
 * @cfg {Ext.data.JsonStore} the store where nodes are saved
 * @class sitools.user.component.dataviews.services.addToCartService
 * @extends Ext.Window
 */
sitools.user.component.dataviews.services.addToCartService =  {
    
    getCartSelectionFile : function (response) {
        
        if (Ext.isEmpty(response.responseText)) {
            return;
        }
        try {
            var json = Ext.decode(response.responseText);
            this.cartSelectionFile = json;
        } catch (err) {
            return;
        }
    },

    addToCart : function () {

        userStorage.get(this.user + "_CartSelections.json", "/" + DEFAULT_ORDER_FOLDER + "/records", this, this.getCartSelectionFile, Ext.emptyFn,
                this.saveSelection);
    },

    saveSelection : function () {
        // if (this.dataview.getSelections().length <= 300 &&
        // this.dataview.selModel.getAllSelections().length <= 300) {
        this._addSelection(this.dataview.getSelections(), this.dataview, this.datasetId);
        // } else {
        // return Ext.Msg.show({
        // title : i18n.get('label.warning'),
        // msg : i18n.get('warning.tooMuchRecords'),
        // buttons : Ext.MessageBox.OK,
        // icon : Ext.MessageBox.WARNING
        // });
        // }
    },

    /**
     * Create an entry in the user storage with all the selected records.
     * 
     * @param {Array}
     *            selections An array of selected {Ext.data.Record} records
     * @param {Ext.grid.GridPanel}
     *            grid the grid
     * @param {string}
     *            datasetId
     * @param {string}
     *            orderName the name of the future file.
     */
    _addSelection : function (selections, grid, datasetId) {
        var primaryKey = "";
        var rec = selections[0];
        Ext.each(rec.fields.items, function (field) {
            if (field.primaryKey) {
                primaryKey = field.name;
            }
        }, rec);
        if (Ext.isEmpty(primaryKey) || Ext.isEmpty(rec.get(primaryKey))) {
            Ext.Msg.alert(i18n.get('label.warning'), i18n.get('warning.noPrimaryKey'));
            return;
        }

        var globalOrder = {};
//        var recordsOrder = {};
//        recordsOrder.records = [];

        var colModelTmp = extColModelToJsonColModel(grid.getColumnModel());
        var colModel = [];

        // On stocke seulement les colonnes configurées dans le Gui service
        Ext.each(colModelTmp, function (col) {
            Ext.each(this.selectionColumns, function (selectCol) {
                if (col.columnAlias == selectCol.columnAlias) {
                    colModel.push(col);
                }
            }, this);
        }, this);

        globalOrder.selectionName = this.selectionName;
        globalOrder.selectionId = this.dataview.datasetName;
        globalOrder.datasetId = this.dataview.datasetId;
        globalOrder.projectId = this.dataview.projectId;
        globalOrder.dataUrl = this.dataview.dataUrl;
        globalOrder.datasetName = this.dataview.datasetName;

        globalOrder.selections = this.dataview.getRequestParamWithoutColumnModel();
        globalOrder.selections = globalOrder.selections.slice(1);
        globalOrder.ranges = this.dataview.getSelectionsRange();
        
        // TODO save the start index to reload the right page
        //this.dataview.getStore().lastOptions.params.start
        
        globalOrder.nbRecords = (grid.isAllSelected()) ? this.dataview.store.getTotalCount() : this.dataview.getNbRowsSelected();
        
        var orderDate = new Date();
        var orderDateStr = orderDate.format(SITOOLS_DATE_FORMAT);
        globalOrder.orderDate = orderDateStr;
        
        globalOrder.colModel = colModel;

        
        if (Ext.isEmpty(this.cartSelectionFile.cartSelections)) {
            this.cartSelectionFile.cartSelections = [];
        }
        
        var index = Ext.each(this.cartSelectionFile.cartSelections, function (sel) {
            if (sel.selectionId === this.dataview.datasetName) {
                return false;
            }
        }, this);
            
        

        if (Ext.isEmpty(index)) {
            this.cartSelectionFile.cartSelections.push(globalOrder);
        } else {
            this.cartSelectionFile.cartSelections[index] = globalOrder;
        }
            
        var putObject = {};
        putObject.cartSelections = [];
        putObject.cartSelections = this.cartSelectionFile.cartSelections; 
       


        userStorage.set(this.user + "_CartSelections.json", "/" + DEFAULT_ORDER_FOLDER + "/records",
                putObject);
    }
    
//    createRecordsSelectionFile : function (recordsOrder) {
//        userStorage.set(this.user + "_" + recordsOrder.selectionId + "_records.json", "/" + DEFAULT_ORDER_FOLDER + "/records", recordsOrder);
//    }
//    
};
Ext.reg('sitools.user.component.dataviews.services.addToCartService', sitools.user.component.dataviews.services.addToCartService);

sitools.user.component.dataviews.services.addToCartService.getParameters = function () {
    var checkColumn = new Ext.grid.CheckColumn({
        header : i18n.get('headers.exportData'),
        tooltip : i18n.get('headers.helpExportData'),
        dataIndex : 'isDataExported',
        editable : true,
        width : 50,
        renderer : function(v, p, record) {
            p.css += ' x-grid3-check-col-td'; 
            var cmp = Ext.getCmp(this.id); 
            if (cmp.enabled &&
                    ColumnRendererEnum.getColumnRendererCategoryFromBehavior(record.data.columnRenderer.behavior) == "Image") {
            	return String.format('<div id="{2}" class="x-grid3-check-col{0} x-grid3-check-col-enabled {1}">&#160;</div>', v ? '-on' : '', cmp.createId(), this.id);
            }
            else {
            	return String.format('<div id="{2}" class="x-grid3-check-disabled-col{0} {1}">&#160;</div>', v ? '-on' : '', cmp.createId(), this.id);
            }
        }
    });
    return [ {
        jsObj : "sitools.component.datasets.selectItems",
        config : {
            height : 250,
            layout : {
                type : 'hbox',
                pack : 'start',
                align : 'stretch'
            },
            grid1 : new Ext.grid.GridPanel({
                width : 270,
                margins : {
                    top : 0,
                    right : 5,
                    bottom : 0,
                    left : 0
                },
                viewConfig : {
                    forceFit : true
                },
                store : new Ext.data.JsonStore({
                    fields : [ 'dataIndex', 'columnAlias', 'primaryKey', 'columnRenderer' ],
                    idProperty : 'columnAlias',
                    url : Ext.getCmp("dsFieldParametersPanel").urlDataset,
                    root : "dataset.columnModel",
                    autoLoad : true,
                    listeners : {
                        load : function (store, records) {
                            Ext.each(records, function (rec) {
                                if (rec.data.columnRenderer) {
                                    if (ColumnRendererEnum.getColumnRendererCategoryFromBehavior(rec.data.columnRenderer.behavior) == "Image") {
                                        rec.data.featureType = "IMAGE";
                                    }
                                }
                            });
                            
                        }
                    }
                }),
                colModel : new Ext.grid.ColumnModel({
                    columns : [ {
                        header : i18n.get('label.selectColumns'),
                        dataIndex : 'columnAlias',
                        sortable : true
                    }, {
                        header : i18n.get('label.featureType'),
                        dataIndex : 'featureType',
                        sortable : true
                    } ]
                })
            }),
            grid2 : new Ext.grid.GridPanel({
                width : 270,
                margins : {
                    top : 0,
                    right : 0,
                    bottom : 0,
                    left : 10
                },
                viewConfig : {
                    forceFit : true,
                },
                store : new Ext.data.JsonStore({
                    fields : [ 'dataIndex', 'columnAlias', 'primaryKey', 'columnRenderer', 'isDataExported' ],
                    idProperty : 'columnAlias',
                    listeners : {
                        add : function (store, records) {
                            Ext.each(records, function (rec) {
                                if (rec.data.columnRenderer) {
                                    if (rec.data.isDataExported && ColumnRendererEnum.getColumnRendererCategoryFromBehavior(rec.data.columnRenderer.behavior) == "Image") {
                                        rec.data.isDataExported = true;
                                    }
                                    else {
                                        rec.data.isDataExported = false;
                                    }
                                }
                            });
                        }
                    }
                }),
                colModel : new Ext.grid.ColumnModel({
                    columns : [ {
                        header : i18n.get('label.exportColumns'),
                        dataIndex : 'columnAlias',
                        sortable : true
                    }, checkColumn ]
                }),
                plugins : [ checkColumn ]
            }),
            name : "exportcolumns",
            value : [],
            getValue : function () {
                var columnsToExport = [];
                var store = this.grid2.getStore();

                store.each(function (record) {
                    var rec = {};
                    rec.columnAlias = record.data.columnAlias;
                    rec.isDataExported = record.data.isDataExported;
                    rec.columnRenderer = record.data.columnRenderer;
                    columnsToExport.push(rec);
                    
                });
                var columnsString = Ext.util.JSON.encode(columnsToExport);
                return columnsString;
            },
            setValue : function (value) {
                var columnsToExport = Ext.util.JSON.decode(value);
                Ext.each(columnsToExport, function (column) {
                    var recordColumn = new Ext.data.Record(column);
                    this.grid2.getStore().add(recordColumn);
                }, this);
                this.value = value;
            }
        }
    } ];
};
/**
 * @static Implementation of the method executeAsService to be able to launch
 *         this window as a service.
 * @param {Object}
 *            config contains all the service configuration
 */
sitools.user.component.dataviews.services.addToCartService.executeAsService = function (config) {
    var selections = config.dataview.getSelections();
    
    if(Ext.isEmpty(userLogin)) {
        alert("You need to be connected");
        return;
    }
    Ext.apply(this, config);
    
    this.cartSelectionFile = [];
    
    (Ext.isEmpty(userLogin)) ? this.user = "public" : this.user = userLogin;
    
    var rec = selections[0];
    if (Ext.isEmpty(rec)) {
        Ext.Msg.alert(i18n.get('label.warning'), i18n.get('warning.noRecordsSelected'));
        return;
    }
    
    
    Ext.each(this.parameters, function (config) {
        if (!Ext.isEmpty(config.value)) {
            switch (config.name) {
            case "exportcolumns":
                this.selectionColumns = Ext.util.JSON.decode(config.value);
                break;
            }
        }
    }, this);
    
    
    this.selectionName = config.dataview.datasetName;
    
    this.addToCart();
    

//    var addSelectionService = new sitools.user.component.dataviews.services.addToCartService(config);
//    addSelectionService.show();
    
    
    
};