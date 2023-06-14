sap.ui.define([
    "./BaseController", 
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/BusyIndicator", 
    "sap/m/MessageBox"
], 
function (BaseController, JSONModel, BusyIndicator,  MessageBox) {
    "use strict";

        return BaseController.extend("com.cs4.wl.venda.controller.Venda", {
          onInit: function() {
            this.getView().setModel(new sap.ui.model.json.JSONModel({
              edit: false
            }), "settings");
          
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteVenda").attachPatternMatched(this.onRouteMatched, this);
            
          },
          
            onPressVenda: function() {
                var oTable = this.byId("material");
                var aPaths = oTable.getSelectedContextPaths();
                if (aPaths.length === 0) {
                  MessageBox.error("Nenhuma linha selecionada");
                  return;
                }
                var sPath = aPaths[0];
                this.IdMov = sPath.split("'")[1]
              
                if (!this.oCreateFragment) {
                  this.oCreateFragment = sap.ui.xmlfragment(this.getView().getId(), "com.cs4.wl.venda.fragments.CreateVenda", this);
                  this.oCreateFragment.bindElement(sPath);
                  this.getView().addDependent(this.oCreateFragment); 
                }
              
                this.oCreateFragment.open();
              },
              
              onPressCancelCreate: function () {
                this.oCreateFragment.close();
              },
              onPressSubmitCreate: function() {
                const oSelectItens = this.byId("idcli");
                const oSelect = oSelectItens.getSelectedItem();
                const idPersonValue = oSelect.getKey();
              
                const oTable = this.byId("material");
                const oSelectedItem = oTable.getSelectedItem();
              
                const oBindingContext = oSelectedItem.getBindingContext();
                const sIdMat = oBindingContext.getProperty("IdMat");
              
                const qtdMovmatInput = this.getView().byId('QtdMovmat');
                const qtdMovmatValue = parseInt(qtdMovmatInput.getValue());
              
                if (qtdMovmatValue >= 1) {
                  var oEntry = {
                    IdMat: sIdMat,
                    QtdMovmat: this.getView().byId('QtdMovmat').getValue(),
                    IdPerson: idPersonValue,
                    DataMat: this.getView().byId('DataMat').getDateValue()
                  };
                  this.getModel().create("/VendaSet", oEntry, {
                    success: function() {
                      BusyIndicator.hide();
                      this.oCreateFragment.close();
                      MessageBox.success(this.getI18nText("vendaSuccess"));
                            // Limpar os campos de entrada
                      qtdMovmatInput.setValue("");
                      this.getView().byId('DataMat').setDateValue(null);
                      
                      this.getModel().refresh(true);  // Atualizar o modelo OData
                    }.bind(this),
              
                    error: function(oError) {
                      BusyIndicator.hide();
                      MessageBox.error(this.getI18nText("errorCreate") + " " + oError.responseText);
                    }.bind(this)
                  });
                } else {
                  MessageBox.error("A quantidade deve ser maior ou igual a 1.");
                }
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
            }
            ,  
              onPressTodas: function() {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("TodasVendas");
              },
              onPressReflesh: function() {
                var oTable = this.getView().byId("material"); 
          
                // Remove todos os filtros existentes
                oTable.getBinding("items").filter([]);
          
                // Atualiza os dados da tabela
                oTable.getBinding("items").refresh();
              },
              onPressDetailGrafico: function() {
                var oTable = this.byId("material");
                  var aItems = oTable.getSelectedItems();
                  if (aItems.length === 0) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("Grafico");
                  }
                  var oItem = aItems[0];
                  var oBindingContext = oItem.getBindingContext();
                  var IdMat = oBindingContext.getObject().IdMat;
                  this.getRouter().navTo("DetailGrafico", {
                    IdMat: IdMat
                  });
                }
            
         });
     });