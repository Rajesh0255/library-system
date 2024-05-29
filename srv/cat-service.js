const cds = require("@sap/cds");
 const { onBeforeBooksCreate} = require("./controller/adminOperations");

module.exports = cds.service.impl(async (srv) => {
    srv.before(["CREATE", "READ"], "Books", onBeforeBooksCreate)
    // srv.after(["READ"], "Employee", onAfterEmployeeCreate)
});