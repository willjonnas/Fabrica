sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/BusyIndicator",
  "sap/m/MessageBox"

], function (BaseController, JSONModel, BusyIndicator, MessageBox) {
  "use strict";

  return BaseController.extend("com.cs4.wl.compra.controller.TodasCompras", {
    onInit: function () {
      this.getView().setModel(new sap.ui.model.json.JSONModel({
        edit: false
      }), "settings");
      this.getRouter().getRoute("TodasCompras").attachPatternMatched(this.onRouteMatched, this);
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
    onFilterData: function() {
      var oStartDate = this.getView().getModel("settings").getProperty("/startDate");
      var oEndDate = this.getView().getModel("settings").getProperty("/endDate");
      
      var oFilterArray = [];
      
      if (oStartDate && oEndDate) {
        var oStartDateFilter = new Filter("DataMat", FilterOperator.GE, oStartDate);
        var oEndDateFilter = new Filter("DataMat", FilterOperator.LE, oEndDate);
        
        oFilterArray.push(oStartDateFilter);
        oFilterArray.push(oEndDateFilter);
      }
      
      var oVizFrame = this.getView().byId("idVizFrame");
      var oDataset = oVizFrame.getDataset();
      var oBinding = oDataset.getBinding("data");
      
      oBinding.filter(oFilterArray);
    },
    
    onExportData: function() {
      var oExport = new Export({
        exportType: new ExportTypeCSV({}),
        models: this.getView().getModel(),
        rows: {
          path: "/CompraSet",
          filters: [
            new Filter("DataMat", FilterOperator.GE, this.getView().getModel("settings").getProperty("/startDate")),
            new Filter("DataMat", FilterOperator.LE, this.getView().getModel("settings").getProperty("/endDate"))
          ]
        },
        columns: [
          {
            name: "IdMat",
            template: {
              content: "{IdMat}"
            }
          },
          {
            name: "NomeMat",
            template: {
              content: "{NomeMat}"
            }
          },
          {
            name: "DataMat",
            template: {
              content: {
                path: "DataMat",
                formatter: this.formatDate.bind(this)
              }
            }
          },
          {
            name: "QtdMovmatt",
            template: {
             

              content: "{QtdMovmat}"
            }
          }
        ]
      });

      oExport.saveFile().catch(function(oError) {
        console.error("Erro ao exportar dados: " + oError);
      });
    },

    formatDate: function(value) {
      if (value) {
        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" });
        return oDateFormat.format(new Date(value));
      }
      return value;
    },
    
    onSelectStatus: function() {
      this.onPressSearch(); // Chamada para executar a pesquisa ao selecionar um checkbox
    },
    onPressSearch: function() {
      var oView = this.getView();
      var oTable = oView.byId("comprass");
      var oModel = this.getView().getModel();
      var sNome = oView.byId("pesquisa").getValue();
      var oStartDate = oView.byId("startDate").getDateValue();
      var oEndDate = oView.byId("endDate").getDateValue();
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
    
      if (oStartDate && oEndDate) {
        var oDateFilter = new sap.ui.model.Filter({
          filters: [
            new sap.ui.model.Filter({
              path: 'DataMat',
              operator: sap.ui.model.FilterOperator.GE,
              value1: oStartDate
            }),
            new sap.ui.model.Filter({
              path: 'DataMat',
              operator: sap.ui.model.FilterOperator.LE,
              value1: oEndDate
            })
          ],
          and: true
        });
        oFilters.push(oDateFilter);
      }
    
      var oBinding = oTable.getBinding("items");
      oBinding.filter(oFilters);
    },
    
    
    
    onPressRefresh: function() {
      var oStartDate = this.getView().byId("startDate");
      var oEndDate = this.getView().byId("endDate");
      oStartDate.setDateValue(null);
      oEndDate.setDateValue(null);
      var oTable = this.getView().byId("comprass"); 

      // Remove todos os filtros existentes
      oTable.getBinding("items").filter([]);

      // Atualiza os dados da tabela
      oTable.getBinding("items").refresh();

    }
  });

});
