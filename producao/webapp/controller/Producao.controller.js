sap.ui.define([
    "./BaseController", 
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/BusyIndicator", 
    "sap/m/MessageBox",
    "../controls/MessageManager"
], 
function (BaseController, JSONModel, BusyIndicator,  MessageBox, MessageManager) {
    "use strict";
    
        return BaseController.extend("com.cs4.wl.producao.controller.Producao", {
          onInit: function() {
            this.getView().setModel(new sap.ui.model.json.JSONModel({
              edit: false
            }), "settings");
          
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteProducao").attachPatternMatched(this.onRouteMatched, this);
            this.oMainMessages = new MessageManager(true)

          },
            
            onPressSearch: function() {
              var oView = this.getView();
              var oTable = oView.byId("material");
              var oModel = this.getView().getModel();
              var sNome = oView.byId("IdNome").getValue();
            
              var oFilters = [];
              if (sNome) {
                var oNomeFilter = new sap.ui.model.Filter("NomeMat", sap.ui.model.FilterOperator.Contains, sNome);
                oFilters.push(oNomeFilter);
              } 
              var oBinding = oTable.getBinding("items");
              oBinding.filter(oFilters);
            },
            onPressReflesh: function() {
              var oTable = this.getView().byId("material"); 
        
              // Remove todos os filtros existentes
              oTable.getBinding("items").filter([]);
        
              // Atualiza os dados da tabela
              oTable.getBinding("items").refresh();
            },
            onPressTodas: function() {
              var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.navTo("TodasProducoes");
            },
            onPressConfiguracao: function(oEvent) {
              var oTable = this.byId("material");
              var aItems = oTable.getSelectedItems();
              if (aItems.length === 0) {
                MessageBox.error("Nenhuma linha selecionada");
                return;
              }
              var oItem = aItems[0];
              var oBindingContext = oItem.getBindingContext();
              var IdMat = oBindingContext.getObject().IdMat;
              this.getRouter().navTo("Configurar", {
                IdMat: IdMat
              });
              
            },
            onPressProducao: function() {
              var oTable = this.byId("material");
              var aPaths = oTable.getSelectedContextPaths();
              if (aPaths.length === 0) {
                MessageBox.error("Nenhuma linha selecionada");
                return;
              }
              var sPath = aPaths[0];
            
              if (!this.oCreateFragment) {
                this.oCreateFragment = sap.ui.xmlfragment(this.getView().getId(), "com.cs4.wl.producao.fragments.CreateMaterial", this);
                this.oCreateFragment.bindElement(sPath);
                this.getView().addDependent(this.oCreateFragment); 
              }
            
              this.oCreateFragment.open();
            },
            
            onPressCancelCreate: function () {
              this.oCreateFragment.close();
            },
            onPressSubmitCreate: function() {
              

              const oTable = this.byId("material");
              const oSelectedItem = oTable.getSelectedItem();
              
              const oBindingContext = oSelectedItem.getBindingContext();
              const sIdMat = oBindingContext.getProperty("IdMat");
            
              const qtdMovmatInput = this.getView().byId('QtdMovmat');
              const qtdMovmatValue = parseInt(qtdMovmatInput.getValue());
           
              if (qtdMovmatValue >= 1) {
                var oEntry = {
                  IdMat1: sIdMat,
                  QtdMovmat: this.getView().byId('QtdMovmat').getValue(),
                  DataMat: this.getView().byId('DataMat').getDateValue()
                };
                
                this.getModel().create("/ProducaoSet", oEntry, {
                  success: function(oResult, oResponse) {
                    BusyIndicator.hide();
                    this.oCreateFragment.close();
                   var bErrors = this._addMessagesFromResponse(oResponse)
                    
                          // Limpar os campos de entrada
                    qtdMovmatInput.setValue("");
                    this.getView().byId('DataMat').setDateValue(null);
                   this.getModel().refresh(true);  // Atualizar o modelo OData
                  }.bind(this),
            
                  error: function(oError) {
                    BusyIndicator.hide();
                    MessageBox.error(this.getI18nText("errorProducao"));
                  }.bind(this),
                });
              } else {
                MessageBox.error("A quantidade deve ser maior ou igual a 1.");
              }
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
