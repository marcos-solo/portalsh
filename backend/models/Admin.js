const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  });

  Admin.prototype.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
  };

  Admin.beforeCreate(async (admin) => {
    if (admin.password) {
      admin.passwordHash = bcrypt.hashSync(admin.password, 10);
    }
  });

  return Admin;
};
