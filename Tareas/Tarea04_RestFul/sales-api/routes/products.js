const express = require("express");
const { body, param, query } = require("express-validator");
const validate = require("../middlewares/validateRequest");
const ctrl = require("../controllers/productsCtrl");

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
    body("name").notEmpty().withMessage("name es requerido"),
    body("stock").optional().isInt({ min: 0 }),
  ],
  validate,
  ctrl.create
);

router.put(
  "/:id",
  [param("id").isInt(), body("stock").optional().isInt({ min: 0 })],
  validate,
  ctrl.update
);

router.delete("/:id", [param("id").isInt()], validate, ctrl.remove);

module.exports = router;
