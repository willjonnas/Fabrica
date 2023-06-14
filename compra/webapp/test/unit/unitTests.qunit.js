/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/cs4/wl/compra/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
