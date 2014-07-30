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

Ext.namespace('sitools.user.controller.header');

/**
 * Populate the div x-headers of the sitools Desktop. 
 * @cfg {String} htmlContent html content of the headers, 
 * @cfg {Array} modules the modules list
 * @class sitools.user.component.entete.Entete
 * @extends Ext.Panel
 */
Ext.define("sitools.user.controller.header.HeaderController", {
    
    extend : 'Ext.app.Controller',
    
    views : ['header.HeaderView', 
             'header.UserProfileView',
             'header.ButtonTaskBarView'],
    
    heightNormalMode : 0, 
    heightMaximizeDesktopMode : 0,
    
    config : {
        HeaderView : null,
        UserProfileView : null
    },
    
    init : function () {
        
        this.getApplication().on('projectLoaded', this.onProjectLoaded, this);
        
        this.control({
        	
        	/* HeaderView events */
        	'headerView' : {
//        		afterRender : function (me) {
//                    // var enteteEl = SitoolsDesk.getEnteteEl();
//                    var enteteEl = Ext.get('x-headers');
//                    me.setHeight(enteteEl.getHeight());
//
//                    me.heightNormalMode = enteteEl.getHeight();
//                    me.heightMaximizeDesktopMode = me.NavBarsPanel.getHeight();
//                },
//                maximizeDesktop : this.onMaximizeDesktop,
//                minimizeDesktop : this.onMinimizeDesktop,
//                windowResize : function (me) {
//                    if (!Ext.isEmpty(me.userContainer) && me.userContainer.isVisible()) {
//                        me.userContainer.hide();
//                    }
//                },
//                desktopReady : function (me) {
//                    me.entetePanel.fireEvent("desktopReady", me.navToolbarButtons);
//                }
        	},
        	
        	'headerView toolbar[name=navbarPanels]' : {
        		maximizeDesktop : this.onMaximizeDesktopNavbar,
                minimizeDesktop : this.onMinimizeDesktopNavbar
        	},
        	
        	/* UserProfilerView events */
			'userProfileWindow' : {
                beforerender : function (usrProfileWindow) {
                    usrProfileWindow.x = Ext.getBody().getWidth() - usrProfileWindow.width;
                    usrProfileWindow.y = this.getEnteteEl().getHeight(); 
                },
                blur : function (userProfileWindow) {
                	this.close();
                }
            },
            
            'userProfileWindow button[name="usrProfileLogout"]' : {
                click : function (btn) {
                    sitools.public.utils.LoginUtils.logout();
                }
            },
            
            'userProfileWindow button[name="usrProfileLogin"]' : {
                click : function (btn) {
                    sitools.public.utils.LoginUtils.connect({
                        closable : true,
                        url : loadUrl.get('APP_URL') + loadUrl.get('APP_LOGIN_PATH_URL') + '/login',
                        register : loadUrl.get('APP_URL') + '/inscriptions/user',
                        reset : loadUrl.get('APP_URL') + '/lostPassword',
                        unblacklist : loadUrl.get('APP_URL') + '/unblacklist'                    
                    });
                }
            },
            
            'userProfileWindow button[name="usrProfileRegister"]' : {
                click : function (btn) {
                    var register = new sitools.public.userProfile.Register({
                        closable : true,
                        url : loadUrl.get('APP_URL')+ "/inscriptions/user",
                        reset : loadUrl.get('APP_URL') + '/lostPassword',
                        unblacklist : loadUrl.get('APP_URL') + '/unblacklist',
                        login : loadUrl.get('APP_URL') + loadUrl.get('APP_LOGIN_PATH_URL') + '/login'
                    });
                    register.show();
                }
            },
            
            'userProfileWindow button[name="usrProfileRegister"]' : {
                click : function (btn) {
                    var register = new sitools.public.userProfile.Register({
                        closable : true,
                        url : loadUrl.get('APP_URL')+ "/inscriptions/user",
                        reset : loadUrl.get('APP_URL') + '/lostPassword',
                        unblacklist : loadUrl.get('APP_URL') + '/unblacklist',
                        login : loadUrl.get('APP_URL') + loadUrl.get('APP_LOGIN_PATH_URL') + '/login'
                    });
                    register.show();
                }
            },
            
            /* ButtonTaskbarView events */
            'buttonTaskBarView button[name=profilBtn]' : {
            	click : function (btn) {
            		var win = Ext.create('sitools.user.view.header.UserProfileView', {
                        buttonId : btn.id
                    });
                    win.show();
            	}
            },
            
			'buttonTaskBarView button[name=maximizeBtn]' : {
				click : function (btn) {
					if (Project.navigationMode) {
						this.getApplication().getController('DesktopController').minimize(); 
					}
					else {
						this.getApplication().getController('DesktopController').maximize();    
					}
				}
			}
            
        });
        this.callParent(arguments);
    },
    
    onProjectLoaded : function () {
        var project = Ext.getStore('ProjectStore').getProject();
        
        this.HeaderView = this.getView('header.HeaderView').create({
            renderTo : "x-headers",
            htmlContent : project.get('htmlHeader'),
            modules : project.modules(),
            listeners : {
                resize : function (me) {
                    me.setSize(SitoolsDesk.getEnteteEl().getSize());
                }
            }
        });
    },

	getEnteteEl : function () {
		return this.getHeaderView().getEl();
	},
	
	 /**
     * listeners of maximizeDesktop event :
     */
    onMaximizeDesktop : function () {
        this.entetePanel.hide();
        this.container.setHeight(this.heightMaximizeDesktopMode);
        this.setHeight(this.heightMaximizeDesktopMode);
        this.NavBarsPanel.fireEvent("maximizeDesktop");
        // this.userContainer.setVisible(! SitoolsDesk.desktopMaximizeMode);
        if (this.userContainer) {
            this.userContainer.fireEvent("maximizeDesktop", this.userContainer, this.navToolbarButtons);
            this.userContainer = null;
        }
        this.doLayout();
    },
    /**
     * listeners of minimizeDesktop event :
     */
    onMinimizeDesktop : function () {
        this.entetePanel.setVisible(true);
        this.container.dom.style.height = "";
        this.setHeight(this.heightNormalMode);
        this.NavBarsPanel.fireEvent("minimizeDesktop");
        // this.userContainer.setVisible(! SitoolsDesk.desktopMaximizeMode);
        if (this.userContainer) {
            this.userContainer.fireEvent("minimizeDesktop", this.userContainer, this.navToolbarButtons);
            this.userContainer = null;
        }
        this.doLayout();

    },
	
	/**
     * listeners of maximizeDesktop event
     */
    onMaximizeDesktopNavbar : function () {
        this.navBarModule.fireEvent("maximizeDesktop");
        this.navToolbarButtons.fireEvent("maximizeDesktop");
    },

    /**
     * listeners of minimizeDesktop event
     */
    onMinimizeDesktopNavbar : function () {
        this.navBarModule.fireEvent("minimizeDesktop");
        this.navToolbarButtons.fireEvent("minimizeDesktop");
    }
});