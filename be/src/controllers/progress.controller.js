const { Progress, Lesson } = require('../models');

// Get user progress
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const progress = await Progress.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'language']
        }
      ]
    });
    
    // Calculate overall progress
    const totalCompleted = progress.filter(item => item.is_completed).length;
    const totalLessons = await Lesson.count();
    const completionRate = totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0;
    
    res.status(200).json({
      progress,
      summary: {
        totalCompleted,
        totalLessons,
        completionRate: Math.round(completionRate)
      }
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
