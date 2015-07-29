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
/*global Ext, sitools, ID, i18n, document, showResponse, alertFailure, LOCALE, ImageChooser, loadUrl, extColModelToStorage, SitoolsDesk, sql2ext
 */

Ext.namespace('sitools.extension.component.datasets.services');

/**
 * Window that contains a tools to sort a store
 *
 * @cfg {} dataview The view the tool is open in
 * @cfg {} pos The position to apply to the window
 * @cfg {Ext.data.Store} store the store to sort
 * @cfg {} columnModel the dataset ColumnModel to know all columns on wich you
 *      can do a sort.
 * @class sitools.user.component.datasets.services.SorterService
 * @extends Ext.Window
 */
Ext.define('sitools.extension.component.datasets.services.MizarMappingService', {
    extend: 'sitools.user.core.PluginComponent',
    alias: 'widget.mizarMappingService',

    pluginName: 'mizarMappingService',

    i18nFolderPath: ['/sitools/client-extension/resources/i18n/mizarModule/'],

    statics: {
        getParameters: function () {
            return [{
                jsObj: "Ext.form.field.Text",
                config: {
                    anchor: "100%",
                    fieldLabel: i18n.get("label.GeoJSONPostGisResourceModel"),
                    labelWidth: 150,
                    value: "/geojson",
                    name: "geojsonResource"
                }
            }];
        }
    },

    init: function (config) {

        this.i18nMizarMappingService = I18nRegistry.retrieve(this.pluginName);
        this.mizarView = Ext.ComponentQuery.query('mizarModuleView')[0];

        if (Ext.isEmpty(this.mizarView)) {
            return Ext.Msg.show({
                title: i18n.get('label.warning'),
                msg: this.i18nMizarMappingService.get('label.mizarViewNotOpened'),
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.OK
            });
        }


        this.dataset = config.dataview.dataset;
        this.dataview = config.dataview;
        this.datasetCm = config.dataview.columns;
        this.mizarServiceButton = config.serviceView.down('button[idService=' + config.id + ']');

        //add layer to Mizar
        Ext.each(config.parameters, function (config) {
            switch (config.name) {
                case "geojsonResource" :
                    this.geojsonResource = config.value;
                    break;
            }
        }, this);
        //service url
        var geojsonUrl = this.dataset.sitoolsAttachementForUsers + this.geojsonResource;

        var layer = mizarWidget.getLayer(this.dataset.name);
        if (Ext.isEmpty(layer)) {

            //layer = mizarWidget.addLayer({
            //    "category": "Other",
            //    "type": "DynamicOpenSearch",
            //    "name": this.dataset.name,
            //    "serviceUrl": geojsonUrl,
            //    //"data": {
            //    //    "type": "JSON",
            //    //    "url": geojsonUrl
            //    //},
            //    "availableServices": [ "OpenSearch" ],
            //    "visible": true,
            //    "pickable": true,
            //    "minOrder": 3
            //});

            layer = mizarWidget.addLayer({
                "category": "Other",
                "type": "GeoJSON",
                "name": this.dataset.name,
                //"serviceUrl": "http://localhost:8182/proxy_resto",
                //"data": {
                //    "type": "JSON",
                //    "url": geojsonUrl
                //},
                //"availableServices": [ "OpenSearch" ],
                "visible": true,
                "pickable": true
                //"minOrder": 3
            });

            //layer.subscribe("endLoad", function(layer){
            //    // Show received features
            //    console.dir(arguments);
            //    //mizarUtils.zoomTo(layer);
            //});


            Ext.Ajax.request({
                url: geojsonUrl,
                method: 'GET',
                success: function (ret) {
                    var response = Ext.decode(ret.responseText);
                    MizarGlobal.jsonProcessor.handleFeatureCollection(layer, response);
                    layer.addFeatureCollection(response);
                    mizarUtils.zoomTo(layer);
                }
            })


        }
        else {
            // show layer
            layer.visible(true);
            mizarUtils.zoomTo(layer);
        }

        this.isMizarLinked = this.linkMizarWithGrid();

    },

    linkMizarWithGrid: function () {
        this.dataview.addListener('selectionchange', this.selectRecordOnMap, this);
        mizarWidget.navigation.renderContext.canvas.addEventListener('mouseup', Ext.bind(this.selectRecordInGrid, this));
        popupMessage("", this.i18nMizarMappingService.get('label.mizarSuccessfullyMapped'), null, "x-info");
    },

    selectRecordInGrid: function (event) {
        console.log("selectRecordInGrid");
        var pickPoint = mizarWidget.navigation.globe.getLonLatFromPixel(event.layerX, event.layerY);

        var selections = MizarGlobal.pickingManager.computePickSelection(pickPoint);
        var recordsIndex = [];

        if (selections.length > 0) {
            var primaryKey = this.dataview.getStore().primaryKey;
            Ext.each(selections, function (selection) {
                var recordIndex = this.dataview.getStore().findBy(function (record) {
                    if (record.get(primaryKey) === selection.feature.id) {
                        return true;
                    }
                }, this);
                recordsIndex.push(recordIndex);
            }, this);
        }
        this.dataview.getSelectionModel().select(recordsIndex, false, true);
        //update the selection info on livegrid toolbar if it exists
        var livegridToolbar = this.dataview.down("livegridpagingtoolbar");
        if (livegridToolbar) {
            livegridToolbar.updateSelectionInfo();
        }
    },

    selectRecordOnMap: function (selectionModel, recordsIndex) {
        console.log("selectRecordOnMap");
        MizarGlobal.pickingManager.doClearSelection();
        if (Ext.isEmpty(recordsIndex)) {
            return;
        }
        MizarGlobal.pickingManager.deactivate();
        var layer = mizarWidget.getLayer(this.dataset.name);
        if (Ext.isEmpty(layer)) {
            return;
        }

        var features = layer.features;
        var primaryKey = this.dataview.getStore().primaryKey;
        var isAllSelected = this.dataview.isAllSelected();


        var mizarFeatureMap = new Ext.util.MixedCollection({
            'getKey': function (obj) {
                return obj.id;
            }
        });
        mizarFeatureMap.addAll(features);

        var featuresSelected = [];
        if (isAllSelected) {
            mizarFeatureMap.each(function (feature) {
                this._selectOnMap(feature, layer);
                featuresSelected = mizarFeatureMap.items;
            }, this);
        }
        else {
            Ext.each(recordsIndex, function (recordIndex) {
                var record = this.dataview.getStore().getAt(recordIndex);
                if (Ext.isEmpty(record)) {
                    return;
                }
                var feature = mizarFeatureMap.get(record.get(primaryKey));
                if (!Ext.isEmpty(feature)) {
                    this._selectOnMap(feature, layer);
                    featuresSelected.push(feature);
                }
            }, this);
        }


        var barycenter = mizarUtils.computeGeometryBarycenter(featuresSelected);
        var coord = mizarWidget.sky.coordinateSystem.fromGeoToEquatorial(barycenter, null, false);

        mizarWidget.navigation.zoomTo(coord, 2.0, 0.1, MizarGlobal.pickingManager.activate);
    },

    _selectOnMap: function (feature, layer) {
        mizarWidget.highlightObservation({
            feature: feature,
            layer: layer
        }, {
            isExclusive: false
        });
    }
});