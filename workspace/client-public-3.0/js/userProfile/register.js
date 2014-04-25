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
/*global Ext, sitools, i18n,document*/
Ext.namespace('sitools.public.userProfile');
/*
 * config { url + handler }
 */
/**
 * @cfg {string} url the url to request when register
 * @cfg {string} login the url to login  
 * @class sitools.userProfile.Register
 * @extends Ext.Window
 */
Ext.define('sitools.public.userProfile.Register', {
    extend : 'Ext.window.Window',
	alias : 'widget.s-register',
	layout: 'hbox',
	width: 420,
	height: 500,
	resizable: false,
	closable: false,
	modal: true,
	layout : 'fit',
  
	initComponent: function () {
		this.title = i18n.get('label.register');
		this.captchaUrl = loadUrl.get('APP_URL') + loadUrl.get('APP_INSCRIPTIONS_USER_URL') + '/captcha?width=300&height=50';
		
	    this.bbar = Ext.create('sitools.public.widget.StatusBar', {
			text: i18n.get('label.ready'),
			iconCls: 'x-status-valid'
		});
	    
	    this.captcha = Ext.create('Ext.Component', {
	        id : 'captchaBox',
	        autoEl: {
	            tag: 'img',
	            src: this.captchaUrl + '&_dc=' + new Date().getTime()
	        },
	        fieldLabel : i18n.get('label.captcha'),
	        height : 50,
	        width : 300,
	        anchor: '100%'
	    });
	    
	    this.items = [{
	    	xtype: 'form',
//			frame: false,
			border: false,
			bodyBorder : false,
			buttonAlign: 'center',
			id: 'frmRegister',
			padding : 5,
			width: 400,
			height : 430,
			labelWidth: 120,
			items: [{
				xtype: 'textfield',
				fieldLabel: i18n.get('label.login'),
				name: 'identifier',
				id: 'regLogin',
				allowBlank: false,
	            vtype: 'uniquelogin',
	            anchor: '100%'
			}, {
				xtype: 'textfield',
				fieldLabel: i18n.get('label.firstName'),
				name: 'firstName',
				id: 'regFirstName',
				allowBlank: false,
	            anchor: '100%'
			}, {
				xtype: 'textfield',
				fieldLabel: i18n.get('label.lastName'),
				name: 'lastName',
				id: 'regLastName',
				allowBlank: false,
	            anchor: '100%'
			}, {
				xtype: 'textfield',
				fieldLabel: i18n.get('label.password'),
				name: 'password',
				allowBlank: false,
				inputType: 'password',
	            vtype: 'passwordComplexity',
	            id: 'pass1',
	            anchor: '100%'
			}, {
				xtype: 'textfield',
				fieldLabel: i18n.get('label.confirmPassword'),
				name: 'cpassword',
				submitValue: false,
				allowBlank: false,
				inputType: 'password',
	            id: 'pass2',
	            initialPassField: 'pass1',
	            vtype: 'password',
	            anchor: '100%'
			}, {
				xtype: 'textfield',
				fieldLabel: i18n.get('label.email'),
	            id: 'regEmail',
				name: 'email',
				vtype: 'uniqueemail',
				allowBlank: false,
	            validationEvent: '',
	            anchor: '100%'
			}, {
                xtype : 'textfield',
                name : 'organisation',
                fieldLabel : i18n.get('label.organisation'),
                anchor : '100%'
            }, {
				xtype: 'textarea',
				fieldLabel: i18n.get('label.comment'),
	            id: 'regComment',
				name: 'comment',
	            validationEvent: '',
	            height: 40,
	            anchor: '100%'
			}, 
			    this.captcha,
			{
			    xtype: 'button',
			    text: i18n.get('label.captchaReload'),
			    icon : loadUrl.get('APP_URL') + '/client-public/common/res/images/icons/refresh.png',
			    x : 150,
			    padding : '5px 0px 0px 0px',
			    arrowAlign : 'right',
			    reloadUrl : this.captchaUrl,
                handler : function () {
                    Ext.util.Cookies.clear('captcha');
                    var box = Ext.get('captchaBox');
                    box.dom.src = this.reloadUrl + '&_dc=' + new Date().getTime();
                    box.slideIn('l');
                }
			},
			{
                xtype: 'textfield',
                fieldLabel: i18n.get('label.fieldCaptcha'),
                name: 'captcha',
                id: 'captcha',
                allowBlank: false,
                anchor: '100%'
            },
            {
				xtype: 'checkbox',
				fieldLabel: Ext.String.format(i18n.get('label.acceptCGU'), URL_CGU),
	            id: 'acceptCGU',
				name: 'acceptCGU',
	            height: 40,
	            anchor: '100%', 
	            submitValue : false
			}],
			buttons: {
                xtype : 'toolbar',
                style : 'background-color:white;',
                items : [
                     { text: i18n.get('label.register'), handler: this.register, scope: this },
    				{ text: i18n.get('label.back'), hidden: !this.register || Ext.isEmpty(this.back), scope: this,
    				handler: function () {
    	        		this.close();
    	        		var login = new sitools.public.userProfile.Login(this.back);
    	        		login.show();
    				}
    			}]
			}
	    	}];
	    
        this.callParent(arguments);
	},
	
    register : function () {
        var f = this.down('form').getForm();
        if (!f.findField('acceptCGU').getValue()) {
            
        	this.down('statusbar').setStatus({
                text: i18n.get('label.mustAcceptCGU'),
                iconCls: 'x-status-error'
            });;
        	return;
        }
        if (! f.isValid()) {
            this.down('statusbar').setStatus({
                text: i18n.get('warning.checkForm'),
                iconCls: 'x-status-error'
            });
            this.reloadCaptcha();
            return;
        }
        var putObject = new Object();
		putObject.properties = [];
        
        Ext.iterate(f.getValues(), function (key, value) {
            if (key == 'organisation') {
                putObject.properties.push({
                	name : "organisation", 
                	value : value,
                	scope : "Editable"
            	});
            } else {
                if (key != 'captcha') {
                    putObject[key] = value;
                }
            }
        }, this);
		
        var cook = Ext.util.Cookies.get('captcha');
        var capt = f.findField('captcha').getValue();
        
        this.getEl().mask();
        this.down('statusbar').showBusy();
        
		Ext.Ajax.request({
			url: this.url,
			method: 'POST',
			jsonData: putObject,
			params : {
                "captcha.id" : cook,
                "captcha.key" : capt
            },
			scope: this,
        	success: function (response, opts) {
	    		var json = Ext.decode(response.responseText);
	    		if (json.success){
	    		    new Ext.ux.Notification({
                        iconCls : 'x-icon-information',
                        title : i18n.get('label.information'),
                        html : i18n.get('label.registerSent'),
                        autoDestroy : true,
                        hideDelay : 1000
                    }).show(document);
	    			Ext.getCmp('winRegister').close();
	    		}
	    		else {
					this.getEl().unmask();
					this.down('statusbar').setStatus({
		            	text : json.message,
		                iconCls: 'x-status-error'
		            });	    			
	    			
	    		}
	    		if (this.handler !== null && this.handler !== undefined) {
	    			this.handler.call(this.scope || this);
	    		}
            },
            failure: function (response, opts) {
        		var txt;
        		if (response.status == 200) {
            		var ret = Ext.decode(response.responseText).message;
            		txt = i18n.get('msg.error') + ': ' + ret;
        		} else if (response.status == 403){
        		    txt = i18n.get('msg.wrongCaptcha');        			
        		} else {
        		    txt = i18n.get('warning.serverError') + ': ' + response.statusText;
        		}
        		this.getEl().unmask();
        		this.down('statusbar').setStatus({
	            	text : txt,
	                iconCls: 'x-status-error'
	            });
	            this.reloadCaptcha();
	    	}
        });
    },
    
    reloadCaptcha : function () {
        Ext.util.Cookies.clear('captcha');
        var box = Ext.get('captchaBox');
        box.dom.src = this.captchaUrl + '&_dc=' + new Date().getTime();
        box.slideIn('l');
        
        var f = Ext.getCmp('frmRegister').getForm();
        var capt = f.findField('captcha').setValue("");

    }
});

