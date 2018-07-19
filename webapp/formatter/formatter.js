sap.ui.define([], function () {
	"use strict";
	return {
		formatCurrency: function (oAmount, oCurrency) {
			if (oCurrency === "USD") {
				return "$ " + oAmount;
			}
		},
		currencyState: function (oAmount) {
			if (oAmount < "0") {
				return "Error";
			}
		}
	};
});