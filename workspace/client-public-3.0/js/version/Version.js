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
/*global Ext, sitools, ID, i18n, document, showResponse, alertFailure*/
Ext.namespace('sitools.public.version');

Ext.define('sitools.public.version.Version', {
    extend : 'Ext.window.Window',
	layout : 'fit',
	 id : 'winVersionId', 
     width : 700,
     height : 480,
     resizable : false, 
     modal : true,
    
    initComponent : function () {
        this.versionUrl = loadUrl.get('APP_URL') + '/version';
        
        var logo = Ext.create('Ext.form.Label', {
            html : '<img src='+loadUrl.get('APP_URL') + '/client-public/res/images/logo_02_tailleMoyenne.png>'
        });
        
        
        
        this.credits = Ext.create('Ext.form.Label', {});
        
        var website = Ext.create('Ext.form.Label', {
            html : '<a style="color:blue;" target="_blank" href="https://github.com/SITools2">https://github.com/SITools2</>'
        });
        
        this.versionLabel = Ext.create('Ext.form.Label', {});
        
        this.buildDateLabel = Ext.create('Ext.form.Label', {}); 
        
        var panelVersion = Ext.create('Ext.panel.Panel', {
            title : i18n.get("label.version"),
            layout : 'fit',
            padding : 10,
            border : false,
            bodyBorder : false
        });
        
        var panelLicence = Ext.create('Ext.container.Container', {
            title : i18n.get("label.licence"),
            layout : 'fit',
            items : [{
                xtype : 'component',
                border : false,
                bodyBorder : false,
                autoEl: {
                    tag: 'iframe',
                    src: loadUrl.get('APP_URL') + "/client-public/res/licences/gpl-3.0.txt"
                }
            }]
        });
        
        panelVersion.add([logo, this.versionLabel, this.buildDateLabel, this.credits, website]);
        
        this.tabs = Ext.create('Ext.tab.Panel', {
            activeTab: 0,
            border : false,
            bodyBorder : false,
            items: [ panelVersion, panelLicence ]            
        });
        
        this.items = [this.tabs];
        
        this.buttons = [{
            text : i18n.get('label.close'),
            scope : this,
            handler : function () {
                this.close();
            }
        }];
            
        this.callParent(arguments);
    },
    
    afterRender : function () {
        this.callParent(arguments);

        Ext.Ajax.request({
            url : this.versionUrl,
            method : 'GET',
            scope : this,
            success : function (ret) {
                var json = Ext.decode(ret.responseText);
                if (!json.success) {
                    Ext.Msg.alert(i18n.get('label.warning'), json.message);
                    return false;
                }
                var info = json.info;
                
                var version = info.version;
                var buildDate = info.buildDate;
                var copyright = info.copyright;
                
                this.versionLabel.setText("<h4>Version : " + version + "</h4>", false);                    
                this.buildDateLabel.setText("<h4>Build date : " + buildDate + "</h4>", false);                    
                this.credits.setText(Ext.String.format("<p>{0}</p><br>", copyright), false);
                
            },
            failure : alertFailure
        });
    }
});
