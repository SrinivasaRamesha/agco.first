sap.ui.define([], function () {
	"use strict";
	return {
		formatCurrency: function (oAmount, oCurrency) {
			if (oCurrency === "USD") {
				return "$ " + oAmount;
			}
		},
		//Forecast data currency status
		currencyState: function (oAmount) {
			if (oAmount < "0") {
				return "Error";
			}
		},
		//to get status of parts in dialog fragment for PARTS section
		getPartState: function (oStatus) {
			if (oStatus === "Completed") {
				return "Success";
			} else if (oStatus === "In Approval") {
				return "Warning";
			} else if (oStatus === "Canceled") {
				return "Error";
			}
		}
	};
});