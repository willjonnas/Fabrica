sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/util/Export",
  "sap/ui/core/util/ExportTypeCSV",
  "sap/ui/core/routing/Router",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function(Controller, JSONModel, Export, ExportTypeCSV, Router, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("com.cs4.wl.venda.controller.DetailGrafico", {
    onInit: function() {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      this.getView().setModel(new JSONModel({
        edit: false,
      }), "settings");

      oRouter.getRoute("DetailGrafico").attachPatternMatched(this.onRouteMatched, this);
    },

    onRouteMatched: function(oEvent) {
      var oArgs = oEvent.getParameter("arguments");
      this.IdMat = oArgs.IdMat;
      this._filterData(this.IdMat);
      this.getView("/MovimentoSet('" + this.IdMat + "')");
    },

    _filterData: function(sIdMat) {
      // Construa um objeto de filtro
      var oFilter = new Filter("IdMat", FilterOperator.EQ, sIdMat);
      
      // Aplique o filtro ao binding do gráfico ou ao modelo, conforme necessário
      var oVizFrame = this.getView().byId("idVizFrame");
      var oDataset = oVizFrame.getDataset();
      var oBinding = oDataset.getBinding("data");
      
      oBinding.filter([oFilter]);
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
          path: "/MovimentoSet",
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
            name: "QtdMovmat",
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
    

    fformatDate: function(value) {
      if (value) {
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd.MM.yyyy" });
        return oDateFormat.format(new Date(value));
      }
      return value;
    },
    onPressSearch: function() {
      var oStartDate = this.getView().byId("startDate").getDateValue();
      var oEndDate = this.getView().byId("endDate").getDateValue();
      var sIdMat = this.IdMat;
      
      var oVizFrame = this.getView().byId("idVizFrame");
      var oDataset = oVizFrame.getDataset();
      var oBinding = oDataset.getBinding("data");
      
      var oFilterArray = [];
      
      if (oStartDate && oEndDate && sIdMat) {

        var oIdMatFilter = new sap.ui.model.Filter("IdMat", sap.ui.model.FilterOperator.EQ, sIdMat);
        
        oFilterArray.push(new sap.ui.model.Filter({
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
        }));
        oFilterArray.push(oIdMatFilter);
      }
      else if (!oStartDate && !oEndDate && sIdMat) {
        var oIdMatFilter = new sap.ui.model.Filter("IdMat", sap.ui.model.FilterOperator.EQ, sIdMat);
        oFilterArray.push(oIdMatFilter);
      }
      oBinding.filter(oFilterArray);
    },

    onPressclean: function() {
      var oVizFrame = this.getView().byId("idVizFrame");
      var oStartDate = this.getView().byId("startDate");
      var oEndDate = this.getView().byId("endDate");
      var oDataset = oVizFrame.getDataset();
      var oBinding = oDataset.getBinding("data");
      var sIdMat = this.IdMat;
    
      // Limpar os campos de data
      oStartDate.setDateValue(null);
      oEndDate.setDateValue(null);
    
      // Remover os filtros de data do binding de dados
      oBinding.filter([]);
    
      // Atualizar o VizFrame
      oVizFrame.invalidate();
    
      // Atualizar os dados OData
      oBinding.refresh();
    
      // Aplicar filtro do IdMat
      var oFilter = new sap.ui.model.Filter("IdMat", sap.ui.model.FilterOperator.EQ, sIdMat);
      oBinding.filter([oFilter]);
    }         
    
  });
});