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
/*
 * global Ext, sitools, i18n, document, projectGlobal, SitoolsDesk, userLogin,
 * DEFAULT_PREFERENCES_FOLDER, loadUrl
 */
/*
 * @include "../../sitoolsProject.js" @include "../../desktop/desktop.js"
 * @include "../../components/forms/forms.js" @include
 * "../../components/forms/projectForm.js"
 */

Ext.namespace('sitools.user.controller.modules.form');

/**
 * Forms Module : Displays All Forms depending on datasets attached to the
 * project.
 * 
 * @class sitools.user.modules.formsModule
 * @extends Ext.grid.GridPanel
 * @requires sitools.user.component.forms.mainContainer
 */
Ext.define('sitools.user.controller.component.form.ProjectFormController', {
	extend : 'Ext.app.Controller',
    
    views : ['component.form.ProjectFormView',
             'component.form.OverviewResultProjectForm',
             'component.form.ResultProjectForm'],
    
    init : function () {
        this.control({
//        	'projectformview #displayPanelId' : {
            'projectformview' : {
                resize : this.resizeForm
            },
            
            'projectformview #propertyPanelId' : {
                click : this.propertySearch
            },
            
            'projectformview #btnSearchForm' : {
                click : this.onSearch
            }
        });
    },
    
    resizeForm :  function (displayPanel, width, height, oldWidth, oldHeight) {
        
        if (!Ext.isEmpty(displayPanel.zonesPanel.getEl())) {
        	
            var cmpChildSize = displayPanel.zonesPanel.getSize();
            var size = displayPanel.body.getSize();
            var xpos = 0, ypos = 0;
            
            if (size.height > cmpChildSize.height) {
                ypos = (size.height - cmpChildSize.height) / 2;
            }
            if (size.width > cmpChildSize.width) {
                xpos = (size.width - cmpChildSize.width) / 2;
            }
            
            displayPanel.zonesPanel.setPosition(xpos, ypos);
        }
    }, 
    
    /**
     * Build the query for the multiDs search
     * @param {Ext.Button} button The button that launch the request (to be disabled)
     * @returns
     */
    onSearch : function (button) {
//        button.setDisabled(true);
        
        var projectformview = button.up('projectformview');
        var containers = projectformview.down('[stype="sitoolsFormContainer"]');
        
        var formMultiDsParams = [];
        var glue = "";
        var i = 0;
        var datasets = [];
        projectformview.datasetPanel.getStore().each(function (rec) {
            if (rec.get("visible")) {
                datasets.push(rec.get('id'));
            }
        });
        if (datasets.length <= 0) {
            Ext.Msg.alert(i18n.get('label.error'), i18n.get('label.atLeastOneDataset'));
            button.setDisabled(false);
            return;
        }
        
        if (!Ext.isEmpty(projectformview.nbDatasetsMax) && datasets.length > projectformview.nbDatasetsMax) {          
            Ext.Msg.alert(i18n.get('label.error'), Ext.String.format(i18n.get('label.toManyDatasetsAllowed'), projectformview.nbDatasetsMax));
            button.setDisabled(false);
            return;
        }
        var valid = true;
        
        projectformview.zonesPanel.items.each(function(componentList) {
            valid = valid && componentList.isComponentsValid();            
        },projectformview);
        
        if (!valid) {
        	projectformview.down('toolbar').setStatus({
                text : i18n.get('label.checkformvalue'),
                iconCls : 'x-status-error'
            });
        	projectformview.down('toolbar').setVisible(true);    
            button.setDisabled(false);
            return;
        } else {
        	projectformview.down('toolbar').setVisible(false);
        }
        
        Ext.each(containers, function (container) {
            if (Ext.isFunction(container.getParameterValue)) {
                var param = container.getParameterValue();
                
                if (!Ext.isEmpty(param)) {
                    formMultiDsParams.push(this.paramValueToApi(param, projectformview));
                }
            }
        }, this);
        
        var urlService = Project.sitoolsAttachementForUsers + projectformview.urlServiceDatasetSearch;
        
        var params = {};
        params.datasetsList = datasets.join("|");

        i = 0;
        if (!Ext.isEmpty(formMultiDsParams)) {
            Ext.each(formMultiDsParams, function (param) {
                params["c[" + i + "]"] = param;
                i += 1;
            }, this);
        }

        //Launch the first POST Request on service: 
        Ext.Ajax.request({
            method : "POST", 
            params : params, 
            //Just to be sure that params are passed with the url request
            jsonData : {}, 
            scope : this, 
            url : urlService, 
            success : function (response) {
                try {
                    var json = Ext.decode(response.responseText);
                    if (! json.success) {
                        Ext.Msg.alert(i18n.get('label.error'), json.message);
                        return;
                    }
                    
//                    var jsObj = SitoolsDesk.navProfile.multiDataset.getObjectResults();
                    var jsObj = Desktop.getNavMode().multiDataset.getObjectResults();
                    
                    var componentCfg = {
                        urlTask : json.TaskModel.statusUrl,
                        formId : projectformview.formId,
                        formMultiDsParams : formMultiDsParams,
                        datasets : datasets, 
                        formName : projectformview.formName, 
                        callerId : this.id
                    };

                    var windowConfig = {
                        id : "windMultiDsResultForm" + projectformview.formId, 
                        title : i18n.get('label.MultiDsResultForm') + " : " + projectformview.formName, 
                        saveToolbar : false, 
                        iconCls : "dataviews"
                    };
                    
                    var viewResultForm = Ext.create(jsObj, componentCfg);
                    
                    Desktop.getNavMode().openComponent(viewResultForm, windowConfig);
//                    SitoolsDesk.addDesktopWindow(windowConfig, componentCfg, jsObj);
                    
                }
                catch (err) {
                    Ext.Msg.alert(i18n.get('label.error'), err);
                    return;
                }
            }, 
                
            failure : alertFailure
        });
        
//        var desktop = getDesktop();
//        var win = desktop.getWindow("windMultiDsResultForm" + this.formId);
//        if (win) {
//            win.close();
//        }

    },
    /**
     * A method to save all the window settings to be abble to reload it when desktop is reloaded. 
     * @return {}
     */
    _getSettings : function () {
        return {
            objectName : "projectForm", 
            formId : this.formId,
            formName : this.formName,
            formParameters : this.formParameters,
            formWidth : this.formWidth,
            formHeight : this.formHeight, 
            formCss : this.formCss, 
            properties : this.properties, 
            urlServicePropertiesSearch : this.urlServicePropertiesSearch, 
            urlServiceDatasetSearch : this.urlServiceDatasetSearch, 
            componentType : this.componentType, 
            dictionaryName : this.dictionaryName,
            preferencesPath : this.preferencesPath, 
            preferencesFileName : this.preferencesFileName,
            formZones : this.zones
            
        };
    }, 
    /**
     * Build a string using a form param Value. 
     * @param {} paramValue An object with attributes : at least type, code, value and optionnal userDimension, userUnit
     * @return {string} something like "TEXTFIELD|ColumnAlias|value"
     */
    paramValueToApi : function (paramValue, projectformview) {
        var stringParam = paramValue.type + "|" + projectformview.dictionaryName + "," + paramValue.code + "|" + paramValue.value;
        if (!Ext.isEmpty(paramValue.userDimension) && !Ext.isEmpty(paramValue.userUnit)) {
            stringParam += "|" + paramValue.userDimension + "|" + paramValue.userUnit.unitName; 
        }  
        return stringParam;
    }, 
    /**
     * Returns the search Button. 
     * @return {}
     */
    getSearchButton : function () {
        return this.searchButton;
    }, 
    /**
     * Build for a properties a new formField depending on property type. 
     * The property type could be one of : 
     *  - TEXTFIELD, 
     *  - NUMERIC_FIELD, 
     *  - NUMERIC_BETWEEN, 
     *  - DATE_BETWEEN
     * @param {} prop the Json definition of a property. 
     * @return {Ext.form.Field} a simple or composite field. 
     */
    buildPropertyField : function (prop) {
        var field;
        switch (prop.type) {
        case "TEXTFIELD" : 
            field = {
                xtype : "textfield", 
                name : prop.name, 
                anchor : '98%', 
                enableKeyEvents : true, 
                fieldLabel : prop.name, 
                getAPIValue : function () {
                    if (Ext.isEmpty(this.getValue())) {
                        return null;
                    }
                    return Ext.String.format("{0}|{1}|{2}", prop.type, prop.name, this.getValue());
                }
            };          
            break;
        case "NUMBER_FIELD" : 
            field = {
                xtype : "numberfield", 
                name : prop.name, 
                anchor : '98%', 
                enableKeyEvents : true, 
                fieldLabel : prop.name, 
                getAPIValue : function () {
                    if (Ext.isEmpty(this.getValue())) {
                        return null;
                    }
                    return Ext.String.format("{0}|{1}|{2}", prop.type, prop.name, this.getValue());
                }
            };          
            break;
        case "NUMERIC_BETWEEN" : 
            field = {
                xtype: 'fieldcontainer',
                defaults: {
                    flex: 1
                },
                msgTarget: 'under',
                anchor : '98%', 
                items: [
                    {
                        xtype: 'numberfield',
                        name : prop.name + "deb", 
                        enableKeyEvents : true
                    },
                    {
                        xtype: 'numberfield',
                        name : prop.name + "fin"
                
                    }
                ],
                fieldLabel : prop.name, 
                getAPIValue : function () {
                    var deb = this.items.itemAt(0).getValue();
                    var fin = this.items.itemAt(1).getValue();
                    if (Ext.isEmpty(deb) || Ext.isEmpty(fin)) {
                        return null;
                    }
                    return Ext.String.format("{0}|{1}|{2}|{3}", prop.type, prop.name, deb, fin);
                }
            };          
            break;
        case "DATE_BETWEEN" : 
            field = {
                xtype: 'fieldcontainer',
                defaults: {
                    flex: 1
                },
                msgTarget: 'under',
                anchor : '98%', 
                items: [
                    {
                        xtype: 'datefield',
                        name : prop.name + "deb", 
                        enableKeyEvents : true, 
                        format : SITOOLS_DEFAULT_IHM_DATE_FORMAT, 
                        showTime : true
                    },
                    {
                        xtype: 'datefield',
                        name : prop.name + "fin", 
                        format : SITOOLS_DEFAULT_IHM_DATE_FORMAT, 
                        showTime : true
                
                    }
                ],
                fieldLabel : prop.name, 
                getAPIValue : function () {
                    var deb, fin;
                    try {
                        deb = this.items.itemAt(0).getValue().format(SITOOLS_DATE_FORMAT);
                        fin = this.items.itemAt(1).getValue().format(SITOOLS_DATE_FORMAT);
                    
                    }
                    catch (err) {
                        return null;
                    }
                    if (Ext.isEmpty(deb) || Ext.isEmpty(fin)) {
                        return null;
                    }
                    return Ext.String.format("{0}|{1}|{2}|{3}", prop.type, prop.name, deb, fin);
                }
            };          
            break;
        }
        return field;
    }, 
    /**
     * Method called when user pressed on refresh Datasets button. 
     * Course properties and creates the parameters of the query to search the list of datasets
     */
    propertySearch : function () {
        var properties = this.propertyPanel.items.items;
        var params = {};
        var j = 0;
        var k = {};
        for (var i = 0; i < properties.length; i++) {
            var prop = properties[i];
            if (!Ext.isEmpty(prop.getAPIValue())) {
                params["k[" + j + "]"] = prop.getAPIValue();
                j++;
            }
        }
        this.datasetPanel.getStore().load({
            params : params
        });
        this.datasetPanel.getView().refresh();
    }
    
});
