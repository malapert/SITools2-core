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
/*global Ext, sitools, window */

Ext.define('sitools.user.model.GuiServiceModel', {
    extend : 'Ext.data.Model',
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
        name : 'xtype',
        type : 'string'
    }, {
        name : 'author',
        type : 'string'
    }, {
        name : 'version',
        type : 'string'
    }, {
        name : 'icon',
        type : 'string'
    }, {
        name : 'parameters'
    }, {
        name : 'priority',
        type : 'int'
    }, {
        name : 'dataSetSelection'
    }, {
        name : 'dependencies'
    }, {
        name : 'defaultVisibility'
    }, {
        name : 'parametersMap'
    } ]
});