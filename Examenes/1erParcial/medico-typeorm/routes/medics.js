const express = require("express");
const { body, param, query } = require("express-validator");
const validate = require("../middlewares/validateRequest");
const ctrl = require("../controllers/medicosCtrl");

const router = express.Router();

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  ctrl.list
);

router.get("/:id", [param("id").isInt()], validate, ctrl.getOne);

router.post(
  "/",
  [
    body("cedula_profesional").notEmpty().withMessage("cedula_profesional es requerido"),
    body("nombres").notEmpty(),
    body("apellidos").notEmpty(),
    body("especialidad").notEmpty(),
    body("anios_expericencia").notEmpty(),
    body("correo_electronico").notEmpty(),

  ],
  validate,
  ctrl.create
);

router.put(
  "/:id",
  validate,
  ctrl.update
);

router.delete("/:id", [param("id").isInt()], validate, ctrl.remove);

module.exports = router;
