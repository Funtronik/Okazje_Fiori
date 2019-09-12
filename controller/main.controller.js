sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "app/model"
], function (Controller,JSONModel,models) {
    "use strict";
    return Controller.extend("app.controller.main", {
        // Global variables
        globalData: null,

        onAfterRendering: function() {
            this.globalData = sap.ui.getCore().getModel("data");
            this.getView().setModel(this.globalData);
            var Products = this.globalData.getProperty("/Products");
            var JSONModel = new sap.ui.model.json.JSONModel();
            JSONModel.setProperty("/Products", Products);
            this.getView().setModel(JSONModel);
        },
        onProductSearch: async function(oEvent){
            this.getView().byId('master').setBusy(true);
            var searchBarString = oEvent.getSource().getValue();
            searchBarString = searchBarString.replace(" ","%");
            var oData = await this.callModel('searchProduct',searchBarString);

            var JSONModel = new sap.ui.model.json.JSONModel();
            JSONModel.setProperty("/Products", oData.getProperty("/Products"));
            this.getView().setModel(JSONModel);
            this.getView().byId('master').setBusy(false);
        },
        onItemPress: async function(oEvent) {
            this.getView().byId('detail').setBusy(true); 
            var oListItemId = oEvent.getParameter('listItem').mProperties.description;

            var oDataDetails = await this.callModel('getProductDetail',oListItemId);
            var oDataLinks = await this.callModel('getProductLinks',oListItemId);
            var oDataPrices = await this.callModel('getProductPrices',oListItemId);

            var oExistingModel = this.getView().getModel();
            oExistingModel.setProperty("/ProductDetailBasic", oDataDetails.getProperty("/ProductDetailBasic"));
            oExistingModel.setProperty("/ProductLinks", oDataLinks.getProperty("/ProductLinks"));
            oExistingModel.setProperty("/ProductPrices", oDataPrices.getProperty("/ProductPrices"));

            //Price Main
            this.getView().byId('idObjectHeader').setNumber(oDataPrices.getProperty("/ProductPrices/0/productPriceNow")+" PLN");
            this.getView().byId('detail').setBusy(false);
        },
        callModel: function(methodName, parameter){
            var returnVal;
            switch (methodName) {
                case 'getProductDetail':
                    returnVal = models.getProductDetail(parameter);
                    break;
                case 'getProductLinks':
                    returnVal = models.getProductLinks(parameter);
                    break;
                case 'getProductPrices':
                    returnVal = models.getProductPrices(parameter);
                    break;
                case 'searchProduct':
                    returnVal = models.searchProduct(parameter);
                    break;
                default:
                    break;
            }
            return returnVal;
        }
    });
});