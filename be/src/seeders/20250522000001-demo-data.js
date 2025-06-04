'use strict';
const argon2 = require('argon2');

module.exports = {
  up: async (queryInterface, Sequelize) => {    // Hash passwords for admin and users
    const adminPassword = await argon2.hash('admin123');
    const userPassword = await argon2.hash('user123');
    const teacherPassword = await argon2.hash('teacher123');
    const studentPassword = await argon2.hash('student123');

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
      },
      {
        name: 'Language Teacher',
        email: 'teacher@example.com',
        password_hash: teacherPassword,
        role: 'user',
        created_at: new Date()
      },
      {
        name: 'Student Learner',
        email: 'student@example.com',
        password_hash: studentPassword,
        role: 'user',
        created_at: new Date()
      },
      {
        name: 'Maria Rodriguez',
        email: 'maria@example.com',
        password_hash: userPassword,
        role: 'user',
        created_at: new Date()
      },
      {
        name: 'Sato Takeshi',
        email: 'sato@example.com',
        password_hash: userPassword,
        role: 'user',
        created_at: new Date()
      },
      {
        name: 'Ahmad Hassan',
        email: 'ahmad@example.com',
        password_hash: userPassword,
        role: 'user',
        created_at: new Date()
      },
      {
        name: 'Budi Santoso',
        email: 'budi@example.com',
        password_hash: userPassword,
        role: 'user',
        created_at: new Date()
      }
    ]);

    // Get the id of the admin user
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@example.com'`
    );
    const adminId = users[0].id;    // Insert sample lessons
    await queryInterface.bulkInsert('lessons', [
      // Spanish Lessons
      {
        title: 'Basic Spanish Greetings',
        content: 'Dalam pelajaran ini, Anda akan mempelajari salam-salam dasar dalam bahasa Spanyol yang sering digunakan dalam percakapan sehari-hari.\n\n' +
                 'Kosakata Salam:\n' +
                 '• Hola - Hello / Halo\n' +
                 '• Buenos días - Good morning / Selamat pagi\n' +
                 '• Buenas tardes - Good afternoon / Selamat siang\n' +
                 '• Buenas noches - Good night / Selamat malam\n' +
                 '• ¿Cómo estás? - How are you? / Apa kabar?\n' +
                 '• Estoy bien, gracias - I\'m fine, thank you / Saya baik-baik saja, terima kasih\n' +
                 '• Mucho gusto - Nice to meet you / Senang berkenalan dengan Anda\n\n' +
                 'Contoh Percakapan:\n' +
                 'A: "¡Hola! ¿Cómo estás?"\n' +
                 'B: "¡Hola! Estoy bien, gracias. ¿Y tú?"\n\n' +
                 'Tips: Gunakan "Buenos días" sampai jam 12 siang, "Buenas tardes" dari jam 12 siang sampai sore, dan "Buenas noches" untuk malam hari.',
        language: 'Spanish',
        created_by: adminId,
        created_at: new Date()
      },
      {
        title: 'Spanish Numbers 1-20',
        content: 'Pelajari angka 1-20 dalam bahasa Spanyol:\n\n' +
                 '1 - uno\n' +
                 '2 - dos\n' +
                 '3 - tres\n' +
                 '4 - cuatro\n' +
                 '5 - cinco\n' +
                 '6 - seis\n' +
                 '7 - siete\n' +
                 '8 - ocho\n' +
                 '9 - nueve\n' +
                 '10 - diez\n' +
                 '11 - once\n' +
                 '12 - doce\n' +
                 '13 - trece\n' +
                 '14 - catorce\n' +
                 '15 - quince\n' +
                 '16 - dieciséis\n' +
                 '17 - diecisiete\n' +
                 '18 - dieciocho\n' +
                 '19 - diecinueve\n' +
                 '20 - veinte',
        language: 'Spanish',
        created_by: adminId,
        created_at: new Date()
      },
      
      // French Lessons
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
      },
      {
        title: 'French Colors',
        content: 'Pelajari warna-warna dalam bahasa Prancis:\n\n' +
                 '• Rouge - Red / Merah\n' +
                 '• Bleu - Blue / Biru\n' +
                 '• Vert - Green / Hijau\n' +
                 '• Jaune - Yellow / Kuning\n' +
                 '• Noir - Black / Hitam\n' +
                 '• Blanc - White / Putih\n' +
                 '• Rose - Pink / Merah muda\n' +
                 '• Orange - Orange / Oranye\n' +
                 '• Violet - Purple / Ungu\n' +
                 '• Gris - Gray / Abu-abu\n' +
                 '• Marron - Brown / Coklat',
        language: 'French',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Japanese Lessons
      {
        title: 'Japanese Hiragana Basics',
        content: 'Pelajari dasar-dasar Hiragana dalam bahasa Jepang:\n\n' +
                 'Hiragana dasar:\n' +
                 'あ (a) - A\n' +
                 'い (i) - I\n' +
                 'う (u) - U\n' +
                 'え (e) - E\n' +
                 'お (o) - O\n\n' +
                 'か (ka) - Ka\n' +
                 'き (ki) - Ki\n' +
                 'く (ku) - Ku\n' +
                 'け (ke) - Ke\n' +
                 'こ (ko) - Ko\n\n' +
                 'さ (sa) - Sa\n' +
                 'し (shi) - Shi\n' +
                 'す (su) - Su\n' +
                 'せ (se) - Se\n' +
                 'そ (so) - So\n\n' +
                 'Latihan menulis setiap karakter dan menghafalkan suaranya.',
        language: 'Japanese',
        created_by: adminId,
        created_at: new Date()
      },
      {
        title: 'Japanese Greetings',
        content: 'Salam-salam dasar dalam bahasa Jepang:\n\n' +
                 '• おはよう (Ohayou) - Good morning (informal) / Selamat pagi\n' +
                 '• おはようございます (Ohayou gozaimasu) - Good morning (polite) / Selamat pagi\n' +
                 '• こんにちは (Konnichiwa) - Hello / Halo\n' +
                 '• こんばんは (Konbanwa) - Good evening / Selamat malam\n' +
                 '• はじめまして (Hajimemashite) - Nice to meet you / Senang berkenalan\n' +
                 '• よろしくお願いします (Yoroshiku onegaishimasu) - Please treat me well\n' +
                 '• ありがとうございます (Arigatou gozaimasu) - Thank you / Terima kasih\n' +
                 '• すみません (Sumimasen) - Excuse me/Sorry / Permisi/Maaf\n' +
                 '• さようなら (Sayounara) - Goodbye / Selamat tinggal',
        language: 'Japanese',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Javanese Lessons
      {
        title: 'Javanese Basic Greetings',
        content: 'Salam-salam dasar dalam bahasa Jawa:\n\n' +
                 'Tingkat Ngoko (informal):\n' +
                 '• Halo - Halo\n' +
                 '• Selamat esuk - Selamat pagi\n' +
                 '• Selamat awan - Selamat siang\n' +
                 '• Selamat sore - Selamat sore\n' +
                 '• Selamat bengi - Selamat malam\n' +
                 '• Piye kabare? - Bagaimana kabarnya?\n' +
                 '• Apik - Baik\n\n' +
                 'Tingkat Krama (formal):\n' +
                 '• Sugeng enjing - Selamat pagi\n' +
                 '• Sugeng siyang - Selamat siang\n' +
                 '• Sugeng sonten - Selamat sore\n' +
                 '• Sugeng dalu - Selamat malam\n' +
                 '• Pripun kabaripun? - Bagaimana kabarnya?\n' +
                 '• Sae - Baik',
        language: 'Javanese',
        created_by: adminId,
        created_at: new Date()
      },
      {
        title: 'Javanese Family Terms',
        content: 'Istilah-istilah keluarga dalam bahasa Jawa:\n\n' +
                 'Ngoko (informal):\n' +
                 '• Bapak - Ayah\n' +
                 '• Ibu - Ibu\n' +
                 '• Anak - Anak\n' +
                 '• Kakang - Kakak laki-laki\n' +
                 '• Mbakyu - Kakak perempuan\n' +
                 '• Adhi - Adik\n' +
                 '• Mbah - Nenek/Kakek\n\n' +
                 'Krama (formal):\n' +
                 '• Rama - Ayah\n' +
                 '• Ibu - Ibu\n' +
                 '• Putra/Putri - Anak laki-laki/perempuan\n' +
                 '• Kang - Kakak laki-laki\n' +
                 '• Mbak - Kakak perempuan\n' +
                 '• Rayinipun - Adik\n' +
                 '• Eyang - Nenek/Kakek',
        language: 'Javanese',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Korean Lessons
      {
        title: 'Korean Hangul Basics',
        content: 'Pengenalan dasar Hangul dalam bahasa Korea:\n\n' +
                 'Vokal dasar:\n' +
                 'ㅏ (a) - A\n' +
                 'ㅓ (eo) - Eo\n' +
                 'ㅗ (o) - O\n' +
                 'ㅜ (u) - U\n' +
                 'ㅡ (eu) - Eu\n' +
                 'ㅣ (i) - I\n\n' +
                 'Konsonan dasar:\n' +
                 'ㄱ (g/k) - G/K\n' +
                 'ㄴ (n) - N\n' +
                 'ㄷ (d/t) - D/T\n' +
                 'ㄹ (r/l) - R/L\n' +
                 'ㅁ (m) - M\n' +
                 'ㅂ (b/p) - B/P\n' +
                 'ㅅ (s) - S\n' +
                 'ㅇ (ng/silent) - Ng/Silent\n' +
                 'ㅈ (j) - J\n' +
                 'ㅎ (h) - H',
        language: 'Korean',
        created_by: adminId,
        created_at: new Date()
      },
      {
        title: 'Korean Greetings',
        content: 'Salam-salam dalam bahasa Korea:\n\n' +
                 '• 안녕하세요 (Annyeonghaseyo) - Hello / Halo (formal)\n' +
                 '• 안녕 (Annyeong) - Hi/Bye / Hai/Dadah (informal)\n' +
                 '• 좋은 아침입니다 (Joeun achimimnida) - Good morning / Selamat pagi\n' +
                 '• 안녕히 가세요 (Annyeonghi gaseyo) - Goodbye (to someone leaving) / Selamat jalan\n' +
                 '• 안녕히 계세요 (Annyeonghi gyeseyo) - Goodbye (when you\'re leaving) / Selamat tinggal\n' +
                 '• 감사합니다 (Gamsahamnida) - Thank you / Terima kasih\n' +
                 '• 죄송합니다 (Joesonghamnida) - Sorry / Maaf\n' +
                 '• 처음 뵙겠습니다 (Cheoeum boepgesseumnida) - Nice to meet you / Senang berkenalan',
        language: 'Korean',
        created_by: adminId,
        created_at: new Date()
      },
      
      // German Lessons
      {
        title: 'German Basics',
        content: 'Dasar-dasar bahasa Jerman:\n\n' +
                 '• Hallo - Hello / Halo\n' +
                 '• Guten Morgen - Good morning / Selamat pagi\n' +
                 '• Guten Tag - Good day / Selamat siang\n' +
                 '• Guten Abend - Good evening / Selamat malam\n' +
                 '• Gute Nacht - Good night / Selamat tidur\n' +
                 '• Wie geht es Ihnen? - How are you? (formal) / Apa kabar?\n' +
                 '• Wie geht\'s? - How\'s it going? (informal) / Apa kabar?\n' +
                 '• Mir geht es gut - I\'m doing well / Saya baik-baik saja\n' +
                 '• Danke - Thank you / Terima kasih\n' +
                 '• Bitte - Please/You\'re welcome / Tolong/Sama-sama\n' +
                 '• Entschuldigung - Excuse me / Permisi\n' +
                 '• Auf Wiedersehen - Goodbye / Selamat tinggal',
        language: 'German',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Chinese (Mandarin) Lessons
      {
        title: 'Chinese Pinyin and Tones',
        content: 'Pengenalan Pinyin dan nada dalam bahasa Mandarin:\n\n' +
                 'Empat nada dasar:\n' +
                 '1. Nada pertama (¯): Tinggi dan datar - mā (ibu)\n' +
                 '2. Nada kedua (´): Naik - má (rami)\n' +
                 '3. Nada ketiga (ˇ): Turun naik - mǎ (kuda)\n' +
                 '4. Nada keempat (`): Turun - mà (memarahi)\n\n' +
                 'Contoh kata dengan nada:\n' +
                 '• 你好 (nǐ hǎo) - Hello / Halo\n' +
                 '• 谢谢 (xiè xie) - Thank you / Terima kasih\n' +
                 '• 对不起 (duì bu qǐ) - Sorry / Maaf\n' +
                 '• 再见 (zài jiàn) - Goodbye / Selamat tinggal\n' +
                 '• 请 (qǐng) - Please / Tolong\n' +
                 '• 是 (shì) - Yes/To be / Ya/Adalah',
        language: 'Chinese',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Arabic Lessons
      {
        title: 'Arabic Alphabet Introduction',
        content: 'Pengenalan huruf Arab:\n\n' +
                 'Huruf-huruf Arab (beberapa contoh):\n' +
                 '• ا (alif) - A\n' +
                 '• ب (ba) - B\n' +
                 '• ت (ta) - T\n' +
                 '• ث (tha) - Th\n' +
                 '• ج (jim) - J\n' +
                 '• ح (ha) - H\n' +
                 '• خ (kha) - Kh\n' +
                 '• د (dal) - D\n' +
                 '• ذ (dzal) - Dz\n' +
                 '• ر (ra) - R\n\n' +
                 'Salam-salam dasar:\n' +
                 '• السلام عليكم (Assalamu\'alaikum) - Peace be upon you / Salam sejahtera\n' +
                 '• وعليكم السلام (Wa\'alaikumussalam) - And peace be upon you too / Dan salam sejahtera juga\n' +
                 '• أهلا وسهلا (Ahlan wa sahlan) - Welcome / Selamat datang\n' +
                 '• شكرا (Shukran) - Thank you / Terima kasih\n' +
                 '• مع السلامة (Ma\'assalamah) - Goodbye / Selamat tinggal',
        language: 'Arabic',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Italian Lessons
      {
        title: 'Italian Basic Phrases',
        content: 'Frasa-frasa dasar dalam bahasa Italia:\n\n' +
                 '• Ciao - Hello/Goodbye (informal) / Halo/Dadah\n' +
                 '• Buongiorno - Good morning / Selamat pagi\n' +
                 '• Buonasera - Good evening / Selamat malam\n' +
                 '• Come stai? - How are you? (informal) / Apa kabar?\n' +
                 '• Come sta? - How are you? (formal) / Apa kabar?\n' +
                 '• Sto bene - I\'m fine / Saya baik-baik saja\n' +
                 '• Grazie - Thank you / Terima kasih\n' +
                 '• Prego - You\'re welcome / Sama-sama\n' +
                 '• Scusi - Excuse me (formal) / Permisi\n' +
                 '• Scusa - Excuse me (informal) / Permisi\n' +
                 '• Arrivederci - Goodbye / Selamat tinggal\n' +
                 '• Per favore - Please / Tolong',
        language: 'Italian',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Portuguese Lessons
      {
        title: 'Portuguese Greetings',
        content: 'Salam-salam dalam bahasa Portugis:\n\n' +
                 '• Olá - Hello / Halo\n' +
                 '• Bom dia - Good morning / Selamat pagi\n' +
                 '• Boa tarde - Good afternoon / Selamat siang\n' +
                 '• Boa noite - Good evening/night / Selamat malam\n' +
                 '• Como está? - How are you? (formal) / Apa kabar?\n' +
                 '• Como vai? - How are you? (informal) / Apa kabar?\n' +
                 '• Estou bem - I\'m fine / Saya baik-baik saja\n' +
                 '• Obrigado/Obrigada - Thank you (m/f) / Terima kasih\n' +
                 '• De nada - You\'re welcome / Sama-sama\n' +
                 '• Com licença - Excuse me / Permisi\n' +
                 '• Desculpe - Sorry / Maaf\n' +
                 '• Tchau - Bye / Dadah\n' +
                 '• Até logo - See you later / Sampai jumpa',
        language: 'Portuguese',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Dutch Lessons
      {
        title: 'Dutch Basic Conversation',
        content: 'Percakapan dasar dalam bahasa Belanda:\n\n' +
                 '• Hallo - Hello / Halo\n' +
                 '• Goedemorgen - Good morning / Selamat pagi\n' +
                 '• Goedemiddag - Good afternoon / Selamat siang\n' +
                 '• Goedenavond - Good evening / Selamat malam\n' +
                 '• Hoe gaat het? - How are you? / Apa kabar?\n' +
                 '• Het gaat goed - I\'m fine / Saya baik-baik saja\n' +
                 '• Dank je wel - Thank you / Terima kasih\n' +
                 '• Graag gedaan - You\'re welcome / Sama-sama\n' +
                 '• Pardon - Excuse me / Permisi\n' +
                 '• Sorry - Sorry / Maaf\n' +
                 '• Tot ziens - Goodbye / Selamat tinggal\n' +
                 '• Doei - Bye (informal) / Dadah',
        language: 'Dutch',
        created_by: adminId,
        created_at: new Date()
      },
        // Russian Lessons
      {
        title: 'Russian Cyrillic Alphabet',
        content: 'Pengenalan alfabet Sirilik Rusia:\n\n' +
                 'Huruf-huruf dasar:\n' +
                 '• А а (A) - A\n' +
                 '• Б б (B) - B\n' +
                 '• В в (V) - V\n' +
                 '• Г г (G) - G\n' +
                 '• Д д (D) - D\n' +
                 '• Е е (YE) - Ye\n' +
                 '• Ё ё (YO) - Yo\n' +
                 '• Ж ж (ZH) - Zh\n' +
                 '• З з (Z) - Z\n' +
                 '• И и (I) - I\n\n' +
                 'Salam-salam dasar:\n' +
                 '• Привет (Privet) - Hi / Hai\n' +
                 '• Здравствуйте (Zdravstvuyte) - Hello (formal) / Halo\n' +
                 '• Как дела? (Kak dela?) - How are things? / Apa kabar?\n' +
                 '• Спасибо (Spasibo) - Thank you / Terima kasih\n' +
                 '• Пожалуйста (Pozhaluysta) - Please/You\'re welcome / Tolong/Sama-sama\n' +
                 '• До свидания (Do svidaniya) - Goodbye / Selamat tinggal',
        language: 'Russian',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Hindi Lessons
      {
        title: 'Hindi Devanagari Script Basics',
        content: 'Pengenalan aksara Devanagari dalam bahasa Hindi:\n\n' +
                 'Vokal (स्वर):\n' +
                 '• अ (a) - A\n' +
                 '• आ (aa) - Aa\n' +
                 '• इ (i) - I\n' +
                 '• ई (ii) - Ii\n' +
                 '• उ (u) - U\n' +
                 '• ऊ (uu) - Uu\n' +
                 '• ए (e) - E\n' +
                 '• ओ (o) - O\n\n' +
                 'Konsonan dasar (व्यंजन):\n' +
                 '• क (ka) - Ka\n' +
                 '• ख (kha) - Kha\n' +
                 '• ग (ga) - Ga\n' +
                 '• च (cha) - Cha\n' +
                 '• ज (ja) - Ja\n' +
                 '• त (ta) - Ta\n' +
                 '• द (da) - Da\n' +
                 '• न (na) - Na\n' +
                 '• प (pa) - Pa\n' +
                 '• म (ma) - Ma',
        language: 'Hindi',
        created_by: adminId,
        created_at: new Date()
      },
      {
        title: 'Hindi Basic Greetings',
        content: 'Salam-salam dasar dalam bahasa Hindi:\n\n' +
                 '• नमस्ते (Namaste) - Hello/Goodbye / Halo/Selamat tinggal\n' +
                 '• नमस्कार (Namaskar) - Formal greeting / Salam formal\n' +
                 '• सुप्रभात (Suprabhat) - Good morning / Selamat pagi\n' +
                 '• शुभ संध्या (Shubh sandhya) - Good evening / Selamat malam\n' +
                 '• आप कैसे हैं? (Aap kaise hain?) - How are you? (formal) / Apa kabar?\n' +
                 '• मैं ठीक हूँ (Main theek hun) - I am fine / Saya baik-baik saja\n' +
                 '• धन्यवाद (Dhanyawad) - Thank you / Terima kasih\n' +
                 '• क्षमा करें (Kshama karen) - Excuse me / Permisi\n' +
                 '• अलविदा (Alvida) - Goodbye / Selamat tinggal',
        language: 'Hindi',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Thai Lessons
      {
        title: 'Thai Script Introduction',
        content: 'Pengenalan aksara Thai:\n\n' +
                 'Konsonan Thai (พยัญชนะ):\n' +
                 '• ก (go gai) - G\n' +
                 '• ข (kho khai) - Kh\n' +
                 '• ค (kho khwai) - Kh\n' +
                 '• ง (ngo nguu) - Ng\n' +
                 '• จ (jo jaan) - J\n' +
                 '• ช (cho chaang) - Ch\n' +
                 '• ท (tho thaan) - Th\n' +
                 '• น (no nuu) - N\n' +
                 '• บ (bo bai mai) - B\n' +
                 '• ป (po plaa) - P\n' +
                 '• ม (mo maa) - M\n' +
                 '• ร (ro ruea) - R\n' +
                 '• ล (lo ling) - L\n' +
                 '• ส (so sua) - S\n' +
                 '• ห (ho hiip) - H\n\n' +
                 'Vokal Thai (สระ):\n' +
                 '• -ะ (a) - A\n' +
                 '• -า (aa) - Aa\n' +
                 '• -ิ (i) - I\n' +
                 '• -ี (ii) - Ii\n' +
                 '• -ุ (u) - U\n' +
                 '• -ู (uu) - Uu',
        language: 'Thai',
        created_by: adminId,
        created_at: new Date()
      },
      {
        title: 'Thai Greetings and Politeness',
        content: 'Salam dan kesopanan dalam bahasa Thai:\n\n' +
                 'Salam dasar:\n' +
                 '• สวัสดี (Sawasdee) - Hello/Goodbye / Halo/Selamat tinggal\n' +
                 '• สวัสดีครับ (Sawasdee krab) - Hello (male speaker) / Halo (laki-laki)\n' +
                 '• สวัสดีค่ะ (Sawasdee ka) - Hello (female speaker) / Halo (perempuan)\n' +
                 '• สบายดีไหม (Sabaai dii mai?) - How are you? / Apa kabar?\n' +
                 '• สบายดี (Sabaai dii) - I\'m fine / Saya baik-baik saja\n\n' +
                 'Kata sopan santun:\n' +
                 '• ขอบคุณ (Khob khun) - Thank you / Terima kasih\n' +
                 '• ขอโทษ (Kho thot) - Sorry/Excuse me / Maaf/Permisi\n' +
                 '• ครับ (Krab) - Polite particle (male) / Partikel sopan (laki-laki)\n' +
                 '• ค่ะ (Ka) - Polite particle (female) / Partikel sopan (perempuan)\n' +
                 '• ไม่เป็นไร (Mai pen rai) - It\'s okay/You\'re welcome / Tidak apa-apa/Sama-sama',
        language: 'Thai',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Vietnamese Lessons
      {
        title: 'Vietnamese Tones and Pronunciation',
        content: 'Pengenalan nada dan pelafalan dalam bahasa Vietnam:\n\n' +
                 'Enam nada dalam bahasa Vietnam:\n' +
                 '1. Ngang (tanpa tanda): Nada datar - ma (hantu)\n' +
                 '2. Sắc (´): Nada naik - má (pipi)\n' +
                 '3. Huyền (`): Nada turun - mà (tetapi)\n' +
                 '4. Hỏi (?): Nada turun naik - mả (makam)\n' +
                 '5. Ngã (~): Nada naik turun - mã (kode)\n' +
                 '6. Nặng (.): Nada berat turun - mạ (bibit padi)\n\n' +
                 'Salam-salam dasar:\n' +
                 '• Xin chào - Hello / Halo\n' +
                 '• Chào buổi sáng - Good morning / Selamat pagi\n' +
                 '• Chào buổi chiều - Good afternoon / Selamat siang\n' +
                 '• Chào buổi tối - Good evening / Selamat malam\n' +
                 '• Bạn có khỏe không? - How are you? / Apa kabar?\n' +
                 '• Tôi khỏe - I\'m fine / Saya baik-baik saja\n' +
                 '• Cảm ơn - Thank you / Terima kasih\n' +
                 '• Xin lỗi - Sorry / Maaf',
        language: 'Vietnamese',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Turkish Lessons
      {
        title: 'Turkish Basic Phrases',
        content: 'Frasa-frasa dasar dalam bahasa Turki:\n\n' +
                 'Salam dan sapaan:\n' +
                 '• Merhaba - Hello / Halo\n' +
                 '• Günaydın - Good morning / Selamat pagi\n' +
                 '• İyi akşamlar - Good evening / Selamat malam\n' +
                 '• İyi geceler - Good night / Selamat tidur\n' +
                 '• Nasılsınız? - How are you? (formal) / Apa kabar?\n' +
                 '• Nasılsın? - How are you? (informal) / Apa kabar?\n' +
                 '• İyiyim - I\'m fine / Saya baik-baik saja\n' +
                 '• Teşekkür ederim - Thank you / Terima kasih\n' +
                 '• Rica ederim - You\'re welcome / Sama-sama\n' +
                 '• Özür dilerim - I\'m sorry / Saya minta maaf\n' +
                 '• Affedersiniz - Excuse me / Permisi\n' +
                 '• Hoşça kalın - Goodbye / Selamat tinggal\n' +
                 '• Görüşürüz - See you later / Sampai jumpa',
        language: 'Turkish',
        created_by: adminId,
        created_at: new Date()
      },
      
      // Swahili Lessons
      {
        title: 'Swahili Greetings and Culture',
        content: 'Salam dan budaya dalam bahasa Swahili:\n\n' +
                 'Salam-salam umum:\n' +
                 '• Hujambo - Hello (to one person) / Halo (untuk satu orang)\n' +
                 '• Hamjambo - Hello (to multiple people) / Halo (untuk banyak orang)\n' +
                 '• Sijambo - I\'m fine (response) / Saya baik-baik saja (jawaban)\n' +
                 '• Habari - How are things? / Apa kabar?\n' +
                 '• Nzuri - Good/Fine / Baik\n' +
                 '• Asante - Thank you / Terima kasih\n' +
                 '• Karibu - You\'re welcome / Sama-sama\n' +
                 '• Pole - Sorry (sympathy) / Turut berduka\n' +
                 '• Samahani - Excuse me/Sorry / Permisi/Maaf\n' +
                 '• Kwaheri - Goodbye / Selamat tinggal\n\n' +
                 'Salam berdasarkan waktu:\n' +
                 '• Habari za asubuhi - Good morning / Selamat pagi\n' +
                 '• Habari za mchana - Good afternoon / Selamat siang\n' +
                 '• Habari za jioni - Good evening / Selamat malam',
        language: 'Swahili',
        created_by: adminId,
        created_at: new Date()
      }
    ]);    // Get the ids of the inserted lessons
    const [lessons] = await queryInterface.sequelize.query(
      `SELECT id, title FROM lessons ORDER BY id`
    );

    // Find lesson IDs
    const lessonMap = {};
    lessons.forEach(lesson => {
      lessonMap[lesson.title] = lesson.id;
    });

    // Insert comprehensive quizzes for all lessons
    await queryInterface.bulkInsert('quizzes', [
      // Spanish Greetings Quiz
      {
        lesson_id: lessonMap['Basic Spanish Greetings'],
        question: 'Bagaimana cara mengucapkan "Halo" dalam bahasa Spanyol?',
        options: JSON.stringify({
          "A": "Hola",
          "B": "Buenos días",
          "C": "Gracias",
          "D": "Adiós"
        }),
        answer: 'A'
      },
      {
        lesson_id: lessonMap['Basic Spanish Greetings'],
        question: 'Apa kata dalam bahasa Spanyol untuk "Selamat pagi"?',
        options: JSON.stringify({
          "A": "Buenas tardes",
          "B": "Buenos días",
          "C": "Buenas noches",
          "D": "¿Cómo estás?"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Basic Spanish Greetings'],
        question: 'Bagaimana cara bertanya "Apa kabar?" dalam bahasa Spanyol?',
        options: JSON.stringify({
          "A": "Estoy bien",
          "B": "Mucho gusto",
          "C": "¿Cómo estás?",
          "D": "Buenas noches"
        }),
        answer: 'C'
      },
      
      // Spanish Numbers Quiz
      {
        lesson_id: lessonMap['Spanish Numbers 1-20'],
        question: 'Apa arti "cinco" dalam bahasa Indonesia?',
        options: JSON.stringify({
          "A": "Empat",
          "B": "Lima",
          "C": "Enam",
          "D": "Tujuh"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Spanish Numbers 1-20'],
        question: 'Bagaimana cara menyebutkan angka "15" dalam bahasa Spanyol?',
        options: JSON.stringify({
          "A": "catorce",
          "B": "quince",
          "C": "dieciséis",
          "D": "diecisiete"
        }),
        answer: 'B'
      },
      
      // French Introduction Quiz
      {
        lesson_id: lessonMap['French Basics: Introduction'],
        question: 'Bagaimana cara memperkenalkan nama dalam bahasa Prancis?',
        options: JSON.stringify({
          "A": "Comment ça va?",
          "B": "Je m'appelle...",
          "C": "Merci beaucoup",
          "D": "Au revoir"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['French Basics: Introduction'],
        question: 'Apa arti kata "Merci" dalam bahasa Indonesia?',
        options: JSON.stringify({
          "A": "Halo",
          "B": "Selamat tinggal",
          "C": "Terima kasih",
          "D": "Apa kabar?"
        }),
        answer: 'C'
      },
      
      // French Colors Quiz
      {
        lesson_id: lessonMap['French Colors'],
        question: 'Apa arti "rouge" dalam bahasa Indonesia?',
        options: JSON.stringify({
          "A": "Biru",
          "B": "Hijau",
          "C": "Merah",
          "D": "Kuning"
        }),
        answer: 'C'
      },
      {
        lesson_id: lessonMap['French Colors'],
        question: 'Bagaimana cara menyebutkan "putih" dalam bahasa Prancis?',
        options: JSON.stringify({
          "A": "noir",
          "B": "blanc",
          "C": "vert",
          "D": "bleu"
        }),
        answer: 'B'
      },
      
      // Japanese Hiragana Quiz
      {
        lesson_id: lessonMap['Japanese Hiragana Basics'],
        question: 'Bunyi apa yang dihasilkan huruf hiragana "あ"?',
        options: JSON.stringify({
          "A": "i",
          "B": "u",
          "C": "a",
          "D": "e"
        }),
        answer: 'C'
      },
      {
        lesson_id: lessonMap['Japanese Hiragana Basics'],
        question: 'Hiragana mana yang mewakili bunyi "ko"?',
        options: JSON.stringify({
          "A": "か",
          "B": "き",
          "C": "く",
          "D": "こ"
        }),
        answer: 'D'
      },
      
      // Japanese Greetings Quiz
      {
        lesson_id: lessonMap['Japanese Greetings'],
        question: 'Bagaimana cara mengucapkan "Selamat pagi" yang sopan dalam bahasa Jepang?',
        options: JSON.stringify({
          "A": "おはよう",
          "B": "おはようございます",
          "C": "こんにちは",
          "D": "こんばんは"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Japanese Greetings'],
        question: 'Apa arti "ありがとうございます" dalam bahasa Indonesia?',
        options: JSON.stringify({
          "A": "Selamat pagi",
          "B": "Selamat tinggal",
          "C": "Terima kasih",
          "D": "Permisi"
        }),
        answer: 'C'
      },
      
      // Javanese Basic Greetings Quiz
      {
        lesson_id: lessonMap['Javanese Basic Greetings'],
        question: 'Bagaimana cara mengucapkan "Selamat pagi" dalam bahasa Jawa halus (Krama)?',
        options: JSON.stringify({
          "A": "Selamat esuk",
          "B": "Sugeng enjing",
          "C": "Selamat pagi",
          "D": "Sugeng siyang"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Javanese Basic Greetings'],
        question: 'Apa arti "Piye kabare?" dalam bahasa Indonesia?',
        options: JSON.stringify({
          "A": "Selamat pagi",
          "B": "Terima kasih",
          "C": "Bagaimana kabarnya?",
          "D": "Selamat malam"
        }),
        answer: 'C'
      },
      
      // Javanese Family Terms Quiz
      {
        lesson_id: lessonMap['Javanese Family Terms'],
        question: 'Apa kata bahasa Jawa halus untuk "ayah"?',
        options: JSON.stringify({
          "A": "Bapak",
          "B": "Rama",
          "C": "Ayah",
          "D": "Papa"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Javanese Family Terms'],
        question: 'Bagaimana cara menyebut "kakak perempuan" dalam bahasa Jawa kasar?',
        options: JSON.stringify({
          "A": "Mbakyu",
          "B": "Kakang",
          "C": "Mbak",
          "D": "Adhi"
        }),
        answer: 'A'
      },
      
      // Korean Hangul Quiz
      {
        lesson_id: lessonMap['Korean Hangul Basics'],
        question: 'Bunyi apa yang dihasilkan huruf hangul "ㅏ"?',
        options: JSON.stringify({
          "A": "o",
          "B": "u",
          "C": "a",
          "D": "i"
        }),
        answer: 'C'
      },
      {
        lesson_id: lessonMap['Korean Hangul Basics'],
        question: 'Konsonan mana yang mewakili bunyi "m"?',
        options: JSON.stringify({
          "A": "ㄴ",
          "B": "ㅁ",
          "C": "ㄹ",
          "D": "ㅂ"
        }),
        answer: 'B'
      },
      
      // Korean Greetings Quiz
      {
        lesson_id: lessonMap['Korean Greetings'],
        question: 'Bagaimana cara mengucapkan "Halo" secara formal dalam bahasa Korea?',
        options: JSON.stringify({
          "A": "안녕",
          "B": "안녕하세요",
          "C": "감사합니다",
          "D": "죄송합니다"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Korean Greetings'],
        question: 'Apa arti "감사합니다" dalam bahasa Indonesia?',
        options: JSON.stringify({
          "A": "Halo",
          "B": "Selamat tinggal",
          "C": "Terima kasih",
          "D": "Maaf"
        }),
        answer: 'C'
      },
      
      // German Quiz
      {
        lesson_id: lessonMap['German Basics'],
        question: 'Bagaimana cara mengucapkan "Selamat malam" dalam bahasa Jerman?',
        options: JSON.stringify({
          "A": "Guten Morgen",
          "B": "Guten Tag",
          "C": "Guten Abend",
          "D": "Gute Nacht"
        }),
        answer: 'C'
      },
      {
        lesson_id: lessonMap['German Basics'],
        question: 'Apa arti kata "Danke" dalam bahasa Indonesia?',
        options: JSON.stringify({
          "A": "Tolong",
          "B": "Terima kasih",
          "C": "Permisi",
          "D": "Selamat tinggal"
        }),
        answer: 'B'
      },
      
      // Chinese Quiz
      {
        lesson_id: lessonMap['Chinese Pinyin and Tones'],
        question: 'Berapa jumlah nada dasar dalam bahasa Mandarin?',
        options: JSON.stringify({
          "A": "3",
          "B": "4",
          "C": "5",
          "D": "6"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Chinese Pinyin and Tones'],
        question: 'Apa arti "你好" dalam bahasa Indonesia?',
        options: JSON.stringify({
          "A": "Terima kasih",
          "B": "Selamat tinggal",
          "C": "Halo",
          "D": "Maaf"
        }),
        answer: 'C'
      },
      
      // Arabic Quiz
      {
        lesson_id: lessonMap['Arabic Alphabet Introduction'],
        question: 'Bunyi apa yang dihasilkan huruf Arab "ب"?',
        options: JSON.stringify({
          "A": "A",
          "B": "B",
          "C": "T",
          "D": "J"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Arabic Alphabet Introduction'],
        question: 'Bagaimana cara membalas salam "السلام عليكم"?',
        options: JSON.stringify({
          "A": "شكرا",
          "B": "أهلا وسهلا",
          "C": "وعليكم السلام",
          "D": "مع السلامة"
        }),
        answer: 'C'
      },
      
      // Italian Quiz
      {
        lesson_id: lessonMap['Italian Basic Phrases'],
        question: 'Bagaimana cara mengucapkan "Selamat pagi" dalam bahasa Italia?',
        options: JSON.stringify({
          "A": "Ciao",
          "B": "Buongiorno",
          "C": "Buonasera",
          "D": "Arrivederci"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Italian Basic Phrases'],
        question: 'Apa arti kata "Grazie"?',
        options: JSON.stringify({
          "A": "Halo",
          "B": "Selamat tinggal",
          "C": "Tolong",
          "D": "Terima kasih"
        }),
        answer: 'D'
      },
      
      // Portuguese Quiz
      {
        lesson_id: lessonMap['Portuguese Greetings'],
        question: 'Bagaimana cara mengucapkan "Selamat siang" dalam bahasa Portugis?',
        options: JSON.stringify({
          "A": "Bom dia",
          "B": "Boa tarde",
          "C": "Boa noite",
          "D": "Olá"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Portuguese Greetings'],
        question: 'Apa perbedaan antara "Obrigado" dan "Obrigada"?',
        options: JSON.stringify({
          "A": "Formal vs informal",
          "B": "Pembicara laki-laki vs perempuan",
          "C": "Pagi vs malam",
          "D": "Tunggal vs jamak"
        }),
        answer: 'B'
      },
      
      // Dutch Quiz
      {
        lesson_id: lessonMap['Dutch Basic Conversation'],
        question: 'Bagaimana cara mengucapkan "Selamat pagi" dalam bahasa Belanda?',
        options: JSON.stringify({
          "A": "Goedemorgen",
          "B": "Goedemiddag",
          "C": "Goedenavond",
          "D": "Hallo"
        }),
        answer: 'A'
      },
      {
        lesson_id: lessonMap['Dutch Basic Conversation'],
        question: 'Apa arti "Dank je wel"?',
        options: JSON.stringify({
          "A": "Halo",
          "B": "Selamat tinggal",
          "C": "Terima kasih",
          "D": "Permisi"
        }),
        answer: 'C'
      },
      
      // Russian Quiz
      {
        lesson_id: lessonMap['Russian Cyrillic Alphabet'],
        question: 'Bunyi apa yang dihasilkan huruf "В"?',
        options: JSON.stringify({
          "A": "B",
          "B": "V",
          "C": "G",
          "D": "D"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Russian Cyrillic Alphabet'],
        question: 'Bagaimana cara mengucapkan "Halo" secara formal dalam bahasa Rusia?',
        options: JSON.stringify({
          "A": "Привет",
          "B": "Здравствуйте",
          "C": "Спасибо",
          "D": "До свидания"
        }),
        answer: 'B'
      },
      
      // Hindi Devanagari Quiz
      {
        lesson_id: lessonMap['Hindi Devanagari Script Basics'],
        question: 'Bunyi apa yang dihasilkan huruf "क"?',
        options: JSON.stringify({
          "A": "Ga",
          "B": "Ka",
          "C": "Cha",
          "D": "Ta"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Hindi Devanagari Script Basics'],
        question: 'Vokal mana yang mewakili bunyi "aa"?',
        options: JSON.stringify({
          "A": "अ",
          "B": "आ",
          "C": "इ",
          "D": "उ"
        }),
        answer: 'B'
      },
      
      // Hindi Greetings Quiz
      {
        lesson_id: lessonMap['Hindi Basic Greetings'],
        question: 'Apa arti "नमस्ते"?',
        options: JSON.stringify({
          "A": "Terima kasih",
          "B": "Selamat pagi",
          "C": "Halo/Selamat tinggal",
          "D": "Permisi"
        }),
        answer: 'C'
      },
      {
        lesson_id: lessonMap['Hindi Basic Greetings'],
        question: 'Bagaimana cara mengucapkan "Terima kasih" dalam bahasa Hindi?',
        options: JSON.stringify({
          "A": "नमस्ते",
          "B": "धन्यवाद",
          "C": "क्षमा करें",
          "D": "अलविदा"
        }),
        answer: 'B'
      },
      
      // Thai Script Quiz
      {
        lesson_id: lessonMap['Thai Script Introduction'],
        question: 'Bunyi apa yang dihasilkan huruf "ก"?',
        options: JSON.stringify({
          "A": "K",
          "B": "G",
          "C": "J",
          "D": "N"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Thai Script Introduction'],
        question: 'Konsonan Thai mana yang mewakili bunyi "m"?',
        options: JSON.stringify({
          "A": "น",
          "B": "ร",
          "C": "ม",
          "D": "ล"
        }),
        answer: 'C'
      },
      
      // Thai Greetings Quiz
      {
        lesson_id: lessonMap['Thai Greetings and Politeness'],
        question: 'Bagaimana cara mengucapkan "Halo" dalam bahasa Thai?',
        options: JSON.stringify({
          "A": "สบายดี",
          "B": "ขอบคุณ",
          "C": "สวัสดี",
          "D": "ขอโทษ"
        }),
        answer: 'C'
      },
      {
        lesson_id: lessonMap['Thai Greetings and Politeness'],
        question: 'Partikel sopan apa yang digunakan perempuan dalam bahasa Thai?',
        options: JSON.stringify({
          "A": "ครับ",
          "B": "ค่ะ",
          "C": "ไหม",
          "D": "ดี"
        }),
        answer: 'B'
      },
      
      // Vietnamese Quiz
      {
        lesson_id: lessonMap['Vietnamese Tones and Pronunciation'],
        question: 'Berapa jumlah nada dalam bahasa Vietnam?',
        options: JSON.stringify({
          "A": "4",
          "B": "5",
          "C": "6",
          "D": "7"
        }),
        answer: 'C'
      },
      {
        lesson_id: lessonMap['Vietnamese Tones and Pronunciation'],
        question: 'Bagaimana cara mengucapkan "Terima kasih" dalam bahasa Vietnam?',
        options: JSON.stringify({
          "A": "Xin chào",
          "B": "Cảm ơn",
          "C": "Xin lỗi",
          "D": "Tôi khỏe"
        }),
        answer: 'B'
      },
      
      // Turkish Quiz
      {
        lesson_id: lessonMap['Turkish Basic Phrases'],
        question: 'Bagaimana cara mengucapkan "Selamat pagi" dalam bahasa Turki?',
        options: JSON.stringify({
          "A": "Merhaba",
          "B": "İyi akşamlar",
          "C": "Günaydın",
          "D": "İyi geceler"
        }),
        answer: 'C'
      },
      {
        lesson_id: lessonMap['Turkish Basic Phrases'],
        question: 'Apa arti "Teşekkür ederim"?',
        options: JSON.stringify({
          "A": "Halo",
          "B": "Terima kasih",
          "C": "Selamat tinggal",
          "D": "Permisi"
        }),
        answer: 'B'
      },
      
      // Swahili Quiz
      {
        lesson_id: lessonMap['Swahili Greetings and Culture'],
        question: 'Bagaimana cara menyapa satu orang dalam bahasa Swahili?',
        options: JSON.stringify({
          "A": "Hamjambo",
          "B": "Hujambo",
          "C": "Habari",
          "D": "Kwaheri"
        }),
        answer: 'B'
      },
      {
        lesson_id: lessonMap['Swahili Greetings and Culture'],
        question: 'Apa arti "Asante" dalam bahasa Indonesia?',
        options: JSON.stringify({
          "A": "Halo",
          "B": "Selamat tinggal",
          "C": "Terima kasih",
          "D": "Apa kabar?"
        }),
        answer: 'C'
      }
    ]);

    // Get user IDs for progress and comments
    const [allUsers] = await queryInterface.sequelize.query(
      `SELECT id, name FROM users WHERE role = 'user' ORDER BY id`
    );

    // Insert sample progress data
    const progressData = [];
    const commentData = [];
    
    // Create progress for different users on different lessons
    allUsers.forEach((user, userIndex) => {
      lessons.forEach((lesson, lessonIndex) => {
        // Create varied progress - some completed, some in progress
        if ((userIndex + lessonIndex) % 3 === 0) {
          // Completed lessons with good scores
          progressData.push({
            user_id: user.id,
            lesson_id: lesson.id,
            is_completed: true,
            score: 80 + Math.floor(Math.random() * 20) // Score between 80-99
          });
        } else if ((userIndex + lessonIndex) % 3 === 1) {
          // Partially completed lessons
          progressData.push({
            user_id: user.id,
            lesson_id: lesson.id,
            is_completed: false,
            score: 40 + Math.floor(Math.random() * 40) // Score between 40-79
          });
        }
        // Some lessons will have no progress (not started)
      });
    });

    await queryInterface.bulkInsert('progress', progressData);

    // Insert sample comments
    const sampleComments = [
      {
        lesson_title: 'Basic Spanish Greetings',
        comments: [
          { user_name: 'Maria Rodriguez', comment: 'Wah keren banget nih pelajarannya! Sekarang gue udah bisa nyapa orang Spanyol dengan PD 😎' },
          { user_name: 'Student Learner', comment: 'Tips pronounciationnya mantul banget deh, contoh-contohnya juga real life gitu' },
          { user_name: 'Regular User', comment: 'Pengenalan bahasa Spanyol yang oke punya! Nunggu lesson selanjutnya nih 🔥' }
        ]
      },
      {
        lesson_title: 'Japanese Hiragana Basics',
        comments: [
          { user_name: 'Sato Takeshi', comment: 'Sebagai native speaker, menurut gue ini cara yang bagus banget buat introduce hiragana ke pemula' },
          { user_name: 'Language Teacher', comment: 'Step by step approach nya excellent! Cocok banget buat yang mau belajar writing system Jepang' },
          { user_name: 'Ahmad Hassan', comment: 'Awalnya hiragana tuh keliatan scary, tapi lesson ini bikin jadi approachable banget sih' }
        ]
      },
      {
        lesson_title: 'Javanese Basic Greetings',
        comments: [
          { user_name: 'Budi Santoso', comment: 'Mantep tenan iki! Perbedaan ngoko sama krama dijelasin dengan detail banget' },
          { user_name: 'Student Learner', comment: 'Appreciate banget bisa belajar formal sama informal level nya culture Jawa' },
          { user_name: 'Language Teacher', comment: 'Ini penting banget sih buat ngerti social hierarchy Jawa lewat bahasanya' }
        ]
      },
      {
        lesson_title: 'Korean Greetings',
        comments: [
          { user_name: 'Regular User', comment: 'Pronunciation Korea emang tricky, tapi romanization nya ngebantu banget!' },
          { user_name: 'Maria Rodriguez', comment: 'Formal sama informal distinction nya mirip-mirip sama Spanish dalam beberapa hal' },
          { user_name: 'Ahmad Hassan', comment: 'Great lesson! Culture Korea yang emphasis sama respect keliatan banget di bahasanya' }
        ]
      },
      {
        lesson_title: 'French Colors',
        comments: [
          { user_name: 'Language Teacher', comment: 'Warna-warna emang essential vocab sih. Lesson ini cover semua basics nya dengan apik' },
          { user_name: 'Student Learner', comment: 'Sekarang gue bisa describe things in French! Pronunciation guide nya helpful banget' }
        ]
      },
      {
        lesson_title: 'Arabic Alphabet Introduction',
        comments: [
          { user_name: 'Ahmad Hassan', comment: 'جيد جداً! Ini introduction yang bagus banget buat Arabic letters untuk pemula' },
          { user_name: 'Budi Santoso', comment: 'Right-to-left writing system nya fascinating banget. Penjelasannya kece!' },
          { user_name: 'Regular User', comment: 'Arabic script emang cakep banget. Lesson ini bikin jadi less intimidating buat dipelajari' }
        ]
      },
      {
        lesson_title: 'Chinese Pinyin and Tones',
        comments: [
          { user_name: 'Sato Takeshi', comment: 'Tones itu crucial banget di Chinese. Lesson ini explain dengan sangat clear' },
          { user_name: 'Language Teacher', comment: 'Contoh-contoh tone dengan different meanings nya very effective banget buat teaching' },
          { user_name: 'Student Learner', comment: 'Akhirnya gue paham kenapa tones matter banget di Chinese! 🤯' }
        ]
      },
      {
        lesson_title: 'Thai Greetings and Politeness',
        comments: [
          { user_name: 'Regular User', comment: 'Polite particles nya unik banget! Beda-beda tergantung gender yang ngomong' },
          { user_name: 'Language Teacher', comment: 'Thai culture yang emphasis politeness keliatan banget dari struktur bahasanya' }
        ]
      },
      {
        lesson_title: 'German Basics',
        comments: [
          { user_name: 'Student Learner', comment: 'German pronunciation nya challenging, tapi lesson ini bikin jadi manageable' },
          { user_name: 'Ahmad Hassan', comment: 'Struktur salam-salam nya sistematis banget, gampang diingat!' }
        ]
      },
      {
        lesson_title: 'Vietnamese Tones and Pronunciation',
        comments: [
          { user_name: 'Maria Rodriguez', comment: '6 tones?! Wow, Vietnamese emang next level ya 😅 Untung ada contohnya' },
          { user_name: 'Budi Santoso', comment: 'Tone system nya mind-blowing! Satu kata bisa beda arti total cuma gara-gara tone' }
        ]
      }
    ];

    // Insert comments
    for (const lessonComments of sampleComments) {
      const lesson = lessons.find(l => l.title === lessonComments.lesson_title);
      if (lesson) {
        for (const comment of lessonComments.comments) {
          const user = allUsers.find(u => u.name === comment.user_name);
          if (user) {
            commentData.push({
              user_id: user.id,
              lesson_id: lesson.id,
              comment: comment.comment,
              created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date within last 30 days
            });
          }
        }
      }
    }

    await queryInterface.bulkInsert('comments', commentData);
  },
  down: async (queryInterface, Sequelize) => {
    // Remove data in reverse order to respect foreign key constraints
    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('progress', null, {});
    await queryInterface.bulkDelete('quizzes', null, {});
    await queryInterface.bulkDelete('lessons', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
