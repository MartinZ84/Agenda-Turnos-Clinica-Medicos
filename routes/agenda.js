var express = require("express");
var router = express.Router();
var medicoController = require("../controllers/medico");
var agendaController = require("../controllers/agenda");
var personaController = require("../controllers/persona");
var calendarioController = require("../controllers/calendario");
var turnoController = require("../controllers/turno");
const authController = require("../controllers/authController");

router.get("/medico/:MedId", agendaController.agendasMed);
router.get("/procedimiento/:ProId", agendaController.agendasPro);
router.get(
  "/",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  agendaController.listarAgenda
);

router.get(
  "/agregarAgenda",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  agendaController.crearAgenda
);
router.post(
  "/agregarAgenda",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  agendaController.insertarAgenda
);

router.get(
  "/clinicaTodas",
  authController.isAuthenticated,
  authController.isAuthorizated([1, 2, 3]),
  agendaController.clinicaTodas
);

router.get("/agenda/:AgendaId", calendarioController.calendarioAgenda);

router.get(
  "/agregarDia/:AgendaId",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  calendarioController.agregarCal
);
router.post(
  "/agregarDia",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  calendarioController.insertarCal
);

module.exports = router;
