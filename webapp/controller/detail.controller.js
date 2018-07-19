sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("incture.forecast.forecasting.controller.detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf incture.forecast.forecasting.view.detail
		 */
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(function (oEvent) {
				var vendorNum = oEvent.getParameter("arguments").vendornumber;
			});
		},
		onBackPress: function () {
			this.getOwnerComponent().getRouter().navTo("RouteMain");
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf incture.forecast.forecasting.view.detail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf incture.forecast.forecasting.view.detail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf incture.forecast.forecasting.view.detail
		 */
		//	onExit: function() {
		//
		//	}

	});

});