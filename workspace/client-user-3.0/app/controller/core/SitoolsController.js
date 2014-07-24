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
/*global Ext, i18n, loadUrl, getDesktop, sitools, SitoolsDesk */
Ext.define('sitools.user.controller.core.SitoolsController', {

    extend : 'Ext.app.Controller',

    stores : [ 'ProjectStore' ],

    init : function () {
        var me = this, desktopCfg;

        this.control({
            'moduleTaskBar button' : {
                click : this.onOpenModule
            }
        });

        this.getApplication().on('projectInitialized', this.loadProject, this);
    },

    loadProject : function () {
        var url = sitools.user.utils.Project.getSitoolsAttachementForUsers();
        var store = this.getStore("ProjectStore");
        store.setCustomUrl(url);
        store.load({
            scope : this,
            callback : function (records, operation, success) {
                this.getApplication().noticeProjectLoaded();
            }
        });
    },

    openModule : function (moduleModel) {
        var module = Ext.create(moduleModel.xtype);
        module.create(this.getApplication(), moduleModel);
        module.init();
    },
    
    openComponent : function (clazz, componentConfig, windowConfig) {
        var moduleController = this.getApplication().getController(clazz);
        moduleController.initComponent(componentConfig, windowConfig);
        moduleController.onLaunch(this.getApplication());
    },
    
    onOpenModule : function (button, e, opts) {
        // get the module from the button
        var module = button.module;
        this.openModule(module);
    }

});