/*global QUnit*/

sap.ui.define([
	"comcs4wl/venda/controller/Venda.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Venda Controller");

	QUnit.test("I should test the Venda controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
