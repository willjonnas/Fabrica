sap.ui.define(
    [
        "sap/ui/model/json/JSONModel",
        "./BaseController",
        "sap/m/MessageBox",
        "../controls/MessageManager"
    ],
    function (JSONModel, BaseController, MessageBox, MessageManager) {
        "use strict";

        return BaseController.extend("com.cs4.wl.producao.controller.Configurar", {

            onInit: function () {
                this.getView().setModel(new JSONModel({
                    edit: false
                }), "settings")
                this.getRouter().getRoute("Configurar").attachPatternMatched(this.onRouteMatched, this);
                this.oMainMessages = new MessageManager(true)

            },
            onRouteMatched: function (oEvent) {
                
                var oArgs = oEvent.getParameter("arguments");
                this.IdMat = oArgs.IdMat;
                this.getView().bindElement("/MaterialSet('" + oArgs.IdMat + "')");
                
                this._filterData(this.IdMat);
                },
                
                _filterData: function(sIdMat) {
                // Construa um objeto de filtro
                var oFilter = new sap.ui.model.Filter("IdMat1", sap.ui.model.FilterOperator.EQ, sIdMat);
                
                // Aplique o filtro ao binding da tabela ou ao modelo, conforme necessário
                this.getView().byId("composicao").getBinding("items").filter([oFilter]);
                // Ou
                //this.oModel.read("/CompraSet", { filters: [oFilter]});
                },

              onPressDelete: function() {
                  MessageBox.confirm("Tem certeza que deseja excluir o material?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function(oAction) {
                      if (oAction === MessageBox.Action.YES) {
                        
                        sap.ui.core.BusyIndicator.show(0);
                        var oInput = this.getView().byId("IdMat2");
                        var IdMat2 = oInput.getValue();
                        
                        this.getModel().callFunction("/deletecompo", {
                          method:"POST",
                          urlParameters: {
                            IdMat1: this.IdMat,
                            IdMat2: IdMat2
                          },
                          success: function(oResult, oResponse) {
                            sap.ui.core.BusyIndicator.hide();
                            var bErrors = this._addMessagesFromResponse(oResponse);
                            this.getModel().refresh(true);
                            oInput.setValue();
                          }.bind(this),
                          error: function() {
                            sap.ui.core.BusyIndicator.hide();
                            MessageBox.error(this.getI18nText("ErrorDelete"));
                            oInput.setValue();
                          }.bind(this)
                        });
                      }
                    }.bind(this)
                  });
              },
              onPressUpdate: function() {      
              
              var oInput = this.getView().byId("IdMat2");
              var IdMat2 = oInput.getValue();
              var oInput1 = this.getView().byId("QtdProdmat");
              var QtdProdmat = oInput1.getValue();
              debugger;
              this.getModel().callFunction("/updatecompo", {
                method:"POST",
                urlParameters: {
                  IdMat1: this.IdMat,
                  IdMat2: IdMat2,
                  QtdProdmat: QtdProdmat
                },
                success: function(oResult, oResponse) {
                  sap.ui.core.BusyIndicator.hide();
                  var bErrors = this._addMessagesFromResponse(oResponse);
                  this.getModel().refresh(true);
                  oInput.setValue();
                  oInput1.setValue();

                }.bind(this),
                error: function() {
                  sap.ui.core.BusyIndicator.hide();
                  MessageBox.error(this.getI18nText("ErrorUpdate"));
                  oInput.setValue();
                  oInput1.setValue();
                }.bind(this)
              });
            },
            onPressAdd: function() {      
              sap.ui.core.BusyIndicator.show(0);
              var oInput = this.getView().byId("IdMat2");
              var IdMat2 = oInput.getValue();
              var oInput1 = this.getView().byId("QtdProdmat");
              var QtdProdmat = oInput1.getValue();
              
              this.getModel().callFunction("/addcompo", {
                method:"POST",
                urlParameters: {
                  IdMat1: this.IdMat,
                  IdMat2: IdMat2,
                  QtdProdmat: QtdProdmat
                },
                success: function(oResult, oResponse) {
                  sap.ui.core.BusyIndicator.hide();
                  var bErrors = this._addMessagesFromResponse(oResponse);
                  this.getModel().refresh(true);
                  oInput.setValue();
                  oInput1.setValue();
                 
                }.bind(this),
                error: function() {
                  sap.ui.core.BusyIndicator.hide();
                  MessageBox.error(this.getI18nText("ErrorAdd"));
                  oInput.setValue();
                  oInput1.setValue();
                }.bind(this)
              });
            },

            _addMessagesFromResponse: function (oResponse) {
                var bHasErrors = false;
                if (oResponse && oResponse.headers && oResponse.headers["sap-message"]) {
                  const oMessage = JSON.parse(oResponse.headers["sap-message"]);
                  var aMessages = oMessage.details || [];
                  aMessages.push(oMessage);
              
                  aMessages.forEach(function (oMessage) {
                    this.oMainMessages.addMessage({
                      title: oMessage.message,
                      type: this.oMainMessages._parseSeverity(oMessage.severity)
                    });
              
                    if (oMessage.severity.toUpperCase() === "ERROR") {
                      bHasErrors = true;
                    }
                  }.bind(this));
              
                  this.oMainMessages.open();
                }
              
                return bHasErrors;
              },
              
          });
 });