module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Invoice",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      clientId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "invoices", timestamps: true }
  );
};
