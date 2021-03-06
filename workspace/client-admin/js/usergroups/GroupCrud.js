/***************************************
* Copyright 2010-2016 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
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
Ext.namespace('sitools.admin.usergroups');

/**
 * A Panel to show all the groups in Sitools2
 * 
 * @cfg {String} the url where get the resource
 * @cfg {Ext.data.JsonStore} the store where saved the group data
 * @class sitools.admin.usergroups.GroupCrud
 * @extends Ext.grid.GridPanel
 */
Ext.define('sitools.admin.usergroups.GroupCrud', { 
    extend : 'Ext.grid.Panel', 
	alias : 'widget.s-groupcrud',
    border : false,
    height : ADMIN_PANEL_HEIGHT,
    id : ID.BOX.GROUP,
    mixins : {
        utils : 'sitools.admin.utils.utils'
    },
    pageSize : ADMIN_PANEL_NB_ELEMENTS,
    forceFit : true,
    
    requires : ['sitools.admin.usergroups.GroupProp',
                'sitools.admin.usergroups.UsersPanel'],

    initComponent : function () {
        this.url = loadUrl.get('APP_URL') + loadUrl.get('APP_SECURITY_URL') + '/groups';
        
        this.store = Ext.create("Ext.data.JsonStore", {
            remoteSort : true,
            pageSize : this.pageSize,
            proxy : {
                type : 'ajax',
                url : this.url,
                reader : {
                    type : 'json',
                    root : 'data',
                    idProperty : 'name'
                }
            },
            fields : [{
                name : 'name',
                type : 'string'
            }, {
                name : 'description',
                type : 'string'
            }]
        });

        this.columns = {
            defaults : {
                sortable : true
            },
            items : [{
                header : i18n.get('label.name'),
                dataIndex : 'name',
                width : 200,
                renderer : function (value, meta, record) {
                    meta.style = "font-weight: bold;";
                    return value;
                }
            }, {
                header : i18n.get('label.description'),
                dataIndex : 'description',
                width : 400
            }]
        };

        this.bbar = {
            xtype : 'pagingtoolbar',
            store : this.store,
            displayInfo : true,
            displayMsg : i18n.get('paging.display'),
            emptyMsg : i18n.get('paging.empty')
        };

        this.tbar = {
            xtype : 'toolbar',
            defaults : {
                scope : this
            },
            items : [{
                text : i18n.get('label.create'),
                icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_create.png',
                handler : this.onCreate,
                xtype : 's-menuButton'
            }, {
                text : i18n.get('label.modify'),
                icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_edit.png',
                handler : this.onModify,
                xtype : 's-menuButton'
            }, {
                text : i18n.get('label.delete'),
                icon : loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/icons/toolbar_delete.png',
                handler : this.onDelete,
                xtype : 's-menuButton'
            }, {
                text : i18n.get('label.users'),
                icon : 'res/images/icons/icons_perso/toolbar_userman.png',
                handler : this.onMembers,
                xtype : 's-menuButton'
            }, '->', {
                xtype : 's-filter',
                emptyText : i18n.get('label.search'),
                store : this.store,
                pageSize : this.pageSize
            }]
        };

        this.listeners = {
            scope : this, 
            itemdblclick : this.onModify
        };
        
        this.selModel = Ext.create('Ext.selection.RowModel', {
            mode : 'SINGLE'
        });
        sitools.admin.usergroups.GroupCrud.superclass.initComponent.call(this);
    },


    /**
     * done a specific render to load informations from the store. 
     */
    onRender : function () {
        sitools.admin.usergroups.GroupCrud.superclass.onRender.apply(this, arguments);
        this.store.load({
            start : 0,
            limit : this.pageSize
        });
    },

    /**
     * Create a new {sitools.admin.usergroups.GroupProp} groupPropertyPanel to create a new group
     */
    onCreate : function () {
        var up = Ext.create("sitools.admin.usergroups.GroupProp", {
            url : this.url,
            action : 'create',
            store : this.getStore()
        });
        up.show(ID.BOX.GROUP);
        // return Ext.Msg.alert(i18n.get('label.information'),
        // i18n.get('msg.notavailable'));
    },

    /**
     * Create a new {sitools.admin.usergroups.GroupProp} groupPropertyPanel to modify an existing group
     */
    onModify : function () {
        var rec = this.getLastSelectedRecord();
        if (!rec) {
            return popupMessage("", i18n.get('warning.noselection'), loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/msgBox/16/icon-info.png');;
        }
        var up = Ext.create("sitools.admin.usergroups.GroupProp", {
            url : this.url + '/' + rec.data.name,
            action : 'modify',
            store : this.getStore()
        });
        up.show(ID.BOX.GROUP);
    },

    /**
     * Diplay confirm delete Msg box and call the method doDelete
     */
    onDelete : function () {
        var rec = this.getLastSelectedRecord();
        if (!rec) {
            return popupMessage("", i18n.get('warning.noselection'), loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/msgBox/16/icon-info.png');;
        }

        Ext.Msg.show({
            title : i18n.get('label.delete'),
            buttons : Ext.Msg.YESNO,
            msg : Ext.String.format(i18n.get('msg.group.confirm.delete'), rec.data.name),
            scope : this,
            fn : function (btn, text) {
                if (btn == 'yes') {
                    this.doDelete(rec);
                }
            }
        });
    },
    
    /**
     * done the delete of the passed record
     * @param rec the record to delete
     */
    doDelete : function (rec) {
        // var rec = this.getSelectionModel().getSelected();
        // if (!rec) return false;
        Ext.Ajax.request({
            url : this.url + "/" + rec.data.name,
            method : 'DELETE',
            scope : this,
            success : function (ret) {
                if (showResponse(ret)) {
                    this.store.reload();
                }

            },
            failure : alertFailure
        });
    },

    /**
     * Gets all the members of the selected group and display them in an {sitools.admin.usergroups.UsersPanel} users Panel
     * @returns
     */
    onMembers : function () {
        var rec = this.getLastSelectedRecord();
        if (!rec) {
            return popupMessage("", i18n.get('warning.noselection'), loadUrl.get('APP_URL') + loadUrl.get('APP_CLIENT_PUBLIC_URL')+'/res/images/msgBox/16/icon-info.png');;
        }
        
        delete rec.data.id;
        
        var up = Ext.create("sitools.admin.usergroups.UsersPanel", {
            mode : 'list',
            url : this.url + '/' + rec.data.name + '/users',
            data : rec.data
        });
        up.show(ID.BOX.GROUP);
    }
});

