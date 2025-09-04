const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config").development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const Product = require("./product")(sequelize, DataTypes);
const Client = require("./client")(sequelize, DataTypes);
const Invoice = require("./invoice")(sequelize, DataTypes);
const InvoiceDetail = require("./invoiceDetail")(sequelize, DataTypes);

// Associations
Client.hasMany(Invoice, {
  foreignKey: "clientId",
  onDelete: "CASCADE",
  as: "invoices",
});
Invoice.belongsTo(Client, { foreignKey: "clientId", as: "client" });

Invoice.hasMany(InvoiceDetail, {
  foreignKey: "invoiceId",
  onDelete: "CASCADE",
  as: "details",
});
InvoiceDetail.belongsTo(Invoice, { foreignKey: "invoiceId", as: "invoice" });

Product.hasMany(InvoiceDetail, {
  foreignKey: "productId",
  as: "invoiceDetails",
});
InvoiceDetail.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = {
  sequelize,
  Sequelize,
  Product,
  Client,
  Invoice,
  InvoiceDetail,
};