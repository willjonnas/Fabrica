sap.ui.define([
    "./BaseController", 
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/BusyIndicator", 
    "sap/m/MessageBox"
    
], function (BaseController, JSONModel, BusyIndicator, MessageBox) {
    "use strict";

    return BaseController.extend("com.cs4.wl.cliente.controller.Cliente", { 
           
            onInit: function () {


            },

    onPressCreate: function () {
         
          if (!this.oCreateFragment) {

            this.oCreateFragment = sap.ui.xmlfragment(this.getView().getId(), "com.cs4.wl.cliente.fragments.CreateCliente", this)
            
            this.getView().addDependent(this.oCreateFragment);
             }
                
          this.oCreateFragment.open();
        },
        onPressCancelCreate: function () {
            this.oCreateFragment.close();
        },   
                
        onPressSubmitCreate: function() {
          var oRadioButtonGroup = this.byId('StatusPerson');
          var sSelectedButtonText = oRadioButtonGroup.getSelectedButton().getText();
          var oModel = this.getView().getModel();
      
          var oEntry = {
              NomePerson: this.getView().byId('NomePerson').getValue(),
              MoradaPerson: this.getView().byId('MoradaPerson').getValue(),
              EmailPerson: this.getView().byId('EmailPerson').getValue(),
              TelefonePerson: this.getView().byId('TelefonePerson').getValue(),
              StatusPerson: sSelectedButtonText
          };
      
          sap.ui.core.BusyIndicator.show(0);
      
          oModel.create('/ClienteSet', oEntry, {
              success: function() {
                  sap.ui.core.BusyIndicator.hide();
                  this.oCreateFragment.close();
                  sap.m.MessageBox.success(this.getI18nText("ClienteCreated"));
      
                  // Limpar os campos do formulário após o sucesso
                  this.getView().byId('NomePerson').setValue("");
                  this.getView().byId('MoradaPerson').setValue("");
                  this.getView().byId('EmailPerson').setValue("");
                  this.getView().byId('TelefonePerson').setValue("");
                  oRadioButtonGroup.setSelectedButton(null);
              }.bind(this),
      
              error: function() {
                  sap.ui.core.BusyIndicator.hide();
                  sap.m.MessageBox.error(this.getI18nText("errorCreate"));
      
                  // Limpar os campos do formulário após o erro
                  this.getView().byId('NomePerson').setValue("");
                  this.getView().byId('MoradaPerson').setValue("");
                  this.getView().byId('EmailPerson').setValue("");
                  this.getView().byId('TelefonePerson').setValue("");
                  oRadioButtonGroup.setSelectedButton(null);
              }.bind(this)
          });
      
        },
        onPressSearch: function() {
            var oView = this.getView();
            var oTable = oView.byId("clientes");
            var oModel = this.getView().getModel();
            var sNome = oView.byId("IdNome").getValue();
            var bPA = oView.byId("Fornecedor").getSelected();
            var bMP = oView.byId("Cliente").getSelected();
          
            var oFilters = [];
            if (sNome) {
              var oFilter = new sap.ui.model.Filter("NomePerson", sap.ui.model.FilterOperator.Contains, sNome);
              oFilters.push(oFilter);
            }
          
            if (bPA && bMP) {
              var oFilterStatus = new sap.ui.model.Filter({
                filters: [
                  new sap.ui.model.Filter("StatusPerson", sap.ui.model.FilterOperator.EQ, "Fornecedor"),
                  new sap.ui.model.Filter("StatusPerson", sap.ui.model.FilterOperator.EQ, "Cliente")
                ],
                and: false
              });
              oFilters.push(oFilterStatus);
            } else if (bPA) {
              var oFilterStatus = new sap.ui.model.Filter("StatusPerson", sap.ui.model.FilterOperator.EQ, "Fornecedor");
              oFilters.push(oFilterStatus);
            } else if (bMP) {
              var oFilterStatus = new sap.ui.model.Filter("StatusPerson", sap.ui.model.FilterOperator.EQ, "Cliente");
              oFilters.push(oFilterStatus);
            }
          
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oFilters);
          }
          ,

          onPresscliente: function(oEvent) {
            // Obter o modelo de dados da tabela de materiais
            var oModel = this.getView().getModel();
            // Obter o contexto do item selecionado
            var oContext = oEvent.getSource().getBindingContext();
            // Obter os dados do item selecionado
            var oCliente = oModel.getProperty(oContext.getPath());
        
            // Criar uma caixa de diálogo
            var oDialog = new sap.m.Dialog({
                title: oCliente.NomePerson,
                content: [
                    new sap.ui.layout.form.SimpleForm({
                        content: [
                            new sap.m.Label({text: "ID"}),
                            new sap.m.Text({text: oCliente.IdPerson}),
                            new sap.m.Label({text: "Nome"}),
                            new sap.m.Text({text: oCliente.NomePerson}),
                            new sap.m.Label({text: "Morada"}),
                            new sap.m.Text({text: oCliente.MoradaPerson}),
                            new sap.m.Label({text: "E-mail"}),
                            new sap.m.Text({text: oCliente.EmailPerson}),
                            new sap.m.Label({text: "Telefone"}),
                            new sap.m.Text({text: oCliente.TelefonePerson}),
                            new sap.m.Label({text: "Status"}),
                            new sap.m.Text({text: oCliente.StatusPerson}),
                           
                        ]
                    })
                ],
                beginButton: new sap.m.Button({
                    text: "Fechar",
                    press: function () {
                        oDialog.close();
                    }
                })
            });
        
            // Abrir a caixa de diálogo
            oDialog.open();
        },
        
        onPressUpdate: function(oEvent) {
            
            var oTable = this.byId("clientes");
            var aItems = oTable.getSelectedItems();
            if (aItems.length === 0) {
              MessageBox.error("Nenhuma linha selecionada");
              return;
            }
            var oItem = aItems[0];
            var oBindingContext = oItem.getBindingContext();
            var IdPerson = oBindingContext.getObject().IdPerson;
            this.getRouter().navTo("Detalhe", {
                IdPerson: IdPerson
            });
            
          },
          onPressRefresh: function() {
            var oTable = this.getView().byId("clientes"); 
      
            // Remove todos os filtros existentes
            oTable.getBinding("items").filter([]);
      
            // Atualiza os dados da tabela
            oTable.getBinding("items").refresh();
          }
   
        });
    });
