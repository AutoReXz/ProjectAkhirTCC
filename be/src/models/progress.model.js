'use strict';
module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define('Progress', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lessons',
        key: 'id'
      }
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }  }, {
    tableName: 'progress',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'lesson_id']
      }
    ]
  });

  Progress.associate = (models) => {
    Progress.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Progress.belongsTo(models.Lesson, {
      foreignKey: 'lesson_id',
      as: 'lesson'
    });
  };

  return Progress;
};
