/***************************************
* Copyright 2011, 2012 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
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
Ext.namespace('sitools.admin.guiServices');

sitools.admin.guiServices.guiServicesStore = Ext.extend(Ext.data.JsonStore, {
    
    constructor : function (config) {
        
        Ext.apply(config, {
            root : 'data',
            restful : true,
            remoteSort : true,
            autoSave : false,
            url : config.url,
            idProperty : 'id',
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
                name : 'label',
                type : 'string'
            }, {
                name : 'author',
                type : 'string'
            }, {
                name : 'version',
                type : 'string'
            }, {
                name : 'iconClass',
                type : 'string'
            }, {
                name : 'xtype',
                type : 'string'
            }, {
                name : 'priority',
                type : 'string'
            }, {
                name : 'dependencies'
            }]        
        });
        
        sitools.admin.guiServices.guiServicesStore.superclass.constructor.call(this, config);
    },
     
    saveRecord : function (rec) {
		this.handleCall(rec, this.url, "POST");
    },
     
    updateRecord : function (rec) {
        if (Ext.isEmpty(rec.id)) {
            return;
        }
        var url = this.url + "/" + rec.id;
        this.handleCall(rec, url, "PUT");        
    },
     
    handleCall : function (rec, method, url) {
        Ext.Ajax.request({
            url : url,
            method : method,
            scope : this,
            jsonData : rec,
            success : function (ret) {
                var data = Ext.decode(ret.responseText);
                if (!data.success) {
                    Ext.Msg.alert(i18n.get('label.warning'), i18n.get(data.message));
                    return false;
                }
                this.reload();
            },
            failure : alertFailure
        });
    },
     
    deleteRecord : function (rec) {
		Ext.Ajax.request({
		    url : this.url + "/" + rec.id,
		    method : 'DELETE',
		    scope : this,
		    success : function (ret) {
		        if (showResponse(ret)) {
		            this.remove(rec);
		        }
		    },
		    failure : alertFailure
		});
    }
     
});


