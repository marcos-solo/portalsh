const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Admin = require('./Admin')(sequelize);
const Student = require('./Student')(sequelize);
const Quiz = require('./Quiz')(sequelize);
const Question = require('./Question')(sequelize);
const Submission = require('./Submission')(sequelize);
const FileSubmission = require('./FileSubmission')(sequelize);

Quiz.hasMany(Question, { onDelete: 'cascade' });
Question.belongsTo(Quiz);

Quiz.hasMany(Submission);
Submission.belongsTo(Quiz);

Student.hasMany(Submission);
Submission.belongsTo(Student);

Submission.hasMany(FileSubmission);
FileSubmission.belongsTo(Submission);

module.exports = {
  sequelize,
  Sequelize,
  Admin,
  Student,
  Quiz,
  Question,
  Submission,
  FileSubmission,
};
