var UrlSiteWindowDatasource = Class.create();

UrlSiteWindowDatasource.prototype = {
	__class__ : "YAHOO.zenoss.portlet.UrlSiteWindowDatasource",
	__init__ : function(settings) {
		this.baseLoc = "http://www.bing.com"; //setting url
	},
	get : function(callback) {
		this.callback = callback;
		var url = this.baseLoc;
		var html = '<iframe src="' + url + '" '
				+ 'style="border:medium none;margin:0;padding:0;'
				+ 'background-color:#fff;' + 'width:100%;height:100%;"/>';
		callback({
			responseText : html
		});
	}
}
YAHOO.zenoss.portlet.UrlSiteWindowDatasource = UrlSiteWindowDatasource;

var UrlPortlet = YAHOO.zenoss.Subclass.create(YAHOO.zenoss.portlet.Portlet);
UrlPortlet.prototype = {
	__class__ : "YAHOO.zenoss.portlet.UrlPortlet",
	__init__ : function(args) {
		args = args || {};
		id = 'id' in args ? args.id : getUID('UrlPortlet');
		baseLoc = 'baseLoc' in args ? args.baseLoc
				: YAHOO.zenoss.portlet.DEFAULT_SITEWINDOW_URL;
		bodyHeight = 'bodyHeight' in args ? args.bodyHeight : 400;
		title = 'title' in args ? args.title : "UrlPortlet";
		refreshTime = 'refreshTime' in args ? args.refreshTime : 0;
		miscthing = 'miscthing' in args ? args.miscthing : "miscthing";
		this.mapobject = null;
		var datasource = 'datasource' in args ? args.datasource
				: new YAHOO.zenoss.portlet.UrlSiteWindowDatasource({
					'baseLoc' : baseLoc ? baseLoc : ''
				});
		this.superclass.__init__({
			id : id,
			title : title,
			refreshTime : refreshTime,
			miscthing : miscthing,
			datasource : datasource,
			bodyHeight : bodyHeight
		});
		this.buildSettingsPane();
		setStyle(this.body, {
			'overflow-y' : 'hidden'
		});
	},
	buildSettingsPane : function() {
		s = this.settingsSlot;
		/*
		 * this.locsearch = YAHOO.zenoss.zenautocomplete.LocationSearch( 'URL
		 * (http://www.zenoss.com)', s);
		 */
		this.locsearch = INPUT({
			'value' : this.datasource.baseLoc
		}, []);
		var container = DIV({
			'class' : 'autocompleter-container portlet-settings-control'
		}, [ DIV({
			'class' : 'control-label'
		}, 'URL (http://www.bing.com)'), this.locsearch ]);
		s.appendChild(container);
	},
	submitSettings : function(e, settings) {
		baseLoc = this.locsearch.value;
		if (baseLoc.length < 1)
			baseLoc = this.datasource.baseLoc;
		// this.locsearch.value = '';
		this.superclass.submitSettings(e, {
			'baseLoc' : baseLoc
		});
	},
	startRefresh : function(firsttime) {
		if (!firsttime)
			this.datasource.get(this.fill);
		if (this.refreshTime > 0)
			this.calllater = callLater(this.refreshTime, this.startRefresh);
	}

}
YAHOO.zenoss.portlet.UrlPortlet = UrlPortlet;
