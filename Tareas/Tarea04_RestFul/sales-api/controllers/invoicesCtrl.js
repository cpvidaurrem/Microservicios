const {
  Invoice,
  Client,
  InvoiceDetail,
  Product,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, clientId, dateFrom, dateTo } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (clientId) where.clientId = clientId;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date[Op.gte] = dateFrom;
      if (dateTo) where.date[Op.lte] = dateTo;
    }

    const { rows, count } = await Invoice.findAndCountAll({
      where,
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "ci", "firstName", "lastName"],
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [["date", "DESC"]],
    });

    res.json({
      data: rows,
      meta: { total: count, page: parseInt(page), limit: parseInt(limit) },
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: Client, as: "client" },
        {
          model: InvoiceDetail,
          as: "details",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });
    if (!invoice)
      return res.status(404).json({ message: "Factura no encontrada" });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  // Crea factura simple (sin detalles). Si quieres crear factura con detalles en una sola llamada, usar transacción y endpoint específico.
  try {
    const { date, clientId } = req.body;
    if (!date || !clientId)
      return res
        .status(400)
        .json({ message: "date y clientId son requeridos" });
    const client = await Client.findByPk(clientId);
    if (!client) return res.status(400).json({ message: "Cliente no existe" });

    const invoice = await Invoice.create({ date, clientId });
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice)
      return res.status(404).json({ message: "Factura no encontrada" });
    await invoice.update(req.body);
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice)
      return res.status(404).json({ message: "Factura no encontrada" });
    await invoice.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };
