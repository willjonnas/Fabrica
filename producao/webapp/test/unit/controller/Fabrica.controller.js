/*global QUnit*/

sap.ui.define([
	"comcs4wl/producao/controller/Producao.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Producao Controller");

	QUnit.test("I should test the Producao controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
