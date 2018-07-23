sap.ui.define([
	"incture/forecast/forecasting/controller/baseController",
	"sap/ui/model/json/JSONModel",
	"incture/forecast/forecasting/model/formatter"
], function (baseController, JSONModel, smartfield, formatter) {
	"use strict";

	return baseController.extend("incture.forecast.forecasting.controller.detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf incture.forecast.forecasting.view.detail
		 */
		partState: function (oStatus) {
			if (oStatus === "Completed") {
				return "Success";
			} else if (oStatus === "In Approval") {
				return "Warning";
			} else if (oStatus === "Negotiating") {
				return "Error";
			}
		},
		formatter: formatter,
		onInit: function () {
			//  Navigating from forecast controller main page to vendor data page
			this.getRouter().getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

		},
		//Navigating to previous page
		onBackPress: function () {
			this.getOwnerComponent().getRouter().navTo("RouteMain");
		},
		//Navigate based on parts selection fragment open
		onPartSelection: function (oEvent) {
			var oDialog = this._getPartsDialog();
			oDialog.open();
			// var oDialog = new sap.ui.xmlfragment("incture.forecast.forecasting.view.projectDetails", this);
			// this.getView().addDependent(oDialog);
			// oDialog.open();
		},
		_getPartsDialog: function () {
			if (!this._oPartDia) {
				this._oPartDia = new sap.ui.xmlfragment("incture.forecast.forecasting.view.projectDetails", this);
				this.getView().addDependent(this._oPartDia);
			}
			return this._oPartDia;
		},
		//Fragment closing action
		onClosePress: function () {
			var oDialog = this._getPartsDialog();
			oDialog.close();
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
					}).addStyleClass("inputNoBorder"),
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

	});

});