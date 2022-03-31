var express = require("express");
var router = express.Router();
var passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models").User;

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  // console.log("HOLA Aca estoy en /github/callback"),
  passport.authenticate("github", { failureRedirect: "/auth/error" }),
  function (req, res) {
    res.redirect(301, "/");
  }
);

router.post("/error", function (req, res) {
  res.send("Ocurrio un error al validar en github");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  req.logout();
  res.redirect("/");
});

//Defino un middleware para autenticacion
var EstaAutenticado = function (req, res, next) {
  // Passport agrega este método al objeto request.
  console.log(req.isAuthenticated() + "---" + req.user[0].nombre);
  if (req.user) {
    req.user = req.user;
    return next();
  }
  // si el usuario no esta autenticado entonces lo redirigimos a donde tengo el login
  res.redirect("/");
};

module.exports = router;
module.exports.EstaAutenticado = EstaAutenticado;
