const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Trainer = sequelize.define('Trainer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if (value) {
          this.setDataValue('password', value);
          this.setDataValue('passwordHash', bcrypt.hashSync(value, 10));
        }
      },
      get() {
        return this.getDataValue('password');
      },
    },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    assignedCourseIds: { type: DataTypes.JSON, defaultValue: [] },
  });

  Trainer.prototype.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
  };

  Trainer.beforeCreate(async (trainer) => {
    if (trainer.password && !trainer.passwordHash) {
      trainer.passwordHash = bcrypt.hashSync(trainer.password, 10);
    }
    if (!trainer.passwordHash && trainer.getDataValue('password')) {
      trainer.passwordHash = bcrypt.hashSync(trainer.getDataValue('password'), 10);
    }
  });

  return Trainer;
};
