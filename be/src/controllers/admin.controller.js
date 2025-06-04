const { User, Lesson, Quiz, Comment, Progress } = require('../models');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response.utils');
const { Op } = require('sequelize');
const argon2 = require('argon2');

// Dashboard Statistics
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalLessons, totalQuizzes, totalComments] = await Promise.all([
      User.count(),
      Lesson.count(),
      Quiz.count(),
      Comment.count()
    ]);

    const stats = {
      totalUsers,
      totalLessons,
      totalQuizzes,
      totalComments
    };

    return sendSuccessResponse(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    console.error('Get stats error:', error);
    return sendErrorResponse(res, 'Failed to get statistics', 500);
  }
};

// User Management
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
      const whereClause = search ? {
      [Op.and]: [
        { active: true },
        {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        }
      ]
    } : { active: true };

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Comment,
          as: 'comments',
          attributes: ['id']
        },
        {
          model: Progress,
          as: 'progress',
          attributes: ['id']
        }
      ]
    });    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    };

    // Return array for frontend compatibility, with pagination in headers
    res.set({
      'X-Total-Count': count,
      'X-Page': page,
      'X-Limit': limit,
      'X-Total-Pages': Math.ceil(count / limit)
    });

    return res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    return sendErrorResponse(res, 'Failed to get users', 500);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: Lesson,
              as: 'lesson',
              attributes: ['id', 'title']
            }
          ]
        },
        {
          model: Progress,
          as: 'progress',
          include: [
            {
              model: Lesson,
              as: 'lesson',
              attributes: ['id', 'title']
            }
          ]
        }
      ]
    });

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    return sendSuccessResponse(res, user, 'User retrieved successfully');
  } catch (error) {
    console.error('Get user by ID error:', error);
    return sendErrorResponse(res, 'Failed to get user', 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    console.log('Update user request:', { id, name, email, hasPassword: !!password, role });

    const user = await User.findByPk(id);
    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    // Check if email already exists (excluding current user)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: id }
        }
      });
      if (existingUser) {
        return sendErrorResponse(res, 'Email already exists', 400);
      }
    }

    // Prepare update data
    const updateData = {
      name: name || user.name,
      email: email || user.email,
      role: role || user.role
    };

    // Hash new password if provided
    if (password && password.trim() !== '') {
      console.log('Updating password for user:', id);
      updateData.password_hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2**16,
        timeCost: 3,
        parallelism: 1
      });
    }

    await user.update(updateData);

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });

    return sendSuccessResponse(res, updatedUser, 'User updated successfully');
  } catch (error) {
    console.error('Update user error:', error);
    return sendErrorResponse(res, 'Failed to update user', 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    // Soft delete - set active to false
    await user.update({ active: false });

    return sendSuccessResponse(res, null, 'User deactivated successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    return sendErrorResponse(res, 'Failed to delete user', 500);
  }
};

// Quiz Management
const getAllQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10, lesson_id } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = lesson_id ? { lesson_id } : {};

    const { count, rows: quizzes } = await Quiz.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']],
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'language']
        }
      ]
    });    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    };

    // Return array for frontend compatibility, with pagination in headers
    res.set({
      'X-Total-Count': count,
      'X-Page': page,
      'X-Limit': limit,
      'X-Total-Pages': Math.ceil(count / limit)
    });

    return res.json(quizzes);
  } catch (error) {
    console.error('Get all quizzes error:', error);
    return sendErrorResponse(res, 'Failed to get quizzes', 500);
  }
};

const createQuiz = async (req, res) => {
  try {
    const { lesson_id, question, options, answer } = req.body;

    // Validate lesson exists
    const lesson = await Lesson.findByPk(lesson_id);
    if (!lesson) {
      return sendErrorResponse(res, 'Lesson not found', 404);
    }

    const quiz = await Quiz.create({
      lesson_id,
      question,
      options,
      answer
    });

    const newQuiz = await Quiz.findByPk(quiz.id, {
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'language']
        }
      ]
    });

    return sendSuccessResponse(res, newQuiz, 'Quiz created successfully', 201);
  } catch (error) {
    console.error('Create quiz error:', error);
    return sendErrorResponse(res, 'Failed to create quiz', 500);
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { lesson_id, question, options, answer } = req.body;

    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return sendErrorResponse(res, 'Quiz not found', 404);
    }

    // Validate lesson exists if lesson_id is provided
    if (lesson_id && lesson_id !== quiz.lesson_id) {
      const lesson = await Lesson.findByPk(lesson_id);
      if (!lesson) {
        return sendErrorResponse(res, 'Lesson not found', 404);
      }
    }

    await quiz.update({
      lesson_id: lesson_id || quiz.lesson_id,
      question: question || quiz.question,
      options: options || quiz.options,
      answer: answer || quiz.answer
    });

    const updatedQuiz = await Quiz.findByPk(id, {
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'language']
        }
      ]
    });

    return sendSuccessResponse(res, updatedQuiz, 'Quiz updated successfully');
  } catch (error) {
    console.error('Update quiz error:', error);
    return sendErrorResponse(res, 'Failed to update quiz', 500);
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return sendErrorResponse(res, 'Quiz not found', 404);
    }

    await quiz.destroy();

    return sendSuccessResponse(res, null, 'Quiz deleted successfully');
  } catch (error) {
    console.error('Delete quiz error:', error);
    return sendErrorResponse(res, 'Failed to delete quiz', 500);
  }
};

// Comment Management
const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 10, lesson_id, user_id } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (lesson_id) whereClause.lesson_id = lesson_id;
    if (user_id) whereClause.user_id = user_id;

    const { count, rows: comments } = await Comment.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'language']
        }
      ]
    });    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    };

    // Return array for frontend compatibility, with pagination in headers
    res.set({
      'X-Total-Count': count,
      'X-Page': page,
      'X-Limit': limit,
      'X-Total-Pages': Math.ceil(count / limit)
    });

    return res.json(comments);
  } catch (error) {
    console.error('Get all comments error:', error);
    return sendErrorResponse(res, 'Failed to get comments', 500);
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const commentRecord = await Comment.findByPk(id);
    if (!commentRecord) {
      return sendErrorResponse(res, 'Comment not found', 404);
    }

    await commentRecord.update({
      comment: comment || commentRecord.comment
    });

    const updatedComment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'language']
        }
      ]
    });

    return sendSuccessResponse(res, updatedComment, 'Comment updated successfully');
  } catch (error) {
    console.error('Update comment error:', error);
    return sendErrorResponse(res, 'Failed to update comment', 500);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return sendErrorResponse(res, 'Comment not found', 404);
    }

    await comment.destroy();

    return sendSuccessResponse(res, null, 'Comment deleted successfully');
  } catch (error) {
    console.error('Delete comment error:', error);
    return sendErrorResponse(res, 'Failed to delete comment', 500);
  }
};

// Lesson Management (extending existing)
const getAllLessons = async (req, res) => {
  try {
    const { page = 1, limit = 10, language } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = language ? { language } : {};

    const { count, rows: lessons } = await Lesson.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Quiz,
          as: 'quizzes',
          attributes: ['id']
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id']
        }
      ]
    });    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    };

    // Return array for frontend compatibility, with pagination in headers
    res.set({
      'X-Total-Count': count,
      'X-Page': page,
      'X-Limit': limit,
      'X-Total-Pages': Math.ceil(count / limit)
    });

    return res.json(lessons);
  } catch (error) {
    console.error('Get all lessons error:', error);
    return sendErrorResponse(res, 'Failed to get lessons', 500);
  }
};

const createLesson = async (req, res) => {
  try {
    const { title, content, language } = req.body;
    const created_by = req.user.id;

    const lesson = await Lesson.create({
      title,
      content,
      language,
      created_by
    });

    const newLesson = await Lesson.findByPk(lesson.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return sendSuccessResponse(res, newLesson, 'Lesson created successfully', 201);
  } catch (error) {
    console.error('Create lesson error:', error);
    return sendErrorResponse(res, 'Failed to create lesson', 500);
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, language } = req.body;

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return sendErrorResponse(res, 'Lesson not found', 404);
    }

    await lesson.update({
      title: title || lesson.title,
      content: content || lesson.content,
      language: language || lesson.language
    });

    const updatedLesson = await Lesson.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return sendSuccessResponse(res, updatedLesson, 'Lesson updated successfully');
  } catch (error) {
    console.error('Update lesson error:', error);
    return sendErrorResponse(res, 'Failed to update lesson', 500);
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return sendErrorResponse(res, 'Lesson not found', 404);
    }

    // Delete associated quizzes, comments, and progress first
    await Quiz.destroy({ where: { lesson_id: id } });
    await Comment.destroy({ where: { lesson_id: id } });
    await Progress.destroy({ where: { lesson_id: id } });
    
    await lesson.destroy();

    return sendSuccessResponse(res, null, 'Lesson deleted successfully');
  } catch (error) {
    console.error('Delete lesson error:', error);
    return sendErrorResponse(res, 'Failed to delete lesson', 500);
  }
};

// Create new user (admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendErrorResponse(res, 'Email already exists', 400);
    }

    // Hash password
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2**16,
      timeCost: 3,
      parallelism: 1
    });

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      role
    });

    const createdUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    return sendSuccessResponse(res, createdUser, 'User created successfully');
  } catch (error) {
    console.error('Create user error:', error);
    return sendErrorResponse(res, 'Failed to create user', 500);
  }
};

module.exports = {
  // Stats
  getStats,
  
  // Users
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  
  // Quizzes
  getAllQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  
  // Comments
  getAllComments,
  updateComment,
  deleteComment,
  
  // Lessons
  getAllLessons,
  createLesson,
  updateLesson,
  deleteLesson
};