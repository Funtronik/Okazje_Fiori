sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"app/model"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("app.Component", {

		metadata: {
			manifest: "json",
		},

		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();
			this.getData();
		},
		getData: function () {
			sap.ui.getCore().setModel(models.createDataModel(),'data');
		}
	});
});