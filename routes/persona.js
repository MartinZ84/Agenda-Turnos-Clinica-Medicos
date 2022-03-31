var express = require("express");
var router = express.Router();
var personaController = require("../controllers/persona");
const authController = require("../controllers/authController");

/* GET home page. */

router.get(
  "/",
  authController.isAuthenticated,
  authController.isAuthorizated([1, 2]),
  personaController.listaPersonas
);
router.get(
  "/perfil/:personaId",
  authController.isAuthenticated,
  authController.isAuthorizated([1, 2, 3]),
  personaController.cargarPerfil
);
router.get("/personasConUsuPaciente", personaController.personasConUsuPaciente);
router.get("/personasSinRelacion", personaController.personasSinRelacion);
router.get("/agregar", personaController.agregar);

router.get(
  "/agregarPersona",
  authController.isAuthenticated,
  authController.isAuthorizated([1, 2]),
  personaController.agregarPersona
);

router.post(
  "/agregar",
  authController.isAuthenticated,
  authController.isAuthorizated([1, 2]),
  personaController.insertar
);
router.post("/update", personaController.update);

module.exports = router;
