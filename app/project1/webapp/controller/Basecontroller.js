sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/Fragment"
  ],
  function(Controller,Fragment) {
    "use strict";

    return Controller.extend("com.app.project1.controller.Base", {
      onInit: function() {
        
      },
      
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

      loadFragment: async function (sFragmentName) {
          const oFragment = await Fragment.load({
              id: this.getView().getId(),
              name: `com.app.project1.fragments.${sFragmentName}`,
              controller: this
          });
          this.getView().addDependent(oFragment);
          return oFragment
      },
      createData: function(oModel, oPayload, sPath){
        return new Promise((resolve, reject) => {
            oModel.create(sPath, oPayload, {
                refreshAfterChange: true,
                success: function(oSuccessData){
                    resolve(oSuccessData);
                },
                error: function(oErrorData){
                    reject(oErrorData)
                }
            })
        })
    },


    });
  }
);