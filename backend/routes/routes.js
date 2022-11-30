module.exports = (app) => {
    const user = require("../controller/user.controller");

    var router = require("express").Router();

    router.post("/signup", user.create);
    router.post("/authenticate", user.authenticate);

    app.use("/", router);

}