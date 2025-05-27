'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'lessons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Lesson.associate = (models) => {
    Lesson.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    Lesson.hasMany(models.Quiz, {
      foreignKey: 'lesson_id',
      as: 'quizzes'
    });
    Lesson.hasMany(models.Comment, {
      foreignKey: 'lesson_id',
      as: 'comments'
    });
    Lesson.hasMany(models.Progress, {
      foreignKey: 'lesson_id',
      as: 'progresses'
    });
  };

  return Lesson;
};
