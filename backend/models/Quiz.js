const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Quiz', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING },
    courseId: { type: DataTypes.STRING, defaultValue: 'course_1' },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    timeLimitMinutes: { type: DataTypes.INTEGER, defaultValue: 15 },
    passPercentage: { type: DataTypes.INTEGER, defaultValue: 70 },
    shuffleQuestions: { type: DataTypes.BOOLEAN, defaultValue: true },
    shuffleOptions: { type: DataTypes.BOOLEAN, defaultValue: true },
    allowReview: { type: DataTypes.BOOLEAN, defaultValue: true },
    questions: { type: DataTypes.JSON },
  });
};
