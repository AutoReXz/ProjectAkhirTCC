'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
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
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Comment.belongsTo(models.Lesson, {
      foreignKey: 'lesson_id',
      as: 'lesson'
    });
  };

  return Comment;
};
