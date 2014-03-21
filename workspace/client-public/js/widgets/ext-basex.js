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
/*!
 * ext-basex/$JIT Adapter Extensions for ExtJS Library 2.0+ and Ext Core 3.0+
 * Copyright(c) 2008-2009 Active Group, Inc.
 * licensing@theactivegroup.com
 * http://licensing.theactivegroup.com
 */
/*
 * ext-basex/$JIT Adapter Extensions for ExtJS Library 2.0+ and Ext Core 3.0+
 * Copyright(c) 2008-2009 Active Group, Inc.
 * licensing@theactivegroup.com
 * http://licensing.theactivegroup.com
 */
(function(){var b=Ext.lib.Ajax,g=function(h){return typeof h!="undefined"},d=Ext.emptyFn||function(){},a=Object.prototype;Ext.lib.Ajax.Queue=function(h){h=h?(h.name?h:{name:h}):{};Ext.apply(this,h,{name:"q-default",priority:5,FIFO:true,callback:null,scope:null,suspended:false,progressive:false});this.requests=new Array();this.pending=false;this.priority=this.priority>9?9:(this.priority<0?0:this.priority)};Ext.extend(Ext.lib.Ajax.Queue,Object,{add:function(h){var i=b.events?b.fireEvent("beforequeue",this,h):true;if(i!==false){this.requests.push(h);this.pending=true;b.pendingRequests++;this.manager&&this.manager.start()}},suspended:false,activeRequest:null,next:function(h){var i=h?this.requests[this.FIFO?"first":"last"]():this.requests[this.FIFO?"shift":"pop"]();if(this.requests.length==0){this.pending=false;Ext.isFunction(this.callback)&&this.callback.call(this.scope||null,this);b.events&&b.fireEvent("queueempty",this)}return i||null},clear:function(){this.suspend();b.pendingRequests-=this.requests.length;this.requests.length=0;this.pending=false;this.resume();this.next()},suspend:function(){this.suspended=true},resume:function(){this.suspended=false},requestNext:function(h){var i;this.activeRequest=null;if(!this.suspended&&(i=this.next(h))){if(i.active){this.activeRequest=b.request.apply(b,i);b.pendingRequests--}else{return this.requestNext(h)}}return this.activeRequest}});Ext.lib.Ajax.QueueManager=function(h){Ext.apply(this,h||{},{quantas:10,priorityQueues:new Array(new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array()),queues:{}})};Ext.extend(Ext.lib.Ajax.QueueManager,Object,{quantas:10,getQueue:function(h){return this.queues[h]},createQueue:function(h){if(!h){return null}var i=new b.Queue(h);i.manager=this;this.queues[i.name]=i;var j=this.priorityQueues[i.priority];j&&j.indexOf(i.name)==-1&&j.push(i.name);return i},removeQueue:function(h){if(h&&(h=this.getQueue(h.name||h))){h.clear();this.priorityQueues[h.priority].remove(h.name);delete this.queues[h.name]}},start:function(){if(!this.started){this.started=true;this.dispatch()}return this},suspendAll:function(){forEach(this.queues,function(h){h.suspend()})},resumeAll:function(){forEach(this.queues,function(h){h.resume()});this.start()},progressive:false,stop:function(){this.started=false;return this},dispatch:function(){var k=this,j=k.queues;var h=(b.activeRequests>b.maxConcurrentRequests);while(b.pendingRequests&&!h){var i=function(n){var m=j[n],l;while(m&&!m.suspended&&m.pending&&m.requestNext()){h||(h=b.activeRequests>b.maxConcurrentRequests);if(h){break}if(m.progressive||k.progressive){break}}if(h){return false}};forEach(this.priorityQueues,function(l){!!l.length&&forEach(l,i,this);h||(h=b.activeRequests>b.maxConcurrentRequests);if(h){return false}},this)}if(b.pendingRequests||h){this.dispatch.defer(this.quantas,this)}else{this.stop()}}});Ext.apply(b,{headers:b.headers||{},defaultPostHeader:b.defaultPostHeader||"application/x-www-form-urlencoded; charset=UTF-8",defaultHeaders:b.defaultHeaders||{},useDefaultXhrHeader:!!b.useDefaultXhrHeader,defaultXhrHeader:"Ext.basex",SCRIPTTAG_POOL:[],_domRefs:[],onUnload:function(){Ext.Element.uncache.apply(Ext.Element,b.SCRIPTTAG_POOL.concat(b._domRefs));delete b._domRefs;delete b.SCRIPTTAG_POOL},monitoredNode:function(q,k,o,h,p){var i=null,n=(h||window).document,m=n?n.getElementsByTagName("head")[0]:null;if(q&&n&&m){i=q.toUpperCase()=="SCRIPT"&&!!b.SCRIPTTAG_POOL.length?Ext.get(b.SCRIPTTAG_POOL.pop()):null;if(i){i.removeAllListeners()}else{i=Ext.get(n.createElement(q))}var l=Ext.getDom(i);l&&forEach(k||{},function(s,r){s&&(r in l)&&l.setAttribute(r,s)});if(o){var j=(o.success||o).createDelegate(o.scope||null,[o||{}],0);Ext.isIE?i.on("readystatechange",function(){this.dom.readyState=="loaded"&&j()}):i.on("load",j)}p||l.parentNode||m.appendChild(l)}b._domRefs.push(i);return i},poll:{},pollInterval:b.pollInterval||50,queueManager:new b.QueueManager(),queueAll:false,activeRequests:0,pendingRequests:0,maxConcurrentRequests:Ext.isIE?Ext.value(window.maxConnectionsPerServer,2):4,forceActiveX:false,async:true,createXhrObject:function(q,r){var n={status:{isError:false},tId:q},m=null;r||(r={});try{r.xdomain&&window.XDomainRequest&&(n.conn=new XDomainRequest());if(!g(n.conn)&&Ext.capabilities.hasActiveX&&!!Ext.value(r.forceActiveX,this.forceActiveX)){throw ("IE7forceActiveX")}n.conn||(n.conn=new XMLHttpRequest())}catch(j){var h=Ext.capabilities.hasActiveX?(r.multiPart?this.activeXMultipart:this.activeX):null;if(h){for(var o=0,k=h.length;o<k;++o){try{n.conn=new ActiveXObject(h[o]);break}catch(p){m=(j=="IE7forceActiveX"?p:j)}}}}finally{n.status.isError=!g(n.conn);n.status.error=m}return n},createExceptionObject:function(l,k,i,h,j){return{tId:l,status:i?-1:0,statusText:i?"transaction aborted":"communication failure",isAbort:i,isTimeout:h,argument:k}},encoder:encodeURIComponent,serializeForm:function(){var j=/select-(one|multiple)/i,h=/file|undefined|reset|button/i,i=/radio|checkbox/i;return function(l){var m=l.elements||(document.forms[l]||Ext.getDom(l)).elements,s=false,r=this.encoder,p,t,k,n,o="",q;forEach(m,function(u){k=u.name;q=u.type;if(!u.disabled&&k){if(j.test(q)){forEach(u.options,function(v){if(v.selected){o+=String.format("{0}={1}&",r(k),r(v.hasAttribute&&v.hasAttribute("value")&&v.getAttribute("value")!==null?v.value:v.text))}})}else{if(!h.test(q)){if(!(i.test(q)&&!u.checked)&&!(q=="submit"&&s)){o+=r(k)+"="+r(u.value)+"&";s=/submit/i.test(q)}}}}});return o.substr(0,o.length-1)}}(),getHttpStatus:function(j,i,h){var l={status:0,statusText:"",isError:false,isLocal:false,isOK:true,error:null,isAbort:!!i,isTimeout:!!h};try{if(!j||!("status" in j)){throw ("noobj")}l.status=j.status;l.readyState=j.readyState;l.isLocal=(!j.status&&location.protocol=="file:")||(Ext.isSafari&&!g(j.status));l.isOK=(l.isLocal||(l.status==304||l.status==1223||(l.status>199&&l.status<300)));l.statusText=j.statusText||""}catch(k){}return l},handleTransactionResponse:function(l,m,j,i){m=m||{};var k=null;l.isPart||b.activeRequests--;if(!l.status.isError){l.status=this.getHttpStatus(l.conn,j,i);k=this.createResponseObject(l,m.argument,j,i)}l.isPart||this.releaseObject(l);l.status.isError&&(k=Ext.apply({},k||{},this.createExceptionObject(l.tId,m.argument,!!j,!!i,l.status.error)));k.options=l.options;k.fullStatus=l.status;if(!this.events||this.fireEvent("status:"+l.status.status,l.status.status,l,k,m,j)!==false){if(l.status.isOK&&!l.status.isError){if(!this.events||this.fireEvent("response",l,k,m,j,i)!==false){var h=l.isPart?"onpart":"success";Ext.isFunction(m[h])&&m[h].call(m.scope||null,k)}}else{if(!this.events||this.fireEvent("exception",l,k,m,j,i,k.fullStatus.error)!==false){Ext.isFunction(m.failure)&&m.failure.call(m.scope||null,k,k.fullStatus.error)}}}return k},releaseObject:function(h){h&&(h.conn=null);if(h&&Ext.value(h.tId,-1)+1){if(this.poll[h.tId]){window.clearInterval(this.poll[h.tId]);delete this.poll[h.tId]}if(this.timeout[h.tId]){window.clearInterval(this.timeout[h.tId]);delete this.timeout[h.tId]}}},decodeJSON:Ext.decode,reCtypeJSON:/(application|text)\/json/i,reCtypeXML:/(application|text)\/xml/i,createResponseObject:function(u,w,k,l){var y="content-type",m={responseXML:null,responseText:"",responseStream:null,responseJSON:null,contentType:null,getResponseHeader:d,getAllResponseHeaders:d};var i={},j="";if(k!==true){try{m.responseJSON=u.conn.responseJSON||null;m.responseStream=u.conn.responseStream||null;m.contentType=u.conn.contentType||null;m.responseText=u.conn.responseText}catch(z){u.status.isError=true;u.status.error=z}try{m.responseXML=u.conn.responseXML||null}catch(x){}try{j=("getAllResponseHeaders" in u.conn?u.conn.getAllResponseHeaders():null)||"";var p;j.split("\n").forEach(function(o){(p=o.split(":"))&&p.first()&&(i[p.first().trim().toLowerCase()]=(p.last()||"").trim())})}catch(v){u.status.isError=true;u.status.error=v}finally{m.contentType=m.contentType||i[y]||""}if((u.status.isLocal||u.proxied)&&typeof m.responseText=="string"){u.status.isOK=!u.status.isError&&((u.status.status=(!!m.responseText.length)?200:404)==200);if(u.status.isOK&&((!m.responseXML&&this.reCtypeXML.test(m.contentType))||(m.responseXML&&m.responseXML.childNodes.length===0))){var A=null;try{if(Ext.capabilities.hasActiveX){A=new ActiveXObject("MSXML2.DOMDocument.3.0");A.async=false;A.loadXML(m.responseText)}else{var q=null;try{q=new DOMParser();A=q.parseFromString(m.responseText,"application/xml")}catch(h){}finally{q=null}}}catch(t){u.status.isError=true;u.status.error=t}m.responseXML=A}if(m.responseXML){var r=(m.responseXML.documentElement&&m.responseXML.documentElement.nodeName=="parsererror")||(m.responseXML.parseError||0)!==0||m.responseXML.childNodes.length===0;r||(m.contentType=i[y]=m.responseXML.contentType||"text/xml")}}if(u.options.isJSON||(this.reCtypeJSON&&this.reCtypeJSON.test(i[y]||""))){try{Ext.isObject(m.responseJSON)||(m.responseJSON=Ext.isFunction(this.decodeJSON)&&Ext.isString(m.responseText)?this.decodeJSON(m.responseText):null)}catch(n){u.status.isError=true;u.status.error=n}}}u.status.proxied=!!u.proxied;Ext.apply(m,{tId:u.tId,status:u.status.status,statusText:u.status.statusText,contentType:m.contentType||i[y],getResponseHeader:function(o){return i[(o||"").trim().toLowerCase()]},getAllResponseHeaders:function(){return j},fullStatus:u.status,isPart:u.isPart||false});u.parts&&!u.isPart&&(m.parts=u.parts);g(w)&&(m.argument=w);return m},setDefaultPostHeader:function(h){this.defaultPostHeader=h||""},setDefaultXhrHeader:function(h){this.useDefaultXhrHeader=h||false},request:function(h,j,l,n,u){var r=u=Ext.apply({async:this.async||false,headers:false,userId:null,password:null,xmlData:null,jsonData:null,queue:null,proxied:false,multiPart:false,xdomain:false},u||{});var p;if(l.argument&&l.argument.options&&l.argument.options.request&&(p=l.argument.options.request.arg)){Ext.apply(r,{async:r.async||p.async,proxied:r.proxied||p.proxied,multiPart:r.multiPart||p.multiPart,xdomain:r.xdomain||p.xdomain,queue:r.queue||p.queue,onPart:r.onPart||p.onPart})}if(!this.events||this.fireEvent("request",h,j,l,n,r)!==false){if(!r.queued&&(r.queue||(r.queue=this.queueAll||null))){r.queue===true&&(r.queue={name:"q-default"});var o=r.queue;var k=o.name||o,t=this.queueManager;var i=t.getQueue(k)||t.createQueue(o);r.queue=i;r.queued=true;var s=[h,j,l,n,r];s.active=true;i.add(s);return{tId:this.transactionId++,queued:true,request:s,options:r}}u.onpart&&(l.onpart||(l.onpart=Ext.isFunction(u.onpart)?u.onpart.createDelegate(u.scope):null));r.headers&&forEach(r.headers,function(v,q){this.initHeader(q,v,false)},this);var m;if(m=(this.headers?this.headers["Content-Type"]||null:null)){delete this.headers["Content-Type"]}if(r.xmlData){m||(m="text/xml");h="POST";n=r.xmlData}else{if(r.jsonData){m||(m="application/json; charset=utf-8");h="POST";n=Ext.isObject(r.jsonData)?Ext.encode(r.jsonData):r.jsonData}}if(n){m||(m=this.useDefaultHeader?this.defaultPostHeader:null);m&&this.initHeader("Content-Type",m,false)}return this.makeRequest(r.method||h,j,l,n,r)}return null},getConnectionObject:function(j,h,l){var m,k;var n=this.transactionId;h||(h={});try{if(k=h.proxied){m={tId:n,status:{isError:false},proxied:true,conn:{el:null,send:function(p){var q=(k.target||window).document,o=q.getElementsByTagName("head")[0];if(o&&this.el){o.appendChild(this.el.dom);this.readyState=2}},abort:function(){this.readyState=0;window[m.cbName]=undefined;Ext.isIE||delete window[m.cbName];var o=Ext.getDom(this.el);if(this.el){this.el.removeAllListeners();if(!m.debug){if(Ext.isIE){b.SCRIPTTAG_POOL.push(this.el)}else{this.el.remove();if(o){for(var p in o){delete o[p]}}}}}this.el=o=null},_headers:{},getAllResponseHeaders:function(){var o=[];forEach(this._headers,function(q,p){q&&o.push(p+": "+q)});return o.join("\n")},getResponseHeader:function(o){return this._headers[String(o).toLowerCase()]||""},onreadystatechange:null,onload:null,readyState:0,status:0,responseText:null,responseXML:null,responseJSON:null},debug:k.debug,params:Ext.isString(h.params)?Ext.urlDecode(h.params):h.params||{},cbName:k.callbackName||"basexCallback"+n,cbParam:k.callbackParam||null};window[m.cbName]=m.cb=function(o){o&&typeof(o)=="object"&&(this.responseJSON=o);this.responseText=o||null;this.status=!!o?200:404;this.abort();this.readyState=4;Ext.isFunction(this.onreadystatechange)&&this.onreadystatechange();Ext.isFunction(this.onload)&&this.onload()}.createDelegate(m.conn);m.conn.open=function(){if(m.cbParam){m.params[m.cbParam]=m.cbName}var o=Ext.urlEncode(Ext.apply(Ext.urlDecode(l)||{},m.params,j.indexOf("?")>-1?Ext.urlDecode(j.split("?").last()):false));m.uri=o?j.split("?").first()+"?"+o:j;this.el=b.monitoredNode(k.tag||"script",{type:k.contentType||"text/javascript",src:m.uri,charset:k.charset||h.charset||null},null,k.target,true);this._headers["content-type"]=this.el.dom.type;this.readyState=1;Ext.isFunction(this.onreadystatechange)&&this.onreadystatechange()};h.async=true}else{m=this.createXhrObject(n,h)}if(m){this.transactionId++}}catch(i){m&&(m.status.isError=!!(m.status.error=i))}finally{return m}},makeRequest:function(p,k,n,h,i){var m;if(m=this.getConnectionObject(k,i,h)){m.options=i;var j=m.conn;try{if(m.status.isError){throw m.status.error}b.activeRequests++;j.open(p.toUpperCase(),k,i.async,i.userId,i.password);("onreadystatechange" in j)&&(j.onreadystatechange=this.onStateChange.createDelegate(this,[m,n,"readystate"],0));("onload" in j)&&(j.onload=this.onStateChange.createDelegate(this,[m,n,"load",4],0));("onprogress" in j)&&(j.onprogress=this.onStateChange.createDelegate(this,[m,n,"progress"],0));if(n&&n.timeout){("timeout" in j)&&(j.timeout=n.timeout);("ontimeout" in j)&&(j.ontimeout=this.abort.createDelegate(this,[m,n,true],0));("ontimeout" in j)||(i.async&&(this.timeout[m.tId]=window.setInterval(function(){b.abort(m,n,true)},n.timeout)))}if(this.useDefaultXhrHeader&&!i.xdomain){this.defaultHeaders["X-Requested-With"]||this.initHeader("X-Requested-With",this.defaultXhrHeader,true)}this.setHeaders(m);if(!this.events||this.fireEvent("beforesend",m,p,k,n,h,i)!==false){j.send(h||null)}}catch(l){m.status.isError=true;m.status.error=l}if(m.status.isError){return Ext.apply(m,this.handleTransactionResponse(m,n))}i.async||this.onStateChange(m,n,"load");return m}},abort:function(i,j,h){i&&Ext.apply(i.status,{isAbort:!!!h,isTimeout:!!h,isError:!!h||!!i.status.isError});if(i&&i.queued&&i.request){i.request.active=i.queued=false;this.events&&this.fireEvent("abort",i,j);return true}else{if(i&&this.isCallInProgress(i)){if(!this.events||this.fireEvent(h?"timeout":"abort",i,j)!==false){("abort" in i.conn)&&i.conn.abort();this.handleTransactionResponse(i,j,i.status.isAbort,i.status.isTimeout)}return true}}return false},isCallInProgress:function(h){if(h&&h.conn){if("readyState" in h.conn&&{0:true,4:true}[h.conn.readyState]){return false}return true}return false},clearAuthenticationCache:function(h){try{if(Ext.isIE){document.execCommand("ClearAuthenticationCache")}else{var i;if(i=new XMLHttpRequest()){i.open("GET",h||"/@@",true,"logout","logout");i.send("");i.abort.defer(100,i)}}}catch(j){}},initHeader:function(h,i){(this.headers=this.headers||{})[h]=i},onStateChange:function(l,v,t){if(!l.conn||l.status.isTimeout||l.status.isError){return}var i=l.conn,q=("readyState" in i?i.readyState:0);if(t==="load"||q>2){var u;try{u=i.contentType||i.getResponseHeader("Content-Type")||""}catch(m){}if(u&&/multipart\//i.test(u)){var h=null,k=u.split('"')[1],s="--"+k;l.multiPart=true;try{h=i.responseText}catch(n){}var j=h?h.split(s):null;if(j){l.parts||(l.parts=[]);j.shift();j.pop();forEach(Array.slice(j,l.parts.length),function(o){var r=o.split("\n\n");var p=(r[0]?r[0]:"")+"\n";l.parts.push(this.handleTransactionResponse(Ext.apply(Ext.clone(l),{boundary:k,conn:{status:200,responseText:(r[1]||"").trim(),getAllResponseHeaders:function(){return p.split("\n").filter(function(w){return !!w}).join("\n")}},isPart:true}),v))},this)}}}(q===4||t==="load")&&b.handleTransactionResponse(l,v);this.events&&this.fireEvent.apply(this,["readystatechange"].concat(Array.slice(arguments,0)))},setHeaders:function(h){if(h.conn&&"setRequestHeader" in h.conn){this.defaultHeaders&&forEach(this.defaultHeaders,function(j,i){h.conn.setRequestHeader(i,j)});this.headers&&forEach(this.headers,function(j,i){h.conn.setRequestHeader(i,j)})}this.headers={};this.hasHeaders=false},resetDefaultHeaders:function(){delete this.defaultHeaders;this.defaultHeaders={};this.hasDefaultHeaders=false},activeXMultipart:["MSXML2.XMLHTTP.6.0","MSXML3.XMLHTTP"],activeX:["MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"]});if(Ext.util.Observable){Ext.apply(b,{events:{request:true,beforesend:true,response:true,exception:true,abort:true,timeout:true,readystatechange:true,beforequeue:true,queue:true,queueempty:true},onStatus:function(h,l,k,j){var i=Array.slice(arguments,1);h=new Array().concat(h||new Array());forEach(h,function(m){m=parseInt(m,10);if(!isNaN(m)){var n="status:"+m;this.events[n]||(this.events[n]=true);this.on.apply(this,[n].concat(i))}},this)},unStatus:function(h,l,k,j){var i=Array.slice(arguments,1);h=new Array().concat(h||new Array());forEach(h,function(m){m=parseInt(m,10);if(!isNaN(m)){var n="status:"+m;this.un.apply(this,[n].concat(i))}},this)}},new Ext.util.Observable());Ext.hasBasex=true}Ext.stopIteration={stopIter:true};Ext.applyIf(Array.prototype,{map:function(j,m){var h=this.length;if(typeof j!="function"){throw new TypeError()}var l=new Array(h);for(var k=0;k<h;++k){k in this&&(l[k]=j.call(m||this,this[k],k,this))}return l},some:function(k){var m=Ext.isFunction(k)?k:function(){};var j=0,h=this.length,n=false;while(j<h&&!(n=!!m(this[j++]))){}return n},every:function(k){var m=Ext.isFunction(k)?k:function(){};var j=0,h=this.length,n=true;while(j<h&&(n=!!m(this[j++]))){}return n},include:function(k,i){if(!i&&typeof this.indexOf=="function"){return this.indexOf(k)!=-1}var j=false;try{this.forEach(function(m,l){if(j=(i?(m.include?m.include(k,i):(m===k)):m===k)){throw Ext.stopIteration}})}catch(h){if(h!=Ext.stopIteration){throw h}}return j},filter:function(j,i){var h=new Array();j||(j=function(k){return k});this.forEach(function(l,k){j.call(i,l,k)&&h.push(l)});return h},compact:function(i){var h=new Array();this.forEach(function(j){(j===null||j===undefined)||h.push(i&&Ext.isArray(j)?j.compact():j)},this);return h},flatten:function(){var h=new Array();this.forEach(function(i){Ext.isArray(i)?(h=h.concat(i)):h.push(i)},this);return h},indexOf:function(k){for(var j=0,h=this.length;j<h;++j){if(this[j]==k){return j}}return -1},lastIndexOf:function(j){var h=this.length-1;while(h>-1&&this[h]!=j){h--}return h},unique:function(i,j){var h=new Array();this.forEach(function(l,k){if(0==k||(i?h.last()!=l:!h.include(l,j))){h.push(l)}},this);return h},grep:function(l,k,j){var h=new Array();k||(k=function(m){return m});var i=j?k.createDelegate(j):k;if(typeof l=="string"){l=new RegExp(l)}l instanceof RegExp&&this.forEach(function(n,m){l.test(n)&&h.push(i(n,m))});return h},first:function(){return this[0]},last:function(){return this[this.length-1]},clear:function(){this.length=0},atRandom:function(i){var h=Math.floor(Math.random()*this.length);return this[h]||i},clone:function(h){if(!h){return this.concat()}var j=this.length||0,i=new Array(j);while(j--){i[j]=Ext.clone(this[j],true)}return i},forEach:function(i,h){Array.forEach(this,i,h)},reversed:function(){var i=this.length||0,h=[];while(i--){h.push(this[i])}return h}});window.forEach=function(i,l,j,h){j=j||i;if(i){if(typeof l!="function"){throw new TypeError()}var k=Object;if(i instanceof Function){k=Function}else{if(i.forEach instanceof Function){return i.forEach(l,j)}else{if(typeof i=="string"){k=String}else{if(Ext.isNumber(i.length)){k=Array}}}}return k.forEach(i,l,j,h)}};Ext.clone=function(i,h){if(i===null||i===undefined){return i}if(Ext.isFunction(i.clone)){return i.clone(h)}else{if(Ext.isFunction(i.cloneNode)){return i.cloneNode(h)}}var j={};forEach(i,function(l,k,m){j[k]=(l===m?j:h?Ext.clone(l,true):l)},i,h);return j};var f=Array.prototype.slice;var e=Array.prototype.filter;Ext.applyIf(Array,{slice:function(h){return f.apply(h,f.call(arguments,1))},filter:function(j,i){var h=j&&typeof j=="string"?j.split(""):[];return e.call(h,i)},forEach:function(n,m,k){if(typeof m!="function"){throw new TypeError()}for(var j=0,h=n.length>>>0;j<h;++j){(j in n)&&m.call(k||null,n[j],j,n)}}});Ext.applyIf(RegExp.prototype,{clone:function(){return new RegExp(this)}});Ext.applyIf(Date.prototype,{clone:function(h){return h?new Date(this.getTime()):this}});Ext.applyIf(Boolean.prototype,{clone:function(){return this===true}});Ext.applyIf(Number.prototype,{times:function(l,j){var k=parseInt(this,10)||0;for(var h=1;h<=k;){l.call(j,h++)}},forEach:function(){this.times.apply(this,arguments)},clone:function(){return(this)+0}});Ext.applyIf(String.prototype,{trim:function(){var h=/^\s+|\s+$/g;return function(){return this.replace(h,"")}}(),trimRight:function(){var h=/^|\s+$/g;return function(){return this.replace(h,"")}}(),trimLeft:function(){var h=/^\s+|$/g;return function(){return this.replace(h,"")}}(),clone:function(){return String(this)+""},forEach:function(i,h){String.forEach(this,i,h)}});var c=function(o,m){var n=typeof o=="function"?o:function(){};var k=n._ovl;if(!k){k={base:n};k[n.length||0]=n;n=function(){var l=arguments.callee._ovl;var i=l[arguments.length]||l.base;return i&&i!=arguments.callee?i.apply(this,arguments):undefined}}var p=[].concat(m);for(var j=0,h=p.length;j<h;++j){k[p[j].length]=p[j]}n._ovl=k;return n};Ext.applyIf(Ext,{overload:c(c,[function(h){return c(null,h)},function(j,i,h){return j[i]=c(j[i],h)}]),isIterable:function(h){if(h===null||h===undefined){return false}if(Ext.isArray(h)||!!h.callee||Ext.isNumber(h.length)){return true}return !!((/NodeList|HTMLCollection/i).test(a.toString.call(h))||h.nextNode||h.item||false)},isArray:function(h){return a.toString.apply(h)=="[object Array]"},isObject:function(h){return(h!==null)&&typeof h=="object"},isNumber:function(h){return typeof h=="number"&&isFinite(h)},isBoolean:function(h){return typeof h=="boolean"},isDocument:function(h){return a.toString.apply(h)=="[object HTMLDocument]"||(h&&h.nodeType===9)},isElement:function(h){return h&&Ext.type(h)=="element"},isEvent:function(h){return a.toString.apply(h)=="[object Event]"||(Ext.isObject(h)&&!Ext.type(h.constructor)&&(window.event&&h.clientX&&h.clientX===window.event.clientX))},isFunction:function(h){return a.toString.apply(h)=="[object Function]"},isString:function(h){return typeof h=="string"},isDefined:g});Ext.capabilities={hasActiveX:g(window.ActiveXObject),hasXDR:function(){return g(window.XDomainRequest)||(g(window.XMLHttpRequest)&&"withCredentials" in new XMLHttpRequest())}(),hasChromeFrame:function(){try{if(g(window.ActiveXObject)&&!!(new ActiveXObject("ChromeTab.ChromeFrame"))){return true}}catch(h){}var i=navigator.userAgent.toLowerCase();return !!(i.indexOf("chromeframe")>=0||i.indexOf("x-clock")>=0)}(),hasFlash:(function(){if(g(window.ActiveXObject)){try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash");return true}catch(l){}return false}else{if(navigator.plugins){for(var h=0,k=navigator.plugins,j=k.length;h<j;++h){if((/flash/i).test(k[h].name)){return true}}return false}}return false})(),hasCookies:Ext.isIE&&("dialogArguments" in window)?false:!!navigator.cookieEnabled,hasCanvas:!!document.createElement("canvas").getContext,hasCanvasText:function(){return !!(this.hasCanvas&&typeof document.createElement("canvas").getContext("2d").fillText=="function")}(),hasSVG:!!(document.createElementNS&&document.createElementNS("http://www.w3.org/2000/svg","svg").width),hasXpath:!!document.evaluate,hasWorkers:g(window.Worker),hasOffline:g(window.applicationCache),hasLocalStorage:g(window.localStorage),hasGeoLocation:g(navigator.geolocation),hasBasex:true,hasAudio:function(){var j=!!document.createElement("audio").canPlayType,k=("Audio" in window)?new Audio(""):{},l=j||("canPlayType" in k)?{tag:j,object:("play" in k),testMime:function(n){var o;return(o=k.canPlayType?k.canPlayType(n):"no")!=="no"&&o!==""}}:false,m,i,h={mp3:"audio/mpeg",ogg:"audio/ogg",wav:"audio/x-wav",basic:"audio/basic",aif:"audio/x-aiff"};if(l&&l.testMime){for(i in h){l[i]=l.testMime(h[i])}}return l}(),hasVideo:function(){var j=!!document.createElement("video").canPlayType,l=j?document.createElement("video"):{},k=("canPlayType" in l)?{tag:j,testCodec:function(n){var o;return(o=l.canPlayType?l.canPlayType(n):"no")!=="no"&&o!==""}}:false,m,h,i={mp4:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',ogg:'video/ogg; codecs="theora, vorbis"'};if(k&&k.testCodec){for(h in i){k[h]=k.testCodec(i[h])}}return k}(),hasInputAutoFocus:function(){return("autofocus" in (document.createElement("input")))}(),hasInputPlaceHolder:function(){return("placeholder" in (document.createElement("input")))}(),hasInputType:function(i){var h=document.createElement("input");if(h){try{h.setAttribute("type",i)}catch(j){}return h.type!=="text"}return false},isEventSupported:function(){var j={select:"input",change:"input",submit:"form",reset:"form",load:"img",error:"img",abort:"img"};var h={},k=/^on/i,i=function(n,m){var l=Ext.getDom(m);return(l?(Ext.isElement(l)||Ext.isDocument(l)?l.nodeName.toLowerCase():m.self?"#window":m||"#object"):m||"div")+":"+n};return function(p,r){p=(p||"").replace(k,"");var q,o=false;var m="on"+p;var l=(r?r:j[p])||"div";var n=i(p,l);if(n in h){return h[n]}q=Ext.isString(l)?document.createElement(l):r;o=(!!q&&(m in q));o||(o=window.Event&&!!(String(p).toUpperCase() in window.Event));if(!o&&q){q.setAttribute&&q.setAttribute(m,"return;");o=Ext.isFunction(q[m])}h[n]=o;q=null;return o}}()};Ext.EventManager.on(window,"beforeunload",b.onUnload,b,{single:true})})();Ext.applyIf(Function.prototype,{forEach:function(a,e,d,c){if(a){var b;for(b in a){(!!c||a.hasOwnProperty(b))&&e.call(d||a,a[b],b,a)}}},createBuffered:function(a,c){var d=this,b=new Ext.util.DelayedTask();return function(){b.delay(a,d,c,Array.slice(arguments,0))}},createDelayed:function(c,d,b,a){var e=(d||b)?this.createDelegate(d,b,a):this;return c?function(){setTimeout(e,c)}:e},clone:function(a){return this}});
