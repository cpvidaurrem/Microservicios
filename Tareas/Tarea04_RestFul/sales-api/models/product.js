module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      brand: { type: DataTypes.STRING, allowNull: true },
      stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { tableName: "products", timestamps: true }
  );
};