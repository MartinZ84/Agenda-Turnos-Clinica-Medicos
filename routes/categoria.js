var express = require("express");
var categoriaCotroller = require("../controllers/categoria");
var router = express.Router();
const authController = require("../controllers/authController");

/* GET home page. */
router.get(
  "/",
  authController.isAuthenticated,
  authController.isAuthorizated(["Admin"]),
  categoriaCotroller.verCategorias
);

router.get(
  "/agregarCategoria",
  authController.isAuthenticated,
  authController.isAuthorizated(["Admin"]),
  categoriaCotroller.agregarCategoria
);
router.post(
  "/createCategoria",
  authController.isAuthenticated,
  authController.isAuthorizated(["Admin"]),
  categoriaCotroller.createCategoria
);
router.post(
  "/updateCategoria",
  authController.isAuthenticated,
  authController.isAuthorizated(["Admin"]),
  categoriaCotroller.updateCategoria
);
router.get(
  "/deleteCategoria/:id",
  authController.isAuthenticated,
  authController.isAuthorizated(["Admin"]),
  categoriaCotroller.deleteCategoria
);

module.exports = router;
