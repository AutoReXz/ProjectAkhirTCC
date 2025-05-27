'use strict';
const argon2 = require('argon2');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash passwords for admin and user
    const adminPassword = await argon2.hash('admin123');
    const userPassword = await argon2.hash('user123');

    // Insert default users
    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password_hash: adminPassword,
        role: 'admin',
        created_at: new Date()
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password_hash: userPassword,
        role: 'user',
        created_at: new Date()
      }
    ]);

    // Get the id of the admin user
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@example.com'`
    );
    const adminId = users[0].id;

    // Insert sample lessons
    await queryInterface.bulkInsert('lessons', [
      {
        title: 'Basic Spanish Greetings',
        content: 'In this lesson, you will learn basic Spanish greetings.\n\n' +
                 '1. Hello - Hola\n' +
                 '2. Good morning - Buenos días\n' +
                 '3. Good afternoon - Buenas tardes\n' +
                 '4. Good night - Buenas noches\n' +
                 '5. How are you? - ¿Cómo estás?\n' +
                 '6. I\'m fine, thank you - Estoy bien, gracias\n' +
                 '7. Nice to meet you - Mucho gusto',
        language: 'Spanish',
        created_by: adminId,
        created_at: new Date()
      },
      {
        title: 'French Basics: Introduction',
        content: 'Welcome to French basics! In this lesson, you\'ll learn:\n\n' +
                 '1. Hello - Bonjour\n' +
                 '2. Good evening - Bonsoir\n' +
                 '3. My name is... - Je m\'appelle...\n' +
                 '4. How are you? - Comment ça va?\n' +
                 '5. I\'m good - Ça va bien\n' +
                 '6. Thank you - Merci\n' +
                 '7. Goodbye - Au revoir',
        language: 'French',
        created_by: adminId,
        created_at: new Date()
      }
    ]);

    // Get the ids of the inserted lessons
    const [lessons] = await queryInterface.sequelize.query(
      `SELECT id, title FROM lessons`
    );

    const spanishLessonId = lessons.find(l => l.title === 'Basic Spanish Greetings').id;
    const frenchLessonId = lessons.find(l => l.title === 'French Basics: Introduction').id;

    // Insert sample quizzes
    await queryInterface.bulkInsert('quizzes', [
      {
        lesson_id: spanishLessonId,
        question: 'How do you say "Hello" in Spanish?',
        options: JSON.stringify({
          "A": "Hola",
          "B": "Buenos días",
          "C": "Gracias",
          "D": "Adiós"
        }),
        answer: 'A'
      },
      {
        lesson_id: spanishLessonId,
        question: 'What is the Spanish phrase for "Good morning"?',
        options: JSON.stringify({
          "A": "Buenas tardes",
          "B": "Buenos días",
          "C": "Buenas noches",
          "D": "¿Cómo estás?"
        }),
        answer: 'B'
      },
      {
        lesson_id: frenchLessonId,
        question: 'How do you say "My name is..." in French?',
        options: JSON.stringify({
          "A": "Comment ça va?",
          "B": "Je m'appelle...",
          "C": "Merci beaucoup",
          "D": "Au revoir"
        }),
        answer: 'B'
      },
      {
        lesson_id: frenchLessonId,
        question: 'What does "Merci" mean in English?',
        options: JSON.stringify({
          "A": "Hello",
          "B": "Goodbye",
          "C": "Thank you",
          "D": "How are you?"
        }),
        answer: 'C'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove data in reverse order
    await queryInterface.bulkDelete('quizzes', null, {});
    await queryInterface.bulkDelete('lessons', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
