sap.ui.define(
  [
    "./Basecontroller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    Token,
    JSONModel,
    MessageToast,
    MessageBox
  ) {
    "use strict";

    return Controller.extend("com.app.project1.controller.admin", {
      onInit: function () {

        debugger
        const oLocalModel = new sap.ui.model.json.JSONModel({
          title: "",
          author: "",
          ISBN: "",
          quantity: 0,
          Aquantity: 0


        });


        this.getView().setModel(oLocalModel, "localModel");
        this.getRouter().attachRoutePatternMatched(this.onBookListLoad, this);


        const oView1 = this.getView();
        const oMulti1 = oView1.byId("idAuthorFilterValue");
        const oMulti2 = oView1.byId("idTitleFilterValue");
        const oMulti3 = oView1.byId("idISBNFilterValue");



        let validae = function (arg) {
          if (true) {
            var text = arg.text;
            return new Token({ key: text, text: text });
          }
        };
        oMulti1.addValidator(validae);
        oMulti2.addValidator(validae);
        oMulti3.addValidator(validae);
      },

      onGoPress: function (ev) {
        const oView = this.getView(),
          oauthorFilter = oView.byId("idAuthorFilterValue"),
          oTitleFilter = oView.byId("idTitleFilterValue"),
          oISBNFilter = oView.byId("idISBNFilterValue"),

          sauthor = oauthorFilter.getTokens(),
          sTitle = oTitleFilter.getTokens(),
          sISBN = oISBNFilter.getTokens(),
          oTable = oView.byId("idBooksTable"),
          bFilters = [];
        sauthor.filter((ele) => {
          ele
            ? bFilters.push(
              new Filter("author", FilterOperator.EQ, ele.getKey())
            )
            : "";
        });
        sTitle.filter((ele) => {
          ele
            ? bFilters.push(
              new Filter("title", FilterOperator.EQ, ele.getKey())
            )
            : "";
        });
        sISBN.filter((ele) => {
          ele
            ? bFilters.push(
              new Filter("ISBN", FilterOperator.EQ, ele.getKey())
            )
            : "";
        });



        oTable.getBinding("items").filter(bFilters);
      },
      onCreateBtnPress: async function () {
        if (!this.odialogbox2) {
          this.odialogbox2 = await this.loadFragment("Create");
        }
        this.odialogbox2.open();
      },
      onActiveloans: async function () {
        if (!this.odialogbox3) {
          this.odialogbox3 = await this.loadFragment("activeloans");
        }
        this.odialogbox3.open();
      },

      onEditBtnPress: async function () {
        debugger
        var oSelected = this.byId("idBooksTable").getSelectedItem();

        if (oSelected != null) {
          var oID = oSelected.getBindingContext().getProperty("ID");
          var oAuthorName = oSelected.getBindingContext().getProperty("author");
          var oBookname = oSelected.getBindingContext().getProperty("title");
          var oStock = oSelected.getBindingContext().getProperty("quantity");
          var oISBN = oSelected.getBindingContext().getProperty("ISBN");
          var oAquantity = oSelected.getBindingContext().getProperty("Aquantity");
          var newBookModel = new sap.ui.model.json.JSONModel({
            ID: oID,
            author: oAuthorName,
            title: oBookname,
            quantity: oStock,
            Aquantity: oAquantity,
            ISBN: oISBN,

          });
          this.getView().setModel(newBookModel, "newBookModel");

          if (!this.oEditbox) {
            this.oEditbox = await this.loadFragment("edit");
          }
          this.oEditbox.open();
        }
        else {
          MessageToast.show("Select Any Book");
        }
      },
      onCancelEdit: function () {
        if (this.oEditbox.isOpen()) {
          this.oEditbox.close();
        }
        // location.reload();
      },

      onSave: function () {
        debugger
        var oPayload = this.getView().getModel("newBookModel").getData();
        var AQ1 = oPayload.Aquantity;
        var Q1 = parseInt(oPayload.quantity);
        if (AQ1 > Q1) {
          var A2 = A1 - Q1;
          var AQ2 = A1 - A2;
          oPayload.Aquantity = AQ2;
          this.getView().getModel("newBookModel").setData(oPayload);
        }
        else if (AQ1 < Q1) {
          var A2 = Q1 - AQ1;

          var B2 = AQ1 + A2;
          oPayload.Aquantity = B2;
          this.getView().getModel("newBookModel").setData(oPayload);
        }
        var oDataModel = this.getOwnerComponent().getModel("ModelV2");// Assuming this is your OData V2 model
        console.log(oDataModel.getMetadata().getName());

        try {
          // Assuming your update method is provided by your OData V2 model
          oDataModel.update("/Books(" + oPayload.ID + ")", oPayload, {
            success: function () {
              this.getView().byId("idBooksTable").getBinding("items").refresh();
              // MessageToast.show("Edited successful!");
              this.oEditbox.close();
            }.bind(this),
            error: function (oError) {
              this.oEditbox.close();
              sap.m.MessageBox.error("Failed to update book: " + oError.message);
            }.bind(this)
          });
        } catch (error) {
          this.oEditbox.close();
          sap.m.MessageBox.error("Some technical Issue");
        }


        // var oDataModel = new sap.ui.model.odata.v2.ODataModel({
        //   serviceUrl: "https://port4004-workspaces-ws-v8smf.us10.trial.applicationstudio.cloud.sap/v2/odata/v4/catalog/Books",
        //   defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
        //   // Configure message parser
        //   messageParser: sap.ui.model.odata.ODataMessageParser
        // })
      },








      //for closing the ActiveLoans popup...
      onCloseActiveLoans: function () {


      },
      onCancelDialog2: function () {
        if (this.odialogbox2.isOpen()) {
          this.odialogbox2.close();
        }
        // location.reload();
      },

      onCloseActiveLoans: function () {
        if (this.odialogbox3.isOpen()) {
          this.odialogbox3.close();
        }

        // location.reload();
      },




      onConfirm: async function () {
        // Get the input fields
        var oTitleInput = this.byId("idtitleInput");
        var oAuthorInput = this.byId("idAuthorInput");
        var oISBNInput = this.byId("idISBNInput");
        var oQuantityInput = this.byId("idQuantityInput");

        // Get input values
        var sTitle = oTitleInput.getValue();
        var sAuthor = oAuthorInput.getValue();
        var sISBN = oISBNInput.getValue();
        var sQuantity = oQuantityInput.getValue();

        // Check if quantity is greater than 0
        if (!sTitle || !sAuthor || !sISBN || !sQuantity) {
          if (!sTitle) {
            oTitleInput.setValueState("Error");
            oTitleInput.setValueStateText("Title is required");
          } else {
            oTitleInput.setValueState("None");
          }

          if (!sAuthor) {
            oAuthorInput.setValueState("Error");
            oAuthorInput.setValueStateText("Author is required");
          } else {
            oAuthorInput.setValueState("None");
          }

          if (!sISBN) {
            oISBNInput.setValueState("Error");
            oISBNInput.setValueStateText("ISBN is required");
          } else {
            oISBNInput.setValueState("None");
          }

          if (!sQuantity) {
            oQuantityInput.setValueState("Error");
            oQuantityInput.setValueStateText("Quantity is required");
          } else {
            oQuantityInput.setValueState("None");
          }

          sap.m.MessageToast.show("Please correct the errors and try again.");
          return;
        }

        // Check if quantity is greater than 0
        if (parseInt(sQuantity) <= 0) {
          oQuantityInput.setValueState("Error");
          oQuantityInput.setValueStateText("Quantity must be greater than 0");
          sap.m.MessageToast.show("Please correct the errors and try again.");
          return;
        }

        // Reset value states if all fields are valid
        oTitleInput.setValueState("None");
        oAuthorInput.setValueState("None");
        oISBNInput.setValueState("None");
        oQuantityInput.setValueState("None");

        const oPayload = this.getView().getModel("localModel").getProperty("/"),
          oModel = this.getView().getModel("ModelV2");

        oPayload.Aquantity = oPayload.quantity;
        this.getView().getModel("localModel").setData(oPayload);
        try {
          await this.createData(oModel, oPayload, "/Books");
          this.getView().byId("idBooksTable").getBinding("items").refresh();
          this.odialogbox2.close();
        } catch (error) {
          this.odialogbox2.close();
          sap.m.MessageBox.error("Some technical Issue");
        }
      },
      onBookListLoad: function () {
        this.getView().byId("idBooksTable").getBinding("items").refresh();

      },
      onDeleteBtnPress: async function () {
        debugger
        var oSelected = this.byId("idBooksTable").getSelectedItem();
        var otitle = oSelected.getBindingContext().getObject().title;

        MessageBox.warning("Do You Want To delete ?"+otitle+"Book", {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          emphasizedAction: MessageBox.Action.OK,
          onClose: async function (sAction) {
            debugger
            if(sAction == "OK"){
           if (oSelected) {
          

          oSelected.getBindingContext().delete("$auto").then(function () {
            MessageToast.show(otitle + " SuccessFully Deleted");
          },
            function (oError) {
              MessageToast.show("Deletion Error: ", oError);
            });
          this.getView().byId("idBooksTable").getBinding("items").refresh();

        };

            }
            else{
              MessageToast.show(  sAction);
            }
           
          },
          dependentOn: this.getView()
        });
      },

      // onDeleteBtnPress: async function () {

      //   var oSelected = this.byId("idBooksTable").getSelectedItem();
      //   if (oSelected) {
      //     var oISBN = oSelected.getBindingContext().getObject().ISBN;

      //     oSelected.getBindingContext().delete("$auto").then(function () {
      //       MessageToast.show(oISBN + " SuccessFully Deleted");
      //     },
      //       function (oError) {
      //         MessageToast.show("Deletion Error: ", oError);
      //       });
      //     this.getView().byId("idBooksTable").getBinding("items").refresh();

      //   } else {
      //     MessageToast.show("Please Select a Row to Delete");
      //   }
      // },
      onClearFilterPress: function () {
        const oView = this.getView(),
          oTitleFilter = oView.byId("idTitleFilterValue"),
          sTitle = oTitleFilter.removeAllTokens(),
          oAuthorFilter = oView.byId("idAuthorFilterValue"),
          sauthor = oAuthorFilter.removeAllTokens(),
          oIsbnFilter = oView.byId("idISBNFilterValue"),
          sISBN = oIsbnFilter.removeAllTokens();

      },

      onIssueBooks: async function () {
        if (!this.oissuebooks) {
          this.oissuebooks = await this.loadFragment("Issue2");
        }
        this.oissuebooks.open();
      },
      //   onAccept: async function (oEvent) {

      //     if(this.byId("idIssueBooksTable").getSelectedItems().length>1){
      //         MessageToast.show("Please Select only one Book");
      //         return
      //     }
      //     var oSelectedBook=this.byId("idIssueBooksTable").getSelectedItem().getBindingContext().getObject()
      //     var oAval=parseInt(oSelectedBook.book1.Aquantity)-1
      //     console.log(oSelectedBook);
      //     var now = new Date();
      //                 if (now.getMonth() == 11) {
      //                     var current = new Date(now.getFullYear() + 1, 0, 1);
      //                 } else {
      //                     var current = new Date(now.getFullYear(), now.getMonth() + 1);
      //                     console.log(current)
      //                 }
      //     debugger
      //     const userModel = new sap.ui.model.json.JSONModel({
      //         book_ID : oSelectedBook.book1.ID,
      //         user_ID: oSelectedBook.user1.ID,
      //         issuedate: new Date(),
      //         returndate: current,
      //         book:{
      //           Aquantity:oAval
      //       }
      //     });
      //     this.getView().setModel(userModel, "userModel");

      //     const oPayload = this.getView().getModel("userModel").getProperty("/"),
      //         oModel = this.getView().getModel("ModelV2");

      //     try {
      //         await this.createData(oModel, oPayload, "/bookloans");
      //         sap.m.MessageBox.success("Book Accepted");
      //         oModel.update("/Books(" + oSelectedBook.book1.ID + ")", oPayload.book, {
      //           success: function() {
      //               // this.getView().byId("idBooksTable").getBinding("items").refresh();
      //               //this.oEditBooksDialog.close();
      //               var oSelected = this.byId("idIssueBooksTable").getSelectedItem();
      //   if (oSelected) {
      //     var oISBN = oSelected.getBindingContext().getObject().ISBN;

      //     oSelected.getBindingContext().delete("$auto").then(function () {
      //       MessageToast.show(oISBN + " SuccessFully Deleted");
      //     },
      //       function (oError) {
      //         MessageToast.show("Deletion Error: ", oError);
      //       });
      //     this.getView().byId("idIssueBooksTable").getBinding("items").refresh();

      //   } else {
      //     MessageToast.show("Please Select a Row to Delete");
      //   }
      //           },
      //           error: function(oError) {
      //               //this.oEditBooksDialog.close();
      //               sap.m.MessageBox.error("Failed to update book: " + oError.message);
      //           }.bind(this)
      //       });
      //         //this.getView().byId("idIssueBooksTable").getBinding("items").refresh();
      //         //this.oCreateBooksDialog.close();
      //     } catch (error) {
      //         //this.oCreateBooksDialog.close();
      //         sap.m.MessageBox.error("Some technical Issue");
      //     }
      // },

      onAcceptPress: async function (oEvent) {
        debugger
          var oItem = oEvent.getSource().getParent().getBindingContext().getObject();
          var oItem2 = oEvent.getSource().getParent();
         
          
          var oAval = parseInt(oItem.book1.Aquantity) - 1
          console.log(oItem);
          var now = new Date();
          if (now.getMonth() == 11) {
            var current = new Date(now.getFullYear() + 1, 0, 1);
          } else {
            var current = new Date(now.getFullYear(), now.getMonth() + 1);
            console.log(current)
          }
          debugger
         
          const userModel = new sap.ui.model.json.JSONModel({
            book_ID: oItem.book1.ID,
            user_ID: oItem.user1.ID,
            issuedate: new Date(),
            
            returndate: current,
            book: {
              Aquantity: oAval
            }
          });
          var oDate = new Date();
          var sCurrentTime = oDate.toTimeString().split(' ')[0]; // Format time as HH:MM:SS
          var sCurrentDate = oDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long' }); // Format date as day month (e.g., 14 June)
          const userModel2 = new sap.ui.model.json.JSONModel({
                  Notifytype : "Accepted",
                  time:sCurrentTime ,
                  date:sCurrentDate,
                  priority:"Low",
                  BookDetails_ID: oItem.book1.ID,
                  UserDetails_ID: oItem.user1.ID,
                  
                 
                });


          this.getView().setModel(userModel, "userModel");
          const oPayload = this.getView().getModel("userModel").getProperty("/"),
            oModel = this.getView().getModel("ModelV2");

            this.getView().setModel(userModel2, "userModel2");
            const oPayload2 = this.getView().getModel("userModel2").getProperty("/"),
             oModel2 = this.getView().getModel("ModelV2");


          try {
            await this.createData(oModel, oPayload, "/bookloans");
            await  this.createData(oModel2, oPayload2, "/Notify");
            oItem2.getBindingContext().delete("$auto");
            sap.m.MessageBox.success("Book Accepted");
            oModel.update("/Books(" + oItem.book1.ID + ")", oPayload.book, {
              success: function () {
               
              },
              error: function (oError) {
               
                sap.m.MessageBox.error("Failed to update book: " + oError.message);
              }.bind(this)
            });
            
            
            
          } catch (error) {
            
            sap.m.MessageBox.error("Some technical Issue");
          }
        },
  



     
      // onAcceptPress: async function (oEvent) {
      //   debugger
      //     var oItem = oEvent.getSource().getParent().getBindingContext().getObject();
      //     var oItem2 = oEvent.getSource().getParent();
         
  
         

      //     debugger
         
      //     var oDate = new Date();
      //     var sCurrentTime = oDate.toTimeString().split(' ')[0]; // Format time as HH:MM:SS
      //     var sCurrentDate = oDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  
      //     const userModel2 = new sap.ui.model.json.JSONModel({
      //       Notifytype : "Accepted",
      //       time:sCurrentTime ,
      //       date:sCurrentDate,
      //       BookDetails_ID: oItem.book1.ID,
      //       UserDetails_ID: oItem.user1.ID,
            
           
      //     });
      //     // this.getView().setModel(userModel, "userModel");
      //     this.getView().setModel(userModel2, "userModel2");
  
      //     // const oPayload = this.getView().getModel("userModel").getProperty("/"),
      //     //   oModel = this.getView().getModel("ModelV2");
      //     const oPayload2 = this.getView().getModel("userModel2").getProperty("/"),
      //       oModel2 = this.getView().getModel("ModelV2");
  
      //     try {
      //       // await this.createData(oModel, oPayload, "/bookloans");
      //       await  this.createData(oModel2, oPayload2, "/Notify");
                
      //       oItem2.getBindingContext().delete("$auto");
      //       sap.m.MessageBox.success("Book Accepted");
  
            
            
            
      //     } catch (error) {
      //       //this.oCreateBooksDialog.close();
      //       sap.m.MessageBox.error("Some technical Issue");
      //     }
      //   },

      onCancleIssue: async function (oEvent) {
        debugger
         var oItem2 = oEvent.getSource().getParent();
         var oItem3 = oEvent.getSource().getParent().getBindingContext().getObject();
         var oDate = new Date();
          var sCurrentTime = oDate.toTimeString().split(' ')[0]; // Format time as HH:MM:SS
          var sCurrentDate = oDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long' }); // Format date as day month (e.g., 14 June)
          const userModel3 = new sap.ui.model.json.JSONModel({
                  Notifytype : "Rejected",
                  time:sCurrentTime ,
                  date:sCurrentDate,
                  priority:"High",
                  BookDetails_ID: oItem3.book1.ID,
                  UserDetails_ID: oItem3.user1.ID,
                  
                 
                });
                this.getView().setModel(userModel3, "userModel3");
                const oPayload3 = this.getView().getModel("userModel3").getProperty("/"),
                 oModel3 = this.getView().getModel("ModelV2");
                 this.createData(oModel3, oPayload3, "/Notify");
         if (oItem3) {
           var oISBN = oItem3.book1.ISBN;
           oItem2.getBindingContext().delete("$auto").then(function () {
             MessageToast.show(oISBN + " Rejected");
           },
             function (oError) {
               MessageToast.show("Deletion Error: ", oError);
             });
           this.oEvent.getSource().getParent().getBinding("items").refresh();
         } else {
           MessageToast.show("Please Select a Row to Delete");
         }
       },
 

      // onDelete: async function () {

      //   var oSelected = this.byId("idIssueBooksTable").getSelectedItem();
      //   if (oSelected) {
      //     var oISBN = oSelected.getBindingContext().getObject().ISBN;

      //     oSelected.getBindingContext().delete("$auto").then(function () {
      //       MessageToast.show(oISBN + " SuccessFully Deleted");
      //     },
      //       function (oError) {
      //         MessageToast.show("Deletion Error: ", oError);
      //       });
      //     this.getView().byId("idIssueBooksTable").getBinding("items").refresh();

      //   } else {
      //     MessageToast.show("Please Select a Row to Delete");
      //   }
      // },

      onClearLoans: async function () {

        var oSelected = this.byId("myTable").getSelectedItem();
        debugger
        var obj = this.byId("myTable").getSelectedItem().getBindingContext().getObject();
        console.log(obj);
        var oId = obj.book.ID
        var oAvaiable = obj.book.Aquantity + 1;
        var aSelectedItems = this.byId("myTable").getSelectedItems();
        console.log()
        const userModel = new sap.ui.model.json.JSONModel({

          book: {
            Aquantity: oAvaiable
          }

        });
        this.getView().setModel(userModel, "userModel");

        const oPayload = this.getView().getModel("userModel").getProperty("/"),
          oModel = this.getView().getModel("ModelV2");
        try {
          oModel.update("/Books(" + oId + ")", oPayload.book, {
            success: function () {
              this.getView().byId("myTable").getBinding("items").refresh();//
              //this.oEditBooksDialog.close();
            },
            error: function (oError) {
              //this.oEditBooksDialog.close();
              sap.m.MessageBox.error("Failed to update book: " + oError.message);
            }.bind(this)
          });
        } catch (error) {
          //this.oCreateBooksDialog.close();
          sap.m.MessageBox.error("Some technical Issue");
        }
        if (oSelected) {
          var oISBN = oSelected.getBindingContext().getObject().ISBN;

          oSelected.getBindingContext().delete("$auto").then(function () {
            MessageToast.show(oISBN + " SuccessFully Deleted");
          },
            function (oError) {
              MessageToast.show("Deletion Error: ", oError);
            });
          this.getView().byId("myTable").getBinding("items").refresh();

        } else {
          MessageToast.show("Please Select a Row to Delete");
        }
      },
      onLogoutPress: function () {
        
        this.getOwnerComponent()
        .getRouter()
        .navTo("RouteView1");
    },
    oncancelbtn: function () {
      if (this.oissuebooks.isOpen()) {
        this.oissuebooks.close();
      }

      // location.reload();
    },
  //   setHeaderContext: function () {
  //     var oView = this.getView();
  //     oView.byId("Bookstitle").setBindingContext(
  //         oView.byId("_IDGenTable1").getBinding("items").getHeaderContext());
  // },

  onNotification: function (oEvent) {
    var oButton = oEvent.getSource(),
      oView = this.getView();

    // create popover
    if (!this._pPopover) {
      this._pPopover = this.loadFragment("Issue3").then(function(oPopover) {
        oView.addDependent(oPopover);
        oPopover.bindElement("");
        return oPopover;
      });
    }
    this._pPopover.then(function(oPopover) {
      oPopover.openBy(oButton);
    });
  },

    });
  }
);
