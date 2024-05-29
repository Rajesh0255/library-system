sap.ui.define(
  [
    "./Basecontroller",

    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/Token",
    "sap/ui/model/json/JSONModel"
    
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    MessageBox,
    MessageToast,
    Filter,
    FilterOperator,
    ODataModel,
    Token
  ) {
    "use strict";

    return Controller.extend("com.app.project1.controller.View1", {
      onInit: function () {
        var oModel = new ODataModel("/v2/odata/v4/catalog/");
        this.getView().setModel(oModel);
        const oLocalModel = new  sap.ui.model.json.JSONModel({
          name : "",
          username: "",
          password: "",
          // confirmpassword : "",
          usertype: "member",
         
        });
        this.getView().setModel(oLocalModel, "localModel");
        this.getRouter().attachRoutePatternMatched(this.onBookListLoad, this);
      },
      

      onSignUp1: async function () {
        debugger
        const oPayload = this.getView().getModel("localModel").getProperty("/"),
            oModel = this.getView().getModel("ModelV2");
        try {
            await this.createData(oModel, oPayload, "/users");
            // this.getView().byId("idBooksTable").getBinding("items").refresh();
            this.osignup.close();
        } catch (error) {
            this.osignup.close();
            sap.m.MessageBox.error("Some technical Issue");
        }
    },
               

      onLogin: async function () {

        if (!this.odialogbox) {
          this.odialogbox = await this.loadFragment("dialogbox");
        }
        this.odialogbox.open();
      },

      onCloseDialog: function () {
        var ouser = this.getView().byId("idUsernameInput").setValue("");
        var opass = this.getView().byId("idPasswordInput").setValue("");

        if (this.odialogbox.isOpen()) {
          this.odialogbox.close();
        }

        // location.reload();
      },

      onSignup: async function(){
      
        if (!this.osignup) {
          this.osignup = await this.loadFragment("signup");
        }
        this.osignup.open();
      },

      onCloseDialog3: function () {
        if (this.osignup.isOpen()) {
          this.osignup.close();
        }
        // location.reload();
      },

      

      onSignin: function (eve) {
        
        debugger;
        var oView = this.getView();
        var sUsername = oView.byId("idUsernameInput").getValue();
        var sPassword = oView.byId("idPasswordInput").getValue();
        var oModel = this.getView().getModel();
        var aUsers = oModel.getProperty("/users");

        var aFilters = [
          new Filter("username", FilterOperator.EQ, sUsername),
          new Filter("password", FilterOperator.EQ, sPassword),
        ];

        oModel.read("/users", {
          filters: aFilters,
          success: function (oData) {
            if (oData.results.length > 0) {
              if (oData.results[0].usertype === "member") {
                var userid = oData.results[0].ID;
                MessageToast.show("Login successful!");
                this.getOwnerComponent()
                  .getRouter()
                  .navTo("RouteUsers", { id: userid });
              }
              if (oData.results[0].usertype === "admin") {
                var userid = oData.results[0].ID;
                MessageToast.show("Login successful!");
                this.getOwnerComponent()
                  .getRouter()
                  .navTo("routeNew");
              }

              // Redirect to the next page or perform other login success actions
            } else {
              MessageToast.show("Invalid username or password.");
            }
          }.bind(this),
          error: function (oError) {
            MessageToast.show("Error during login process.");
          },
        });
      },

      
    });
  }
);
