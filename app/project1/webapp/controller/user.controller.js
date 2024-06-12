sap.ui.define(
  [
    "./Basecontroller",
      
      "sap/m/MessageToast",
      "sap/ui/model/json/JSONModel"
  ],
  function(Controller,MessageToast,JSONModel) {
    "use strict";

    return Controller.extend("com.app.project1.controller.user", {
      onInit: function() {
        const oRouter = this.getOwnerComponent().getRouter();
      oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);


    

      },
     
      onUserDetailsLoad: function(oEvent ){
        const {id} = oEvent.getParameter("arguments");
        this.ID = id;
        // const sRouterName = oEvent.getParameter("name");
        const oObjectPage = this.getView().byId("ObjectPageLayout");
 
        oObjectPage.bindElement(`/users(${id})`);
    },

   

    onBorrowNewBookPress: async function (oEvent) {
      console.log(
        this.byId("idBooksTable")
          .getSelectedItem()
          .getBindingContext()
          .getObject()
      );
      var oSelectedItem = oEvent.getSource().getParent();
      console.log(oSelectedItem);
      console.log(oEvent.getSource().getBindingContext().getObject());
      console.log(oEvent.getParameters());
      var oSelectedUser = oSelectedItem.getBindingContext().getObject();
      if (this.byId("idBooksTable").getSelectedItems().length > 1) {
        MessageToast.show("Please Select only one Book");
        return;
      }
      var oSelectedBook = this.byId("idBooksTable")
        .getSelectedItem()
        .getBindingContext()
        .getObject();
      console.log(oSelectedBook);
      const userModel = new sap.ui.model.json.JSONModel({
        user1_ID: oSelectedUser.ID,
        book1_ID: oSelectedBook.ID,
        reservedDate: new Date(),
      });
      this.getView().setModel(userModel, "userModel");
      const oPayload = this.getView().getModel("userModel").getProperty("/"),
        oModel = this.getView().getModel("ModelV2");
      try {
        await this.createData(oModel, oPayload, "/IssueBooks");
        sap.m.MessageBox.success("Book Reserved");
        //this.getView().byId("idIssueBooks").getBinding("items").refresh();
        //this.oCreateBooksDialog.close();
      } catch (error) {
        //this.oCreateBooksDialog.close();
        sap.m.MessageBox.error("Some technical Issue");
      }
    },
    onLogoutPress2: function () {
        
      this.getOwnerComponent()
      .getRouter()
      .navTo("RouteView1");
  },    

  // onUserNote: function(oEvent) {
  //   this.odialogbox15 =  this.loadFragment("Usernotification");
  // },
  // onUserNote: async function () {
  //   if (!this.odialogbox2) {
  //     this.odialogbox2 = await this.loadFragment("Usernotification");
  //   }
  //   this.odialogbox2.open();
  // },

  onUserNote: function (oEvent) {
    var oButton = oEvent.getSource(),
      oView = this.getView();
      var userID = this.ID;
    // create popover
    if (!this._pPopover) {
      this._pPopover = this.loadFragment("Usernotification").then(function(oPopover) {
        oView.addDependent(oPopover);
        oPopover.bindElement(`/users(${userID})`);
        return oPopover;
      });
    }
    this._pPopover.then((oPopover) => {
      oPopover.openBy(oButton);
    });
  },

  // onItemClose: async function (oEvent){
  //   debugger
  //   var oItem3 = oEvent.getSource().getParent();
  //          oItem3.getBindingContext().delete("$auto");
  // }
   
    });
   
  }
);
