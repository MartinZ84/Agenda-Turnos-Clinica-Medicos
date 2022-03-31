var express = require("express");
var router = express.Router();
var espController = require("../controllers/especialidad");
const authController = require("../controllers/authController");

router.get(
  "/todas",
  authController.isAuthenticated,
  authController.isAuthorizated([1, 2, 3]),
  espController.allEspecialidades
);

router.get(
  "/",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  espController.verEspecialidades
);
// router.get("/:id", espController.espID);

router.get(
  "/agregarEspecialidad",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  espController.agregarEspecialidad
);
router.post(
  "/agregarEspecialidad",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  espController.insertarEspecialidad
);

router.post(
  "/addEspecialidad",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  espController.insertar
);

router.post(
  "/updateEspecialidad",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  espController.updateEspecialidad
);
router.post(
  "/deleteEspecialidad",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  espController.deleteEspecialidad
);
module.exports = router;
