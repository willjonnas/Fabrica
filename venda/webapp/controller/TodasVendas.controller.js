sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/BusyIndicator",
  "sap/m/MessageBox"

], function (BaseController, JSONModel, BusyIndicator, MessageBox) {
  "use strict";

  return BaseController.extend("com.cs4.wl.venda.controller.TodasVendas", {
    onInit: function () {
      this.getView().setModel(new sap.ui.model.json.JSONModel({
        edit: false
      }), "settings");
      this.getRouter().getRoute("TodasVendas").attachPatternMatched(this.onRouteMatched, this);
    },

    onRouteMatched: function (oEvent) {
/*       var oArgs = oEvent.getParameter("arguments");
      var oView = this.getView();

      oView.bindElement({
        path: "/CompraSet"
      });

      var oTable = oView.byId("comprass");
      var oBinding = oTable.getBinding("items");

      var oFilter = new sap.ui.model.Filter({
        path: "InOutMat",
        operator: sap.ui.model.FilterOperator.EQ,
        value1: "IN"
      });

      oBinding.filter([]);
      oBinding.filter([oFilter]); */
    },
    formatDate: function (date) {

      var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

        pattern: "yyyy-MM-dd"

      });

      return oDateFormat.format(date);
    },
    onSelectStatus: function() {
      this.onPressSearch(); // Chamada para executar a pesquisa ao selecionar um checkbox
    },
    onPressSearch: function() {
      var oView = this.getView();
      var oTable = oView.byId("vendas");
      var oModel = this.getView().getModel();
      var sNome = oView.byId("pesquisa").getValue();
    
      var oFilters = [];
      var bNomeMatChecked = oView.byId("NomeMat").getSelected();
      var bNomePersonChecked = oView.byId("NomePerson").getSelected();
     
    
      if (bNomeMatChecked && sNome) {
        var oNomeMatFilter = new sap.ui.model.Filter("NomeMat", sap.ui.model.FilterOperator.Contains, sNome);
        oFilters.push(oNomeMatFilter);
      }
    
      if (bNomePersonChecked && sNome) {
        var oNomePersonFilter = new sap.ui.model.Filter("NomePerson", sap.ui.model.FilterOperator.Contains, sNome);
        oFilters.push(oNomePersonFilter);
      }
    
    
      var oBinding = oTable.getBinding("items");
      oBinding.filter(oFilters);
    },
    
    onPressRefresh: function() {
      var oTable = this.getView().byId("vendas"); 

      // Remove todos os filtros existentes
      oTable.getBinding("items").filter([]);

      // Atualiza os dados da tabela
      oTable.getBinding("items").refresh();
    }
  });

});
