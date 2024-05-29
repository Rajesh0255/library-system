sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel"
    ],
    function(Controller,MessageToast,JSONModel) {
      "use strict";
  
      return Controller.extend("com.app.project1.controller.user", {
        onInit: function() {
          const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);


        const newBorrowModel = new JSONModel({
          author          : "",
          title           : "",
          ISBN            : "",
          DueDate         : ""
      });

        },
        
        onUserDetailsLoad: function(oEvent ){
          const {id} = oEvent.getParameter("arguments");
          this.ID = id;
          // const sRouterName = oEvent.getParameter("name");
          const oObjectPage = this.getView().byId("ObjectPageLayout");
   
          oObjectPage.bindElement(`/users(${id})`);
      },
      onBorrowNewBookPress: async function () {
        debugger
        var oSelected = this.byId("idBooksTable").getSelectedItem();
        if (oSelected) {
            // var oBook = oSelected.getBindingContext().getObject().ID;
            var oAuthorName = oSelected.getBindingContext().getObject().author
            var oBookname = oSelected.getBindingContext().getObject().title
            // var oStock = oSelected.getBindingContext().getObject().quantity
            var oISBN = oSelected.getBindingContext().getObject().ISBN

            const newBorrowModel = new JSONModel({
              Books: {
                authorName      : oAuthorName,
                title           : oBookname,
                ISBN            : oISBN,
              },
             DueDate         : "2024-2-3"
            });
            this.getView().setModel(newBorrowModel, "newBorrowModel");
            // var oContext = this.getView().byId("idUserActiveLoanTable").getBinding("items")
            const oModel = this.getView().getModel("ModelV2") 
            var oNewBook = this.getView().getModel("newBorrowModel").getData();
            oModel.create("/users",oNewBook, {
                sucess: function () {
                    MessageToast.show("Book created successfully");
                },
                error: function () {
                    MessageToast.show("Error creating book");
                }
            });
        }
        else {
            MessageToast.show("Select a Book to Borrow")
        }

    },

      
      });
      
    }
  );