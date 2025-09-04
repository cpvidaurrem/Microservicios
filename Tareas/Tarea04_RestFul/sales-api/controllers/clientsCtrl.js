const { Client, Invoice } = require("../models");
const { Op } = require("sequelize");

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, ci, q } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (ci) where.ci = ci;
    if (q)
      where[Op.or] = [
        { firstName: { [Op.like]: `%${q}%` } },
        { lastName: { [Op.like]: `%${q}%` } },
      ];

    const { rows, count } = await Client.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["id", "ASC"]],
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
    const client = await Client.findByPk(req.params.id, {
      include: [{ model: Invoice, as: "invoices" }],
    });
    if (!client)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(client);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { ci, firstName, lastName, gender } = req.body;
    const client = await Client.create({ ci, firstName, lastName, gender });
    res.status(201).json(client);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "CI ya registrado" });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client)
      return res.status(404).json({ message: "Cliente no encontrado" });
    await client.update(req.body);
    res.json(client);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client)
      return res.status(404).json({ message: "Cliente no encontrado" });
    await client.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };
