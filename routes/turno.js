var express = require("express");
var router = express.Router();
var medicoController = require("../controllers/medico");
var agendaController = require("../controllers/agenda");
var personaController = require("../controllers/persona");
var calendarioController = require("../controllers/calendario");
var turnoController = require("../controllers/turno");
const authController = require("../controllers/authController");

router.get(
  "/secretarioTurnos",
  authController.isAuthenticated,
  authController.isAuthorizated([2]),
  turnoController.secretarioTurnos
);

router.get(
  "/misTurnos",
  authController.isAuthenticated,
  authController.isAuthorizated([3]),
  turnoController.misTurnos
);
router.get(
  "/calendario/:idCalendario",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  turnoController.turnosDisponibles
);
router.get("/allTurnos", turnoController.allTurnos);

router.post(
  "/reservarTurno",
  authController.isAuthenticated,
  authController.isAuthorizated([3, 2]),
  turnoController.reserva
);
router.get(
  "/reservarTurno?",
  authController.isAuthenticated,
  authController.isAuthorizated([3, 2]),
  turnoController.reserva
);
router.get(
  "/buscarAgenda",
  authController.isAuthenticated,
  authController.isAuthorizated([3, 2]),
  turnoController.buscarAgenda
);

router.post(
  "/buscarTurno",
  authController.isAuthenticated,
  authController.isAuthorizated([3, 2]),
  turnoController.buscarTurno
);

router.post(
  "/cambiarEstado",
  authController.isAuthenticated,
  authController.isAuthorizated([3, 2]),
  turnoController.cambiarEstado
);

router.get(
  "/confirmarTurno/:idTurno",
  authController.isAuthenticated,
  authController.isAuthorizated([2, 3]),
  turnoController.confirmarTurno
);

router.get(
  // "/verTurno/:idTurno",
  "/verTurno/?",
  authController.isAuthenticated,
  authController.isAuthorizated([2, 3]),
  turnoController.verTurno
);
module.exports = router;
