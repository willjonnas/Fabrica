sap.ui.define(
    [
        "sap/ui/model/json/JSONModel",
        "./BaseController",
        "sap/m/MessageBox"
    ],
    function (JSONModel, BaseController, MessageBox) {
        "use strict";

        return BaseController.extend("com.cs4.wl.materiais.controller.Editar", {

            onInit: function () {
                this.getView().setModel(new JSONModel({
                    edit: false
                }), "settings")
                this.getRouter().getRoute("Editar").attachPatternMatched(this.onRouteMatched, this);


            },
            onRouteMatched: function (oEvent) {
                const oArgs = oEvent.getParameter("arguments");
                this.IdMat = oArgs.IdMat;
                this.getView().bindElement("/MaterialSet(" + oArgs.IdMat + ")");


            },
            onValueHelpRequest: function (oEvent) {
                var oInput = oEvent.getSource();
                var aItems = ["MP", "PA"];
                var oDialog = new sap.m.SelectDialog({
                    title: "Selecione o status do material",
                    contentWidth: "250px",
                    contentHeight: "80px",
                    items: aItems.map(function (sItem) {
                        return new sap.m.StandardListItem({
                            title: sItem
                        });
                    }),
                    search: function (oEvent) {
                        var sValue = oEvent.getParameter("value");
                        var oFilter = new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, sValue);
                        oEvent.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: function (oEvent) {
                        oInput.setValue(oEvent.getParameter("selectedItem").getTitle());
                    },
                    cancel: function (oEvent) {
                        // do nothing
                    }
                });
                oDialog.open();
            },
            onPressSave: function () {
                var oView = this.getView();
                var oModel = oView.getModel();
            
                oModel.submitChanges({
                    success: function () {
                        MessageBox.success("Salvo com sucesso!");
                    },
                    error: function () {
                        MessageBox.error("Erro ao salvar.");
                    }
                });
            },

        });
    }
);
