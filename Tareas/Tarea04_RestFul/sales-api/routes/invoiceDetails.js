const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middlewares/validateRequest");
const ctrl = require("../controllers/invoiceDetailsCtrl");

const router = express.Router();

router.post(
  "/",
  [
    body("invoiceId").notEmpty().isInt(),
    body("productId").notEmpty().isInt(),
    body("quantity").notEmpty().isInt({ min: 1 }),
    body("price").notEmpty().isFloat({ gt: 0 }),
  ],
  validate,
  ctrl.addDetail
);

router.get(
  "/invoice/:invoiceId",
  [param("invoiceId").isInt()],
  validate,
  ctrl.getDetailsByInvoice
);

router.put(
  "/:id",
  [
    param("id").isInt(),
    body("productId").optional().isInt(),
    body("quantity").optional().isInt({ min: 1 }),
    body("price").optional().isFloat({ gt: 0 }),
  ],
  validate,
  ctrl.updateDetail
);

router.delete("/:id", [param("id").isInt()], validate, ctrl.deleteDetail);

module.exports = router;
