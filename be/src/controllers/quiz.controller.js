const { Quiz, Lesson, Progress } = require('../models');

// Get quizzes by lesson id
exports.getQuizzesByLessonId = async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    // Verify if lesson exists
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    const quizzes = await Quiz.findAll({
      where: { lesson_id: lessonId },
      attributes: ['id', 'question', 'options'] // Exclude answer to not expose it to users
    });
    
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create quiz for lesson (admin only)
exports.createQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { question, options, answer } = req.body;
    
    // Verify if lesson exists
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    const quiz = await Quiz.create({
      lesson_id: lessonId,
      question,
      options,
      answer
    });
    
    // Don't include answer in response
    const responseQuiz = {
      id: quiz.id,
      lesson_id: quiz.lesson_id,
      question: quiz.question,
      options: quiz.options
    };
    
    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: responseQuiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit quiz answer and calculate score
exports.submitQuizAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const userId = req.user.id;
    
    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if the answer is correct
    const isCorrect = quiz.answer === answer;
    
    // Get or create user progress for this lesson
    let progress = await Progress.findOne({
      where: {
        user_id: userId,
        lesson_id: quiz.lesson_id
      }
    });
    
    if (progress) {
      // Update progress if it exists
      if (isCorrect) {
        await progress.update({
          score: progress.score + 1,
          is_completed: true
        });
      }
    } else {
      // Create new progress entry
      progress = await Progress.create({
        user_id: userId,
        lesson_id: quiz.lesson_id,
        is_completed: isCorrect,
        score: isCorrect ? 1 : 0
      });
    }
    
    res.status(200).json({
      correct: isCorrect,
      correctAnswer: isCorrect ? null : quiz.answer,
      progress: {
        is_completed: progress.is_completed,
        score: progress.score
      }
    });
  } catch (error) {
    console.error('Submit quiz answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
