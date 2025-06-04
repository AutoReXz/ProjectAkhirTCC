const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Aturan validasi untuk registrasi
const registerValidationRules = [
  body('name').notEmpty().withMessage('Nama wajib diisi'),
  body('email').isEmail().withMessage('Email harus valid'),
  body('password').isLength({ min: 6 }).withMessage('Kata sandi minimal 6 karakter')
];

const loginValidationRules = [
  body('email').isEmail().withMessage('Email harus valid'),
  body('password').notEmpty().withMessage('Kata sandi wajib diisi')
];

// Aturan validasi untuk pelajaran
const lessonValidationRules = [
  body('title').notEmpty().withMessage('Judul wajib diisi'),
  body('content').notEmpty().withMessage('Konten wajib diisi'),
  body('language').notEmpty().withMessage('Bahasa wajib diisi')
];

// Aturan validasi untuk kuis
const quizValidationRules = [
  body('question').notEmpty().withMessage('Pertanyaan wajib diisi'),
  body('options').isObject().withMessage('Pilihan harus berupa objek dengan kunci A, B, C, D'),
  body('answer').isIn(['A', 'B', 'C', 'D']).withMessage('Jawaban harus salah satu dari: A, B, C, D')
];

// Aturan validasi untuk komentar
const commentValidationRules = [
  body('comment').notEmpty().withMessage('Komentar wajib diisi')
];

// Admin validation rules
const validateAdmin = {
  createUser: [
    body('name').notEmpty().withMessage('Nama wajib diisi'),
    body('email').isEmail().withMessage('Email harus valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role harus user atau admin'),
    validate
  ],
  
  updateUser: [
    body('name').optional().notEmpty().withMessage('Nama tidak boleh kosong'),
    body('email').optional().isEmail().withMessage('Email harus valid'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role harus user atau admin'),
    validate
  ],
  
  createQuiz: [
    body('lesson_id').isInt({ min: 1 }).withMessage('Lesson ID harus berupa integer positif'),
    body('question').notEmpty().withMessage('Pertanyaan wajib diisi'),
    body('options').isObject().withMessage('Pilihan harus berupa objek dengan kunci A, B, C, D'),
    body('answer').isIn(['A', 'B', 'C', 'D']).withMessage('Jawaban harus salah satu dari: A, B, C, D'),
    validate
  ],
  
  updateQuiz: [
    body('lesson_id').optional().isInt({ min: 1 }).withMessage('Lesson ID harus berupa integer positif'),
    body('question').optional().notEmpty().withMessage('Pertanyaan tidak boleh kosong'),
    body('options').optional().isObject().withMessage('Pilihan harus berupa objek dengan kunci A, B, C, D'),
    body('answer').optional().isIn(['A', 'B', 'C', 'D']).withMessage('Jawaban harus salah satu dari: A, B, C, D'),
    validate
  ],
  
  updateComment: [
    body('comment').optional().notEmpty().withMessage('Komentar tidak boleh kosong'),
    validate
  ],
  
  createLesson: [
    body('title').notEmpty().withMessage('Judul wajib diisi'),
    body('content').notEmpty().withMessage('Konten wajib diisi'),
    body('language').notEmpty().withMessage('Bahasa wajib diisi'),
    validate
  ],
  
  updateLesson: [
    body('title').optional().notEmpty().withMessage('Judul tidak boleh kosong'),
    body('content').optional().notEmpty().withMessage('Konten tidak boleh kosong'),
    body('language').optional().notEmpty().withMessage('Bahasa tidak boleh kosong'),
    validate
  ]
};

module.exports = {
  validate,
  registerValidationRules,
  loginValidationRules,
  lessonValidationRules,
  quizValidationRules,
  commentValidationRules,
  validateAdmin
};
