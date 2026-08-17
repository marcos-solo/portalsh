const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Submission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quizId: { type: DataTypes.STRING },
    quizTitle: { type: DataTypes.STRING },
    studentName: { type: DataTypes.STRING },
    studentId: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalQuestions: { type: DataTypes.INTEGER, defaultValue: 0 },
    scorePercentage: { type: DataTypes.INTEGER, defaultValue: 0 },
    passThreshold: { type: DataTypes.INTEGER, defaultValue: 70 },
    isPassed: { type: DataTypes.BOOLEAN, defaultValue: false },
    timeTakenSeconds: { type: DataTypes.INTEGER, defaultValue: 0 },
    submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    answers: { type: DataTypes.JSON },
    details: { type: DataTypes.JSON },
  });
};
