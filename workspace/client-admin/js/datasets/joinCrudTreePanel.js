Ext.define('sitools.component.datasets.joinCrudTreePanel', { 
    extend : 'Ext.tree.Panel',
    loader : null,
    projectId : null,
    layout : "fit", 
    autoScroll : true, 
    rootVisible : true,
    layout : 'fit',
    enableDD: false,
    initComponent : function () {
            
//        this.root = Ext.create('Ext.data.NodeInterface', {
//            text : this.name, 
//            leaf : false, 
//            expanded : true
//        }); 
        

        this.store = Ext.create('Ext.data.TreeStore', {
            root : {
                text : this.name,
                leaf : false,
                expanded : true
            },
            proxy : {
                type : 'memory',
                reader : {
                    type : 'json'
                }
            }
        });
        
        Ext.apply(this, {
            contextMenuRoot : new Ext.menu.Menu({
                items : [{
                    id : 'create-node',
                    text : i18n.get("Add Table"), 
                    icon : loadUrl.get('APP_URL') + '/res/images/icons/add_folder.png', 
                    menu : {
                        items : [ {
                            id : 'INNER_JOIN',
                            action : "addTable",
                            text : i18n.get("label.innerJoin")
                        }, {
                            id : 'CROSS_JOIN',
                            action : "addTable",
                            text : i18n.get("label.crossJoin")
                        }, {
                            id : 'LEFT_JOIN',
                            action : "addTable",
                            text : i18n.get("label.leftJoin")
                        }, {
                            id : 'LEFT_OUTER_JOIN',
                            action : "addTable",
                            text : i18n.get("label.leftOuterJoin")
                        }, {
                            id : 'RIGHT_JOIN',
                            action : "addTable",
                            text : i18n.get("label.rightJoin")
                        }, {
                            id : 'RIGHT_OUTER_JOIN',
                            action : "addTable",
                            text : i18n.get("label.rightOuterJoin")
                        }],
                        listeners : {
                            scope : this,
                            itemclick : this._cxtMenuHandler
                        }
                    }
                }, {
                    id : 'edit-root',
                    text : i18n.get("label.modify"), 
                    icon : loadUrl.get('APP_URL') + '/res/images/icons/toolbar_edit.png'
                }],
                listeners : {
                    scope : this,
                    itemclick : this._cxtMenuHandler
                }
            }),
            contextMenuNode : new Ext.menu.Menu({
                items : [ {
                    id : 'add-joinCondition',
                    text : i18n.get("Add Join Condition"), 
                    icon : loadUrl.get('APP_URL') + '/res/images/icons/add_datasets.png'
                }, {
                    id : 'edit-node',
                    text : i18n.get("label.modify"), 
                    icon : loadUrl.get('APP_URL') + '/res/images/icons/toolbar_edit.png'
                }, {
                    id : 'edit-jointure',
                    text : i18n.get("editJointure"), 
                    icon : loadUrl.get('APP_URL') + '/res/images/icons/toolbar_edit.png', 
                    menu : {
                        items : [ {
                            id : 'INNER_JOIN',
                            action : "editJointure",
                            text : i18n.get("label.innerJoin")
                        }, {
                            id : 'CROSS_JOIN',
                            action : "editJointure",
                            text : i18n.get("label.crossJoin")
                        }, {
                            id : 'LEFT_JOIN',
                            action : "editJointure",
                            text : i18n.get("label.leftJoin")
                        }, {
                            id : 'LEFT_OUTER_JOIN',
                            action : "editJointure",
                            text : i18n.get("label.leftOuterJoin")
                        }, {
                            id : 'RIGHT_JOIN',
                            action : "editJointure",
                            text : i18n.get("label.rightJoin")
                        }, {
                            id : 'RIGHT_OUTER_JOIN',
                            action : "editJointure",
                            text : i18n.get("label.rightOuterJoin")
                        }],
                        listeners : {
                            scope : this,
                            itemclick : this._cxtMenuHandler
                        }
                    }
                }, {
                    id : 'delete-node',
                    text : i18n.get("label.delete"), 
                    icon : loadUrl.get('APP_URL') + '/res/images/icons/toolbar_delete.png'
                } ],
                listeners : {
                    scope : this,
                    itemclick : this._cxtMenuHandler
                }
            }),
            contextMenuLeaf : new Ext.menu.Menu({
                items : [ {
                    id : 'edit-node',
                    text : i18n.get("label.modify"),
                    icon : loadUrl.get('APP_URL') + '/res/images/icons/toolbar_edit.png'
                }, {
                    id : 'delete-node',
                    text : i18n.get("label.delete"), 
                    icon : loadUrl.get('APP_URL') + '/res/images/icons/toolbar_delete.png'
                } ],
                listeners : {
                    scope : this,
                    itemclick : this._cxtMenuHandler
                }
            }),
            listeners : {
                scope : this,
                contextmenu : function (node, e) {
                    e.stopEvent();
                    // Register the context node with the menu so that a Menu
                    // Item's handler function can access
                    // it via its parentMenu property.
                    node.select();
                    var c;
                    if (node == this.getRootNode()) {
                        c = node.getOwnerTree().contextMenuRoot;
                        c.contextNode = this.getRootNode();
                    }
                    else {
                        if (node.isLeaf()) {
                            c = node.getOwnerTree().contextMenuLeaf;
                        } else {
                            c = node.getOwnerTree().contextMenuNode;
                        }
                        c.contextNode = node;
                    }
                    
                    c.showAt(e.getXY());
                }, 
                beforenodedrop : function (dropEvent) {
                    if (dropEvent.target.attributes.type == dropEvent.data.node.attributes.type) {
                        return false;
                    }
                    
                    return true;
                }
            }
        });
        sitools.component.datasets.joinCrudTreePanel.superclass.initComponent.call(this);
    },

    onRender : function () {
        sitools.component.datasets.joinCrudTreePanel.superclass.onRender.apply(this, arguments);
    },

    _cxtMenuHandler : function (item) {
        var node, up;
        switch (item.id) {
        case 'delete-node':
            var tot = Ext.Msg.show({
                title : i18n.get('label.warning'),
                buttons : Ext.Msg.YESNO,
                msg : i18n.get('label.graphs.node.delete'),
                scope : this,
                fn : function (btn, text) {
                    if (btn == 'yes') {
                        var n = item.parentMenu.contextNode;
                        if (n.parentNode) {
                            n.remove();
                        }
                    }
                }
            });

            break;

        case 'add-joinCondition':
            node = item.parentMenu.contextNode;
            
            // this.doLayout();
            up = new sitools.admin.datasets.joinConditionWin({
                node : node,
                mode : 'create', 
                storeColumnDataset : this.storeColumnDataset
            });
            up.show(this);

            break;

        case 'INNER_JOIN':
        case 'LEFT_JOIN':
        case 'CROSS_JOIN':
        case 'LEFT_OUTER_JOIN':
        case 'RIGHT_JOIN':
        case 'RIGHT_OUTER_JOIN':
            if (item.action == "addTable") {
                node = item.parentMenu.parentMenu.contextNode;

                // this.doLayout();
                up = new sitools.admin.datasets.joinTableWin({
                    node : node,
                    mode : 'create',
                    datasetSelectTables : this.datasetSelectTables, 
                    typeJointure : item.id
                });
                up.show();
            }
            if (item.action == "editJointure") {
                node = item.parentMenu.parentMenu.contextNode;
                node.attributes.typeJointure = item.id;
                node.setText(this.getNodeText(node.attributes));
            }
            break;

        case 'edit-node':
            node = item.parentMenu.contextNode;
            if (node.isLeaf()) {
                up = new sitools.admin.datasets.joinConditionWin({
                    node : node,
                    mode : 'edit', 
                    storeColumnDataset : this.storeColumnDataset
                });
            } else {
                up = new sitools.admin.datasets.joinTableWin({
                    node : node,
                    mode : 'edit', 
                    datasetSelectTables : this.datasetSelectTables, 
                    typeJointure : node.attributes.typeJointure
                });
            }
            up.show();
            break;
        case 'edit-root' : 
            node = item.parentMenu.contextNode;
            up = new sitools.admin.datasets.joinTableWin({
                node : node,
                mode : 'edit-root', 
                datasetSelectTables : this.datasetSelectTables
            });
            up.show();
            break;
        }
    },

    getIdGraph : function () {
        return this.loader.getIdGraph();
    }, 
    buildDefault : function () {
        //load the first table as main table and the others as children
        var storeTables = this.scope.panelSelectTables.getStoreSelectedTables();
        if (storeTables.getCount() !== 0 && Ext.isEmpty(this.getRootNode().data.table)) {
            var rec = storeTables.getAt(0);
            var rootNode = this.getRootNode();
            Ext.apply(rootNode, {
                text : rec.data.name,
                leaf : false, 
                children : [], 
                type : "table"
            });
            rootNode.text = rec.data.name;
            Ext.apply(rootNode.attributes, {
                table : {
                    name : rec.data.name,
                    alias : rec.data.alias,
                    schema : rec.data.schemaName
                }
            });
            
            var i = 0;
            storeTables.each(function (rec) {
                if (i !== 0) {
                    rootNode.appendChild({
                        typeJointure : "INNER_JOIN",
                        text : "INNER_JOIN " + rec.data.name,
                        table : {
                            name : rec.data.name,
                            alias : rec.data.alias,
                            schema : rec.data.schemaName
                        },
                        leaf : false, 
                        type : "table", 
                        children : []
                    });
                }
                i++;
            }, this);
        }
    }, 
    loadTree : function (dataset) {
        var rootNode = this.getRootNode();
        var mainTable = dataset.structure.mainTable;
        if (!Ext.isEmpty(mainTable)) {
            Ext.apply(rootNode, {
                text : mainTable.name,
                leaf : false, 
                expanded : true
            });
            Ext.apply(rootNode.attributes, {
                table : mainTable
            });
        }
        Ext.each(dataset.structure.nodeList, function (node) {
            this.loadNode(node, rootNode);
        }, this);
    }, 
    loadNode : function (node, parent) {
        var treeNode;
        if (node.leaf) {
            Ext.apply(node, {
                text : this.getNodeText(node), 
                nodeType : "sync", 
                expanded : true
            });
            treeNode = new Ext.tree.TreeNode(node);
            node.children = [];

            parent.appendChild(treeNode);
        }
        else {
            Ext.apply(node, {
                text : this.getNodeText(node), 
                nodeType : "sync", 
                iconCls : "x-tree-node-folder", 
                expanded : true
            });
            
            var children = node.children;
            
            parent.appendChild(node);
            var nodeInserted = parent.lastChild;
            
            Ext.each(children, function (nodeChildren) {
                this.loadNode(nodeChildren, nodeInserted);
            }, this);
            
        }
    }, 
    getNodeText : function (node) {
        if (node.leaf) {
            var predicat = node.predicat || {};
            predicat.leftAttribute = predicat.leftAttribute || {};
            predicat.rightAttribute = predicat.rightAttribute || {};
            
            var compareOperator = predicatOperators.getOperatorValueForClient(predicat.compareOperator);
            
            return String.format("{0} {1} {2} {3}", 
                predicat.logicOperator, 
                this.getDisplayName(predicat.leftAttribute), 
                compareOperator, 
                this.getDisplayName(predicat.rightAttribute));

        }
        else {
            var table = ! Ext.isEmpty(node.table) ? node.table : node.attributes.table;
            if (!Ext.isEmpty(table)) {
                return node.typeJointure + " " + table.name;
            }
            else {
                return "wrong node";
            }
        }
    }, 
    getDisplayName : function (column) {
        if (column.specificColumnType == "DATABASE") {
            return String.format("{0}.{1}", 
            Ext.isEmpty(column.tableAlias) ? column.tableName: column.tableAlias, 
            column.columnAlias);
        }
        else {
            return column.columnAlias;
        }
    }, 
    deleteJoinPanelItems : function () {
        var root = new Ext.tree.TreeNode({
            text : this.name, 
            leaf : false, 
            expanded : true
        }); 
        this.setRootNode(root);

    }
});