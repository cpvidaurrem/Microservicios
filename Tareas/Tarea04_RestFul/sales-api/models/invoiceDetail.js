module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "InvoiceDetail",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      invoiceId: { type: DataTypes.INTEGER, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    },
    { tableName: "invoice_details", timestamps: true }
  );
};
