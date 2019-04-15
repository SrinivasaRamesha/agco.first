sap.ui.define([
	"incture/forecast/forecasting/controller/baseController",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"incture/forecast/forecasting/model/formatter"
], function (baseController, Export, ExportTypeCSV, JSONModel, Filter, FilterOperator, formatter) {
	"use strict";

	return baseController.extend("incture.forecast.forecasting.controller.Forecast", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf incture.forecast.forecasting.view.Forecast
		 */
		formatter: formatter,
		onInit: function () {
			//Forecast model initialization and set at view level
			var oJSONModel = this.initSampleDataModel();
			this.getView().setModel(oJSONModel, "forecastModel");
			this._oGlobalFilter = null;

			//Forecast model initiaalization can be deleted later
			var oSegmentModel = new JSONModel();
			oSegmentModel.loadData("model/localData.json");
			this.getView().setModel(oSegmentModel, "oSegmentModel");

			//Can be used for Pagination --- still need to work on that
			// var oModel = this.getView().getModel("forecastModel"),
			// 	modData = oModel.getData(),
			// 	oTab = this.getView().byId("ForecastTableId");
			// oModel.setProperty("/oRows", modData.Forecasting.slice(0, 10));
			// oTab.bindRows("forecastModel>/oRows");
			// // oTab.setVisible(true);
			// var len = modData.Forecasting.length;
			// var oActual = len / 10;
			// var oCalculation = (oActual % 1 == 0);
			// if (oCalculation == true) {
			// 	var oValue = oActual;
			// } else {
			// 	var oValue = parseInt(oActual) + 1;
			// }

		},
		//Navigating to detail view on link press
		onVendorLinkPress: function (oEvent) {
			var oVenNum = oEvent.getSource().getProperty("text");
			var mainPath = oEvent.getSource().getBindingInfo("text").binding.getContext().getPath();
			var oVenName = this.getView().getModel("forecastModel").getProperty(mainPath).VendorName;
			this.getOwnerComponent().getRouter().navTo("detail", {
				vendornumber: oVenNum,
				vendorname: oVenName
			});
		},
		//Filter operation for forecast model
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
		//ToolPage master screen hiding functionality
		onSideNavButtonPress: function () {
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			var sideExpanded = toolPage.getSideExpanded();

			this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},
		//ToolPage detail section data loading on Selection
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
				// oTab.setVisible(true);
				var len = modData.Forecasting.length;
				var oActual = len / 10;
				var oCalculation = (oActual % 1 == 0);
				if (oCalculation == true) {
					var oValue = oActual;
				} else {
					var oValue = parseInt(oActual) + 1;
				}
				oTab.setVisible(true);
				this.getView().byId("forecastPaginator").setNumberOfPages(oValue);

				this.getView().byId("pageHeadingId").setText("Forecasting");
			} else if (oSelKey === "BGS") {
				sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());
				this.getView().byId("pageHeadingId").setText("Budgeting(Savings)");
				this.getView().byId("SavingsTableId").setVisible(true);
				this.getView().byId("SecondSavingsTableId").setVisible(false);
			} else if (oSelKey === "BGNS") {
				sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());
				this.getView().byId("pageHeadingId").setText("Budgeting(NON-Savings)");
				this.getView().byId("NonSavingsTableId").setVisible(true);
			}
		},
		//on press of savings first screen table 
		onSavingsRow: function (oEvent) {
			var oVenNum = oEvent.getSource().getProperty("text");
			var mainPath = oEvent.getSource().getBindingInfo("text").binding.getContext().getPath();
			var oVenName = this.getView().getModel("forecastModel").getProperty(mainPath).VendorName;
			// var oIndex = oEvent.getParameter("rowIndex");
			// var oPath = "/oRows/" + oIndex;
			// var oVal = this.getView().getModel("forecastModel").getProperty(oPath).Factory;
			//this.getOwnerComponent().getRouter().navTo("savingsDescription");
			var tableid = this.getView().byId("SecondSavingsTableId");
			tableid.setVisible(true);
			this.getView().byId("SavingsTableId").setVisible(false);

		},
		//on press of savings second screen segmented button 
		onSavingsSegButton: function (oEvent) {
			var oSel = oEvent.getParameter("item").getText();
			if (oSel === "2018") {
				var tableid = this.getView().byId("SavingsTable2018");
				tableid.setVisible(true);
				this.getView().byId("SavingsTable2019").setVisible(false);
			} else if (oSel === "2019") {
				var tableid = this.getView().byId("SavingsTable2019");
				tableid.setVisible(true);
				this.getView().byId("SavingsTable2018").setVisible(false);
			}

		},

		//on press of projects in savings 2nd screen
		onSavingsDialog: function (oEvent) {

			this.oFragment = sap.ui.xmlfragment("incture.forecast.forecasting.fragment.dialog", this);
			this.getView().addDependent(this.oFragment);
			this.oFragment.open();

		},
		onCloseDialog: function (oEvent) {
			this.oFragment.close();
		},
		// onSelectionChange: function(oEvent) {
		// 	// this.getOwnerComponent().getRouter().navTo("detail");
		// 	var oIndex = oEvent.getParameter("rowIndex"),
		// 		oVal = this.getView().getModel("forecastModel").getProperty("/oRows/2").VendorName;

		// 	this.getOwnerComponent().getRouter().navTo("detail", {
		// 		vendorname: oVal
		// 	});
		// },
		//Downloading the data to excel
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
		//Pagination function
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