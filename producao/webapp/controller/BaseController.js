sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
    "use strict";

    return Controller.extend("com.cs4.compra.controller.BaseController", {

        getRouter: function() {
            return UIComponent.getRouterFor(this);
        },

        getModel: function(sName) {
            return this.getView().getModel(sName);
        },

        setModel: function(oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        getI18nText: function(sText) {
            return this.getResourceBundle().getText(sText);
        }
    });
});