sap.ui.define([
	"incture/forecast/forecasting/controller/baseController",
	"sap/ui/model/json/JSONModel"
], function (baseController, JSONModel, smartfield) {
	"use strict";

	return baseController.extend("incture.forecast.forecasting.controller.detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf incture.forecast.forecasting.view.detail
		 */
		onInit: function () {
			// this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			// this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(function (oEvent) {
			// 	var vendorNum = oEvent.getParameter("arguments").vendornumber;
			// 	var sFinalPath = "vendorModel>/VendorNumber/" + vendorNum;
			// });
			this.getRouter().getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

		},
		onBackPress: function () {
			this.getOwnerComponent().getRouter().navTo("RouteMain");
		},
		_onObjectMatched: function (oEvent) {
			var vendorNum = oEvent.getParameter("arguments").vendornumber;
			var vendorName = oEvent.getParameter("arguments").vendorname;
			this.getView().byId("vendorPageNumId").setText(vendorNum);
			this.getView().byId("vendorPageNameId").setText(vendorName);
			var oFinalPath = "vendorModel>/" + vendorNum;
			var oTemplate = new sap.m.ColumnListItem({
				cells: [new sap.m.Text({
						text: "{vendorModel>name}"
					}),
					new sap.m.Input({
						value: "{vendorModel>Jan}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>Feb}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>Mar}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>April}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>May}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>Jun}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>July}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>Aug}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>Sep}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>Oct}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>Nov}",
						editable: false
					}),
					new sap.m.Input({
						value: "{vendorModel>Dec}",
						editable: false
					})
				]
			});
			var oVendorTab = this.getView().byId("vendorLevelTabId");
			var oVendorTab2 = this.getView().byId("vendorLevelTabIdSec");
			oVendorTab.bindItems(oFinalPath, oTemplate);
			oVendorTab2.bindItems(oFinalPath, oTemplate);

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