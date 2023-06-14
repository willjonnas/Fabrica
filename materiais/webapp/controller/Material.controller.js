sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/BusyIndicator",
  "sap/m/MessageBox", 

], function (BaseController, JSONModel, BusyIndicator, MessageBox) {
  "use strict";

  return BaseController.extend("com.cs4.wl.materiais.controller.Material", {

    onInit: function () {
    

    },

    onPressMaterial: function (oEvent) {
      // Obter o modelo de dados da tabela de materiais
      var oModel = this.getView().getModel();
      // Obter o contexto do item selecionado
      var oContext = oEvent.getSource().getBindingContext();
      // Obter os dados do item selecionado
      var oMaterial = oModel.getProperty(oContext.getPath());

      // Criar uma caixa de diálogo
      var oDialog = new sap.m.Dialog({
        title: oMaterial.NomeMat,
        content: [
          new sap.ui.layout.form.SimpleForm({
            content: [
              new sap.m.Label({ text: "ID" }),
              new sap.m.Text({ text: oMaterial.IdMat }),
              new sap.m.Label({ text: "Nome" }),
              new sap.m.Text({ text: oMaterial.NomeMat }),
              new sap.m.Label({ text: "Descrição" }),
              new sap.m.Text({ text: oMaterial.DescMat }),
              new sap.m.Label({ text: "Peso" }),
              new sap.m.Text({ text: oMaterial.PesoMat }),
              new sap.m.Label({ text: "Tamanho" }),
              new sap.m.Text({ text: oMaterial.TamMat }),
              new sap.m.Label({ text: "Preço" }),
              new sap.m.Text({ text: oMaterial.PrecoMat }),
              new sap.m.Label({ text: "Status" }),
              new sap.m.Text({ text: oMaterial.StatusMat })
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
    }
    ,
    onPressCreate: function () {

      if (!this.oCreateFragment) {

        this.oCreateFragment = sap.ui.xmlfragment(this.getView().getId(), "com.cs4.wl.materiais.fragments.CreateMaterial", this)

        this.getView().addDependent(this.oCreateFragment);
      }

      this.oCreateFragment.open();
    },
    onPressCancelCreate: function () {
      this.oCreateFragment.close();
      this.getView().byId('NomeMat').setValue("");
      this.getView().byId('DescMat').setValue("");
      this.getView().byId('PesoMat').setValue("");
      this.getView().byId('TamMat').setValue("");
      this.getView().byId('PrecoMat').setValue("");
      oRadioButtonGroup.setSelectedButton(null);
    },

    onPressSubmitCreate: function () {

      var oRadioButtonGroup = this.byId("StatusMat");
      var sSelectedButtonText = oRadioButtonGroup.getSelectedButton().getText();


      var oEntry = {
        NomeMat: this.getView().byId('NomeMat').getValue(),
        DescMat: this.getView().byId('DescMat').getValue(),
        PesoMat: this.getView().byId('PesoMat').getValue(),
        TamMat: this.getView().byId('TamMat').getValue(),
        PrecoMat: this.getView().byId('PrecoMat').getValue(),
        StatusMat: sSelectedButtonText
      };

      BusyIndicator.show(0);

      this.getModel().create('/MaterialSet', oEntry, {
        success: function () {
          BusyIndicator.hide();
          this.oCreateFragment.close();
          MessageBox.success(this.getI18nText("MaterialCreated"));
          this.getView().byId('NomeMat').setValue("");
          this.getView().byId('DescMat').setValue("");
          this.getView().byId('PesoMat').setValue("");
          this.getView().byId('TamMat').setValue("");
          this.getView().byId('PrecoMat').setValue("");
          oRadioButtonGroup.setSelectedButton(null);
          
          // Redefinir filtros da tabela
          var oTable = this.getView().byId('materiais');
          oTable.getBinding('items').filter([]);
        }.bind(this),

        error: function () {
          BusyIndicator.hide();
          MessageBox.error(this.getI18nText("errorCreate"));
        }.bind(this)
      });
    },

    onPressDelete: function () {
      var oTable = this.byId("materiais");
      var aPaths = oTable.getSelectedContextPaths();
      oTable.removeSelections();
      if (aPaths.length === 0) {
        // exibir mensagem de erro aqui
        MessageBox.error("Nenhum Material Selecionado");
        return;
      }
      MessageBox.confirm("Tem certeza que deseja excluir o material selecionado?", {
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        onClose: function (oAction) {
          if (oAction === MessageBox.Action.YES) {
            BusyIndicator.show(0);
            for (var i = 0; i < aPaths.length; i++) {
              this.getModel().remove(aPaths[i], {
                success: function () {
                  BusyIndicator.hide();
                  MessageBox.success(this.getI18nText("successDelete"));
                }.bind(this),
                error: function () {
                  BusyIndicator.hide();
                  MessageBox.error(this.getI18nText("errorDelete"));
                }.bind(this)
              });
            }
          }
        }.bind(this)
      });
    },



    onPressSearch: function () {
      var oView = this.getView();
      var oTable = oView.byId("materiais");
      var oModel = this.getView().getModel();
      var sNome = oView.byId("IdNome").getValue();
      var bPA = oView.byId("PA").getSelected();
      var bMP = oView.byId("MP").getSelected();

      var oFilters = [];
      if (sNome) {
        var oFilter = new sap.ui.model.Filter("NomeMat", sap.ui.model.FilterOperator.Contains, sNome);
        oFilters.push(oFilter);
      }

      if (bPA && bMP) {
        var oFilterStatus = new sap.ui.model.Filter({
          filters: [
            new sap.ui.model.Filter("StatusMat", sap.ui.model.FilterOperator.EQ, "PA"),
            new sap.ui.model.Filter("StatusMat", sap.ui.model.FilterOperator.EQ, "MP")
          ],
          and: false
        });
        oFilters.push(oFilterStatus);
      } else if (bPA) {
        var oFilterStatus = new sap.ui.model.Filter("StatusMat", sap.ui.model.FilterOperator.EQ, "PA");
        oFilters.push(oFilterStatus);
      } else if (bMP) {
        var oFilterStatus = new sap.ui.model.Filter("StatusMat", sap.ui.model.FilterOperator.EQ, "MP");
        oFilters.push(oFilterStatus);
      }

      var oBinding = oTable.getBinding("items");
      oBinding.filter(oFilters);
    },

    onPressUpdate: function(oEvent) {
      var oTable = this.byId("materiais");
      var aItems = oTable.getSelectedItems();
      if (aItems.length === 0) {
        MessageBox.error("Nenhuma linha selecionada");
        return;
      }
      var oItem = aItems[0];
      var oBindingContext = oItem.getBindingContext();
      var IdMat = oBindingContext.getObject().IdMat;
      this.getRouter().navTo("Editar", {
        IdMat: IdMat
      });
      
    },
    onPressReflash: function() {
      var oTable = this.getView().byId("materiais"); 

      // Remove todos os filtros existentes
      oTable.getBinding("items").filter([]);

      // Atualiza os dados da tabela
      oTable.getBinding("items").refresh();
    },
    onPressStock: function() {
    var oTable = this.byId("materiais");
      var aItems = oTable.getSelectedItems();
      if (aItems.length === 0) {
        MessageBox.error("Nenhuma linha selecionada");
        return;
      }
      var oItem = aItems[0];
      var oBindingContext = oItem.getBindingContext();
      var IdMat = oBindingContext.getObject().IdMat;
      this.getRouter().navTo("TimeAxis", {
        IdMat: IdMat
      });

    }
  });
});

