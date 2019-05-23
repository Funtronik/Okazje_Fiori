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
        onProductSearch: function(oEvent){
            var oList = this.getView().byId('idProductList');
            oList.busy = true;
            var searchBarString = oEvent.getSource().getValue();
            searchBarString = searchBarString.replace(" ","%")
            var oData = models.searchProduct(searchBarString);

            var JSONModel = new sap.ui.model.json.JSONModel();
            JSONModel.setProperty("/Products", oData.getProperty("/Products"));
            this.getView().setModel(JSONModel);
            oList.busy = false;
        },
        onItemPress: function(oEvent) {
            var oListItemId = oEvent.getParameter('listItem').mProperties.description

            var oDataDetails = models.getProductDetail(oListItemId);
            var oDataLinks = models.getProductLinks(oListItemId);
            var oDataPrices = models.getProductPrices(oListItemId);

            var oExistingModel = this.getView().getModel();
            oExistingModel.setProperty("/ProductDetailBasic", oDataDetails.getProperty("/ProductDetailBasic"));
            oExistingModel.setProperty("/ProductLinks", oDataLinks.getProperty("/ProductLinks"));
            oExistingModel.setProperty("/ProductPrices", oDataPrices.getProperty("/ProductPrices"));

            //Price Main
            this.getView().byId('idObjectHeader').setNumber(oDataPrices.getProperty("/ProductPrices/0/productPriceNow")+" PLN");

        }
    });
});