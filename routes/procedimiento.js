var express = require("express");
var router = express.Router();
var proController = require("../controllers/procedimiento");
const authController = require("../controllers/authController");

router.get(
  "/",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  proController.verProcedimiento
);
router.get(
  "/agregarProcedimiento",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  proController.agregarProcedimiento
);

router.post(
  "/agregarProcedimiento",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  proController.createProcedimiento
);

router.post(
  "/updateProcedimiento",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  proController.updateProcedimiento
);
router.post(
  "/deleteProcedimiento",
  authController.isAuthenticated,
  authController.isAuthorizated([1]),
  proController.deleteProcedimiento
);

router.get("/todas", proController.proTodas);
// router.get("/agregar", proController.agregar);
// router.post("/agregar", proController.insertar);
router.get(
  "/:id",
  authController.isAuthenticated,
  authController.isAuthorizated([1, 2, 3]),
  proController.procedimientoID
);

module.exports = router;
