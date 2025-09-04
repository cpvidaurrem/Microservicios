const express = require("express");
const { body, param, query } = require("express-validator");
const validate = require("../middlewares/validateRequest");
const ctrl = require("../controllers/invoicesCtrl");

const router = express.Router();

// List invoices, filter by clientId, dateFrom, dateTo
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("clientId").optional().isInt(),
  ],
  validate,
  ctrl.list
);

router.get("/:id", [param("id").isInt()], validate, ctrl.getOne);

router.post(
  "/",
  [body("date").notEmpty().isISO8601(), body("clientId").notEmpty().isInt()],
  validate,
  ctrl.create
);

router.put(
  "/:id",
  [
    param("id").isInt(),
    body("date").optional().isISO8601(),
    body("clientId").optional().isInt(),
  ],
  validate,
  ctrl.update
);

router.delete("/:id", [param("id").isInt()], validate, ctrl.remove);

module.exports = router;
