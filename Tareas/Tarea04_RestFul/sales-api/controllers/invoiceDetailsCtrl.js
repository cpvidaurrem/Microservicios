const { InvoiceDetail, Invoice, Product, sequelize } = require("../models");

const addDetail = async (req, res, next) => {
  // Añade detalle simple y decrementa stock dentro de una transacción
  const t = await sequelize.transaction();
  try {
    const { invoiceId, productId, quantity, price } = req.body;
    if (!invoiceId || !productId || !quantity || !price) {
      await t.rollback();
      return res
        .status(400)
        .json({
          message: "invoiceId, productId, quantity y price son requeridos",
        });
    }

    const invoice = await Invoice.findByPk(invoiceId, { transaction: t });
    if (!invoice) {
      await t.rollback();
      return res.status(404).json({ message: "Factura no encontrada" });
    }
    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    if (product.stock < quantity) {
      await t.rollback();
      return res.status(400).json({ message: "Stock insuficiente" });
    }

    const detail = await InvoiceDetail.create(
      { invoiceId, productId, quantity, price },
      { transaction: t }
    );

    // opcional: decrementar stock
    product.stock = product.stock - quantity;
    await product.save({ transaction: t });

    await t.commit();
    res.status(201).json(detail);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const getDetailsByInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const details = await InvoiceDetail.findAll({
      where: { invoiceId },
      include: [{ model: Product, as: "product" }],
    });
    res.json({ data: details });
  } catch (err) {
    next(err);
  }
};

const updateDetail = async (req, res, next) => {
  // Nota: este ejemplo no calcula/ajusta stock de forma compleja (solo reemplaza detalle).
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const { productId, quantity, price } = req.body;
    const detail = await InvoiceDetail.findByPk(id, { transaction: t });
    if (!detail) {
      await t.rollback();
      return res.status(404).json({ message: "Detalle no encontrado" });
    }

    // Si cambia product o quantity, deberías manejar stock (lógica adicional). Aquí hacemos un enfoque simple:
    if (productId && productId !== detail.productId) {
      // revertir stock del producto anterior y restar del nuevo producto
      const oldProduct = await Product.findByPk(detail.productId, {
        transaction: t,
      });
      const newProduct = await Product.findByPk(productId, { transaction: t });
      if (!newProduct) {
        await t.rollback();
        return res
          .status(404)
          .json({ message: "Nuevo producto no encontrado" });
      }
      // devolver stock al anterior
      oldProduct.stock += detail.quantity;
      // restar stock del nuevo
      if (newProduct.stock < (quantity || detail.quantity)) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "Stock insuficiente en nuevo producto" });
      }
      newProduct.stock -= quantity || detail.quantity;
      await oldProduct.save({ transaction: t });
      await newProduct.save({ transaction: t });
    } else if (
      typeof quantity !== "undefined" &&
      quantity !== detail.quantity
    ) {
      // ajustar stock del mismo producto
      const product = await Product.findByPk(detail.productId, {
        transaction: t,
      });
      const diff = quantity - detail.quantity; // si positivo, necesitamos más stock
      if (diff > 0 && product.stock < diff) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "Stock insuficiente para aumentar cantidad" });
      }
      product.stock -= diff;
      await product.save({ transaction: t });
    }

    await detail.update(
      {
        productId: productId || detail.productId,
        quantity: quantity || detail.quantity,
        price: price || detail.price,
      },
      { transaction: t }
    );
    await t.commit();
    res.json(detail);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const deleteDetail = async (req, res, next) => {
  // Eliminar detalle y devolver stock
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const detail = await InvoiceDetail.findByPk(id, { transaction: t });
    if (!detail) {
      await t.rollback();
      return res.status(404).json({ message: "Detalle no encontrado" });
    }
    const product = await Product.findByPk(detail.productId, {
      transaction: t,
    });
    if (product) {
      product.stock += detail.quantity;
      await product.save({ transaction: t });
    }
    await detail.destroy({ transaction: t });
    await t.commit();
    res.status(204).send();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

module.exports = { addDetail, getDetailsByInvoice, updateDetail, deleteDetail };
