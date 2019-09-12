sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {
		//createDeviceModel
		createDataModel: function () {

			var json = new sap.ui.model.json.JSONModel();
			$.ajax({
				type: "GET",
				url: './scripts/database.php',
				async: false,
				data: ({searchString:"",searchId:"",operation:""}),
				success: function (data) //on recieve of reply
				{
					try {
						json.setData(JSON.parse(data));
					} catch (e) {
						if (data.includes("<br"))
							console.log(data);
						console.log("Error during fetch data: " + e);
					}
				},
				error: function (err) {
					console.log(err);
				}
			});
			return json;
		},
		searchProduct: function(iv_searchString){
			var json = new sap.ui.model.json.JSONModel();
			$.ajax({
				type: "GET",
				url: './scripts/database.php',
				async: false,
				data: ({searchString:iv_searchString,searchId:"",operation:""}),
				success: function (data) //on recieve of reply
				{
					try {
						if (data != "")
							json.setData(JSON.parse(data));
					} catch (e) {
						if (data.includes("<br"))
							console.log(data);
						console.log("Error during fetch data: " + e);
					}
				},
				error: function (err) {
					console.log(err);
				}
			});
			return json;
		},
		getProductDetail: function(iv_id){
			var json = new sap.ui.model.json.JSONModel();
			$.ajax({
				type: "GET",
				url: './scripts/database.php',
				async: false,
				data: ({searchString:"",searchId:iv_id,operation:"basic"}),
				success: function (data) //on recieve of reply
				{
					try {
						if (data != "")
							json.setData(JSON.parse(data));
					} catch (e) {
						if (data.includes("<br"))
							console.log(data);
						console.log("Error during fetch data: " + e);
					}
				},
				error: function (err) {
					console.log(err);
				}
			});
			return json;
		},
		getProductLinks: function(iv_id){
			var json = new sap.ui.model.json.JSONModel();
			$.ajax({
				type: "GET",
				url: './scripts/database.php',
				async: false,
				data: ({searchString:"",searchId:iv_id,operation:"links"}),
				success: function (data) //on recieve of reply
				{
					try {
						if (data != "")
							json.setData(JSON.parse(data));
					} catch (e) {
						if (data.includes("<br"))
							console.log(data);
						console.log("Error during fetch data: " + e);
					}
				},
				error: function (err) {
					console.log(err);
				}
			});
			return json;
		},
		getProductPrices: function(iv_id){
			var json = new sap.ui.model.json.JSONModel();
			$.ajax({
				type: "GET",
				url: './scripts/database.php',
				async: false,
				data: ({searchString:"",searchId:iv_id,operation:"prices"}),
				success: function (data) //on recieve of reply
				{
					try {
						if (data != "")
							json.setData(JSON.parse(data));
					} catch (e) {
						if (data.includes("<br"))
							console.log(data);
						console.log("Error during fetch data: " + e);
					}
				},
				error: function (err) {
					console.log(err);
				}
			});
			return json;
		}
	};
});