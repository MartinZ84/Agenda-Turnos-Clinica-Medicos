var express = require("express");
var router = express.Router();
var clinicaController = require("../controllers/clinica");
const authController = require("../controllers/authController");

router.get(
  "/",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  clinicaController.verClinicas
);
router.get(
  "/agregarClinica",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  clinicaController.agregarClinica
);

router.post("/agregarClinica", clinicaController.createClinica);

router.post(
  "/updateClinica",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  clinicaController.updateClinica
);
router.post(
  "/deleteClinica",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  clinicaController.deleteClinica
);

router.get(
  "/:id",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  clinicaController.clincaID
);

router.get(
  "/todas",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  clinicaController.clinicaTodas
);

module.exports = router;
