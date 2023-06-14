/*global QUnit*/

sap.ui.define([
	"com/cs4/wl/compra/controller/Compra.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Compra Controller");

	QUnit.test("I should test the Compra controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
