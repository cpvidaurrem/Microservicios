const express = require("express");
const { body, param, query } = require("express-validator");
const validate = require("../middlewares/validateRequest");
const ctrl = require("../controllers/clientsCtrl");

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
    body("ci").notEmpty().withMessage("ci es requerido"),
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("gender").optional().isIn(["M", "F", "O"]),
  ],
  validate,
  ctrl.create
);

router.put(
  "/:id",
  [param("id").isInt(), body("gender").optional().isIn(["M", "F", "O"])],
  validate,
  ctrl.update
);

router.delete("/:id", [param("id").isInt()], validate, ctrl.remove);

module.exports = router;
