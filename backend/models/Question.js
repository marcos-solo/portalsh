const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Question', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    choices: { type: DataTypes.JSON },
    answer: { type: DataTypes.STRING },
    marks: { type: DataTypes.INTEGER, defaultValue: 1 },
  });
};
