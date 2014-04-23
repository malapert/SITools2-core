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
/* global Ext, i18n, sitools, formPanel, result, window, SitoolsDesk, loadUrl */
/*
 * @include "openSearchResultFeed.js"
 */
Ext.namespace('sitools.user.component');
/**
 * A Panel to display OpenSearch queries and result.
 * 
 * @cfg {string} datasetId DatasetId
 * @cfg {string} datasetUrl the attachementUrl of the dataset
 * @cfg {string} datasetName the dataset Name.
 * @class sitools.user.component.datasetOpensearch
 * @extends Ext.Panel
 * @requires sitools.user.component.openSearchResultFeed
 */
Ext.define('sitools.user.component.datasetOpensearch', {
    extend : 'Ext.panel.Panel',
    alias : 'sitools.user.component.datasetOpensearch',
    componentType : "openSearch",
    layout : {
        type : 'vbox',
        align : 'stretch',
        pack : 'start'
    },

    initComponent : function () {

        var uri = config.dataUrl + "/opensearch/search";
        var uriSuggest = config.dataUrl + "/opensearch/suggest";

        var search;
        var ds = Ext.create('Ext.data.JsonStore', {
            url : uriSuggest,
            restful : true,
            root : 'data',
            fields : [ {
                name : 'field',
                type : 'string'
            }, {
                name : 'name',
                type : 'string'
            }, {
                name : 'nb',
                type : 'string'
            } ]
        });

        var resultTpl = new Ext.XTemplate('<tpl for="."><div class="search-item">', '<h3>{name}<span> ({field} / {nb} results ) </span></h3>', '</div></tpl>');

        search = Ext.create('Ext.form.field.ComboBox', {
            store : ds,
            displayField : 'name',
            typeAhead : false,
            loadingText : i18n.get("label.searching"),
            hideTrigger : true,
            name : 'searchQuery',
            anchor : "90%",
            tpl : resultTpl,
            itemSelector : 'div.search-item',
            minChars : 2,
            queryParam : 'q',
            enableKeyEvents : true,
            scope : this,
            listeners : {
                scope : this,
                beforequery : function (queryEvent) {
                    if (queryEvent.query.indexOf(" ") == -1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                specialkey : function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        _clickOnSearch();
                    }
                },
                beforeselect : function (self, record, index) {
                    var tabName = record.data.name.split(':');
                    if (tabName.length > 1) {
                        record.data.name = tabName[1];
                    }

                    record.data.name = record.data.field + ":" + record.data.name;
                    return true;
                }
            }
        });

        var link = Ext.create('Ext.button.Button', {
            icon : loadUrl.get('APP_URL') + '/common/res/images/icons/help.png',
            scope : this,
            handler : function () {
                var helpModule = SitoolsDesk.app.findModule("helpWindow");
                if (!Ext.isEmpty(helpModule.getWindow())) {
                    helpModule.getWindow().close();
                }
                helpModule.openModule({
                    activeNode : "Recherche_OpenSearch"
                });
            },
            width : 20

        });

        var field = Ext.create('Ext.form.FieldContainer', {
            fieldLabel : i18n.get("label.search"),
            anchor : '100%',
            defaults : {
                flex : 1
            },
            items : [ search, link ]
        });

        var items = field;

        var buttonForm = [{
            text : i18n.get("label.search"),
            scope : this,
            handler : this._clickOnSearch
        }];

        var formPanel = Ext.create('Ext.form.Panel', {
            labelWidth : 75, // label settings here cascade unless
            height : 75,
            frame : true,
            defaultType : 'textfield',
            items : items,
            buttons : buttonForm

        });

        var result = Ext.create('sitools.user.component.openSearchResultFeed', {
            input : search,
            dataUrl : config.dataUrl,
            pagging : true,
            datasetName : config.datasetName,
            datasetId : config.datasetId,
            exceptionHttpHandler : function (proxy, type, action, options, response, args) {
                // si on a un cookie de session et une erreur 403
                if ((response.status == 403) && !Ext.isEmpty(Ext.util.Cookies.get('hashCode'))) {
                    Ext.MessageBox.minWidth = 360;
                    Ext.MessageBox.alert(i18n.get('label.session.expired'), response.responseText);
                    return false;
                }
                return true;
            }
        });

        this.items = [ formPanel, result ];

        sitools.user.component.datasetOpensearch.superclass.initComponent.call(this);
    },

    /**
     * click handler for the search button gets the search query and update the
     * RSS feed URI to display the results
     */
    _clickOnSearch : function () {
        var searchQuery = formPanel.getForm().getValues().searchQuery;
        result.updateStore(uri + "?q=" + searchQuery);
    },

    _getSettings : function () {
        return {
            objectName : "datasetOpenSearch",
            datasetName : this.datasetName,
            preferencesPath : this.preferencesPath,
            preferencesFileName : this.preferencesFileName
        };
    }
});
