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
/*global Ext, sitools, window, showVersion, publicStorage, userLogin, projectGlobal, SitoolsDesk, showResponse, i18n, extColModelToJsonColModel, loadUrl*/

/**
 * @cfg {Array} modules la liste des modules
 * @class sitools.user.component.entete.NavBarButtons
 * @extends Ext.Toolbar
 */
Ext.define('sitools.user.view.header.ButtonTaskBarView', {
    extend : 'Ext.Toolbar',
    alias: 'widget.buttonTaskBarView',
    
    requires : ['sitools.public.utils.LoginUtils'],
    /**
     * The id of the button to open the profile window
     */
    profileButtonId : "profileButtonId", 
    
    initComponent : function () {
        
        var itemsButtons = [];
        var userLogin = sitools.public.utils.LoginUtils.getUserLogin();
        if (!Ext.isEmpty(userLogin)) {
            // width with save button
            this.width = '204px';
        }
        
        /**
         * The btn to open profileWindow
         */
        this.profilButton = Ext.create("Ext.Button", {
        	name : 'profilBtn',
            scope : this, 
            iconCls : 'navBarButtons-icon',
            cls : 'navBarTransition',
            icon : "/sitools/common/res/images/icons/navBarButtons/user-icon.png", 
            tooltip : {
                html : i18n.get('label.profil'), 
                anchor : 'bottom', 
                trackMouse : false
            }, 
            id : this.profileButtonId
        });
        itemsButtons.push(this.profilButton);
        
        this.versionButton = Ext.create('Ext.Button', {
        	name : 'versionBtn',
            iconCls : 'navBarButtons-icon',
            icon : "/sitools/common/res/images/icons/navBarButtons/version-icon.png", 
            tooltip : {
                html : i18n.get('label.version'), 
                anchor : 'bottom', 
                trackMouse : false
            }
        });
        itemsButtons.push(this.versionButton);
        
        if (!Ext.isEmpty(userLogin)) {
            this.saveButton = Ext.create('Ext.Button', {
                scope : this, 
                iconCls : 'navBarButtons-icon',
                handler : this.saveAction, 
//                scale : "medium", 
                icon : "/sitools/common/res/images/icons/navBarButtons/save-icon.png", 
                tooltip : {
                    html : i18n.get('label.save'), 
                    anchor : 'bottom', 
                    trackMouse : false
                }, 
                id : "saveBtnId"
            });
            itemsButtons.push(this.saveButton);
        }
        
        this.helpButton = Ext.create('Ext.Button', {
            iconCls : 'navBarButtons-icon',
//            scale : "medium", 
            scope : this, 
            icon : "/sitools/common/res/images/icons/navBarButtons/help-icon.png", 
//            handler : SitoolsDesk.showHelp,
            handler : function () {
                alert('todo');
            },
            tooltip : {
                html : i18n.get('label.help'), 
                anchor : 'bottom', 
                trackMouse : false
            }
        });
        itemsButtons.push(this.helpButton);
        
        /**A specialized btn to switch between normal and maximize mode */
        this.maximizeButton = Ext.create('Ext.Button', {
			name : 'maximizeBtn',
			iconCls : 'navBarButtons-icon',
//            icon : SitoolsDesk.desktopMaximizeMode ? "/sitools/common/res/images/icons/navBarButtons/mini-icon.png" : "/sitools/common/res/images/icons/navBarButtons/maxi-icon.png",  
            tooltip : {
            	id : 'tooltipId',
//                html : SitoolsDesk.desktopMaximizeMode ? i18n.get('label.maximize') : i18n.get('label.minimize'), 
                anchor : 'bottom',
                trackMouse : false,
                listeners : {
                	show : function (tooltip){
		                if (SitoolsDesk.desktopMaximizeMode) {
                			tooltip.update(i18n.get('label.minimize'));
		                }
		                else {
	                		tooltip.update(i18n.get('label.maximize'));
		                }
                	}
                }
            }
        });
        itemsButtons.push(this.maximizeButton);
        
        this.callParent(Ext.apply(this,  {
            id : 'navBarButtonsId',
            enableOverflow: true,
//            defaults : {
//                overCls : "x-navBar-items-over", 
//                ctCls : "x-navBar-items-ct"
//            }, 
            items : itemsButtons, 
//            cls : "x-navBar-buttons", 
//            overCls : "x-navBar-over", 
//            ctCls : "x-navBar-ct", 
            width : this.width,
            listeners : {
                scope : this, 
                maximizeDesktop : this.onMaximizeDesktop, 
                minimizeDesktop : this.onMinimizeDesktop 
            }, 
            border : false
        }));
    }, 
    
    /**
     * listeners of maximizeDesktop event
     */
    onMaximizeDesktop : function () {
        this.maximizeButton.setIcon("/sitools/common/res/images/icons/navBarButtons/mini-icon.png");
        //SitoolsDesk.desktopMaximizeMode = true;
        this.maximizeButton.tooltip.html = i18n.get('label.minimize');
    },
    
    /**
     * listeners of minimizeDesktop event
     */
    onMinimizeDesktop : function () {
        this.maximizeButton.setIcon("/sitools/common/res/images/icons/navBarButtons/maxi-icon.png");
      //  SitoolsDesk.desktopMaximizeMode = false;
        this.maximizeButton.tooltip.html = i18n.get('label.maximize');
    },
    
    /**
     * Returns the maximizeBtn
     * @returns {Ext.Button}
     */
    getMaximizeButton : function () {
        return this.maximizeButton;
    }, 
    
    /**
     * Handler of Save Btn. If admin Role : open a menu, else save desktop. 
     * @param {Ext.Button} btn The pressed btn
     * @param {Ext.event} event the click Event. 
     * @returns
     */
    saveAction : function (btn, event) {
        if (!Ext.isEmpty(userLogin) && projectGlobal && projectGlobal.isAdmin) {
            var ctxMenu = new Ext.menu.Menu({
                items: ['<b class="menu-title">' + i18n.get('label.chooseSaveType') + '</b>', '-',
                {
                    text: i18n.get("label.myself"),
                    handler : function () {
                        SitoolsDesk.app.saveWindowSettings();
                    }
                }, {
                    text: i18n.get("label.publicUser"),
                    handler : function () {
                        SitoolsDesk.app.saveWindowSettings(true);
                    }
                }, {
                    text : i18n.get('label.deletePublicPref'),
                    handler : function () {
                        publicStorage.remove();
                    }
                }] 
            });
            ctxMenu.showAt([event.getXY()[0], SitoolsDesk.getEnteteEl().getHeight()]);
        }
        else {
            SitoolsDesk.app.saveWindowSettings();
        }
    }
    
});