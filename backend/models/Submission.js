const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Submission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    answers: { type: DataTypes.JSON },
    score: { type: DataTypes.FLOAT },
    submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
};
