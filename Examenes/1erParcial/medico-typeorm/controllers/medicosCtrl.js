const { Medic, Invoice } = require("../entity");
const { Op } = require("sequelize");

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, cedula_profesional, q } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (cedula_profesional) where.cedula_profesional = cedula_profesional;
    if (q)
      where[Op.or] = [
        { nombres: { [Op.like]: `%${q}%` } },
        { apellidos: { [Op.like]: `%${q}%` } },
      ];

    const { rows, count } = await Medic.findAndCountAll({
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
    if (!Medic)
      return res.status(404).json({ message: "Medice no encontrado" });
    res.json(Medic);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { cedula_profesional, nombres, apellidos, especialidad, anios_experiencia, correo_electronico } = req.body;
    const Medic = await Medic.create({
      cedula_profesional,
      nombres,
      apellidos,
      especialidad, 
      anios_experiencia, 
      correo_electronico,
    });
    res.status(201).json(Medic);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "cedula_profesional ya registrado" });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const Medic = await Medic.findByPk(req.params.id);
    if (!Medic)
      return res.status(404).json({ message: "Medice no encontrado" });
    await Medic.update(req.body);
    res.json(Medic);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const Medic = await Medic.findByPk(req.params.id);
    if (!Medic)
      return res.status(404).json({ message: "Medice no encontrado" });
    await Medic.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };
