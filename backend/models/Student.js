const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    roll: { type: DataTypes.STRING },
    rollNumber: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false, defaultValue: 'student123' },
    assignedCourseIds: { type: DataTypes.JSON, defaultValue: [] },
  });
};
