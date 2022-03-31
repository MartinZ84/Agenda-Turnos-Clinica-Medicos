var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
var EstaAutenticado = require("./auth").EstaAutenticado;
var passport = require("passport");

// /* GET home page. */

// //AUTENTICAR CON GITHUB
// router.get("/github", passport.authenticate("github"));
// router.get(
//   "/github/callback",
//   //console.log("Aca estoy en /github/callback"),
//   passport.authenticate("github", { failureRedirect: "/error" }),
//   function (req, res) {
//     res.redirect(301, "/medicos");
//   }
// );

// router.post("/error", function (req, res) {
//   res.send("Ocurrio un error al validar en github");
// });
// /// FIN DE GITHUB

//router para las vistas
router.get("/", authController.isAuthenticated, (req, res) => {
  console.log(
    "*************authController.isAuthenticated****************************"
  );
  console.log(req.user);
  if (req.user[0]) {
    console.log("dentro de if undefinied :    *****" + req.user[0]);
    req.user = req.user[0];
  }
  res.render("index", {
    title: "Cuyana medical",
    pretty: true,
    user: req.user,
    persona: req.persona,
  });
});

router.get("/login", (req, res) => {
  res.render("login", { pretty: true, alert: false });
});

router.get("/register", (req, res) => {
  res.render("register");
});

//router para los métodos del controller
router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/logout", authController.isAuthenticated, authController.logout);

module.exports = router;
