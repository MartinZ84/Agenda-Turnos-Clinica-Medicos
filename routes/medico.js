var express = require("express");
var router = express.Router();
var medicoController = require("../controllers/medico");
var agendaController = require("../controllers/agenda");
var personaController = require("../controllers/persona");
var calendarioController = require("../controllers/calendario");
var turnoController = require("../controllers/turno");
const authController = require("../controllers/authController");

router.get(
  "/",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  medicoController.verMedicos
);

router.get(
  "/agregarMedico",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  medicoController.agregarMedico
);
router.get(
  "/esp/:EspId",
  authController.isAuthenticated,
  authController.isAuthorizated([1, 2, 3]),
  medicoController.medicosEsp
);

router.get(
  "/:id",
  authController.isAuthenticated,
  authController.isAuthorizated([1, 2, 3]),
  medicoController.medicoID
);

router.post(
  "/agregarMedico",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  medicoController.insertar
);

module.exports = router;
