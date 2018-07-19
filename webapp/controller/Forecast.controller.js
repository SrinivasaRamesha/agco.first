sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"incture/forecast/forecasting/formatter/formatter"
], function (Controller, Export, ExportTypeCSV, JSONModel, Filter, FilterOperator, formatter) {
	"use strict";

	return Controller.extend("incture.forecast.forecasting.controller.Forecast", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf incture.forecast.forecasting.view.Forecast
		 */
		formatter: formatter,
		onInit: function () {
			var oJSONModel = this.initSampleDataModel();
			this.getView().setModel(oJSONModel, "forecastModel");
			this._oGlobalFilter = null;
		},
		onVendorLinkPress: function (oEvent) {
			var oVenNum = oEvent.getSource().getProperty("text");
			this.getOwnerComponent().getRouter().navTo("detail", {
				vendornumber: oVenNum
			});
		},
		initSampleDataModel: function () {
			var oModel = new JSONModel();

			jQuery.ajax(jQuery.sap.getModulePath("incture.forecast.forecasting.model", "/localData.json"), {
				dataType: "json",
				success: function (oData) {
					var aTemp1 = [];
					var aTemp2 = [];
					var aFactory = [];
					var aVendorName = [];
					for (var i = 0; i < oData.Forecasting.length; i++) {
						var oProduct = oData.Forecasting[i];
						if (oProduct.Factory && jQuery.inArray(oProduct.Factory, aTemp1) < 0) {
							aTemp1.push(oProduct.Factory);
							aFactory.push({
								Name: oProduct.Factory
							});
						}
						if (oProduct.VendorName && jQuery.inArray(oProduct.VendorName, aTemp2) < 0) {
							aTemp2.push(oProduct.VendorName);
							aVendorName.push({
								Name: oProduct.VendorName
							});
						}
						// oProduct.DeliveryDate = (new Date()).getTime() - (i % 10 * 4 * 24 * 60 * 60 * 1000);
						// oProduct.DeliveryDateStr = oDateFormat.format(new Date(oProduct.DeliveryDate));
						// oProduct.Heavy = oProduct.WeightMeasure > 1000 ? "true" : "false";
						// oProduct.Available = oProduct.Status == "Available" ? true : false;
					}

					oData.Factory = aFactory;
					oData.VendorName = aVendorName;

					oModel.setData(oData);
				},
				error: function () {
					jQuery.sap.log.error("failed to load json");
				}
			});

			return oModel;
		},
		filterTableLevel: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("Factory", FilterOperator.Contains, sQuery),
					new Filter("ParentNumber", FilterOperator.Contains, sQuery),
					new Filter("VendorNumber", FilterOperator.Contains, sQuery),
					new Filter("VendorName", FilterOperator.Contains, sQuery)
				], false);
			}

			this._filter();
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf incture.forecast.forecasting.view.Forecast
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf incture.forecast.forecasting.view.Forecast
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf incture.forecast.forecasting.view.Forecast
		 */
		//	onExit: function() {
		//
		//	}
		onSideNavButtonPress: function () {
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			var sideExpanded = toolPage.getSideExpanded();

			this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},
		onItemSelect: function (oEvent) {
			var item = oEvent.getParameter('item');
			var viewId = this.getView().getId();
			var oSelKey = item.getProperty("key");
			if (oSelKey === "FC") {
				sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());
				var oTab = this.getView().byId("ForecastTableId");

				var oModel = this.getView().getModel("forecastModel"),
					modData = oModel.getData();
				oModel.setProperty("/oRows", modData.Forecasting.slice(0, 10));
				oTab.bindRows("forecastModel>/oRows");
				oTab.setVisible(true);
				var len = modData.Forecasting.length;
				var oActual = len / 10;
				var oCalculation = (oActual % 1 == 0);
				if (oCalculation == true) {
					var oValue = oActual;
				} else {
					var oValue = parseInt(oActual) + 1;
				}

				this.getView().byId("forecastPaginator").setNumberOfPages(oValue);

				this.getView().byId("pageHeadingId").setText("Forecasting");
			} else if (oSelKey === "BGS") {
				sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());
				this.getView().byId("pageHeadingId").setText("Budgeting(Savings)");
			} else if (oSelKey === "BGNS") {
				sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());
				this.getView().byId("pageHeadingId").setText("Budgeting(NON-Savings)");
			}
		},
		// onSelectionChange: function(oEvent) {
		// 	// this.getOwnerComponent().getRouter().navTo("detail");
		// 	var oIndex = oEvent.getParameter("rowIndex"),
		// 		oVal = this.getView().getModel("forecastModel").getProperty("/oRows/2").VendorName;

		// 	this.getOwnerComponent().getRouter().navTo("detail", {
		// 		vendorname: oVal
		// 	});
		// },
		onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
			var oExport = new Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new ExportTypeCSV({
					separatorChar: ",",
					charset: "UTF-8"
				}),

				// Pass in the model created above
				models: this.getView().getModel("forecastModel"),

				// binding information for the rows aggregation
				rows: {
					path: "/Forecasting"
				},

				// column definitions with column name and binding info for the content

				columns: [{
					name: "Factory",
					template: {
						content: "{Factory}"
					}
				}, {
					name: "Parent Number",
					template: {
						content: "{ParentNumber}"
					}
				}, {
					name: "Vendor Number",
					template: {
						content: "{VendorNumber}"
					}
				}, {
					name: "Vendor Name",
					template: {
						content: "{VendorName}"
							// "{Width} x {Depth} x {Height} {DimUnit}"
					}
				}, {
					name: "Current Quote",
					template: {
						content: "{CurrentQuote}"
					}
				}, {
					name: "Total Standard",
					template: {
						content: "{TotalStandard}"
					}
				}, {
					name: "Total PPV Budget",
					template: {
						content: "{TotalPPVBudget}"
					}
				}, {
					name: "Total PPV Forecast",
					template: {
						content: "{TotalPPVForecast}"
					}
				}]
			});

			// download exported file
			oExport.saveFile().catch(function (oError) {
				sap.m.MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function () {
				oExport.destroy();
			});
		},
		onItemsSelectionChange: function (oEvent) {
			// var oIndex = oEvent.getParameter("rowIndex");
			// var oPath = "/oRows/" + oIndex;
			// var oVal = this.getView().getModel("forecastModel").getProperty(oPath).VendorNumber;

			// this.getOwnerComponent().getRouter().navTo("detail", {
			// 	vendornumber: oVal
			// });
		},
		onPageSelection: function (oEvent) {
			var oTargetPage = oEvent.getParameter("targetPage");
			var oTargetValue = oTargetPage * 10;
			var oSourceValue = oTargetValue - 10;
			var oModel = this.getView().getModel("forecastModel");
			var oTotalData = oModel.getProperty("/Forecasting");
			var oSelectedData = oTotalData.slice(oSourceValue, oTargetValue);
			oModel.setProperty("/oRows", oSelectedData);
		},
		onColPress: function () {

		},

		_setToggleButtonTooltip: function (bLarge) {
			var toggleButton = this.byId('toggleButtonId');
			if (bLarge) {
				toggleButton.setTooltip('Large Size Navigation');
			} else {
				toggleButton.setTooltip('Small Size Navigation');
			}
		},
		_filter: function () {
			var oFilter = null;

			if (this._oGlobalFilter) {
				oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
			} else if (this._oGlobalFilter) {
				oFilter = this._oGlobalFilter;
			}

			this.byId("ForecastTableId").getBinding("rows").filter(oFilter, "Application");
		}
	});
});