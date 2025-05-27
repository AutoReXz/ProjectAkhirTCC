'use strict';
module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lessons',
        key: 'id'
      }
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'quizzes',
    timestamps: false
  });

  Quiz.associate = (models) => {
    Quiz.belongsTo(models.Lesson, {
      foreignKey: 'lesson_id',
      as: 'lesson'
    });
  };

  return Quiz;
};
