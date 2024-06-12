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
        const oLocalModel1 = new  sap.ui.model.json.JSONModel({
          name : "",
          username: "",
          password: "",
          usertype: "member",
         
        });
        this.getView().setModel(oLocalModel1, "localModel1");
        this.getRouter().attachRoutePatternMatched(this.onBookListLoad, this);
      },
      

      onSignUp1: async function () {

        var oNameInput = this.byId("Name");
            var oUsernameInput = this.byId("user1");
            var oPasswordInput = this.byId("password1");
            var oConfirmPasswordInput = this.byId("confirmPassword");

            // Get the input values
            var sName = oNameInput.getValue();
            var sUsername = oUsernameInput.getValue();
            var sPassword = oPasswordInput.getValue();
            var sConfirmPassword = oConfirmPasswordInput.getValue();

            var bValid = true;

            // Reset value states
            oNameInput.setValueState("None");
            oUsernameInput.setValueState("None");
            oPasswordInput.setValueState("None");
            oConfirmPasswordInput.setValueState("None");

            // Validate name
            if (!sName) {
                oNameInput.setValueState("Error");
                oNameInput.setValueStateText("Please enter your name");
                bValid = false;
            }

            // Validate username
            if (!sUsername) {
                oUsernameInput.setValueState("Error");
                oUsernameInput.setValueStateText("Please enter your username");
                bValid = false;
            }

            // Validate password length
            if (!sPassword) {
                oPasswordInput.setValueState("Error");
                oPasswordInput.setValueStateText("Please enter your password");
                bValid = false;
            } else if (sPassword.length < 8) {
                oPasswordInput.setValueState("Error");
                oPasswordInput.setValueStateText("Password must be at least 8 characters long");
                bValid = false;
            }

            // Validate confirm password
            if (!sConfirmPassword) {
                oConfirmPasswordInput.setValueState("Error");
                oConfirmPasswordInput.setValueStateText("Please confirm your password");
                bValid = false;
            } else if (sPassword !== sConfirmPassword) {
                oConfirmPasswordInput.setValueState("Error");
                oConfirmPasswordInput.setValueStateText("Passwords do not match");
                bValid = false;
            }


            if (!bValid) {
              MessageToast.show("Please correct the errors and try again.");
              return;
          }





        debugger
        const oPayload = this.getView().getModel("localModel1").getProperty("/"),
            oModel = this.getView().getModel("ModelV2");
        try {
        // Check if username exists
        const aFilters = [
            new Filter("username", FilterOperator.EQ, sUsername)
        ];
        
        const aUsers = await this.readData(oModel, "/users", aFilters);
        
        if (aUsers.length > 0) {
          var name1 = aUsers[0].name

            MessageToast.show( name1 +"  Username already exists. Please choose a different username.");
            return;
        }

        // If username does not exist, create the user
        await this.createData(oModel, oPayload, "/users");
        // MessageToast.show(  `${sUsername} Account Created is Successfully Created`);
        MessageToast.show(  sUsername + "  Account Created is Successfully Created");
        this.osignup.close();
    } catch (error) {
        MessageToast.show("Some technical issue");
    }
},
readData: function (oModel, sPath, aFilters) {
  return new Promise((resolve, reject) => {
      oModel.read(sPath, {
          filters: aFilters,
          success: function (oData) {
              resolve(oData.results);
          },
          error: function (oError) {
              reject(oError);
          }
      });
  });
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
        var oNameInput = this.byId("Name");
        var oUsernameInput = this.byId("user1");
        var oPasswordInput = this.byId("password1");
        var oConfirmPasswordInput = this.byId("confirmPassword");

        oNameInput.setValue("");
        oUsernameInput.setValue("");
        oPasswordInput.setValue("");
        oConfirmPasswordInput.setValue("");

        // Reset value states
        oNameInput.setValueState("None");
        oUsernameInput.setValueState("None");
        oPasswordInput.setValueState("None");
        oConfirmPasswordInput.setValueState("None");

        if (this.osignup.isOpen()) {
          this.osignup.close();
        }
        // location.reload();
      },

      

      onSignin: function (eve) {

        var oUsernameInput = this.byId("idUsernameInput");
        var oPasswordInput = this.byId("idPasswordInput");

        var sUsername = oUsernameInput.getValue();
        var sPassword = oPasswordInput.getValue();

        var bValid = true;

        oUsernameInput.setValueState("None");
        oPasswordInput.setValueState("None");

        if (!sUsername) {
          oUsernameInput.setValueState("Error");
          bValid = false;
      }

      // Validate password
      if (!sPassword) {
          oPasswordInput.setValueState("Error");
          bValid = false;
      }

        
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
                MessageToast.show(sUsername +"  Login successful!");
                this.getOwnerComponent()
                .getRouter()
                .navTo("RouteUsers", { id: userid });
                
              }
              if (oData.results[0].usertype === "admin") {
                debugger
                var userid = oData.results[0].ID;
                var username = oData.results[0].name;
                MessageToast.show(sUsername + "  Login successful!");
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
