/*global QUnit*/

sap.ui.define([
	"comcs4wl/cliente/controller/Cliente.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Cliente Controller");

	QUnit.test("I should test the Cliente controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
