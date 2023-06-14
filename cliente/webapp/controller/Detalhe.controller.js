sap.ui.define(
    [
        "sap/ui/model/json/JSONModel",
        "./BaseController",
        "sap/m/MessageBox"
    ],
    function (JSONModel, BaseController, MessageBox) {
        "use strict";

        return BaseController.extend("com.cs4.wl.materiais.controller.Detalhe", {

            onInit: function () {
                this.getView().setModel(new JSONModel({
                    edit: false
                }), "settings")
                this.getRouter().getRoute("Detalhe").attachPatternMatched(this.onRouteMatched, this);


            },
            onRouteMatched: function (oEvent) {
                const oArgs = oEvent.getParameter("arguments");
                this.IdPerson = oArgs.IdPerson;
                this.getView().bindElement("/ClienteSet('" + oArgs.IdPerson + "')");


            },
            onPressSave: function () {
                var oView = this.getView();
                var oModel = oView.getModel();
            
                oModel.submitChanges({
                    success: function () {
                        MessageBox.success("Atualizado com sucesso!");
                    },
                    error: function () {
                        MessageBox.error("Erro ao salvar.");
                    }
                });
            },

        });
    }
);
