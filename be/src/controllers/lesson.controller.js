const { Lesson, User } = require('../models');

// Get all lessons
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(lessons);
  } catch (error) {
    console.error('Get all lessons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get lesson by id
exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.status(200).json(lesson);
  } catch (error) {
    console.error('Get lesson by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new lesson (admin only)
exports.createLesson = async (req, res) => {
  try {
    const { title, content, language } = req.body;
    const userId = req.user.id;
    
    const lesson = await Lesson.create({
      title,
      content,
      language,
      created_by: userId
    });
    
    res.status(201).json({
      message: 'Lesson created successfully',
      lesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update lesson (admin only)
exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, language } = req.body;
    
    const lesson = await Lesson.findByPk(id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    await lesson.update({
      title,
      content,
      language
    });
    
    res.status(200).json({
      message: 'Lesson updated successfully',
      lesson
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete lesson (admin only)
exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findByPk(id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    await lesson.destroy();
    
    res.status(200).json({
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
