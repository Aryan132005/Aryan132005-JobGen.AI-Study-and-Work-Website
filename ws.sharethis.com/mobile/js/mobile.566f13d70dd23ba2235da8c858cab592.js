var stlib = stlib || {
  functions: [],
  functionCount: 0,
  util: {
    prop: function(p, obj) {
      if (obj) {
        return obj[p];
      }
      return function(o) { return o[p]; };
    }
  },
  dynamicOn: true,
  setPublisher : function(pubKey){
    stlib.publisher = pubKey;
  },
  setProduct : function(prod){
    stlib.product = prod;
  },
  parseQuery: function( query ) {
    var Params = new Object ();
    if ( ! query ) return Params; // return empty object
    var Pairs = query.split(/[;&]/);
    for ( var i = 0; i < Pairs.length; i++ ) {
       var KeyVal = Pairs[i].split('=');
       if ( ! KeyVal || KeyVal.length != 2 ) continue;
       var key = unescape( KeyVal[0] );
       var val = unescape( KeyVal[1] );
       val = val.replace(/\+/g, ' ');
       Params[key] = val;
    }
    return Params;
  },
  getQueryParams : function(){
    var buttonScript = document.getElementById('st_insights_js');
    if(buttonScript && buttonScript.src){
      var queryString = buttonScript.src.replace(/^[^\?]+\??/,'');
      var params = stlib.parseQuery( queryString );
      stlib.setPublisher ( params.publisher);
      stlib.setProduct( params.product);
    }
  }
};

stlib.global = {
  hash: stlib.util.prop('hash', document.location).substr(1)
};

// Extract out parameters
stlib.getQueryParams();
stlib.debugOn = false;
stlib.debug = {
	count: 0,
	messages: [],
	debug: function(message, show) {
		if (show && (typeof console) != "undefined") {
			console.log(message);
		} 
		stlib.debug.messages.push(message);
	},
	show: function(errorOnly) {
		for (message in stlib.debug.messages) {
			if ((typeof console) != "undefined") {
				if (errorOnly) {
					/ERROR/.test(stlib.debug.messages[message]) ? console.log(stlib.debug.messages[message]) : null;
				} else {
					console.log(stlib.debug.messages[message]);
				}
			} 
		}
	},
	showError: function() { 
		stlib.debug.show(true); 
	}
};

var _$d = function(message) {	stlib.debug.debug(message, stlib.debugOn); }
var _$d0 = function() { _$d(" "); };
var _$d_ = function() { _$d("___________________________________________"); };
var _$d1 = function(m) { _$d(_$dt() + "| " + m); };
var _$d2 = function(m) { _$d(_$dt() + "|  * " + m); };
var _$de = function(m) { _$d(_$dt() + "ERROR: " + m); };

var _$dt = function() { 
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	return h+":"+m+":"+s+" > ";
};
/********************START SCRIPTLOADER***********************/
/* 
 * This handles on demand loading of javascript and CSS files
 */
stlib.scriptLoader = {
	loadJavascript : function(href,callBack){
		var loader = stlib.scriptLoader;
		loader.head=document.getElementsByTagName('head')[0];
		loader.scriptSrc=href;
		loader.script=document.createElement('script');
		loader.script.setAttribute('type', 'text/javascript');
		loader.script.setAttribute('src', loader.scriptSrc);
		loader.script.async = true;
		
		if(window.attachEvent && document.all) { //IE:
			loader.script.onreadystatechange=function(){
				if(this.readyState=='complete' || this.readyState=='loaded'){
					callBack();
				}
			};
		} else { //other browsers:
			loader.script.onload=callBack;
		}
		loader.s = document.getElementsByTagName('script')[0]; 
		loader.s.parentNode.insertBefore(loader.script, loader.s);
	},
	loadCSS : function(href,callBack) {
		_$d_();
		_$d1("Loading CSS: "  + href);
		var loader = stlib.scriptLoader;
		var cssInterval;
		loader.head=document.getElementsByTagName('head')[0];
		loader.cssSrc=href;
		loader.css=document.createElement('link');
		loader.css.setAttribute('rel', 'stylesheet');
		loader.css.setAttribute('type', 'text/css');
		loader.css.setAttribute('href', href);
		loader.css.setAttribute('id', href);
		setTimeout(function(){
			callBack();
			if(!document.getElementById(href)){
				cssInterval=setInterval(function(){
					if(document.getElementById(href)){
						clearInterval(cssInterval);
						callBack();
					}
				}, 100);
			}
		},100);
		loader.head.appendChild(loader.css);		
	}
};
/********************END SCRIPTLOADER***********************/
/********************START GA LOGGING***********************/
/*
 * Requires scriptLoader.js
 */
var widgetLogger = {};
stlib.gaLogger = {
	configOptions : null,

	// TODO, error checking and validation for service
	shareLog: function(service){
		if (typeof(widgetLogger.pubTracker) != "undefined" && widgetLogger.pubTracker != null && typeof(widgetLogger.pubTracker._trackEvent) != "undefined"){
			if (stlib.gaLogger.configOptions) {
				widgetLogger.pubTracker._trackEvent("ShareThis", service, stlib.gaLogger.configOptions.URL);
			} else {
				widgetLogger.pubTracker._trackEvent("ShareThis", service);
			}
		}
		if(typeof(window.postMessage)!=="undefined" && document.referrer!==""){
			if (stlib.gaLogger.configOptions) {
				parent.postMessage("ShareThis|click|"+service+"|"+stlib.gaLogger.configOptions.URL,document.referrer);
			} else {
				parent.postMessage("ShareThis|click|"+service,document.referrer);
			}
		}
	},

	//initialize GA and log a page view.
	initGA : function(trackerID, configOptions, doNotTrackPageView){
		stlib.gaLogger.configOptions = configOptions;
		if(typeof(trackerID) == "undefined")
		{
			_$de("tracker ID for GA required");
			return;
		}
		if(typeof(_gat)=="undefined"){
			var scriptSrc = "../../ssl.google-analytics.com/ga.js";
			stlib.scriptLoader.loadJavascript(scriptSrc,function(){
				 try{
					widgetLogger.ga = _gat._createTracker(trackerID);
//					widgetLogger.ga = _gat._createTracker("UA-1645146-17"); 	// share5x && fastshare
//					widgetLogger.ga = _gat._createTracker("UA-1645146-9"); 	// share4x && mobile && share5x page based
					if( typeof(widgetLogger.ga) != "undefined" && widgetLogger.ga!==null && typeof(widgetLogger.ga._trackEvent) != "undefined") {
						/* For Mobile Widget - we are tracking page views as events. So skip in case of Mobile Widget.
						   Please refer WID-62 for more details.
						*/
						if(typeof(doNotTrackPageView) == "undefined" && doNotTrackPageView != true){
							widgetLogger.ga._trackPageview();
						}
						if (stlib.gaLogger.configOptions && stlib.gaLogger.configOptions.tracking && stlib.gaLogger.configOptions.publisherGA !== null){
							widgetLogger.pubTracker=_gat._createTracker(stlib.gaLogger.configOptions.publisherGA);
							widgetLogger.ga._trackEvent("PublisherGA-"+stlib.gaLogger.configOptions.tracking,stlib.gaLogger.configOptions.publisherGA,stlib.gaLogger.configOptions.publisher);

						}else if(stlib.gaLogger.configOptions && stlib.gaLogger.configOptions.publisherGA!==null){
							widgetLogger.pubTracker=_gat._createTracker(stlib.gaLogger.configOptions.publisherGA);
							widgetLogger.ga._trackEvent("PublisherGA-"+stlib.gaLogger.configOptions.tracking,stlib.gaLogger.configOptions.publisherGA,stlib.gaLogger.configOptions.publisher);
						}
					}
				 }catch(err) {}
			});
		}else{
			if( typeof(widgetLogger.ga) != "undefined" && widgetLogger.ga!==null && typeof(widgetLogger.ga._trackEvent) != "undefined") {
				if (stlib.gaLogger.configOptions && stlib.gaLogger.configOptions.tracking && stlib.gaLogger.configOptions.publisherGA != null){
					widgetLogger.pubTracker=_gat._createTracker(stlib.gaLogger.configOptions.publisherGA);
					widgetLogger.ga._trackEvent("PublisherGA-"+stlib.gaLogger.configOptions.tracking,stlib.gaLogger.configOptions.publisherGA,stlib.gaLogger.configOptions.publisher);
				}
			}
		}
	},

	// TODO, error checking and validation for the 4 params.  Maybe even putting in a JSON obj
	gaLog : function(category, action, label, value) {
		if( typeof(widgetLogger.ga) != "undefined" && widgetLogger.ga!==null && typeof(widgetLogger.ga._trackEvent) != "undefined") {
			 widgetLogger.ga._trackEvent(category, action, label, value);
		 }
	}
};
/********************END GA LOGGING***********************/
/********************START BROWSER CODE***********************/
stlib.browser = {
	iemode: null,
	firefox: null,
	firefoxVersion: null,
	safari: null,
	chrome: null,
	opera: null,
	windows: null,
	mac: null,
	ieFallback: (/MSIE [6789]/).test(navigator.userAgent),
	//ieFallback: true,
	
	init: function() {
		var ua = navigator.userAgent.toString().toLowerCase();
		
		if (/msie|trident/i.test(ua)) {
	      if (document.documentMode) // IE8 or later
	    	  stlib.browser.iemode = document.documentMode;
		  else{ // IE 5-7
			  stlib.browser.iemode = 5; // Assume quirks mode unless proven otherwise
			  if (document.compatMode){
				  if (document.compatMode == "CSS1Compat")
					  stlib.browser.iemode = 7; // standards mode
		      }
		   }
	      //stlib.browser.iemode = getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i); //IE11+ 
		}
		/*stlib.browser.firefox 	=(navigator.userAgent.indexOf("Firefox") !=-1) ? true : false;
		stlib.browser.firefoxVersion 	=(navigator.userAgent.indexOf("Firefox/5.0") !=-1 || navigator.userAgent.indexOf("Firefox/9.0") !=-1) ? false : true;
		stlib.browser.safari 	=(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1) ? true : false;
		stlib.browser.chrome 	=(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") !=-1) ? true : false;
		stlib.browser.windows 	=(navigator.userAgent.indexOf("Windows") !=-1) ? true : false;
		stlib.browser.mac 		=(navigator.userAgent.indexOf("Macintosh") !=-1) ? true : false;*/
		
		stlib.browser.firefox 	= ((ua.indexOf("firefox") !=-1) && (typeof InstallTrigger !== 'undefined'))?true:false;
	    stlib.browser.firefoxVersion 	=(ua.indexOf("firefox/5.0") !=-1 || ua.indexOf("firefox/9.0") !=-1) ? false : true;
	    stlib.browser.safari 	= (ua.indexOf("safari") !=-1 && ua.indexOf("chrome") ==-1)?true:false;
	    stlib.browser.chrome 	= (ua.indexOf("safari") !=-1 && ua.indexOf("chrome") !=-1)?true:false;
    	stlib.browser.opera 	= (window.opera || ua.indexOf(' opr/') >= 0)?true:false;
		stlib.browser.windows 	=(ua.indexOf("windows") !=-1) ? true : false;
		stlib.browser.mac 		=(ua.indexOf("macintosh") !=-1) ? true : false;
	},

	getIEVersion : function() {
		return stlib.browser.iemode;
	},
	isFirefox : function() {
		return stlib.browser.firefox;
	},
	firefox8Version : function() {
		return stlib.browser.firefoxVersion;
	},
	isSafari : function() {
		return stlib.browser.safari;
	},
	isWindows : function() {
		return stlib.browser.windows;
	},
	isChrome : function() {
		return stlib.browser.chrome;
	},
	isOpera : function() {
		return stlib.browser.opera;
	},
	isMac : function() {
		return stlib.browser.mac;
	},
       isSafariBrowser: function(vendor, ua) {
              // check if browser is safari
              var isSafari = vendor &&
                              vendor.indexOf('Apple Computer, Inc.') > -1 &&
                              ua && !ua.match('CriOS');
              // check if browser is not chrome
              var notChrome = /^((?!chrome|android).)*safari/i.test(ua);
              // check if browser is not firefox
              var notFireFox = /^((?!firefox|linux))/i.test(ua);
              // check if OS is from Apple
              var isApple = (ua.indexOf('Mac OS X') > -1) ||
                             (/iPad|iPhone|iPod/.test(ua) && !window.MSStream);
              // check if OS is windows
              var isWindows = (ua.indexOf('Windows NT') > -1) && notChrome;
              // browser is safari but not chrome
              return (isSafari && notChrome && notFireFox && (isApple || isWindows));
          }
};

stlib.browser.init();
/********************END BROWSER CODE***********************/
/********************START MOBILE BROWSER CODE***********************/

stlib.browser.mobile = {
	mobile:false,
	uagent: null,
	android: null,
	iOs: null,
	silk: null,
	windows: null,
	kindle: null,
	url: null,
	sharCreated: false,
	sharUrl: null,
	isExcerptImplementation: false, //Flag to check if multiple sharethis buttons (Excerpt) have been implemented
	iOsVer: 0, // It will hold iOS version if device is iOS else 0
	
	init: function () {
		this.uagent = navigator.userAgent.toLowerCase();
		if (this.isAndroid()) {
			this.mobile = true;
		}else if (this.isIOs()) {
			this.mobile = true;
		} else if (this.isSilk()) {
			this.mobile = true;
		} else if (this.isWindowsPhone()) {
			this.mobile = true;
		}else if (this.isKindle()) {
			this.mobile = true;
		}
		
		
	},
	
	isMobile: function isMobile() {
		return this.mobile;
	},
	
	isAndroid: function() {
		if (this.android === null) {
			this.android = this.uagent.indexOf("android") > -1;
		}
		return this.android;
	},

	isKindle: function() {
		if (this.kindle === null) {
			this.kindle = this.uagent.indexOf("kindle") > -1;
		}
		return this.kindle;
	},
	
	isIOs: function isIOs() {
		if (this.iOs === null) {
			this.iOs = (this.uagent.indexOf("ipad") > -1) ||
				   (this.uagent.indexOf("ipod") > -1) ||
				   (this.uagent.indexOf("iphone") > -1);
		}
		return this.iOs;
		
	},

	isSilk: function() {
		if (this.silk === null) {
			this.silk = this.uagent.indexOf("silk") > -1;
		}
		return this.silk;
	},

	/**
	 * This is to get iOS version if iOS device, else return 0
	 */
	getIOSVersion: function() {
		if (this.isIOs()) {
			this.iOsVer = this.uagent.substr( (this.uagent.indexOf( 'os ' )) + 3, 5 ).replace( /\_/g, '.' );
		}
		return this.iOsVer;
	},
	
	isWindowsPhone: function() {
		if (this.windows === null) {
			this.windows = this.uagent.indexOf("windows phone") > -1;
		}
		return this.windows;
	}
	
};

stlib.browser.mobile.init();

/********************END MOBILE BROWSER CODE***********************/

/********************START MOBILE BROWSER FRIENDLY CODE***********************/
stlib = stlib || {};
stlib.browser = stlib.browser || {};
stlib.browser.mobile = stlib.browser.mobile || {};

stlib.browser.mobile.handleForMobileFriendly = function(o, options, widgetOpts) {
    if (!this.isMobile()) {
      return false;
    }
    if (typeof(stLight) === 'undefined') {
      stLight = {}
      stLight.publisher = options.publisher;
      stLight.sessionID = options.sessionID;
      stLight.fpc = "";
    }
          var title = (typeof(o.title) !== 'undefined') ? o.title: encodeURIComponent(document.title);
          var url =  (typeof(o.url) !== 'undefined') ? o.url: document.URL;
                //SA-77: introduce new st_short_url parameter
                var shortUrl = (options.short_url != "" && options.short_url != null) ? options.short_url : '';

    if (options.service=="sharethis") {
      var title = (typeof(o.title) !== 'undefined') ? o.title: encodeURIComponent(document.title);
      var url =  (typeof(o.url) !== 'undefined') ? o.url: document.URL;



      var summary = '';
      if(typeof(o.summary)!='undefined' && o.summary!=null){
        summary=o.summary;
      }
      var form = document.createElement("form");
      form.setAttribute("method", "GET");
      form.setAttribute("action", "http://edge.sharethis.com/share4x/mobile.html");
      form.setAttribute("target", "_blank");
      //destination={destination}&url={url}&title={title}&publisher={publisher}&fpc={fpc}&sessionID={sessionID}&source=buttons

      var params={url:url,title:title,summary:summary,destination:options.service,publisher:stLight.publisher,fpc:stLight.fpc,sessionID:stLight.sessionID,short_url:shortUrl};
      if(typeof(o.image)!='undefined' && o.image!=null){
        params.image=o.image;
      }if(typeof(o.summary)!='undefined' && o.summary!=null){
        params.desc=o.summary;
      }if(typeof(widgetOpts)!='undefined' && typeof(widgetOpts.exclusive_services)!='undefined' && widgetOpts.exclusive_services!=null){
        params.exclusive_services=widgetOpts.exclusive_services;
      }if(typeof(options.exclusive_services)!='undefined' && options.exclusive_services!=null){
        params.exclusive_services=options.exclusive_services;
      }if(typeof(widgetOpts)!='undefined' && typeof(widgetOpts.services)!='undefined' && widgetOpts.services!=null){
        params.services=widgetOpts.services;
      }if(typeof(options.services)!='undefined' && options.services!=null){
        params.services=options.services;
      }

      // Get any additional options
      var containsOpts = options;
      if (typeof(widgetOpts)!='undefined') {
        containsOpts = widgetOpts;
      }
      if(typeof(containsOpts.doNotHash)!='undefined' && containsOpts.doNotHash!=null){
        params.doNotHash=containsOpts.doNotHash;
      }
      if(typeof(o.via)!='undefined' && o.via!=null){
        params.via=o.via;
      }

      params.service = options.service;
      params.type = options.type;
      if (stlib.data) {
        var toStoreA = stlib.json.encode(stlib.data.pageInfo);
        var toStoreB = stlib.json.encode(stlib.data.shareInfo);

        if (stlib.browser.isFirefox() && !stlib.browser.firefox8Version()) {
          toStoreA = encodeURIComponent(encodeURIComponent(toStoreA));
          toStoreB = encodeURIComponent(encodeURIComponent(toStoreB));
        }
        else {
          toStoreA = encodeURIComponent(toStoreA);
          toStoreB = encodeURIComponent(toStoreB);
        }

        params.pageInfo = toStoreA;
        params.shareInfo = toStoreB;
      }

      for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
      }
      document.body.appendChild(form);
      form.submit();
      return true;
    }
    if(options.service=='email') {
      var sharInterval, i=0;
      stlib.browser.mobile.url = url;
      if(stlib.browser.mobile.sharUrl == null) {
        stlib.browser.mobile.createSharOnPage();
      }
      var body = (shortUrl != "") ? shortUrl  + "%0A%0a" : "{sharURLValue}" + "%0A%0a";
      if( (typeof(o.summary) != 'undefined') && o.summary!=null){
        body += o.summary + "%0A%0a";
      }
      body += "Sent using ShareThis";
      var mailto = "mailto:?";
      mailto += "subject=" + title;
      mailto += "&body=" +body;

      //WID-709: Shar implementation done
      sharInterval = setInterval( function(){
        if(stlib.browser.mobile.sharUrl != null){
          clearInterval(sharInterval);
          window.location.href=mailto.replace("{sharURLValue}", stlib.browser.mobile.sharUrl);
        }
        if(i > 500) {
          clearInterval(sharInterval);
          window.location.href=mailto.replace("{sharURLValue}", stlib.browser.mobile.sharUrl);
        }
        i++;
      }, 100);
    }
    return true;
  };

stlib.browser.mobile.createSharOnPage = function(){
    if(stlib.browser.mobile.url!=="" && stlib.browser.mobile.url!==" " && stlib.browser.mobile.url!==null && !stlib.browser.mobile.sharCreated)
    {
      var data=["return=json","cb=stlib.browser.mobile.createSharOnPage_onSuccess","service=createSharURL","url="+encodeURIComponent(stlib.browser.mobile.url)];
      data=data.join('&');
      stlib.scriptLoader.loadJavascript("https://ws.sharethis.com/api/getApi.php?"+data, function(){});
    }
};

stlib.browser.mobile.createSharOnPage_onSuccess = function(response){
    if(response.status=="SUCCESS") {
      stlib.browser.mobile.sharCreated = true;
      stlib.browser.mobile.sharUrl = response.data.sharURL;
    } else {
      stlib.browser.mobile.sharUrl = stlib.browser.mobile.url;
    }
};

/********************END MOBILE BROWSER FRIENDLY CODE***********************/

/***************START JSON ENCODE/DECODE***************/
stlib.json = {
	c : {"\b":"b","\t":"t","\n":"n","\f":"f","\r":"r",'"':'"',"\\":"\\","/":"/"},
	d : function(n){return n<10?"0".concat(n):n},
	e : function(c,f,e){e=eval;delete eval;if(typeof eval==="undefined")eval=e;f=eval(""+c);eval=e;return f},
	i : function(e,p,l){return 1*e.substr(p,l)},
	p : ["","000","00","0",""],
	rc : null,
	rd : /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/,
	rs : /(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g,
	rt : /^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/,
	ru : /([\x00-\x07]|\x0b|[\x0e-\x1f])/g,
	s : function(i,d){return "\\".concat(stlib.json.c[d])},
	u : function(i,d){
		var	n=d.charCodeAt(0).toString(16);
		return "\\u".concat(stlib.json.p[n.length],n)
	},
	v : function(k,v){return stlib.json.types[typeof result](result)!==Function&&(v.hasOwnProperty?v.hasOwnProperty(k):v.constructor.prototype[k]!==v[k])},
	types : {
		"boolean":function(){return Boolean},
		"function":function(){return Function},
		"number":function(){return Number},
		"object":function(o){return o instanceof o.constructor?o.constructor:null},
		"string":function(){return String},
		"undefined":function(){return null}
	},
	$$ : function(m){
		function $(c,t) { 
			t=c[m];
			delete c[m];
			try {
				stlib.json.e(c)
			} catch(z){c[m]=t;return 1;}
		};
		return $(Array)&&$(Object);
	},
	encode : function(){
		var	self = arguments.length ? arguments[0] : this,
			result, tmp;
		if(self === null)
			result = "null";
		else if(self !== undefined && (tmp = stlib.json.types[typeof self](self))) {
			switch(tmp){
				case	Array:
					result = [];
					for(var	i = 0, j = 0, k = self.length; j < k; j++) {
						if(self[j] !== undefined && (tmp = stlib.json.encode(self[j])))
							result[i++] = tmp;
					};
					result = "[".concat(result.join(","), "]");
					break;
				case	Boolean:
					result = String(self);
					break;
				case	Date:
					result = '"'.concat(self.getFullYear(), '-', stlib.json.d(self.getMonth() + 1), '-', stlib.json.d(self.getDate()), 'T', stlib.json.d(self.getHours()), ':', stlib.json.d(self.getMinutes()), ':', stlib.json.d(self.getSeconds()), '"');
					break;
				case	Function:
					break;
				case	Number:
					result = isFinite(self) ? String(self) : "null";
					break;
				case	String:
					result = '"'.concat(self.replace(stlib.json.rs, stlib.json.s).replace(stlib.json.ru, stlib.json.u), '"');
					break;
				default:
					var	i = 0, key;
					result = [];
					for(key in self) {
						if(self[key] !== undefined && (tmp = stlib.json.encode(self[key])))
							result[i++] = '"'.concat(key.replace(stlib.json.rs, stlib.json.s).replace(stlib.json.ru, stlib.json.u), '":', tmp);
					};
					result = "{".concat(result.join(","), "}");
					break;
			}
		};
		return result;
	},
	decode : function(input){
		if(typeof(input)=='string')
		{
			var data=null;
			try{if ( /^[\],:{}\s]*$/.test(input.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			 .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")	
			 .replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {
			 	data=window.JSON && window.JSON.parse ? window.JSON.parse(input) : (new Function("return " + input))();
			 	return data;
			 }else{
			 	return null;
			 }}catch(err){}	
		}
	}
};
try{stlib.json.rc=new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')}
catch(z){stlib.json.rc=/^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/}
/***************END JSON ENCODE/DECODE***************/
stlib.validate = {
	regexes: {
		notEncoded:		/(%[^0-7])|(%[0-7][^0-9a-f])|["{}\[\]\<\>\\\^`\|]/gi,
		tooEncoded:		/%25([0-7][0-9a-f])/gi,
		publisher:		/^(([a-z]{2}(-|\.))|)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
		url:			/^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i,
		fpc:			/^[0-9a-f]{7}-[0-9a-f]{11}-[0-9a-f]{7,8}-[0-9]*$/i,
		sessionID:		/^[0-9]*\.[0-9a-f]*$/i,
		title:			/.*/,
		description:	/.*/,
		buttonType:		/^(chicklet|vcount|hcount|large|custom|button|)$/, // TODO: verify, also, is blank ok.
		comment:		/.*/,
		destination:	/.*/, // TODO: check against all service (construct a regexp?)
		source:			/.*/, // TODO: Need to define this
		image:			/(^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))|^$/i,
		sourceURL:		/^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i,
		sharURL:		/(^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))|^$/i
	}
};

stlib.html = {
	encode : function(value) {
		if(stlib.html.startsWith(value, 'http')) {//URL check
			return String(value)
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');		
		} else {
			return String(value)
				.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
		}
	},
  
	startsWith : function(value, str) {
     return (value.match("^"+str)==str);
    }
};
/********************START COOKIE LIBRARY***********************/
/*
 * This handles cookies
 */
var tpcCookiesEnableCheckingDone = false;
var tpcCookiesEnabledStatus = true;

stlib.cookie = {
	setCookie : function(name, value, days) {
		var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
		var ie =(navigator.userAgent.indexOf("MSIE") !=-1);

		if (safari || ie) {
			  var expiration = (days) ? days*24*60*60 : 0;

			  var _div = document.createElement('div');
			  _div.setAttribute("id", name);
			  _div.setAttribute("type", "hidden");
			  document.body.appendChild(_div);

			  var
			  div = document.getElementById(name),
			  form = document.createElement('form');

			  try {
				  var iframe = document.createElement('<iframe name="'+name+'" ></iframe>');
					//try is ie
				} catch(err) {
					//catch is ff and safari
					iframe = document.createElement('iframe');
				}

			  iframe.name = name;
			  iframe.src = 'javascript:false';
			  iframe.style.display="none";
			  div.appendChild(iframe);

			  form.action = "https://sharethis.com/account/setCookie.php";
			  form.method = 'POST';

			  var hiddenField = document.createElement("input");
			  hiddenField.setAttribute("type", "hidden");
			  hiddenField.setAttribute("name", "name");
			  hiddenField.setAttribute("value", name);
			  form.appendChild(hiddenField);

			  var hiddenField2 = document.createElement("input");
			  hiddenField2.setAttribute("type", "hidden");
			  hiddenField2.setAttribute("name", "value");
			  hiddenField2.setAttribute("value", value);
			  form.appendChild(hiddenField2);

			  var hiddenField3 = document.createElement("input");
			  hiddenField3.setAttribute("type", "hidden");
			  hiddenField3.setAttribute("name", "time");
			  hiddenField3.setAttribute("value", expiration);
			  form.appendChild(hiddenField3);

			  form.target = name;
			  div.appendChild(form);

			  form.submit();
		}
		else {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			} else {
				var expires = "";
			}
			var cookie_string = name + "=" + escape(value) + expires;
			cookie_string += "; domain=" + escape (".sharethis.com")+";path=/";
			document.cookie = cookie_string;
		}
	},
	setTempCookie : function(name, value, days) {
		if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
		} else {
				var expires = "";
		}
		var cookie_string = name + "=" + escape(value) + expires;
		cookie_string += "; domain=" + escape (".sharethis.com")+";path=/";
		document.cookie = cookie_string;
	},
	getCookie : function(cookie_name) {
	  var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
	  if (results) {
		  return (unescape(results[2]));
	  } else {
		  return false;
	  }
	},
	deleteCookie : function(name) {

		// For all browsers
		var path="/";
		var domain=".sharethis.com";
		document.cookie = name.replace(/^\s+|\s+$/g,"") + "=" +( ( path ) ? ";path=" + path : "")
				  + ( ( domain ) ? ";domain=" + domain : "" ) +";expires=Thu, 01-Jan-1970 00:00:01 GMT";


		// For Safari and IE
		var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
		var ie =(navigator.userAgent.indexOf("MSIE") !=-1);

		if (safari || ie) {
			var _div = document.createElement('div');
			_div.setAttribute("id", name);
			_div.setAttribute("type", "hidden");
			document.body.appendChild(_div);

			var
			div = document.getElementById(name),
			form = document.createElement('form');

			try {
			  var iframe = document.createElement('<iframe name="'+name+'" ></iframe>');
				//try is ie
			} catch(err) {
				//catch is ff and safari
				iframe = document.createElement('iframe');
			}

			iframe.name = name;
			iframe.src = 'javascript:false';
			iframe.style.display="none";
			div.appendChild(iframe);

			form.action = "https://sharethis.com/account/deleteCookie.php";
			form.method = 'POST';

			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", "name");
			hiddenField.setAttribute("value", name);
			form.appendChild(hiddenField);

			form.target = name;
			div.appendChild(form);

			form.submit();
		}
	},
	deleteAllSTCookie : function() {
		var a=document.cookie;
		a=a.split(';');
		for(var i=0;i<a.length;i++){
			var b=a[i];
			b=b.split('=');

      // do not delete the st_optout cookie
			if(!/st_optout/.test(b[0])){
				var name=b[0];
				var path="/";
				var domain=".edge.sharethis.com";
				document.cookie = name + "=;path=" + path + ";domain=" + domain +";expires=Thu, 01-Jan-1970 00:00:01 GMT";
			}
		}
	},
	setFpcCookie : function(name, value) {
//		var name="__unam";
		var current_date = new Date;
		var exp_y = current_date.getFullYear();
		var exp_m = current_date.getMonth() + 9;// set cookie for 9 months into future
		var exp_d = current_date.getDate();
		var cookie_string = name + "=" + escape(value);
		if (exp_y) {
			var expires = new Date (exp_y,exp_m,exp_d);
			cookie_string += "; expires=" + expires.toGMTString();
		}
		var domain=stlib.cookie.getDomain();
		cookie_string += "; domain=" + escape (domain)+";path=/";
		document.cookie = cookie_string;
	},
	getFpcCookie : function(cookie_name) {
		var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
		if (results)
			return (unescape(results[2]));
		else
			return false;
	},
	getDomain : function() {
		var str = document.domain.split(/\./);
		var domain="";
		if(str.length>1){
			domain="."+str[str.length-2]+"."+str[str.length-1];
		}
		return domain;
	},
	checkCookiesEnabled: function() {
		if(!tpcCookiesEnableCheckingDone) {
			stlib.cookie.setTempCookie("STPC", "yes", 1);
			if(stlib.cookie.getCookie("STPC") == "yes") {
				tpcCookiesEnabledStatus = true;
			}else {
				tpcCookiesEnabledStatus = false;
			}
			tpcCookiesEnableCheckingDone = true;
			return tpcCookiesEnabledStatus;
		}else{
			return tpcCookiesEnabledStatus;
		}
	},
	hasLocalStorage: function() {
		try {
			localStorage.setItem("stStorage", "yes");
			localStorage.removeItem("stStorage");
			return true;
		} catch(e) {
			return false;
		}
	}
};
/********************END COOKIE LIBRARY***********************/
/*
 * This holds critical data, requires the cookie object
 */
if (typeof(stlib.data) == "undefined") {
	stlib.data = {
		bInit: false,
		publisherKeySet: false,
		pageInfo: {
		},
		shareInfo: {
		},
		resetPageData: function() {
			//stlib.data.pageInfo.publisher 		= "00-00-00"; // The publisher key as given by the publisher
			//stlib.data.pageInfo.fpc 			= "ERROR"; // The cookie set on the publisher's domain to track the user on that domain
			stlib.data.pageInfo.sessionID 		= "ERROR"; // The session on any given pageview with our widget on it
			//stlib.data.pageInfo.sourceURL		= "ERROR"; // The source domain
			stlib.data.pageInfo.hostname		= "ERROR"; // The source domain
			stlib.data.pageInfo.location		= "ERROR.html"; // The source domain
			stlib.data.pageInfo.product             = "widget";
			stlib.data.pageInfo.stid            = "";
		},
		resetShareData: function() {
			stlib.data.shareInfo = {};
			stlib.data.shareInfo.url 			= "ERROR"; // The url the service is sharing before any modification
			stlib.data.shareInfo.sharURL		= ""; // The shar url the service is sharing before any modification
			stlib.data.shareInfo.buttonType		= "ERROR"; // The button type that were clicked (hcount or vcount)
			stlib.data.shareInfo.destination	= "ERROR"; // The channel that is being shared to (facebook, twitter)
			stlib.data.shareInfo.source 		= "ERROR"; // The widget or code location that is generating the request
			//stlib.data.shareInfo.title 			= ""; // The title of the article as best as can be determined
			//stlib.data.shareInfo.image 			= ""; // The title of the article as best as can be determined
			//stlib.data.shareInfo.description 	= "";	   // The description of the article as best as can be determined
			//stlib.data.shareInfo.comment	 	= "";	   // The description of the article as best as can be determined
		},
		resetData: function() {
			stlib.data.resetPageData();
			stlib.data.resetShareData();
		},
		validate: function () {
			var regexes = stlib.validate.regexes;

			function validateHelp(key, value) {
				if (value != encodeURIComponent(value)) {
					regexes.notEncoded.test(value) ? _$de(key + " not encoded") : null;
					regexes.tooEncoded.test(value) ? _$de(key + " has too much encoding") :null;
				}
				var valueOk = regexes[key] ? regexes[key].test(decodeURIComponent(value)) : true;
				if (!valueOk) {
					_$de(key + " failed validation");
				}
			}

			var p = stlib.data.pageInfo;
			var param;
			for (param in p) {
				validateHelp(param, p[param])
			}
			p = stlib.data.shareInfo;
			for (param in p) {
				validateHelp(param, p[param])
			}

		},
		init: function() {
			if (!stlib.data.bInit) {
				stlib.data.bInit = true;
				stlib.data.resetData();
				stlib.data.set("fcmp", typeof(window.__cmp) == 'function', "pageInfo");
                              stlib.data.set("fcmpv2", typeof(window.__tcfapi) == 'function', "pageInfo");

				if(stlib.publisher){
					stlib.data.setPublisher(stlib.publisher);
				}
				stlib.data.set("product",stlib.product,"pageInfo");
				var rawUrl = document.location.href, refDomain = '', refQuery = '', referArray = [], currentRefer = '', cleanUrl = '', hashString = "",
					baseURL = '', sessionID_time = '', sessionID_rand = '';

				//Fix for WID-343
				referArray = stlib.data.getRefDataFromUrl(rawUrl);//get referrer data coming from share.es
				if(referArray.length > 0) {
					refDomain = (typeof(referArray[0]) != "undefined") ? referArray[0] : "";
					refQuery = (typeof(referArray[1]) != "undefined") ? referArray[1] : "";
					cleanUrl = stlib.data.removeRefDataFromUrl(rawUrl);//Remove referrer data from the URL.

					//Displays the modified(without referrer data parameter) or original URL in the address bar
					stlib.data.showModifiedUrl(cleanUrl);
					stlib.data.set("url", cleanUrl, "shareInfo");
				} else { //For old non-secure shar urls
					currentRefer = document.referrer;
					referArray = currentRefer.replace("http://", "").replace("https:///", "").split("/");
					refDomain = referArray.shift();
					refQuery = referArray.join("/");

					stlib.data.set("url", rawUrl,"shareInfo");
				}
				// TODO add option to not use hash tag

        stlib.data.set("title", document.title, "shareInfo");

				if (stlib.data.publisherKeySet != true) {
					stlib.data.set("publisher","ur.00000000-0000-0000-0000-000000000000","pageInfo");
				}

				// no longer using fpc
				// stlib.fpc.createFpc();
				// stlib.data.set("fpc",stlib.fpc.cookieValue,"pageInfo"); // Requires that the cookie has been created

				sessionID_time = (new Date()).getTime().toString();
				sessionID_rand = Number(Math.random().toPrecision(5).toString().substr(2)).toString();
				stlib.data.set("sessionID",sessionID_time + '.' + sessionID_rand,"pageInfo");

				//stlib.data.set("sourceURL", document.location.href,"pageInfo");
				stlib.data.set("hostname", document.location.hostname,"pageInfo");
				stlib.data.set("location", document.location.pathname,"pageInfo");

				stlib.data.set("refDomain", refDomain ,"pageInfo");
				stlib.data.set("refQuery", refQuery,"pageInfo");
			}
		},
		//Fix for WID-343
		showModifiedUrl: function(modUrl) {
			if (window.history && history.replaceState)
				history.replaceState(null, document.title, modUrl);
			else if ((/MSIE/).test(navigator.userAgent)) {
				var ampInHashIndex = 0, hashString = window.location.hash, patt1 = new RegExp("(\&st_refDomain=?)[^\&|]+"),
					patt2 = new RegExp("(\#st_refDomain=?)[^\&|]+"), hRef = document.location.href;
				if(patt1.test(hRef)) {
					ampInHashIndex = hashString.indexOf('&st_refDomain');
					window.location.hash = hashString.substr(0, ampInHashIndex);
				} else if(patt2.test(hRef))
					window.location.replace("#");
			} else {
				document.location.replace(modUrl);
			}
		},
		//Fix for WID-343
		getRefDataFromUrl: function(url) {
			var patt = new RegExp("st_refDomain="), tempDomain = '', tempQuery = '', result = [];

			if(patt.test(url)) {
				tempDomain = url.match(/(st_refDomain=?)[^\&|]+/g);
				result.push(tempDomain[0].split('=')[1]);

				tempQuery = url.match(/(st_refQuery=?)[^\&|]+/g);
				result.push(tempQuery[0].replace('st_refQuery=', ''));
			}

			return result;
		},
		//Fix for WID-343
		removeRefDataFromUrl: function(url) {
			var urlWoRefdomain = '',
				obj = '',
				patt1 = new RegExp("(\&st_refDomain=?)[^\&|]+"),
				patt2 = new RegExp("(\#st_refDomain=?)[^\&|]+");

			if(patt1.test(url)) {
				urlWoRefdomain = url.replace(/\&st_refDomain=(.*)/g,'');
			} else if(patt2.test(url)) {
				urlWoRefdomain = url.replace(/\#st_refDomain=(.*)/g,'');
			} else {
				urlWoRefdomain = url;
			}

			return urlWoRefdomain;
		},
		setPublisher: function(publisherKey) {
			// TODO: Add Validation
			stlib.data.set("publisher",publisherKey,"pageInfo");
			stlib.data.publisherKeySet = true;
		},
		setSource: function(src, options) {
			// TODO: Add Validation
			var source = "";
			// Inside widget logging
			if (options) {
				if (options.toolbar) {
					source = "toolbar"+src;
				} else if (options.page && options.page != "home" && options.page != "") {
					source = "chicklet"+src;
				} else {
					source = "button"+src;
				}
			}
			// Outside widget logging
			else {
				// can be share5x, share4x, chicklet, fastshare, mobile
				source = src;
			}
			stlib.data.set("source",source,"shareInfo");
		},
		set: function(key, value, table) {
			if (typeof(value) == "number" || typeof(value) == "boolean") {
				stlib.data[table][key] = value;
			} else if (typeof(value) == "undefined" || value == null) {
			} else {
//				_$d1("Stripping HTML: " + key + ": " + value.replace(/<[^<>]*>/gi, " "));
//				_$d1("decodeURI: " + key + ": " + decodeURI(value.replace(/<[^<>]*>/gi, " ")));
//				_$d1("Escape percent: " + key + ": " + decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25"));
//				_$d1("Decoding: " + key + ": " + decodeURIComponent(decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
//				_$d1("Encoding: " + key + ": " + encodeURIComponent(decodeURIComponent(decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25"))));
				stlib.data[table][key] = encodeURIComponent(decodeURIComponent(unescape(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
				// These might have url encoded data
				if (key=="url" /*|| key=="sourceURL"*/ || key=="location" || key=="image") {
					try {
						stlib.data[table][key] = encodeURIComponent(decodeURIComponent(decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
					} catch (e) {
						stlib.data[table][key] = encodeURIComponent(decodeURIComponent(unescape(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
					}
				}
			}
		},
		get: function(key, table) {
			try {
				if (stlib.data[table] && stlib.data[table][key])
					return decodeURIComponent(stlib.data[table][key]);
				else
					return false;
			}catch(e){
				return false
			}
		},
		unset: function(key, table) {
			if (stlib.data[table] && typeof(stlib.data[table][key])!="undefined")
				delete stlib.data[table][key];
		},
                bindEvent: function(element, eventName, eventHandler) {
                    if (element.addEventListener) {
                        element.addEventListener(eventName, eventHandler, false);
                    } else if (element.attachEvent) {
                        element.attachEvent('on' + eventName, eventHandler);
                    }
                },
                debug: function(endpoint, event) {
                  stlib.data.init();
                  var a = stlib.data.pageInfo;
                  var c = "";
                  var b;
                  for (b in a) {
                      c += b + "=" + a[b] + "&"
                  }
                  c = c.substring(0, c.length - 1);

                  var loggerUrl = "https://l.sharethis.com/";
                  loggerUrl += endpoint;
                  loggerUrl += "?event=" + event;
                  loggerUrl += "&" + c;

                  var e = new Image(1, 1);
                  e.src = loggerUrl;
                  e.onload = function() {
                      return
                  };
                },
                hostname: function(url) {
                  var a;
                  if (url == null) {
                    url = st.href;
                  }
                  a = document.createElement('a');
                  a.setAttribute('href', url);
                  return a.hostname;
                },
                protocol: function(url) {
                  var a;
                  if (url == null) {
                    url = st.href;
                  }
                  a = document.createElement('a');
                  a.setAttribute('href', url);
                  return a.protocol;
                },
                parseCookie: function (name, cookie) {
                  var values = cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
                  return values ? values.pop() : null;
                },
                writeCookie: function(name, value, max_age)  {
                  if (!max_age) {
                    max_age = 33696000
                  }
                  var host = (window && window.location && window.location.hostname) || '';
                  var parts = host.split('.');
                  var domain = "";
                  if (parts.length > 1) {
                    domain = "domain=." + parts.slice(-2).join('.');
                  }
                  var samesite_secure = "";
                  try {
                    document.cookie = "st_samesite=1;SameSite=None;Secure";
                    if (stlib.data.parseCookie("st_samesite", document.cookie)) {
                      samesite_secure = "SameSite=None;Secure"
                      document.cookie = "st_samesite=1;max-age=0;SameSite=None;Secure";
                    }
                  } catch (e) {}
                  document.cookie = name + "=" + value + ";" + domain + ";path=/;max-age=" + max_age + ";" + samesite_secure;
                },
                setConsent: function(consent) {
                    for(var consent_key in consent) {
                         stlib.data.set(consent_key,consent[consent_key],"pageInfo");
                    }
                },
                getEUConsent: function (c) {

                  function once(fn, context) { 
                    var result;
                    return function() { 
                      if(fn) {
                        result = fn.apply(context || this, arguments);
                        fn = null;
                      }
                      return result;
                    };
                  }
        
                  var done = once(c);

                  // set usprivacy first if we have it
                  var usprivacy = stlib.data.parseCookie("usprivacy", document.cookie);
                  if (usprivacy) {
                    stlib.data.setConsent({
                      usprivacy: usprivacy
                    });
                  }

                  // keep track of how long it takes to get consent
                  var start = Date.now();

                  var useCookie = once(function() {
        
                    // check for first party cookies
                    var euconsent_v2 = stlib.data.parseCookie("euconsent-v2", document.cookie);
                    if (euconsent_v2 !== null) {
                      stlib.data.setConsent({
                        gdpr_consent: euconsent_v2,
                        gdpr_domain: document.location.hostname,
                        gdpr_method: "cookie"
                      });
                    }
                    done();
                  });

                  if (typeof window.__tcfapi == "function") {

                    // fallback to cookie in case the tcf api is too slow or unavailable
                    var timeout = setTimeout(useCookie, 5000);
        
                    // first we try to get the data from the cmp
                    // wrap in a try catch since we don't control the tcfapi code on page
                    try {

                      const tcfapi_callback = (data) => {
                        if (data && data.tcString) {
                          var gdpr_domain = (data.isServiceSpecific)
                            ? document.location.hostname : ".consensu.org";
                          stlib.data.setConsent({
                            consent_duration: Date.now() - start,
                            gdpr_consent: data.tcString,
                            gdpr_domain: gdpr_domain,
                            gdpr_method: "api"
                          });
                          clearTimeout(timeout);
                          done();
                          __tcfapi('removeEventListener', 2, () => {}, data.listenerId);
                        } 
                      }
                      __tcfapi('addEventListener', 2, tcfapi_callback);
                      
                    } catch (e) {
        
                      // fallback to cookie if there is an error
                      useCookie();
                    }
                  } else {
        
                    // fallback to cookie if the tcfapi doesn't exist
                    useCookie();
                  }
                }
	};

	stlib.data.resetData();
}
stlib.hash = {
	doNotHash: false,
	hashAddressBar: false,
	doNotCopy: false,
	prefix:"sthash",
	shareHash: "",
	incomingHash: "",
	validChars: ["1","2","3","4","5","6","7","8","9","0",
				"A","B","C","D","E","F","G","H","I","J",
				"K","L","M","N","O","P","Q","R","S","T",
				"U","V","W","X","Y","Z","a","b","c","d",
				"e","f","g","h","i","j","k","l","m","n",
				"o","p","q","r","s","t","u","v","w","x",
				"y","z"],
	servicePreferences: {
		linkedin: "param",
		stumbleupon: "param",
		bebo: "param"
	},
	hashDestination: function(destination) {
		if (destination == "copy") {return "dpuf";}
		var condensedString = destination.substring(0,2) + destination.substring(destination.length-2, destination.length);
		var increment = function(string, pos) {
			if(string.charCodeAt(pos) == 122) {
				return "a";
			}
			return String.fromCharCode(string.charCodeAt(pos) + 1);
		}
		return increment(condensedString, 0) + increment(condensedString, 1) + increment(condensedString, 2) + increment(condensedString, 3);
	},
	getHash: function() {
		var sthashFound = false;
		var sthashValue = "";
		var urlWithoutHash = document.location.href;
		urlWithoutHash = urlWithoutHash.split("#").shift();
		var paramArray = urlWithoutHash.split("?");
		if (paramArray.length > 1) {
			paramArray = paramArray[1].split("&");
			for (arg in paramArray) {
				try {
					if (paramArray[arg].substring(0, 6) == "sthash") {
						sthashFound = true;
						sthashValue = paramArray[arg];
					}
				} catch (err) {

				}
			}
			if (sthashFound) {
				return sthashValue;
			} else {
				return document.location.hash.substring(1);
			}
		} else {
			return document.location.hash.substring(1);
		}
	},
	stripHash: function(url) {
		var urlWithoutHash = url;
		urlWithoutHash = urlWithoutHash.split("#");
		if (urlWithoutHash.length > 1)
			return urlWithoutHash[1];
		else
			return "";
	},
	clearHash: function() {
		if (stlib.hash.validateHash(document.location.hash)) {
			var baseHref = document.location.href.split("#").shift();

			if (window.history && history.replaceState)
//				history.replaceState(null, "ShareThis", "#");
				history.replaceState(null, document.title, baseHref);
			else if ((/MSIE/).test(navigator.userAgent))
				window.location.replace("#");
			else
				document.location.hash = "";
		}
	},
	init: function() {
		var finalHash = "";
		var max = stlib.hash.validChars.length;
		for (var i=0;i<8;i++) {
			finalHash += stlib.hash.validChars[Math.random()*max|0];
		}
		if (stlib.hash.getHash() == "") {
			stlib.hash.shareHash = stlib.hash.prefix + "." + finalHash;
		} else {
			var splitHash = stlib.hash.getHash().split(".");
			var key = splitHash.shift();
			if (key == stlib.hash.prefix || key == stlib.hash.prefix) {
				stlib.hash.incomingHash = stlib.hash.getHash();
				stlib.hash.shareHash = stlib.hash.prefix + "." + splitHash.shift() + "." + finalHash;
			} else {
				stlib.hash.shareHash = stlib.hash.prefix + "." + finalHash;
			}
		}
		if (!stlib.hash.doNotHash && stlib.hash.hashAddressBar) {
			if (document.location.hash == "" || stlib.hash.validateHash(document.location.hash)) {
				if (window.history && history.replaceState)
					history.replaceState(null, "ShareThis", "#"+stlib.hash.shareHash + ".dpbs");
				else if ((/MSIE/).test(navigator.userAgent))
					window.location.replace("#"+stlib.hash.shareHash + ".dpbs");
				else
					document.location.hash = stlib.hash.shareHash + ".dpbs";
			}
		} else {
			stlib.hash.clearHash();
		}
		if (!stlib.hash.doNotHash && !stlib.hash.doNotCopy) {
			stlib.hash.copyPasteInit();
		}
		stlib.hash.copyPasteLog();
	},
	checkURL: function() {
		var destination = stlib.data.get("destination", "shareInfo");
		var baseURL = stlib.hash.updateParams(destination);
		var shortenedDestination = "." + stlib.hash.hashDestination(destination);
		stlib.hash.updateDestination(shortenedDestination);
		if (!stlib.hash.doNotHash && typeof(stlib.data.pageInfo.shareHash) != "undefined") {
			var url = stlib.data.get("url", "shareInfo");
			var hash = stlib.hash.stripHash(url);
			if (stlib.hash.validateHash(hash) || hash == "") {
				if(typeof(stlib.hash.servicePreferences[destination]) != "undefined") {
					if(stlib.hash.servicePreferences[destination] == "param") {
						_$d1("Don't use hash, use params");
						_$d2(baseURL);
						if (baseURL.split("?").length > 1) {
							var parameterArray = baseURL.split("?")[1].split("&")
							var sthashExists = false;
							//for (arg in parameterArray) {
							for (var arg = 0; arg < parameterArray.length; arg++) {
								if (parameterArray[arg].split(".")[0] == "sthash") {
									sthashExists = true;
								}
							}
							if (sthashExists) {
								// Param was fixed by updateParams, dont need to add anything
								stlib.data.set("url",baseURL, "shareInfo");
							} else {
								// Param wasn't there, need to add it.
								stlib.data.set("url",baseURL + "&" + stlib.data.pageInfo.shareHash, "shareInfo");
							}
						} else {
							// There are no params, need to add the hash param
							stlib.data.set("url",baseURL + "?" + stlib.data.pageInfo.shareHash, "shareInfo");
						}
						if (destination == "linkedin") {	// shar url contains # which is an error in LinkedIn
							if (stlib.data.get("sharURL", "shareInfo") != "") {
								stlib.data.set("sharURL", stlib.data.get("url", "shareInfo"), "shareInfo");
							}
						}
					} else {
						_$d1("Using Hash");
						stlib.data.set("url",baseURL + "#" + stlib.data.pageInfo.shareHash, "shareInfo");
					}
				} else {
					_$d1("Not using custom destination hash type");
					stlib.data.set("url",baseURL + "#" + stlib.data.pageInfo.shareHash, "shareInfo");
				}
			}
		}
	},
	updateParams: function(destination) {
		var baseURL = stlib.data.get("url", "shareInfo").split("#").shift();
		var regex2a = /(\?)sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}/;
		var regex2b = /(&)sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}/;
		var regex1a = /(\?)sthash\.[a-zA-z0-9]{8}/;
		var regex1b = /(&)sthash\.[a-zA-z0-9]{8}/;
		if (regex2a.test(baseURL)) {
			baseURL = baseURL.replace(regex2a, "?" + stlib.data.pageInfo.shareHash);
		} else if (regex2b.test(baseURL)) {
			baseURL = baseURL.replace(regex2b, "&" + stlib.data.pageInfo.shareHash);
		} else if (regex1a.test(baseURL)) {
			baseURL = baseURL.replace(regex1a, "?" + stlib.data.pageInfo.shareHash);
		} else if (regex1b.test(baseURL)) {
			baseURL = baseURL.replace(regex1b, "&" + stlib.data.pageInfo.shareHash);
		}
		return baseURL;
	},
	updateDestination: function(destinationHash) {
		var regex2 = /sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}\.[a-z]{4}/;
		var regex1 = /sthash\.[a-zA-z0-9]{8}\.[a-z]{4}/;
		_$d_();
		_$d1("Updating Destination");
		if (regex2.test(stlib.data.pageInfo.shareHash)) {
			_$d2(stlib.data.pageInfo.shareHash.substring(0,24));
			stlib.data.pageInfo.shareHash = stlib.data.pageInfo.shareHash.substring(0,24) + destinationHash;
		} else if (regex1.test(stlib.data.pageInfo.shareHash)) {
			_$d2(stlib.data.pageInfo.shareHash.substring(0,15));
			stlib.data.pageInfo.shareHash = stlib.data.pageInfo.shareHash.substring(0,15) + destinationHash;
		} else {
			stlib.data.pageInfo.shareHash += destinationHash;
		}
	},
	validateHash: function(isValidHash) {
		var regex3 = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}$/;
		var regex2 = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}\.[a-z]{4}$/;
		var regex1 = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-z]{4}$/;
		var regex0 = /[\?#&]?sthash\.[a-zA-z0-9]{8}$/;
		return regex0.test(isValidHash) || regex1.test(isValidHash) || regex2.test(isValidHash) || regex3.test(isValidHash);
	},
	appendHash : function (url) {
		var hash = stlib.hash.stripHash(url);
		if (stlib.data.pageInfo.shareHash && (stlib.hash.validateHash(hash) || hash == "")) {
			url = url.replace("#"+hash,"") + "#" + stlib.data.pageInfo.shareHash;
		} else {
		}
		return url;
	},
	copyPasteInit: function() {
		var body = document.getElementsByTagName("body")[0];
		var replacement = document.createElement("div");
		replacement.id = "stcpDiv";
		replacement.style.position = "absolute";
		replacement.style.top = "-1999px";
		replacement.style.left = "-1988px";
		body.appendChild(replacement);
		replacement.innerHTML = "ShareThis Copy and Paste";
		var baseHref = document.location.href.split("#").shift();
		var hash = "#" + stlib.hash.shareHash;
		if (document.addEventListener) {
			body["addEventListener"]("copy",function(e){
				//TYNT CONFLICT FIX: do not copy if Tynt object exists
				if (typeof(Tynt)!="undefined"){
//					console.log("Tynt exists. Don't copy");
					return;
				}
//				console.log("Tynt doesn't exist. Proceed");

				//grab current range and append url to it
				var selection = document.getSelection();

				if (selection.isCollapsed) {
					return;
				}

				var markUp = selection.getRangeAt(0).cloneContents();
				replacement.innerHTML = "";
				replacement.appendChild(markUp);

				if (replacement.textContent.trim().length==0) {
				    return;
				}

				if((selection+"").trim().length==0) {
					//No text, don't need to do anything
				} else if (replacement.innerHTML == (selection+"") || replacement.textContent == (selection+"")) {
					//Fix for CNS FB:12969. Encode html data to avoid js script execution on content copy
					replacement.innerHTML = stlib.html.encode(stlib.hash.selectionModify(selection));
				} else {
					//Fix for CNS FB:12969. Encode html data to avoid js script execution on content copy
					replacement.innerHTML += stlib.html.encode(stlib.hash.selectionModify(selection, true));
				}
				var range = document.createRange();
				range.selectNodeContents(replacement);
				var oldRange = selection.getRangeAt(0);
			},false);
		} else if (document.attachEvent) {
			/*
			body.oncopy = function() {
				var oldRange = document.selection.createRange();
				replacement.innerHTML = oldRange.htmlText;
				try {
					var length = (oldRange.text).trim().length;
				} catch (e) {
					var length = (oldRange.text).replace(/^\s+|\s+$/g, '').length;
				}
				if(length==0) {
					//No text, don't need to do anything
				} else if (oldRange.htmlText == oldRange.text) {
					//Just text, treat normally
					replacement.innerHTML = stlib.hash.selectionModify(oldRange.text);
				} else {
					//Text and markup, special case
					replacement.innerHTML += stlib.hash.selectionModify(oldRange.text, true);
				}
				var range = document.body.createTextRange();
				range.moveToElementText(replacement);
				range.select();
				setTimeout(function() {oldRange.select();}, 1);
			};
			*/
		}
	},
	copyPasteLog: function() {
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var messageEvent1 = eventMethod == "attachEvent" ? "oncopy" : "copy";
		var body = document.getElementsByTagName("body")[0];
		if(body){
			body[eventMethod](messageEvent1,function(e){
				var pass = true;
				stlib.data.resetShareData();
				stlib.data.set("url", document.location.href, "shareInfo");
				stlib.data.setSource("copy");
				stlib.data.set("destination", "copy", "shareInfo");
		    	stlib.data.set("buttonType", "custom", "shareInfo");

				if (typeof(Tynt)!="undefined"){
					// Log Tynt
					stlib.data.set("result", "tynt", "shareInfo");
					pass = false;
				}
				if (typeof(addthis_config)!="undefined") {
					// Log AddThis
					stlib.data.set("result", "addThis", "shareInfo");
					if (typeof(addthis_config.data_track_textcopy)=="undefined"||addthis_config.data_track_textcopy) {
						stlib.data.set("enabled", "true", "shareInfo");
						pass = false;
					} else {
						stlib.data.set("enabled", "false", "shareInfo");
					}
				}
			},false);
		}
	},
	logCopy: function(url, selection) {
		stlib.data.resetShareData();
	    stlib.data.set("url", url, "shareInfo");
	    stlib.data.setSource("copy");
    	stlib.data.set("destination", "copy", "shareInfo");
    	stlib.data.set("buttonType", "custom", "shareInfo");
    	if (selection)
    		stlib.data.set("copy_text", selection, "shareInfo");
    	stlib.sharer.share();
	},
	selectionModify: function(selection, anchorOnly) {
		selection = "" + selection;
		_$d_();
		_$d1("Copy Paste");
		var regex = /^((http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))/i;
		var regex2 = /^([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i;
		var regexPhoneNumberUS = /^\+?1?[\.\-\\)_\s]?[\\(]?[0-9]{3}[\.\-\\)_\s]?[0-9]{3}[\.\-_\s]?[0-9]{4}$|^[0-9]{3}[\.\-_\s]?[0-9]{4}$/;
		var regexPhoneNumberIndia = /^[0-9]{3}[\.\-_\s]?[0-9]{8}$/;
		var regexPhoneNumberBrazil = /^[0-9]{2}[\.\-_\s]?[0-9]{4}[\.\-_\s]?[0-9]{4}$/;
		var regexEmail = /[\-_\.a-z0-9]+@[\-_\.a-z0-9]+\.[\-_\.a-z0-9]+/i;
		var regex3 = /[\s@]/;
		var baseHref = document.location.href.split("#").shift();
		var hash = "#" + stlib.hash.shareHash;
		var anchorStr = "";
		var urlStr = "";
		var returnStr = selection;
		if (typeof(anchorOnly) == "undefined" && ((regex.test(selection) || regex2.test(selection)) && !regex3.test(selection.trim()))) { // the selection is a url
			_$d2("is Url");
			if (selection.match(/#/) == null || stlib.hash.validateHash(selection)) {
				urlStr = selection.split("#")[0] + hash + ".dpuf";
			} else {
				urlStr = selection;
			}
		} else {
			_$d2("is Not Url");
			if (document.location.hash == "" || (/^#$/).test(document.location.hash) || stlib.hash.validateHash(document.location.hash)) {
				urlStr = baseHref + hash + ".dpuf";
			} else {
				urlStr = document.location.href;
			}
			returnStr = selection;
			if (selection.length > 50) {
				if (!regexPhoneNumberUS.test(selection) && !regexPhoneNumberIndia.test(selection) && !regexPhoneNumberBrazil.test(selection) && !regexEmail.test(selection)) {		// don't add if an email or phone number
					returnStr += anchorStr;
				}
			}
		}
		if (selection.length > 500) {
			selection = selection.substring(0, 497) + "...";
		}
		stlib.hash.logCopy(urlStr, selection);
		return returnStr;
	}
};

stlib.allServices = {
	adfty: {title: 'Adfty'},
	allvoices: {title:'Allvoices'},
	amazon_wishlist: {title:'Amazon Wishlist'},
	arto: {title:'Arto'}, 
	att: {title:'AT&T'},	
	baidu: {title: 'Baidu'},
	blinklist : {title : 'Blinklist'},
	blip: {title: 'Blip'},
	blogmarks : {title : 'Blogmarks'},
	blogger : {title : 'Blogger',type : 'post'},
	buddymarks: {title: 'BuddyMarks'},
	buffer: {title: 'Buffer'},
	care2 : {title : 'Care2'},
	chiq : {title:'chiq'},
	citeulike : {title : 'CiteULike'},
	chiq : {title : 'chiq'},
	corkboard: {title: 'Corkboard'},
	dealsplus : {title : 'Dealspl.us'},
	delicious : {title : 'Delicious'},
	digg : {title : 'Digg'},
	diigo : {title : 'Diigo'},
	dzone: {title: 'DZone'},
	edmodo : {title : 'Edmodo'},
	email : {title : 'Email'},
	embed_ly : {title : 'Embed.ly'},
	evernote: {title:'Evernote'},
	facebook : {title : 'Facebook'},
	fark : {title : 'Fark'},
	fashiolista: {title:'Fashiolista'},
	flipboard: {title:'Flipboard'},
	folkd:{title:'folkd.com'},
	foodlve: {title:'FoodLve'},
	fresqui : {title : 'Fresqui'},
	friendfeed : {title : 'FriendFeed'},
	funp : {title : 'Funp'},
	fwisp: {title:'fwisp'},
	google: {title: 'Google'},
	googleplus: {title: 'Google +'},
	google_bmarks : {title : 'Bookmarks'},
	google_reader: {title: 'Google Reader'},
	google_translate: {title: 'Google Translate'},
	hatena: {title:'Hatena'},
	instapaper : {title : 'Instapaper'},
	jumptags: {title:'Jumptags'},
	kaboodle:{title:'Kaboodle'},
	kik: {title:'Kik'},
	linkagogo:{title:'linkaGoGo'},
	linkedin : {title : 'LinkedIn'},
	livejournal : {title : 'LiveJournal',type : 'post'},
	mail_ru : {title : 'mail.ru'},
	meneame : {title : 'Meneame'},
	messenger : {title : 'Messenger'},
	mister_wong : {title : 'Mr Wong'},
	moshare : {title : 'moShare'},
	myspace : {title : 'MySpace'},
	n4g : {title : 'N4G'},
	netlog: {title: 'Netlog'},
	netvouz:{title:'Netvouz'},
	newsvine : {title : 'Newsvine'},
	nujij:{title:'NUjij'},
	odnoklassniki : {title : 'Odnoklassniki'},
	oknotizie : {title : 'Oknotizie'},
	pinterest:{title:'Pinterest'},
	pocket:{title:'Pocket'},
	print:{title:'Print'},
	raise_your_voice : {title : 'Raise Your Voice'},
	reddit : {title : 'Reddit'},
	segnalo : {title : 'Segnalo'},
	sharethis : {title : 'ShareThis'},
	sina: {title:'Sina'},
	sonico : {title : 'Sonico'},
	startaid:{title:'Startaid'},
	startlap:{title:'Startlap'},
	stumbleupon : {title : 'StumbleUpon'},
	stumpedia:{title:'Stumpedia'},
	typepad : {title : 'TypePad',type : 'post'},
	tumblr : {title : 'Tumblr'},
	twitter : {title : 'Twitter'},
	viadeo:{title:'Viadeo'},
	virb:{title:'Virb'},
	vkontakte : {title : 'Vkontakte'},
	voxopolis:{title: 'VOXopolis'},
	whatsapp : {title: 'WhatsApp'},
	weheartit : {title: 'We Heart It'},
	wordpress : {title : 'WordPress',type : 'post'},
	xerpi:{title:"Xerpi"},
	xing: {title:'Xing'},
	yammer : {title : 'Yammer'}
};
stlib.allOauthServices = {
	twitter: {title:'Twitter'},
	linkedIn : {title : 'LinkedIn'},
	facebook : {title : 'Facebook'}
};
stlib.allNativeServices = {
	fblike:{title:"Facebook Like"},
	fbrec:{title:"Facebook Recommend"},
	fbsend:{title:"Facebook Send"},
	fbsub:{title:"Facebook Subscribe"},
	foursquaresave:{title:"Foursquare Save"},
	foursquarefollow:{title:"Foursquare Follow"},
	instagram:{title:"Instagram Badge"},
	plusone: {title:'Google +1'},
	pinterestfollow : {title : 'Pinterest Follow'},
	twitterfollow : {title : 'Twitter Follow'},
	youtube : {title : 'Youtube Subscribe'}
};
stlib.allDeprecatedServices = {
	google_bmarks:{title:'Google Bookmarks'},
	yahoo_bmarks:{title:'Yahoo Bookmarks'}
};
stlib.allOtherServices = {
	copy:{title:'Copy Paste'},
	sharenow:{title:'ShareNow'},
	sharenow_auto:{title:'Frictionless Sharing'},
	fbunlike:{title:'Facebook Unlike'}
};
var _all_services = stlib.allServices;/*
 * This handles direct post sharing
 */
stlib.sharer = {
	sharerUrl: "https://ws.sharethis.com/api/sharer.php",
	regAuto : new RegExp(/(.*?)_auto$/), //regexp to detect auto events
	constructParamString: function() {
		// Validate the data
		stlib.data.validate();
//		if (!stlib.hash.doNotHash) {
    //			stlib.hash.checkURL();
//		}
		// Pull all the parameters from the page the widget was on
		var p = stlib.data.pageInfo;
		var paramString = "?";
		var param;
		for (param in p) {
			// the following line creates "param=value&"
			paramString += param + "=" + encodeURIComponent(p[param]) + "&";
			_$d1("constructParamStringPageInfo: " + param + ": " + p[param]);
		}
		// Pull all the parameters related to the share
		p = stlib.data.shareInfo;
		for (param in p) {

			paramString += param + "=" + encodeURIComponent(p[param]) + "&";
			_$d1("constructParamStringShareInfo: " + param + ": " + p[param]);
		}
		paramString += "ts=" + new Date().getTime() + "&";

		return paramString.substring(0, paramString.length-1);
	},
	stPrint : function() {
		window.print();
	},
	incrementShare : function() {
					var currentRefer = document.referrer;
					var referArray = currentRefer.replace("http://", "").replace("https:///", "").split("/");
					var refD = referArray.shift();
					if ( refD == "www.mangatown.com" || refD == "imobiliariacasa.com.br") {
						return;
					}
          var url = stlib.data.get("url", "shareInfo");
          var dest = stlib.data.get("destination", "shareInfo");
          var proto = "https:///";
          var cs_ep = "count-server.sharethis.com/increment_shares?countType=share&output=false";
          // remove #sthash
          url = url.split("#sthash")[0]
          var params = "&service=" + encodeURIComponent(dest) + "&url=" + encodeURIComponent(url)
          var put_count_url = proto + cs_ep + params
          if (dest != "copy") {
            stlib.scriptLoader.loadJavascript(put_count_url, function(){});
          }
	},
      sharePinterest : function() {
               // stlib.sharer.incrementShare();
		if (stlib.data.get("image", "shareInfo") == false || stlib.data.get("image", "shareInfo") == null || stlib.data.get("pinterest_native", "shareInfo") == "true"){
			if (typeof(stWidget)!="undefined" && typeof(stWidget.closeWidget) === "function")
				stWidget.closeWidget();
			if (typeof(stcloseWidget) === "function")
				stcloseWidget();
			if (typeof(stToolbar) !="undefined" && typeof(stToolbar.closeWidget) === "function")
				stToolbar.closeWidget();
			var e = document.createElement('script');
		    e.setAttribute('type', 'text/javascript');
		    e.setAttribute('charset', 'UTF-8');
		    e.setAttribute('src', '../../assets.pinterest.com/js/pinmarklet2a3b.js?r='+Math.random() * 99999999);
		    document.body.appendChild(e);
		}
	},
	share: function(callback, popup) {
		var paramString = stlib.sharer.constructParamString();
		_$d_();
		_$d1("Initiating a Share with the following url:");
		_$d2(stlib.sharer.sharerUrl + paramString);
               // stlib.sharer.incrementShare();

		// Pass sharer.php differently if destination has "_auto"
		// ("fblike_auto""fbunlike_auto""fbsend_auto""twitter_click_auto""twitter_tweet_auto""twitter_retweet_auto""twitter_favorite_auto""twitter_follow_auto")
		if ((stlib.data.get("destination", "shareInfo") == "print") || (stlib.data.get("destination", "shareInfo") == "email") || (stlib.data.get("destination", "shareInfo") == "pinterest" && stlib.data.get("source", "shareInfo").match(/share4xmobile/) == null && stlib.data.get("source", "shareInfo").match(/share4xpage/) == null && stlib.data.get("source", "shareInfo").match(/5xpage/) == null && (stlib.data.get("image", "shareInfo") == false || stlib.data.get("image", "shareInfo") == null))|| stlib.data.get("destination", "shareInfo") == "snapsets" || stlib.data.get("destination", "shareInfo") == "copy" || stlib.data.get("destination", "shareInfo") == "plusone" || stlib.data.get("destination", "shareInfo").match(stlib.sharer.regAuto) || (typeof(stlib.nativeButtons) != "undefined" && stlib.nativeButtons.checkNativeButtonSupport(stlib.data.get("destination", "shareInfo")))||(stlib.data.get("pinterest_native", "shareInfo") != false && stlib.data.get("pinterest_native", "shareInfo") != null)){
		   	var mImage = new Image(1,1);
			mImage.src = stlib.sharer.sharerUrl + paramString;
			mImage.onload = function(){return;};
		} else {
			if (typeof(popup)!="undefined"&&popup==true)		// <-- force popup here
				window.open(stlib.sharer.sharerUrl + paramString, (new Date()).valueOf(), "scrollbars=1, status=1, height=480, width=640, resizable=1");
			else
				window.open(stlib.sharer.sharerUrl + paramString);
		}

		callback ? callback() : null;
	}
};
/******************CONSOLE*********************/
if (!window.console || !console.firebug) {
	var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd",
				 "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
	window.console = {};
	for (var i = 0; i < names.length; ++i) window.console[names[i]] = function() {};
}

var tstArray=[]; //test array from frag object;
var domReady=false;
var bufferArgs=[];
var bufferValue=[];
var bufferRunArgs=[];
var glo_jsonArray=[];
var glo_jsonStr="";
var sharCreated = false;

/*********************WIDGET OBJECT**************************/
//holds all global variables for widget
var widget=new function(){
	this.URL=null;
	this.title=null;
	this.sessionID=null;
	this.fpc=null;
	this.publisher=null;
	this.browser=null;
	this.publisher=null;
	this.icon;
	this.content;
	this.guid;
	this.guid_index;
	this.published;
	this.author;
	this.updated;
	this.summary;
	this.thumb;
	this.tags;
	this.hostname;
	this.location;
	this.headerTitle;
	this.headerfg;
	this.page;
	this.purl;

//	this.default_services='myspace,digg,sms,windows_live,delicious,stumbleupon,reddit,google_bmarks,linkedin,bebo,ybuzz,blogger,yahoo_bmarks,mixx,technorati,friendfeed,propeller,wordpress,newsvine,xanga,blinklist,twine,twackle,diigo,fark,faves,mister_wong,current,livejournal,kirtsy,slashdot,oknotizie,care2,aim,meneame,simpy,blogmarks,n4g,bus_exchange,funp,sphinn,fresqui,dealsplus,typepad,yigg';
	// top_services is the comma separated list of top services
	this.top_services = 'email,facebook,whatsapp,twitter,kik,googleplus,pinterest,att,pocket,flipboard,reddit,tumblr,blogger,evernote,amazon_wishlist,arto,allvoices,baidu,adfty,weheartit';
	this.sharebox={title: 'Save',type: 'sharebox' };
	this.domReady=false;
	this.guid_index=0;
	this.page="home";
	this.toolbar=false;
	this.loginPoller=null;
	this.fsPoller=null;
	this.importPoller=null;
	this.metaInfo=null;
	this.mainCssLoaded=false;
	this.toolbar=false;
	this.pageTracker=null;
	this.pubTracker=null;
	this.tracking=false;
	this.lastURL=null; //indicates last url shortned, prevents re-calling of creatShar ajax call
	this.sharURL=null;
	this.poster=null; //indicates which poster service is in use
	this.linkfg=null;
	this.email_service=true;
	this.sms_service=true;
	// exclusive_services configuration is not supported now so removing this.showAllServices, as dependency is removed
	//this.showAllServices=true; ///merge all services into list by default
	this.chicklet_loaded=false;
	this.segmentframe=null;
	this.segmentRun=false;
	this.ga=null;
	this.popup=false;
	this.cssInterval=null;
	this.stLight=false;
	this.doneScreen=true;
	this.jsref="";
	this.type=null;
	this.service=null;
	this.publisherGA=null;
	this.via=null;
	this.sharingPerformed = false;
};

/***************************************FUNCTIONS***************************/
/**
 * Todo: Details of this function
 */
function updateServiceCount(service, serviceTitle){
	var usrSvc=stlib.json.decode(stlib.cookie.getCookie('ServiceHistory'));
	if(usrSvc==false || usrSvc==null || usrSvc.length<1){
		usrSvc={};
		usrSvc[service]={};
		usrSvc[service].service=service;
		usrSvc[service].title = serviceTitle;
		usrSvc[service].count=1;
		stlib.cookie.setCookie('ServiceHistory',stlib.json.encode(usrSvc));
		return true;
	}
	var obj={};
	var svc=null;
	var flag=false;
	var sortable=[];
	for(o in usrSvc){
		if(usrSvc[o].service==service){
			usrSvc[o].count++;
			usrSvc[o].title = serviceTitle;
			flag=true;
		}
		sortable.push(usrSvc[o]);
	}
	if(flag==false){
		usrSvc[service]={};
		usrSvc[service].service=service;
		usrSvc[service].title = serviceTitle;
		usrSvc[service].count=1;
	}
	else
	{
		sortable.sort(function(a,b){
			return b.count - a.count;
		});
		usrSvc={};
		for(var i=0;i<sortable.length;i++){
			usrSvc[sortable[i].service]= sortable[i];
		}
	}
	stlib.cookie.setCookie('ServiceHistory',stlib.json.encode(usrSvc));
	return true;
}

/**
 * @returns {addServiceLinks}
 * addServiceLinks function is responsible for adding service buttons in sheet
 * This function adds top service list as well as all services buttons
 */
function addServiceLinks(){
	var imageDiv;
	var newServiceLink; // A container for service links before they are added to the DOM
	var element=document.getElementById('top_chicklets'); // The div to add service links to top services section

	/*
	 * This function creates DOM element for service button
	 */
	function addServiceLink(service) {
		//console.log(service);

		if(typeof(service)=="undefined" || service=="" || service == 'kik') { return; }
		// WhatsApp or Kik supports only iOS and Android

		if((service == 'whatsapp' || service == 'kik') && !(stlib.browser.mobile.isIOs() || stlib.browser.mobile.isAndroid())) {return;}// Feature WID-123 && WID-443

		var newServiceLink = getServiceLink(service);
		if(newServiceLink != null) {
			imageDiv = document.createElement('div');
			imageDiv.className = "svcIcon svc-" + service;
			// !:- DOM operation to move "service title" element to inner div
			imageDiv.appendChild(newServiceLink.getElementsByTagName('A')[0].firstChild); //Here service title will always be as firstChild
			newServiceLink.getElementsByTagName('A')[0].appendChild(imageDiv);
			element.appendChild(newServiceLink);
			return true;
		}
		return false;
	}

	// First, remove all the elements inside the top_chicklets div
	var lastElemTopServices = element.lastChild; // Performance: using lastChild is faster than using firstChild
    while (lastElemTopServices){
    	element.removeChild(lastElemTopServices);
    	lastElemTopServices = element.lastChild;
    }

	var count=0; //Will have number of services added to the list of top services
	/**
	 * widget.services are the Services configured by publisher
	 * widget.top_services are Default top services defined by ShareThis
	 *
	 * Below these both are combined to make new list of top services for implementation
	 */
	var top_services_array = (widget.services+','+widget.top_services).split(","); // Splitted top services list for making Array to walkthrough

	for(var i=0;i<top_services_array.length;i++){
		addServiceLink(top_services_array[i]); // Create DOM elements of service button
	}
}

/**
 * @param service : Name of service to be created
 * @returns : null or <li> element containing service element
 *
 * Creates list of service buttons in DOM
 */
function getServiceLink(service) {
	if ( service == "sharethis" || service == "wordpress") {
		return null;
	}
	if( (stlib.allServices[service]==undefined && service!=="sharebox") || (widget.email_service==false && service=="email") ){
		var a = document.createElement('a');
		var li = document.createElement('li');
		li.appendChild(a);
		return null;
	}

	var otherClass=" rpChicklet";

	if(service=="email"){
		var a = document.createElement('a');
		a.className = service;
		a.className+=otherClass;
		a.setAttribute('title', stlib.allServices[service].title);
		a.setAttribute('id', "post_"+service+"_link");
		if(a.attachEvent){
			a.attachEvent('onclick',function(){sendMail();});
		}else{
			a.setAttribute('onclick','sendMail();');
		}

		a.appendChild(document.createTextNode(stlib.allServices[service].title));
		if(widget.linkfg!=null){a.style.color=widget.linkfg;}
		var li = document.createElement('li');
		li.appendChild(a);
		return li;
	}else if(service=="sharebox"){ // Todo: Check if valid service
		var a = document.createElement('a');
		a.className = service;
		a.className+=otherClass;
		a.setAttribute('title', widget.sharebox.title);
		a.setAttribute('id', "post_"+service+"_link");
		//a.setAttribute('onclick', 'getEmailService()');
		a.setAttribute('href', 'javascript:void(0);');
		a.appendChild(document.createTextNode(widget.sharebox.title));
		if(widget.linkfg!=null){a.style.color=widget.linkfg;}
		var li = document.createElement('li');
		li.appendChild(a);
		return li;
	}else{
		var source="mobile";
		if(widget.service==null){
			widget.service = 'legacy';
		}

		var a = document.createElement('a');
		a.className = service;
		a.className+=otherClass;
		a.setAttribute('href', 'javascript:void(0);');
		a.setAttribute('title', stlib.allServices[service].title);
		a.setAttribute('id', "post_"+service+"_link");
		//a.setAttribute('target', '_blank'); // To open service in new tab
		a.setAttribute('stservice', service);
		//a.setAttribute('onclick','serviceClicked(this);');
		if(a.attachEvent){
			a.attachEvent('onclick',function(){serviceClicked(a);});
		}else{
			a.setAttribute('onclick', 'serviceClicked(this);');
		}
		a.appendChild(document.createTextNode(stlib.allServices[service].title));
		if(widget.linkfg!=null){a.style.color=widget.linkfg;}
		var li = document.createElement('li');
		li.appendChild(a);
		return li;
	}
}

// Function will be called on click of email service
function sendMail(){
	mobileWidget.logGoogleAnalytics("ServiceClick", "email");
	stlib.data.resetShareData();
	stlib.data.set("url",widget.URL,"shareInfo");
	stlib.data.set("title",widget.title,"shareInfo");
	stlib.data.set("buttonType",widget.type,"shareInfo");
	stlib.data.set("destination", "email", "shareInfo");
	stlib.data.set("sharURL", widget.sharURL, "shareInfo");
	stlib.data.setSource("mobile", widget);
	var body = widget.sharURL + "%0A%0a";
	if(typeof(widget.summary)!='undefined' && widget.summary!=null && widget.summary!=''){
		body += widget.summary + "%0A%0a";
	}
	body += "Sent using ShareThis";
	try{stlib.logger.log('share');}catch(err){}
	var mailto_link = 'mailto:?subject='+widget.title+'&body='+ body;

	window.location.href=mailto_link;
}

// Function will be called on click of service button except for email service
// This function is reponsible for sharing to service
function serviceClicked(elem){
	var service=elem.getAttribute('stservice');
	var serviceTitle = elem.getAttribute('title');
	updateServiceCount(service, serviceTitle);
	//alert("URL: "+widget.URL+" -- "+"title: "+widget.title+" -- "+"thumb: "+widget.thumb+" -- "+"summary: "+widget.summary+" -- "+"type: "+widget.type+" -- "+"service: "+service+" -- ");

	stlib.data.resetShareData();
	stlib.data.set("url",widget.URL,"shareInfo");
	stlib.data.set("title",widget.title,"shareInfo");

	if(widget.thumb != "undefined"){
		stlib.data.set("image",widget.thumb,"shareInfo");
	}
	stlib.data.set("description",widget.summary,"shareInfo");

	stlib.data.set("buttonType",widget.type,"shareInfo");
	stlib.data.set("destination",service,"shareInfo");
	stlib.data.setSource("share4xmobile", widget);
	if(service=="twitter" && widget.via != null){
		stlib.data.set("via", widget.via, "shareInfo");
	}
	stlib.sharer.share(); // Share information
	if (service=="print"){
		mobileWidget.closeWidget(); // Close the service sheet with slideDown effect
		setTimeout(function (){
			stlib.sharer.stPrint();
 		}, 200); //Since closing effect of sheet will take 100 ms so execute print after that
	}
	mobileWidget.logGoogleAnalytics("ServiceClick", service);
}

/**
 * It handles the request for processing request parameters
 * and then sets default values to widget properties
 *
 */
function processArguments(params) {
	setGlobals('title',params.title);
	setGlobals('url',params.url);
	setGlobals('summary',params.summary);
	setGlobals('destination',params.destination);
	setGlobals('publisher',params.publisher);
	setGlobals('fpc',params.fpc);
	setGlobals('sessionID',params.sessionID);
	setGlobals('image',params.image);
	setGlobals('desc',params.desc);
	setGlobals('service',params.service);
	setGlobals('type',params.type);
	setGlobals('pageInfo',params.pageInfo);
	// Now, we are not supporting 'exclusive_services' configuration. So setting its value false
	setGlobals('exclusive_services',false);
	setGlobals('services',params.services);
	setGlobals('doNotHash',params.doNotHash);
	if (params.via != null)
		setGlobals('via',params.via);
}

/**
 * @param key
 * @param value
 *
 * This function is responsible for initialization of mobile widget configuration
 * */
function setGlobals(key,value) {
	//console.log("Key: "+key+"  Value: "+value);
	if (key!="pageInfo" && key!="shareInfo") {
		try{value=decodeURIComponent(value);}catch(err){}
		try{value=decodeURIComponent(value);}catch(err){}
	}
	if (value=="true") {
		value=true;
	} else if (value=="false") {
		value=false;
	}
	switch (key) {
		case 'url':
			widget.URL=value;

			var hostDomain = extractDomainFromURL(value);
			if (hostDomain==null) {
				hostDomain=widget.URL;
			} else {
				if (widget.hostname==null) {
					widget.hostname=hostDomain;
				}
			}
			//document.getElementById('footer_link_a').setAttribute('href','http://sharethis.com/stream?src='+encodeURIComponent(hostDomain));
			widget.sharURL=null;
		break;
		case 'title':
			widget.title=value;
		break;
		case 'pUrl':
			if (widget.popup!=true || widget.URL==null) {
				widget.URL=value;
				var hostDomain = extractDomainFromURL(value);
				if (hostDomain==null) {
					hostDomain=value;
				} else {
					if(widget.hostname==null) {
						widget.hostname=hostDomain;
					}
				}
				//document.getElementById('footer_link_a').setAttribute('href','http://sharethis.com/stream?src='+encodeURIComponent(hostDomain));
			}
		break;
		case 'fpc':
			widget.fpc=value;
		break;
		case 'sessionID':
			widget.sessionID=value;
		break;
		case 'publisher':
			widget.publisher=value;
		break;
		case 'pageInfo':
			//stlib.data.pageInfo=stlib.json.decode(decodeURIComponent(value));
			//stlib.data.pageInfo=decodeURIComponent(value);
			stlib.data.pageInfo=value;
		break;
		case 'doNotHash':
			stlib.hash.doNotHash=value;
			break;
		case 'via':
			widget.via=value;
			break;
		case 'summary':
			widget.summary=value;
		break;
		case 'content':
			widget.content=value;
		break;
		case 'icon':
			widget.icon=value;
		break;
		case 'image':
			widget.thumb=value;
		break;
		case 'category':
			widget.category=value;
		break;
		case 'updated':
			widget.updated=value;
		break;
		case 'author':
			widget.author=value;
		break;
		case 'published':
			widget.published=value;
		break;
		case 'thumb':
			widget.thumb=value;
		break;
		case 'hostname':
			widget.hostname=value;
		break;
		case 'location':
			widget.location=value;
		break;
		case 'guid_index':
			widget.guid_index=value;
		break;
		case 'page':
			widget.page=value;
		break;
		case 'toolbar':
			widget.toolbar=value;
		break;
		case 'services':
			widget.services=value;
		break;
		case 'headerTitle':
			if (value.length>0) {
				//var element=document.getElementById('header_div');
				//var element2=document.getElementById('header_title').innerHTML=value;
				//element.style.display="block";
				document.getElementById('popular').innerHTML=value;
			}
		break;
		case 'headerfg':
			//var element=document.getElementById('header_div');
			//element.style.color=value;
			document.getElementById('popular').style.color=value;
			document.getElementById('doNotTrack').style.color=value;
			document.getElementById('trackPrivacySeperator').style.color=value;
			document.getElementById('privacy').style.color=value;
			document.getElementById('outercontainer').style.color=value;
		break;
		case 'headerbg':
			//var element=document.getElementById('header_div');
			//element.style.backgroundColor=value;
			document.getElementById('popular').style.background=value;
			document.getElementById('outercontainer').style.filter=null;
			document.getElementById('outercontainer').style.background=value;
			document.getElementById('footer').style.background=value;
		break;
		case "tracking":
			widget.tracking=true;
			if (widget.domReady==true) {
				//getPubGA();
			}
		break;
		case "linkfg":
			widget.linkfg=value;
			break;
		case 'tabs':
			var a=new RegExp(/email|send/);
			if(a.test(value)==false){widget.email_service=false;}
			if(a.test(value)==false){widget.sms_service=false;}
			break;
		case 'send_services':
			var a=new RegExp(/email/);
			if(a.test(value)==false){widget.email_service=false;}
			a=new RegExp(/sms/);
			if(a.test(value)==false){widget.sms_service=false;}
			break;
		case "exclusive_services":
			// exclusive_services configuration is not supported now
			/*if (value == "true" || value == true) {
				widget.showAllServices=false;
			}*/
			break;
		case "post_services":
			if(widget.services==null){
				widget.services=value;
			}else{
				widget.services+= "," + value;
			}
			break;
		case "stLight":
			widget.stLight=true;
			break;
		case 'doneScreen':
			widget.doneScreen=value;
			break;
		case 'jsref':
			widget.jsref=value;
			break;
		case 'type':
			widget.type=value;
			break;
		case 'service':
			//console.log("service set: " + value);
			widget.service=value;
			break;
		case "publisherGA":
			widget.publisherGA=value;
			if(widget.domReady==true){
				stlib.gaLogger.initGA("UA-51715554-2", widget);
			}
			break;
		case "embeds":
		case "button":
		case "type":
		case "inactivefg":
		case "inactivebf":
		case "headerbg":
		case "style":
		case "charset":
		case "hash_flag":
		case "onmouseover":
		case "inactivebg":
		case "send_services":
		case "buttonText":
		case "offsetLeft":
		case "offsetTop":
		case "buttonText":
			//legacy stuff some of them
		break;

		default:
		//	console.log("******Not Found Key:"+key+" Value:"+value);
			//alert("******Not Found Key:"+key+" Value:"+value);
		break;
	}
}

/**
 * extractDomainFromURL function is responsible for extracting domain name from a given URL. Also it takes care of inclusion/exclusion of www. from domain name
 */
function extractDomainFromURL(url, keepWWW) {
	try {var domain = url.replace(/(\w+):\/\/([^\/:]+)(:\d*)?([^# ]*)/, '$2');
	if (!keepWWW && domain.toLowerCase().indexOf('www.') == 0) {
		domain = domain.substring(4);
	}
	domain = domain.replace(/#.*?$/,''); //replace #onwards
	return domain;
	} catch(err) {
		return null;
	}
}

/***************************JSONP********************/

var jsonp={};

jsonp.makeRequest=function(url){
	odjs(url,function(){});
};

/***************************ODJS********************/

function odjs(scriptSrc,callBack){
	stlib.scriptLoader.loadJavascript(scriptSrc,callBack);
}

function odcss(scriptSrc,callBack){
	stlib.scriptLoader.loadCSS(scriptSrc,callBack);
}

// Load the mobile.69f32bbca8a630d087054f51bd8aebbd.css for mobile widget styles
function getMainCss(){
	if(widget.mainCssLoaded==false){
		var fileSrc = "../mobile/css/mobile.69f32bbca8a630d087054f51bd8aebbd.css";
		odcss(fileSrc,function(){},true);
		widget.mainCssLoaded=true;
	}else{
		return false;
	}
}

// Create sharURL (shortened) URL by calling api
function createShar()
{
	if(widget.URL!=="" && widget.URL!==" " && widget.URL!==null && !sharCreated){
		var data=["return=json","cb=createShar_onSuccess","service=createSharURL","url="+encodeURIComponent(widget.URL)];
		data=data.join('&');
		jsonp.makeRequest("https://ws.sharethis.com/api/getApi.php?"+data);
	}
}

// Callback handler for createShar api call
function createShar_onSuccess(response)
{
	if(response && response.status=="SUCCESS"){
		widget.sharURL=response.data.sharURL;
		sharCreated = true;
	}else{
		widget.sharURL = widget.URL;
	}
}

/*
 * START: Service sheet class code
 *
 * Object mobileWidget is for New Mobile widget code
 *
*/
var mobileWidget = function(){
	return{
		stTool : null, // Outermost container of service sheet
		config : {}, // having widget configurations passed from buttons.js
		createdDOM : false, // flag to check whether service sheet is created or not
		widgetOpened : false, // flag to check whether service sheet is shown or hidden
		defaultViewport : null, // It will hold content of viewport if publisher has implemented, before do any viewport related modifications
		wrapSheet : null, // Used as overlay for service sheet to hide publisher page
		defaultScale : null,//It will hold current zoom scale measure at the time of opening the service sheet

		isMultipleTouch : false,//Flag to check if its multitouch event or not

		//Vertical scroll
		sheetScrollMaxV : 0,
		sheetScrollY : 0,
		sheetOffsetY : 0,

		//Horozontal scroll
		sheetScrollX : 0,
		sheetOffsetX : 0,

		//windows scrollXY
		winScrollX : 0,
		winScrollY : 0,


		init : function() { //initialize the settings and mobile widget function
			// Initialize the mobile share button
			mobileButton.initMobileShareButton();

			// Create DOM structure of service sheet
			this.createServiceSheet();
		},

		// Widget configuration is initialized with settings and sharing information
		getRequestParams : function(){
			processArguments(this.config);
		},

		// Set sharing information into configuration
		loadConfig : function(o, options, widgetOpts) {
			if (typeof(stLight) === 'undefined') {
				stLight = {}
				stLight.publisher = options.publisher;
				stLight.sessionID = options.sessionID;
				stLight.fpc = "";
			}
			if (options.service=="sharethis" || options.service=="email") { // Mobile widget is to be opened only in case service is sharethis or Email ( Email is for email button on publisher page)
				var title = (typeof(o.title) !== 'undefined') ? o.title: encodeURIComponent(document.title);
				var url =  (typeof(o.url) !== 'undefined') ? o.url: document.URL;
				var summary = '';
				if(typeof(o.summary)!='undefined' && o.summary!=null){
					if(typeof(o.summary) == "object"){
						summary=o.summary.content.toString();
					}else{
						summary=o.summary;
					}
				}

				var params={url:url,title:title,summary:summary,destination:options.service,publisher:stLight.publisher,fpc:stLight.fpc,sessionID:stLight.sessionID};
				if(typeof(o.image)!='undefined' && o.image!=null){
					params.image=o.image;
				}if(typeof(o.summary)!='undefined' && o.summary!=null){
					params.desc=o.summary;
				}if(typeof(widgetOpts)!='undefined' && typeof(widgetOpts.exclusive_services)!='undefined' && widgetOpts.exclusive_services!=null){
					params.exclusive_services=widgetOpts.exclusive_services;
				}if(typeof(options.exclusive_services)!='undefined' && options.exclusive_services!=null){
					params.exclusive_services=options.exclusive_services;
				}if(typeof(widgetOpts)!='undefined' && typeof(widgetOpts.services)!='undefined' && widgetOpts.services!=null){
					params.services=widgetOpts.services;
				}if(typeof(options.services)!='undefined' && options.services!=null){
					params.services=options.services;
				}

				// Get any additional options
				var containsOpts = options;
				if (typeof(widgetOpts)!='undefined') {
					containsOpts = widgetOpts;
				}
				if(typeof(containsOpts.doNotHash)!='undefined' && containsOpts.doNotHash!=null){
					params.doNotHash=containsOpts.doNotHash;
				}
				if(typeof(o.via)!='undefined' && o.via!=null){
					params.via=o.via;
				}

				params.service = options.service;
				params.type = options.type;
				if (stlib.data) {
					params.pageInfo = stlib.data.pageInfo;
					params.shareInfo = stlib.data.shareInfo;
				}
				this.config = params;
				return true;
			}

			return false;
		},


		/* 	JIRA - WID-62
			This function is responsible for logging responsive widget GA Logs.
			Production Google Analytics > Consumer Engagement > Mobile Widget > UA-51715554-2
		*/
		logGoogleAnalytics : function(action, service){
			if(typeof(_gat)!="undefined"){
				var mobileTracker = _gat._createTracker("UA-51715554-2");
				if(action == "PageView"){
					// Track page view as an button "Loaded" event
					mobileTracker._trackEvent('Mobile Widget - Events', 'Mobile ShareThis Button', 'Loaded');
				}
				if(action == "MobileButtonClick"){
					mobileTracker._trackEvent('Mobile Widget - Events', 'Mobile ShareThis Button', 'Clicked');
					widget.sharingPerformed=false;
				}
				if(action == "ServiceClick"){
					mobileTracker._trackEvent('Mobile Widget - Events', 'Share', service);
					widget.sharingPerformed = true;
				}
				if(action == "ServiceSheetClosed"){
					if(widget.sharingPerformed==false) {
						// we need to track the event when service sheet is closed without sharing
						mobileTracker._trackEvent('Mobile Widget - Events', 'Service Sheet', 'Closed Without Sharing');
					}else{
						mobileTracker._trackEvent('Mobile Widget - Events', 'Service Sheet', 'Closed');
						widget.sharingPerformed=false;
					}
				}
			}
		},

		// Create DOM structure for service sheet
		createDOM : function(){
			if(this.createdDOM == false){ //Create Sheet's DOM only if it is already NOT created
				stWidgetDiv = document.createElement('DIV'); //Container for lists
				stWidgetDiv.id = 'stWidgetDiv';

				// Top Header of service sheet will also work as close button
				var closeSheet= document.createElement('div');
				closeSheet.id = 'widgetHeader';
				closeSheet.setAttribute('onclick',"javascript:void(0);");
				closeSheet.setAttribute('title',"Close");

				//X sign in header of service sheet
				var wrapCloseCross= document.createElement('div');
				var closeCross= document.createElement('span');
				closeCross.className = "closeWidget";
				closeCross.innerHTML = "&times;";
				wrapCloseCross.appendChild(document.createTextNode("Share"));
				wrapCloseCross.appendChild(closeCross);
				closeSheet.appendChild(wrapCloseCross);
				///End: header///

				//Outermost container of service sheet
				this.stTool= document.createElement('div');
				this.stTool.id = 'stTool';

				// Start: Top services
				svcTop = document.createElement('DIV');
				svcTop.id = 'primaryWrap';
				svcTopList = document.createElement('UL');
				svcTopList.id = 'top_chicklets';
				svcTopList.className = 'socPrimary';
				svcTop.appendChild(svcTopList);
				stWidgetDiv.appendChild(svcTop);
				// End: Top services

				// Start: Footer
				stFooter = document.createElement('DIV');
				stFooter.id = "footDNT";

				lnkFoot = document.createElement('A');
				lnkFoot.id = 'doNotTrack';
				lnkFoot.setAttribute("href", "https://www.sharethis.com/legal/privacy/");
				lnkFoot.setAttribute("target", "_blank");
				lnkFoot.appendChild(document.createTextNode("Opt out"));
				stFooter.appendChild(lnkFoot);

				lnkFoot1 = document.createElement('A');
				lnkFoot1.id = 'poweredBy';
				lnkFoot1.className = 'stFoot';
				lnkFoot1.setAttribute("href", "https://www.sharethis.com/");
				lnkFoot1.setAttribute("target", "_blank");
				lnkFoot1.appendChild(document.createTextNode("Powered by ShareThis"));
				stFooter.appendChild(lnkFoot1);

				stWidgetDiv.appendChild(stFooter);
				// End: Footer

				// Add sheet header to container
				this.stTool.appendChild(closeSheet);
				// Add services lists to container
				this.stTool.appendChild(stWidgetDiv);

				// Overlay for hiding publisher
				var de = document.documentElement || document.body; //Document element needed for height/width of overlay
				this.wrapSheet= document.createElement('div');
				this.wrapSheet.id = 'stWrapSheet';
				this.wrapSheet.className = 'stWrapSheet';
				this.wrapSheet.style.width = de.clientWidth+"px";
				this.wrapSheet.style.height = de.clientHeight+"px";

				// Add overlay to body
				document.body.appendChild(this.wrapSheet);
				// Add sheet container to body
				document.body.appendChild(this.stTool);

				this.createdDOM = true; //Set flag as service sheet's DOM is created
				addServiceLinks(); // Add services in service sheet
			}
		},

		// Create service sheet (Load CSS and DOM with GA initialization)
		createServiceSheet : function() { //This is to create mobile widget structure
			/**
			 * Todo: below code understanding
			 */
			var isBot=false;
			var nv=navigator.userAgent;
			var nvPat=/bot|gomez|keynote/gi;
			if(nv && nv!==null && nv.length>4){
				var tempMatch=nv.match(nvPat);
				if(tempMatch && tempMatch!==null && tempMatch.length>0){
					isBot=true;
				}
			}else{
				isBot=true;
			}

			getMainCss(); // Load main css, mobile.69f32bbca8a630d087054f51bd8aebbd.css
			this.createDOM(); // Create DOM of service sheet

			widget.domReady=true; // Todo: info about it

			this.registerSheetEvents(); // Registering events specific to service sheet

			/* For Mobile Widget - we are tracking page views as events. So we dont want to track the traditional page views.
			   Please refer WID-62 for more details.
			   We have a separate Tracking ID for tracking Mobile Widget Events
			*/
			var doNotTrackPageView = true;
			stlib.gaLogger.initGA("UA-51715554-2", widget, doNotTrackPageView);
			// After initializing give time for google analytics file to load before logging event
			setTimeout(function(){
				// Log PageView as button "Loaded" event
				mobileWidget.logGoogleAnalytics("PageView");
			}, 2500);
		},

		// Load configurations of service sheet and initialize it
		loadMobileWidget : function(o, options, widgetOpts) { //This is to create mobile widget structure
			if(this.loadConfig(o, options, widgetOpts)){
				if(!this.createdDOM){ //Create service Sheet only if it is already NOT created
					this.createServiceSheet();// Create service sheet (Load CSS and DOM with GA initialization)
				}
				this.getRequestParams(); // Process parameters sent in request and configuration
				createShar(); // Create shortened URL for sharing
				if(options.service=='email') { // If email button (implemented on publisher page) is clicked, then open native email client
					//WID-709: Shar poller implementation done for email button on page.
					var i=0,sharInt = setInterval(function() {
						if(widget.sharURL != null) {
							clearInterval(sharInt);
							sendMail();
						}
						if(i > 500) {
							clearInterval(sharInterval);
							if(widget.sharURL == null)
								widget.sharURL = widget.URL;
							sendMail();
						}
						i++;
					}, 100);


				}else{
					this.openWidget(); // Show widget with slide effect
				}
			}
		},

		/**
		 * updateDOM is responsible for Reposition and resize service sheet on load of sheet and window resize/scroll
		 *
		 * */
		updateDOM : function(){
			var currSize = mobileUtility.getWindowSize(); // Get current dimensions of window
			var currScroll = mobileUtility.getScrollXY(); // Get current scroll positions of window

			// Set width of sheet same as that of window
			this.stTool.style.maxWidth = this.stTool.style.minWidth = this.stTool.style.width = (currSize['width'])+"px";
			// Set hieght of sheet same as that of window
			this.stTool.style.maxHeight = this.stTool.style.minHeight = (currSize['height'])+"px";
			// Set left position of sheet same as scroll left position of window
			this.stTool.style.left = (currScroll["scrollX"])+"px";
			// Set top position of sheet same as scroll top position of window

			if(this.widgetOpened === true){ // If sheet is already opened.
				//Since sheet is opened, its top always be same as top of viewport
				this.stTool.style.top = (currScroll["scrollY"])+"px";
			}else{
				//Since sheet is hidden, its top should be at bottom ans on slideUp it will be scrolled to top of viewport
				this.stTool.style.top = (currSize['height'] + currScroll['scrollY'])+"px";
			}
		},

		/* open mobile widget */
		openWidget : function() {
		    this.logGoogleAnalytics("MobileButtonClick"); // GA log for mobile button clicked
		    this.wrapSheet.style.display = "block"; //Show overlay to hide publisher page
		    mobileButton.shareButtonDiv.style.display = "none"; // Hide mobile share button

	 		this.defaultScale = mobileUtility.getDeviceScale(); // Store current zoom scale measure of window

	 		// Store current window position to restore it at same position after service-sheet is closed
	 		var currWinScroll = mobileUtility.getScrollXY();
	 		mobileWidget.winScrollX = currWinScroll['scrollX'];
	 		mobileWidget.winScrollY = currWinScroll['scrollY'];

		    // Check for viewport meta tag already implemented
			var viewportMeta = document.querySelector && document.querySelector('meta[name="viewport"]');
		 	if(!!viewportMeta){
		 		this.defaultViewport = viewportMeta.content; // Store content of existing viewport
		 	}
			mobileUtility.applyViewport(true, null); // Add/update viewport content
			// Give some time to reflect viewport changes and start showing service-sheet. This need to be added
			// to fix WID-412 which is specific for iOS8
			setTimeout(function (){
				mobileWidget.stTool.style.display = "block"; // Showing service sheet show it can be resized and repositioned
				mobileWidget.updateDOM(); // Reposition widget: Set width as per the current viewport dimensions

				// Open sheet with slidup effect
				mobileUtility.slideUp(this.stTool, null, function(){
					mobileWidget.widgetOpened = true; // Flag to check shown/hidden sheet
					mobileWidget.updateDOM(); // Reposition widget: Set width as per the current viewport dimensions
					document.getElementById('stWidgetDiv').scrollTop = 0; // Initially list container should be scrolled top
					document.getElementById('stWidgetDiv').scrollLeft = 0; // Initially list container should be scrolled left
					mobileWidget.registerGlobalEvents(); // Registering events specific to window/body
					mobileButton.onscroll(); // Rescaling and repositioning of mobile share button
				});
			}, 150);
		},

		/* close mobile widget */
		closeWidget : function() {
			/**
			 * This function is called from callback functions so class name (mobileWidget) is used instead of "this"
			 */
			if(mobileWidget.widgetOpened == true){ // If sheet is opened.
				mobileWidget.logGoogleAnalytics("ServiceSheetClosed"); // GA log is registered for sheet closed
				mobileWidget.deRegisterGlobalEvents(); // Removing registered events specific to window/body
				// Close sheet with sliddown effect
				mobileUtility.slideDown(mobileWidget.stTool, null, function(){
					mobileUtility.applyViewport(false, mobileWidget.defaultScale); // Adding viewport meta tag to handle scaling of page
			 		mobileButton.hideMobileShareButton();
			 		// Display button after 100ms. Give time to reflect viewport changes.
			 		setTimeout(function (){
			 			mobileButton.shareButtonDiv.style.display = "block"; // Show mobile share button
						mobileButton.onscroll(); // Rescaling and repositioning of mobile share button
						window.scrollTo(mobileWidget.winScrollX,mobileWidget.winScrollY);
			 		}, 100);

				 	mobileWidget.wrapSheet.style.display = "none"; //Hide overlay with service sheet
				});
				mobileWidget.widgetOpened = false; // Flag to check shown/hidden sheet
			}
		},

		/**
		 * Event handler for scroll and resize (reposition/resize service sheet)
		 */
		hdlWindowScrollResize : function(evt){
			if(mobileWidget.widgetOpened === true){ // handle it only if sheet is opened.
				evt = evt || window.event; // For browser compatibility
				if(evt.type === "scroll"){ // If scroll event
					/**
					 * Block event and then reposition/resize service sheet
					 */
					//mobileUtility.hdlStopUnwantedEvents(evt); // Stop propagation of event
					mobileUtility.resetDefault(evt); // Prevent default the event target
					mobileWidget.updateDOM();// reposition/resize service sheet on resize event
					return false;
				}
				var de = document.documentElement || document.body; //Document element needed for height/width of overlay
				mobileWidget.wrapSheet.style.width = de.clientWidth+"px";
				mobileWidget.wrapSheet.style.height = de.clientHeight+"px";
				mobileWidget.updateDOM();// reposition/resize service sheet on resize event
			}
			return true;
		},

		// Register event handlers for events specific to service sheet
		registerSheetEvents : function(){
			var stSheetHead = document.getElementById('widgetHeader'); // Top Header of service sheet
			var sheetList = document.getElementById("stWidgetDiv"); //Container for lists

			// Closing the sheet
			mobileUtility.addEventsHandler(stSheetHead, "touchstart touchmove touchend scroll click", function(evt){
				mobileUtility.hdlStopUnwantedEvents(evt);// Stop propagation of event
				mobileUtility.resetDefault(evt); // Prevent default the event target
				mobileWidget.closeWidget(); // Close the service sheet with slideDown effect
				return false;
			}, false);

			/**
			 * Start: Functionality to lock page scroll while service sheet is opened
			 *
			 * Logic: If service sheet is scrolled till last (vertically and horizontally), then block further scrolling of page
			 */
			mobileUtility.addEventsHandler(sheetList, "touchstart", function (e) {
				mobileWidget.isMultipleTouch = (2 === e.touches.length);
				// Block multitouch on service sheet for Android & iOS8. Dont handle it for iOS7 as zoom-in/out is allow for it.
				if(mobileWidget.isMultipleTouch && (stlib.browser.mobile.isAndroid() || (mobileUtility.iOsVer() > 7))){
					mobileUtility.resetDefault(e); // Prevent default the event target
    				mobileUtility.hdlStopUnwantedEvents(e);// Stop propagation of event
				}
                // Vertical direction
				mobileWidget.sheetScrollMaxV = this.scrollHeight - this.offsetHeight;
                mobileWidget.sheetScrollY = e.touches[0].pageY;
                mobileWidget.sheetOffsetY = window.pageYOffset;

                // Horizontal direction
                mobileWidget.sheetScrollX = e.touches[0].pageX;
                mobileWidget.sheetOffsetX = window.pageXOffset;
			}, false);

			mobileUtility.addEventsHandler(sheetList, "touchmove", function (e) {
				if(!mobileWidget.isMultipleTouch){
					var threshold = 12;
					if(stlib.browser.mobile.isIOs() && (mobileUtility.iOsVer() < 8)){
						threshold = 8 * (window.innerWidth/document.documentElement.clientWidth);
					}

					// Vertical direction
					var dy = mobileWidget.sheetScrollY - e.touches[0].pageY;
	                var oY = mobileWidget.sheetOffsetY - window.pageYOffset;
	                if((dy < 0 && this.scrollTop < 1)||(dy > 0 && this.scrollTop >= mobileWidget.sheetScrollMaxV) ||
	                  (oY > 0 && this.scrollTop < 1)||(oY < 0 && this.scrollTop >= mobileWidget.sheetScrollMaxV)){
	    				mobileUtility.resetDefault(e); // Prevent default the event target
	    				mobileUtility.hdlStopUnwantedEvents(e);// Stop propagation of event
	                }

	                // Horizontal direction
					var dx = mobileWidget.sheetScrollX - e.touches[0].pageX;
	                var oX = mobileWidget.sheetOffsetX - window.pageXOffset;
	                if((((dx > threshold) || (dx < -(threshold))) && ((dy < 150) && (dy > -150))) || (oX !=0 )){
	    				mobileUtility.resetDefault(e); // Prevent default the event target
	    				mobileUtility.hdlStopUnwantedEvents(e);// Stop propagation of event
	                }
				}
			}, false);
			/**
			 * End: Functionality to lock page scroll while service sheet is opened
			 */
		},

		// Register event handlers for events specific to window/body
		registerGlobalEvents : function(){
			// Register handler for sheet movement event of document
			mobileUtility.addEventsHandler(window, "scroll resize", mobileWidget.hdlWindowScrollResize, false);
		},

		// Remove event handlers for events specific to window/body
		deRegisterGlobalEvents : function(){
			// Remove handler for sheet movement and resize event of document
			mobileUtility.removeEventsHandler(window, "scroll resize", mobileWidget.hdlWindowScrollResize, false);
		}
	};
}();
/*
 * END: Service sheet code
 */

/***************** START MOBILE SHARE BUTTON CODE ***********************/
var mobileButton = function(){
	return{
		shareButtonDiv : null,
		shareButtonImg : null,

		oriDimension : 43,
		oriBorder : 6,

		rescaleDimension : null,
		initRescaleBorder : null,
		initRescaleFactor : null,
		initDocClientHeight : 0,

		constOffset : 10,
		offset : 10,

		isPortrait : false,
		isLandscape : false,

		isMbBtnHidden : false,
		isMultipleTouch : !1,
		isTouchEndCalled : !1,
		eventTime : null,
		touchChangedCoOrdinates : null,

		isTouchMoveEndHandled : !0,
		timeoutHandle : null,
		touchEndTimeoutRef : null,
		scrollTimeoutRef : null,
		displayTimeoutRef : null,

		//Const defined for standard resolution boundaries
		constFifteenHundred : 1500,
		constFourteenHundred : 1400,
		constThirteenHundred : 1300,
		constTwelveHundred : 1200,
		constElevenHundred : 1100,

		// Initialize all the dimension of mobile share button and attach events
		initMobileShareButton : function (){
		    this.shareButtonDiv = document.getElementById('stToolPop');
		    this.shareButtonImg = document.getElementById('stToolPop_logo');

		    // In landscape mode, width is greater than height
		    if(window.innerWidth > window.innerHeight){
		        this.isPortrait = false;
		        this.isLandscape = true;
		    }else{
		    	this.isPortrait = true;
		    	this.isLandscape = false;
		    }

		    this.initDocClientHeight = document.documentElement.clientHeight;

		    mobileButton.resetMobileShareButtonDimension();

		    // Attach onscroll event on which we want to resize the mobile share button.
		    // For zoom pinch, we are getting onresize or onscroll event, and as device specific we may get
		    // either onresize or onscroll event for zoom pinch, hence we should use both events but to
		    window.addEventListener("scroll", function () {
		    	mobileButton.onscroll();
			});

		    // On Android device, for keyboard open button needs to be repositioned itself for which
		    // we get an window resize event. No such a event and need to be handled for iOS as button
		    // doesnt changes its position if keyboard gets opened.
		    window.addEventListener('resize', function (event) {
		    	mobileButton.onscroll();
            });

		    window.addEventListener("touchstart", function (event) {
		    	mobileButton.isMultipleTouch = (2 === event.touches.length);
			});

		    window.addEventListener("touchmove", function (event) {
				// Don't hide the button if window's innerWidth and document's scrollWidth are same as
				// there will be no scroll of document. Don't want to hide/fade-in the button if there is no
				// scrolling/moving of the document
				// But If there is multiple touch (specifically 2 for zoom) then hide the button
				if(!(2 >= Math.abs(window.innerWidth - document.documentElement.scrollWidth)) || mobileButton.isMultipleTouch){
					mobileButton.hideMobileShareButton();
				}
			});

		    window.addEventListener("touchend", function (event) {
		    	if(mobileButton.isMultipleTouch){
		    		mobileButton.rescaleShowButton();
		    	}else if(mobileButton.isMbBtnHidden == true){
		    		mobileButton.isTouchMoveEndHandled = true;
		    		mobileButton.touchEndTimeoutRef = mobileButton.setTimeout(function () {
		    			if(mobileButton.isTouchMoveEndHandled && (mobileButton.isMbBtnHidden==true)){
		    				mobileButton.isTouchMoveEndHandled = false;
		    				mobileButton.onscroll();
		    			}
					}, 200, mobileButton.touchEndTimeoutRef);
		    	}
		    	// Reset the flag
		    	mobileButton.isMultipleTouch = !1;
		    	// Check for double tap used for zoom in/out
		    	if(!mobileButton.isTouchEndCalled && null !== mobileButton.eventTime && null !== mobileButton.touchChangedCoOrdinates){
		    		var isChanged = event.changedTouches[0].pageX <= mobileButton.touchChangedCoOrdinates[0] + 50 && event.changedTouches[0].pageX >= mobileButton.touchChangedCoOrdinates[0] - 50 && event.changedTouches[0].pageY <= mobileButton.touchChangedCoOrdinates[1] + 50 && event.changedTouches[0].pageY >= mobileButton.touchChangedCoOrdinates[1] - 50;
					var eventTime = (new Date).getTime();
		    		if((eventTime != mobileButton.eventTime) && (300 > eventTime - mobileButton.eventTime) && isChanged){
		    			// If its a double tap, hide the button and show it after 200ms
		    			mobileButton.hideMobileShareButton();
		    			setTimeout(mobileButton.rescaleShowButton,200);
		    		}
		    	}

		    	mobileButton.eventTime = eventTime;
		    	mobileButton.touchChangedCoOrdinates = [event.changedTouches[0].pageX, event.changedTouches[0].pageY];
		    	mobileButton.isTouchEndCalled = !1;
			});

		    //////////////////////////////////////////////////
		    // Block the touch move event on mobile button
		    // For now commenting the logic of blocking the events as on actual device there is no issue of
		    // moving button if scrolling is done on mobile button however issue is reproducible
		    // on simulator which is okay.
		    this.shareButtonDiv.addEventListener("touchmove", function (event) {
		    	if(!(2 >= Math.abs(window.innerWidth - document.documentElement.scrollWidth))){
		    		mobileButton.hideMobileShareButton();
		    	}
			},false);

		    this.shareButtonImg.addEventListener("touchmove", function (event) {
		    	if(!(2 >= Math.abs(window.innerWidth - document.documentElement.scrollWidth))){
		    		mobileButton.hideMobileShareButton();
		    	}
			},false);

		    this.shareButtonDiv.addEventListener("touchend", function (event) {
		    	if(mobileButton.isMbBtnHidden == true){
		    		mobileButton.touchEndTimeoutRef = mobileButton.setTimeout(function () {
		    			if(mobileButton.isMbBtnHidden==true){
		    				mobileButton.onscroll();
		    			}
					}, 100, mobileButton.touchEndTimeoutRef);
		    	}
			},false);

		    this.shareButtonImg.addEventListener("touchend", function (event) {
		    	if(mobileButton.isMbBtnHidden == true){
		    		mobileButton.touchEndTimeoutRef = mobileButton.setTimeout(function () {
		    			if(mobileButton.isMbBtnHidden==true){
		    				mobileButton.onscroll();
		    			}
					}, 100, mobileButton.touchEndTimeoutRef);
		    	}
			},false);

		    //////////////////////////////////////////////////

		    // On some actual device we have to handle orientation change event to resize & reposition the button
		    // For mozilla we have handle separate "window.screen.onmozorientationchange" event
		    window.addEventListener("orientationchange", function(){
		    	mobileButton.hideMobileShareButton();
		    	mobileButton.onscroll();
		    });

		    // Resize mobile share button after button creation (on page load) to display it with proper size
		    mobileButton.onscroll();
		    // This is required while page is zoomed and user refresh the page and as some browser does not trigger scroll event
		    // we have to call mobileButton.rescaleMobileShareButton() manually.
		    window.scrollTo(0, 0);

		    // Once all initialization is done, make mobile share button visible
		    this.shareButtonDiv.style.visibility = "visible";
		},

		hideMobileShareButton : function (){
			// Looks like we dont need to check hidden variable but lets have commented code
			//if(this.isMbBtnHidden == false){
				this.shareButtonDiv.style.visibility = "hidden";
				this.shareButtonDiv.style.opacity = 0;
			//}
			this.isMbBtnHidden = true;
		},

		showMobileShareButton : function (){
			if(mobileButton.isMbBtnHidden == true){
				this.shareButtonDiv.style.visibility = "visible";
				stFade.fadeIn('stToolPop');
			}
			this.isMbBtnHidden = false;
		},

		//Reset the dimension of mobile share button as per the orientation of the device
		resetMobileShareButtonDimension : function (){
			var portraitFactor = 1;// Decide division factor for portrait view  based on device's layout height
			var landscapeFactor = 1;// Decide division factor for landscape view based on device's layout height
			var layoutHeight = document.documentElement.clientHeight;
			//Calculate the % change in clientHeight if viewport is changed
			var viewPortChangeFactor = layoutHeight/this.initDocClientHeight;
			if(viewPortChangeFactor != 1){
				this.constFifteenHundred  = this.constFifteenHundred * viewPortChangeFactor;
				this.constFourteenHundred  = this.constFourteenHundred * viewPortChangeFactor;
				this.constThirteenHundred  = this.constThirteenHundred * viewPortChangeFactor;
				this.constTwelveHundred  = this.constTwelveHundred * viewPortChangeFactor;
				this.constElevenHundred  = this.constElevenHundred * viewPortChangeFactor;
			}

			if (layoutHeight > (this.constFifteenHundred)){
				portraitFactor = 7.5;
				landscapeFactor = 11.8;
			}else if ((layoutHeight <= (this.constFifteenHundred)) && (layoutHeight > (this.constFourteenHundred))){
				portraitFactor = 7.8;
				landscapeFactor = 12;
			}else if ((layoutHeight <= (this.constFourteenHundred)) && (layoutHeight > (this.constThirteenHundred))){
				portraitFactor = 8.1;
				landscapeFactor = 12.2;
			}else if ((layoutHeight <= (this.constThirteenHundred)) && (layoutHeight > (this.constTwelveHundred))){
				portraitFactor = 8.4;
				landscapeFactor = 12.4;
			}else if ((layoutHeight <= (this.constTwelveHundred)) && (layoutHeight >= (this.constElevenHundred))){
				portraitFactor = 8.7;
				landscapeFactor = 12.6;
			}else if (layoutHeight < (this.constElevenHundred)){
				portraitFactor = 9;
				landscapeFactor = 12.8;
			}
			// From example for iphone device width (980px), proper rescale factor for default size of width 43px is 2.325
		    // To keep it dynamic, calculate rescale factor on client width.
		    // Button width 99px (76px for landscape mode) is best suitable for device's client width 980px so get it by dividing client width by 9.8.
		    // Rescale factor is calculated by (Required Width:99px)/(Actual Width:43px)
			if(window.innerWidth > window.innerHeight){
		        // Landscape Mode
		        this.initRescaleFactor = (document.documentElement.clientWidth/landscapeFactor)/this.oriDimension ;//1.767;// 43px to 76px;
		    }else {
		    	// Portrait Mode
		    	this.initRescaleFactor = (document.documentElement.clientWidth/portraitFactor)/this.oriDimension ;//2.325;// 43px to 99px;
		    }

		    // Calculate the re-scale dimension
		    this.rescaleDimension = Math.round(this.oriDimension * this.initRescaleFactor);
		    this.initRescaleBorder = Math.round(this.oriBorder * this.initRescaleFactor);

		    this.offset = this.constOffset * this.initRescaleFactor;
		    if(viewPortChangeFactor != 1)
		    	this.initDocClientHeight = layoutHeight;
		},

		rescaleShowButton : function(){
			mobileButton.displayTimeoutRef = mobileButton.setTimeout(function(){
				mobileButton.rescaleMobileShareButton();
			},150,mobileButton.displayTimeoutRef);
		},

		// Resize mobile share button based on zoom-factor
		rescaleMobileShareButton : function (){
			// For orientation changed from "Portrait" to "Landscape", (visual dimension)window's innerWidth will be greater than innerHeight
			// i.e. width value will be changed as per orientation but their will be no change in (layout dimension) document.documentElement width & height.
			// So to get correct zoomFactor for landscape mode, use visual height (which was a width for portrait mode) as a width with respective layout width.
			// Note: There will be change in zoomFactor if browser specific footer / header is displayed which would change the innerHeight
			//       in landscape mode. But there is no best way to handle this hence currently it is a limitation.
			var visualWidth = window.innerWidth;
			var visualHeight = window.innerHeight;
			var layoutWidth = document.documentElement.clientWidth;
			var layoutHeight = document.documentElement.clientHeight;
			var viewPortChangeFactor = layoutHeight/this.initDocClientHeight;

		    var zoomFactor = visualWidth/layoutWidth;

		    // To get correct zoom-factor (1) value for both orientation we need to evaluate it by following logic
		    var isZoomReset = (2 >= Math.abs(window.innerWidth - document.documentElement.scrollWidth));

		    // Check if orientation change
		    if((visualWidth > visualHeight) && this.isLandscape == false){
		        this.isPortrait = false;
		        this.isLandscape = true;
		        mobileButton.resetMobileShareButtonDimension();
		    }else if((visualWidth < visualHeight) && this.isPortrait == false){
		    	this.isPortrait = true;
		    	this.isLandscape = false;
		    	mobileButton.resetMobileShareButtonDimension();
		    }else if(viewPortChangeFactor != 1){
		    	// Viewport is changed hence need to recalculate the dimensions
		    	mobileButton.resetMobileShareButtonDimension();
		    }
		    //Else there will be no change in orientation & viewport

		    // Set right and bottom only if zoom is reset i.e. zoom Factor is 1
		    if(isZoomReset){
		    	this.shareButtonDiv.style.left = '';
		        this.shareButtonDiv.style.top = '';
		        this.shareButtonDiv.style.right = this.offset  +  'px';
		        this.shareButtonDiv.style.bottom = this.offset  + 'px';
		    	mobileUtility.addClass('stToolPop', 'stToolPop-fixed');
		    	mobileUtility.removeClass('stToolPop', 'stToolPop-absolute');
		    }

		    var newDimension = Math.round(this.rescaleDimension * zoomFactor);
		    // Check dimension for even number. Make it even if its a odd number. In order to keep the
		    // circular shape of button, it is required to have dimension in an even number.
		    if(newDimension%2 != 0){
		    	newDimension++;
		    }

		    this.shareButtonDiv.style.width = newDimension + 'px';
		    this.shareButtonDiv.style.height = newDimension + 'px';

			// Check minimum zoom factor as on some device, as beyond 0.072 (which approximate to high zoom-in value)
		    // on some device, border of the button get hide as it is calculated near to 1px which is not properly visible.
		    if(zoomFactor > 0.072){
		    	this.shareButtonDiv.style.border = "solid " + this.initRescaleBorder * zoomFactor + 'px' + " #fff";
		    }else {
		    	this.shareButtonDiv.style.border = "solid " + this.initRescaleBorder * 0.072 + 'px' + " #fff";
		    }

		    // Set left and top only if zoom is not reset i.e. it is other that 1
		    if(!isZoomReset){
			    // Replace the button to bottom-right corner after zoom in/out
		    	this.shareButtonDiv.style.right = '';
		        this.shareButtonDiv.style.bottom = '';
			    this.shareButtonDiv.style.left = window.innerWidth - this.shareButtonDiv.offsetWidth + window.pageXOffset - Math.round(this.offset * zoomFactor) +  'px';
			    this.shareButtonDiv.style.top = window.innerHeight - this.shareButtonDiv.offsetHeight + window.pageYOffset - Math.round(this.offset * zoomFactor) + 'px';
			    mobileUtility.addClass('stToolPop', 'stToolPop-absolute');
		    	mobileUtility.removeClass('stToolPop', 'stToolPop-fixed');
		    }
		    this.shareButtonImg.style.width = (newDimension/2) + 'px';
		    this.shareButtonImg.style.height = (newDimension/2) + 'px';
		    this.shareButtonImg.style.margin = (newDimension/4) + 'px';

		    // Display the button
		    mobileButton.showMobileShareButton();
		},

		setTimeout : function (method, time, handle) {
			var timeoutHandle = void 0 !== handle ? handle : mobileButton.timeoutHandle;
			if(handle){
				clearTimeout(handle);
			}
			timeoutHandle = setTimeout(method, time);
			void 0 === handle && (mobileButton.timeoutHandle = timeoutHandle);
			return timeoutHandle;
		},

		onscroll : function(){
			if(mobileButton.displayTimeoutRef){
				clearTimeout(mobileButton.displayTimeoutRef);
			}
			mobileButton.scrollTimeoutRef = mobileButton.setTimeout(function(){
				mobileButton.rescaleShowButton();
			},300,mobileButton.scrollTimeoutRef);
		}
	};
}();
/***************** END MOBILE SHARE BUTTON CODE ***********************/


/********************** UTILITY START ************************/
//This is for fade effects on transition of screens
var stFade = function(){
	var diffNum = 0.1;
	return {
		animate : null,
		minOpct : 0,
		maxOpct : 0.8,
		fadeOut : function(elemID){
			this.maxOpct -= diffNum;
			this.updateOpacity(elemID, "fadeOut", this.maxOpct);
		},
		fadeIn : function(elemID){
			this.minOpct += diffNum;
			this.updateOpacity(elemID, "fadeIn", this.minOpct);
		},
		updateOpacity : function(elemID, effect, opct){
			if((opct < 0) || (opct > 0.8)){
				clearTimeout(this.animate);
				this.maxOpct = 0.8;
				this.minOpct = 0;
			}else{
				objElem = document.getElementById(elemID);
				if(objElem.filters != 'undefined'){
					objElem.style.filter="alpha(opacity="+(opct * 100)+")";
				}
				if(objElem.style.opacity != 'undefined'){
					objElem.style.opacity = opct;
				}
				this.animate = setTimeout(function(){stFade[effect](elemID);},80);
			}
		}
	};
}();


/**
 * Utility class for mobile related JavaScript
 */
var mobileUtility = function() {
	return {

		addClass : function(elemId, className){
			objElem = document.getElementById(elemId);
			if(objElem){
				objElem.classList.add(className.trim());
			}
		},

		removeClass : function(elemId, className){
			objElem = document.getElementById(elemId);
			if(objElem){
				objElem.classList.remove(className.trim());
			}
		},

		/**
		 * getScrollXY function is for getting current scroll measures of window
		 */
		getScrollXY : function(){
			var scrOfX = 0, scrOfY = 0;
			if( typeof( window.pageYOffset ) == 'number' ) {
				//Netscape compliant
				scrOfY = window.pageYOffset;
				scrOfX = window.pageXOffset;
			} else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
				//DOM compliant
				scrOfY = document.body.scrollTop;
				scrOfX = document.body.scrollLeft;
			} else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
				//IE6 standards compliant mode
				scrOfY = document.documentElement.scrollTop;
				scrOfX = document.documentElement.scrollLeft;
			}

			if(scrOfX < 0){ // This is to set top 0 if it is negative for window
				scrOfX = 0;
			}
			if(scrOfY < 0){// This is to set left 0 if it is negative for window
				scrOfY = 0;
			}
			return {"scrollX":scrOfX, "scrollY":scrOfY}; // Return object
		},

		/**
		 * getDeviceScale function is for getting current zoom scale measures of window
		 */
		getDeviceScale : function(){
			var deviceWidth, landscape = Math.abs(window.orientation) == 90;

			if (landscape) {
			  // iPhone OS < 3.2 reports a screen height of 396px
			  deviceWidth = Math.max(480, window.screen.height);
			} else {
			  deviceWidth = window.screen.width;
			}

			//return window.innerWidth / deviceWidth;
			var scale = (deviceWidth / window.innerWidth);
			if(scale > 0){
				return scale;
			}else{
				return 1;
			}
		},

		/**
		 * getWindowSize function is for getting current dimension of window
		 */
		getWindowSize : function(){
			var myWidth = 0, myHeight = 0;
			if( typeof( window.innerWidth ) == 'number' ) {
				//Non-IE
				myWidth = window.innerWidth;
				myHeight = window.innerHeight;
			} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
				//IE 6+ in 'standards compliant mode'
				myWidth = document.documentElement.clientWidth;
				myHeight = document.documentElement.clientHeight;
			} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
				//IE 4 compatible
				myWidth = document.body.clientWidth;
				myHeight = document.body.clientHeight;
			}

			return {"width":myWidth, "height":myHeight}; // Return object
		},

		/**
		 * Animation effect for sliding up the service sheet
		 * @param elem: HTMLElement to be slided up
		 * @param finishTop: [integer of null] Expected last value to style.top property
		 * @param callBack: callback function to be executed on completion of sliding up
		 *
		 **/
		slideUp : function(elem, finishTop, callBack) {
			var currScroll = this.getScrollXY(); // get current scroll measures of window
			var currSize = this.getWindowSize(); // get current dimension of window
			if(!finishTop){ // If expected last style.top is given as null, then set it as top offset of window
				finishTop = currScroll['scrollY'];
			}
			elem.style.top = (currSize['height'] + currScroll['scrollY'])+"px"; // Intitiation of slide from bottom to top
			elem.style.display = "block"; //Show the given element
			function frame() { // This function will be called using poller until finishTop is reached
				var elemTop = parseInt(elem.style.top); // Get current value for style.top
				elemTop -= 50; //New value for style.top
				elem.style.top = (elemTop > 0?elemTop:0)+'px'; // Move element to top

				// check for complete animation
				if(finishTop >= elemTop){ // If top reached to expected position
					elem.style.top = finishTop+"px"; //Finally adjust the top of element
					clearInterval(pollerSlideUp); // Destroy the poller
					callBack(); //execute callback function
				}
			}
			var pollerSlideUp = setInterval(frame, 1); // run every 1ms
		},

		/**
		 * Animation effect for sliding down the service sheet
		 * @param elem: HTMLElement to be slided down
		 * @param finishTop: [integer of null] Expected last value to style.top property
		 * @param callBack: callback function to be executed on completion of sliding down
		 *
		 **/
		slideDown : function(elem, finishTop, callBack) {
			var currScroll = this.getScrollXY(); // get current scroll measures of window
			var currSize = this.getWindowSize(); // get current dimension of window
			if(!finishTop){// If expected last style.top is given as null, then set it as bottom offset of window
				finishTop = (currSize['height'] + currScroll['scrollY']);
			}
			elem.style.top = currScroll['scrollY']+'px'; // Intitiation of slide from top to bottom
			function frame() { // This function will be called using poller until finishTop is reached
				var elemTop = parseInt(elem.style.top);// Get current value for style.top
				elemTop += 50; //New value for style.top
				elem.style.top = (elemTop > 0?elemTop:0)+'px'; // Move element to down
				// check for complete animation
				if(finishTop <= elemTop){ // If top reached to expected position
					elem.style.top = finishTop+"px"; //Finally adjust the top of element
					elem.style.display = "none"; //Hide the given element
					clearInterval(pollerSlideDown); // Destroy the poller
					callBack(); //execute callback function
				}
			}
			var pollerSlideDown = setInterval(frame, 1); // run every 1ms
		},
		/**
		 * @param flgAdd: Whether to add or to remove viewport
		 * @param defaultScale: Page zoom scale at time of opening of sheet
		 */
		applyViewport : function(flgAdd, defaultScale) {
			// Getting viewport meta tag implemented on page
			var viewportMeta = document.querySelector && document.querySelector("meta[name=viewport]");
			//Content attribute for viewport meta tag
			var params = "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0";
			// Get iOS version, if it is iOS else null

			if(!flgAdd){ //if flgAdd is false then remove viewport from page head
				if(!!viewportMeta){ //If viewport is there then remove it from page head
					if(defaultScale != null){
				 		params = "width=device-width, initial-scale="+defaultScale;
					}else{
						params = "";
					}
					viewportMeta.setAttribute('content',params); //reset the content attribute of viewport to empty
				 	if(mobileWidget.defaultViewport != null){ //If page was already had implemented viewport then revert that back
				 		viewportMeta.setAttribute('content',mobileWidget.defaultViewport);
				 		mobileWidget.defaultViewport = null; //reset the variable
				 	}else{// If viewport was not implemented on page then remove it as we had added it
				 		viewportMeta.parentNode.removeChild(viewportMeta);
				 	}
				}
				// Return the control because below functionality is for adding viewport
				return;
			}else if(stlib.browser.mobile.isIOs() && this.iOsVer() < 8){ // Special conditions for iOS. For iOS <= 7
				/**
				 * Since initial-scale is not effective on iOS 7 if we are adding viewport dynamically,
				 * so we have no control over user to zoom in/out the sheet to make it readable
				 */
				//params = "width=device-width, initial-scale=1.0";
			}else{
				/**
				 * Below code is for adding viewport to head of publisher page
				 */
				if(!viewportMeta){ //If viewport is already NOT present
					//Creating meta tag for viewport with name="viewport"
					try {//IE does not consider name as attribute if added using javascript. So implemented below mechanism
						viewportMeta = document.createElement('<META name="viewport" />');
					    //try is ie
					} catch(err) {
						//catch is non-ie
						viewportMeta = document.createElement('META');
						viewportMeta.setAttribute("name", "viewport");
					}
					viewportMeta.setAttribute('content',params); //Adding default settings to viewport
					// Get a reference to the element in which we want to insert a new node
					var parentElement = document.getElementsByTagName('head')[0];
					parentElement.insertBefore(viewportMeta, parentElement.firstChild); //Add viewport to page
				}else{ //If viewport is already present
					mobileWidget.defaultViewport = viewportMeta.content; //Store current content of viewport, which will be used later on sheet close
					viewportMeta.setAttribute('content',params); //Set new content to viewport
				}
			}
		},

		//Generic function for stopping propagation of given event
		hdlStopUnwantedEvents : function(evt){
			evt = evt || window.event;

		    if (typeof evt.stopPropagation != "undefined") {
		        evt.stopPropagation(); // Non-ie
		    } else {
		        evt.cancelBubble = true; //IE specific
		    }
		    if (typeof evt.stopImmediatePropagation != "undefined") {
		        evt.stopImmediatePropagation();
		    }
		    return false;
		},

		//To prevent default on given event
		resetDefault : function(evt){
			evt = evt || window.event;
			if (typeof evt.preventDefault != "undefined") {
				evt.preventDefault();
			}
		},

		/*
		 * @param chNode: HTMLElement whose parent is to be checked
		 * @param elemId: id of expected parent element
		 * getParentById is to check parent/grand parent of given element using given id
		 *
		 * @return:
		 * 	If given element, chNode, is invalid or its id is matched with the enquired id THEN return given element
		 *  If given id is matched with a any parent in hierarchy, THEN return that parent element
		 *  If reached till end of DOM hierarchy and given id is not matched with any parent element THEN return last parent element
		 *
		 */
		getParentById : function(chNode, elemId){
			if(!!chNode){
				if(typeof(chNode.id) != "undefined" && elemId == chNode.id){
					return chNode;
				}
				if(typeof(chNode.parentNode) == "undefined" || chNode.parentNode == null){
					return chNode;
				}
				if(typeof(chNode.parentNode.id) != "undefined" && elemId == chNode.parentNode.id){
					return chNode.parentNode;
				}
				return this.getParentById(chNode.parentNode, elemId); //Recursive call to iterate in DOM hierarchy
			}else{
				return chNode;
			}
		},

		// Wrapper function for adding event handlers
		addEventsHandler : function(target, spaceSeparatedEvents, callBack, isCapture){ // Wrapper function for adding event handlers
			var eventsArr = spaceSeparatedEvents.split(/\s+/g); //Splitting space separated events
			for(var i in eventsArr){
				target.addEventListener(eventsArr[i], callBack, isCapture);
				// Todo: Add cross-browser functionality if needed
			}
		},

		// Wrapper function for removing already added event handlers
		removeEventsHandler : function(target, spaceSeparatedEvents, callBack, isCapture){ // Wrapper function for removing event handlers
			var eventsArr = spaceSeparatedEvents.split(/\s+/g); //Splitting space separated events
			for(var i in eventsArr){
				target.removeEventListener(eventsArr[i], callBack, isCapture);
				// Todo: Add cross-browser functionality if needed
			}
		},

		iOsVer : function(){
			return parseInt(stlib.browser.mobile.getIOSVersion()); // Check iOS version
		}
	};
}();
/********************** UTILITY END ************************/
