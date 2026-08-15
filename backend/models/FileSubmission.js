const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('FileSubmission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    filename: { type: DataTypes.STRING, allowNull: false },
    originalName: { type: DataTypes.STRING },
    mimeType: { type: DataTypes.STRING },
    size: { type: DataTypes.INTEGER },
    url: { type: DataTypes.STRING },
  });
};
