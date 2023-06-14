/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comcs4wl/producao/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
