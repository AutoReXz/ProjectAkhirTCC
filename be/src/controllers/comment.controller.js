const { Comment, User, Lesson } = require('../models');

// Get comments by lesson id
exports.getCommentsByLessonId = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify if lesson exists
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    const comments = await Comment.findAll({
      where: { lesson_id: id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create comment for lesson
exports.createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    
    // Verify if lesson exists
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    const newComment = await Comment.create({
      user_id: userId,
      lesson_id: id,
      comment
    });
    
    // Include user info in response
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });
    
    res.status(201).json({
      message: 'Comment added successfully',
      comment: commentWithUser
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
