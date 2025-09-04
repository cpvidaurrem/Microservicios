module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Client",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      ci: { type: DataTypes.STRING, unique: true, allowNull: false },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      gender: { type: DataTypes.ENUM("M", "F", "O"), defaultValue: "O" },
    },
    { tableName: "clients", timestamps: true }
  );
};