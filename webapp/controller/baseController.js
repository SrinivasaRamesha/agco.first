sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("incture.forecast.forecasting.controller.baseController", {

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}

	});

});