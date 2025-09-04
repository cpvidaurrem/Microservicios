const { Product } = require("../models");
const { Op } = require("sequelize");

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q, brand } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (q) where.name = { [Op.like]: `%${q}%` };
    if (brand) where.brand = brand;

    const { rows, count } = await Product.findAndCountAll({
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
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, description, brand, stock } = req.body;
    const product = await Product.create({ name, description, brand, stock });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    await product.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };