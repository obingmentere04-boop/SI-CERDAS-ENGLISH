import { Quiz, QuizQuestion, GradeLevel } from '../types';

export const initialFiftyQuestions: QuizQuestion[] = [
  // 40 PILIHAN GANDA (1 s.d. 40)
  {
    id: 'q-50-1',
    type: 'mc',
    questionText: 'When you meet your teacher at the school gate at 06:45 a.m., what is the best greeting to say?',
    options: ['Good morning, Sir/Ma\'am.', 'Good afternoon, Sir/Ma\'am.', 'Good evening, Sir/Ma\'am.', 'Good night, Sir/Ma\'am.'],
    correctAnswer: 0,
    explanation: 'Pukul 06.45 pagi menggunakan salam "Good morning".',
    points: 2
  },
  {
    id: 'q-50-2',
    type: 'mc',
    questionText: 'Complete the dialogue: Rian: "Hi Maya, how are you today?" - Maya: "___"',
    options: ['I am fine, thank you. And you?', 'I am 13 years old.', 'My name is Maya.', 'Nice to meet you.'],
    correctAnswer: 0,
    explanation: 'Jawaban yang tepat untuk menanyakan kabar "How are you today?" adalah "I am fine, thank you. And you?".',
    points: 2
  },
  {
    id: 'q-50-3',
    type: 'mc',
    questionText: 'Complete the sentence: "Hello, my name ___ Farhan and I am in Grade VII."',
    options: ['is', 'are', 'am', 'be'],
    correctAnswer: 0,
    explanation: 'Subjek "my name" adalah kata benda tunggal (it), sehingga menggunakan to be "is".',
    points: 2
  },
  {
    id: 'q-50-4',
    type: 'mc',
    questionText: 'Andi: "Dewi, this is my classmate, Budi." - Dewi: "Hello Budi, ___"',
    options: ['Glad to meet you.', 'I am leaving now.', 'Good night.', 'What is your address?'],
    correctAnswer: 0,
    explanation: 'Saat diperkenalkan kepada orang baru, respons kesantunan yang tepat adalah "Glad to meet you" atau "Nice to meet you".',
    points: 2
  },
  {
    id: 'q-50-5',
    type: 'mc',
    questionText: 'Which pronoun correctly replaces the underlined words? "Siti and Rahma practice speaking English together every day."',
    options: ['They', 'We', 'She', 'Them'],
    correctAnswer: 0,
    explanation: 'Subjek jamak orang ketiga "Siti and Rahma" digantikan dengan pronoun "They".',
    points: 2
  },
  {
    id: 'q-50-6',
    type: 'mc',
    questionText: 'Which preposition is used for specific pinpoint street address with house number? "Rani lives ___ Diponegoro Street No. 24."',
    options: ['at', 'in', 'on', 'by'],
    correctAnswer: 0,
    explanation: 'Alamat spesifik yang mencantumkan nomor rumah menggunakan preposisi "at".',
    points: 2
  },
  {
    id: 'q-50-7',
    type: 'mc',
    questionText: 'Choose the correct Simple Present sentence with subject "She":',
    options: ['She studies English diligently every night.', 'She study English diligently every night.', 'She is study English diligently every night.', 'She studying English diligently every night.'],
    correctAnswer: 0,
    explanation: 'Subjek orang ketiga tunggal "She" memerlukan penambahan akhiran -ies pada kata kerja "study" -> "studies".',
    points: 2
  },
  {
    id: 'q-50-8',
    type: 'mc',
    questionText: 'What is the opposite (antonym) of the word "COURAGE"?',
    options: ['Fear / Cowardice', 'Bravery', 'Strength', 'Confidence'],
    correctAnswer: 0,
    explanation: 'Lawan kata dari "courage" (keberanian) adalah "fear" (ketakutan) atau "cowardice" (kebengecutan).',
    points: 2
  },
  {
    id: 'q-50-9',
    type: 'mc',
    questionText: 'Teacher: "Attention, class! Please open your book to page 15." - Students: "___"',
    options: ['Yes, Sir/Ma\'am.', 'No, thank you.', 'Never mind.', 'You are welcome.'],
    correctAnswer: 0,
    explanation: 'Respons patuh dan santun saat guru meminta perhatian adalah "Yes, Sir!" atau "Yes, Ma\'am!".',
    points: 2
  },
  {
    id: 'q-50-10',
    type: 'mc',
    questionText: 'Which expression is used to ask for clarification when you do not hear clearly?',
    options: ['Pardon me, could you please repeat that?', 'I don\'t care.', 'Be quiet please.', 'Good job!'],
    correctAnswer: 0,
    explanation: '"Pardon me, could you please repeat that?" adalah ungkapan santun meminta pengulangan ucapan.',
    points: 2
  },
  {
    id: 'q-50-11',
    type: 'mc',
    questionText: 'Complete the sentence: "We ___ very enthusiastic about studying in the multimedia room."',
    options: ['are', 'is', 'am', 'was'],
    correctAnswer: 0,
    explanation: 'Subjek "We" berpasangan dengan to be "are" dalam Simple Present.',
    points: 2
  },
  {
    id: 'q-50-12',
    type: 'mc',
    questionText: 'In a Descriptive Text, what is the purpose of the "Identification" section?',
    options: ['To introduce and identify the specific person, place, or thing to be described', 'To give step-by-step instructions', 'To tell past events chronologically', 'To state arguments on an issue'],
    correctAnswer: 0,
    explanation: 'Bagian Identification bertujuan memperkenalkan objek/tokoh yang akan digambarkan.',
    points: 2
  },
  {
    id: 'q-50-13',
    type: 'mc',
    questionText: 'Edo: "Thank you so much for lending me your English dictionary." - Budi: "___"',
    options: ['You are welcome.', 'I am sorry.', 'Never see you.', 'Good morning.'],
    correctAnswer: 0,
    explanation: 'Respons paling tepat untuk ungkapan terima kasih adalah "You are welcome".',
    points: 2
  },
  {
    id: 'q-50-14',
    type: 'mc',
    questionText: 'Identify the adjective in the sentence: "The diligent boy always finishes his English tasks on time."',
    options: ['Diligent', 'Boy', 'Finishes', 'Tasks'],
    correctAnswer: 0,
    explanation: '"Diligent" (rajin) adalah kata sifat (adjective) yang menerangkan kata benda "boy".',
    points: 2
  },
  {
    id: 'q-50-15',
    type: 'mc',
    questionText: 'Before going to bed at 09:30 p.m., what parting expression do you say to your family?',
    options: ['Good night, sleep tight.', 'Good morning.', 'Good afternoon.', 'Good day.'],
    correctAnswer: 0,
    explanation: '"Good night" digunakan sebagai salam perpisahan ketika hendak beristirahat tidur malam.',
    points: 2
  },
  {
    id: 'q-50-16',
    type: 'mc',
    questionText: 'Which modal verb expresses ability in: "Siti ___ speak English clearly and confidently"?',
    options: ['can', 'must', 'should', 'might'],
    correctAnswer: 0,
    explanation: 'Modal "can" digunakan untuk menyatakan kemampuan (ability).',
    points: 2
  },
  {
    id: 'q-50-17',
    type: 'mc',
    questionText: 'What is the motto of SI CERDAS ENGLISH?',
    options: ['Learn with Confidence, Speak with Courage!', 'Work Hard, Play Hard', 'English is Difficult', 'Grammar is Everything'],
    correctAnswer: 0,
    explanation: 'Moto resmi SI CERDAS ENGLISH adalah "Learn with Confidence, Speak with Courage!".',
    points: 2
  },
  {
    id: 'q-50-18',
    type: 'mc',
    questionText: 'Complete the interrogative question: "___ your father go to work by motorcycle every morning?"',
    options: ['Does', 'Do', 'Is', 'Are'],
    correctAnswer: 0,
    explanation: 'Subjek orang ketiga tunggal "your father" (he) menggunakan kata kerja bantu "Does".',
    points: 2
  },
  {
    id: 'q-50-19',
    type: 'mc',
    questionText: 'Which expression shows greeting someone you haven\'t seen in a long time?',
    options: ['Long time no see! How have you been?', 'Goodbye, see you tomorrow.', 'Please forgive me.', 'Excuse me, where is the canteen?'],
    correctAnswer: 0,
    explanation: '"Long time no see!" adalah ungkapan ramah saat bertemu kawan yang sudah lama tidak berjumpa.',
    points: 2
  },
  {
    id: 'q-50-20',
    type: 'mc',
    questionText: 'What is the main communicative goal of an Announcement Text in school?',
    options: ['To give official information about an event or notice to the school community', 'To amuse readers with a funny cartoon', 'To describe the physical traits of a teacher', 'To retell holiday memories'],
    correctAnswer: 0,
    explanation: 'Teks pengumuman bertujuan menyampaikan informasi penting secara resmi.',
    points: 2
  },
  {
    id: 'q-50-21',
    type: 'mc',
    questionText: 'Arrange the words into a correct order: [always / English songs / listens to / Maya]',
    options: ['Maya always listens to English songs.', 'English songs Maya always listens to.', 'Listens to Maya always English songs.', 'Always Maya listens to English songs.'],
    correctAnswer: 0,
    explanation: 'Pola susunan: Subject (Maya) + Adverb of frequency (always) + Verb (listens to) + Object (English songs).',
    points: 2
  },
  {
    id: 'q-50-22',
    type: 'mc',
    questionText: 'Which coordinating conjunction indicates contrast? "He is tired, ___ he keeps practicing speaking."',
    options: ['yet / but', 'so', 'and', 'or'],
    correctAnswer: 0,
    explanation: '"Yet" atau "but" digunakan untuk menghubungkan dua pernyataan yang bertentangan.',
    points: 2
  },
  {
    id: 'q-50-23',
    type: 'mc',
    questionText: 'What is the plural form of the irregular noun "tooth"?',
    options: ['teeth', 'tooths', 'toothes', 'teethes'],
    correctAnswer: 0,
    explanation: 'Bentuk jamak tidak beraturan dari "tooth" adalah "teeth".',
    points: 2
  },
  {
    id: 'q-50-24',
    type: 'mc',
    questionText: 'What is the generic structure of a Recount Text?',
    options: ['Orientation - Events - Reorientation', 'Goal - Materials - Steps', 'Identification - Description', 'Thesis - Arguments - Recommendation'],
    correctAnswer: 0,
    explanation: 'Struktur teks recount: Orientation (pengenalan), Events (rentetan peristiwa), Reorientation (penutup).',
    points: 2
  },
  {
    id: 'q-50-25',
    type: 'mc',
    questionText: 'Select the sentence that correctly uses the Simple Past Tense:',
    options: ['We participated in the English speech contest yesterday.', 'We participate in the English speech contest yesterday.', 'We are participate in the English speech contest yesterday.', 'We participating in the English speech contest yesterday.'],
    correctAnswer: 0,
    explanation: 'Penanda waktu "yesterday" mewajibkan kata kerja bentuk lampau (Verb 2): "participated".',
    points: 2
  },
  {
    id: 'q-50-26',
    type: 'mc',
    questionText: 'Choose the correct question tag: "You love speaking English with AI Miss Sarah, ___?"',
    options: ['don\'t you', 'aren\'t you', 'do you', 'won\'t you'],
    correctAnswer: 0,
    explanation: 'Kalimat positif Simple Present dengan kata kerja "love" berpasangan dengan question tag "don\'t you".',
    points: 2
  },
  {
    id: 'q-50-27',
    type: 'mc',
    questionText: 'What are the main components of a Procedure Text?',
    options: ['Goal / Aim, Materials / Ingredients, and Steps / Methods', 'Orientation, Complication, and Resolution', 'Identification and Physical Description', 'Abstract, Body, and Conclusion'],
    correctAnswer: 0,
    explanation: 'Komponen teks prosedur terdiri dari Goal (tujuan), Materials (alat/bahan), dan Steps (langkah-langkah).',
    points: 2
  },
  {
    id: 'q-50-28',
    type: 'mc',
    questionText: 'Complete: "There ___ a big English laboratory and three computer rooms in our school."',
    options: ['is', 'are', 'were', 'am'],
    correctAnswer: 0,
    explanation: 'Ketika frasa kata benda pertama setelah "there" adalah tunggal ("a big English laboratory"), kita menggunakan "There is".',
    points: 2
  },
  {
    id: 'q-50-29',
    type: 'mc',
    questionText: 'Choose the correct imperative sentence for giving positive classroom instructions:',
    options: ['Speak louder and be confident!', 'You are speaking louder.', 'Do you speak louder?', 'Why speak louder?'],
    correctAnswer: 0,
    explanation: 'Kalimat perintah (imperative) diawali dengan kata kerja dasar "Speak...".',
    points: 2
  },
  {
    id: 'q-50-30',
    type: 'mc',
    questionText: 'Which word is a synonym of "AWESOME" in expressing appreciation?',
    options: ['Wonderful / Fantastic', 'Awful', 'Boring', 'Difficult'],
    correctAnswer: 0,
    explanation: '"Wonderful" dan "fantastic" adalah sinonim dari kata apresiasi "awesome" (luar biasa).',
    points: 2
  },
  {
    id: 'q-50-31',
    type: 'mc',
    questionText: 'When your friend wins the English storytelling contest, what do you say?',
    options: ['Congratulations on your great victory! I am proud of you.', 'I am sorry to hear that.', 'Never mind.', 'You should study harder.'],
    correctAnswer: 0,
    explanation: '"Congratulations on..." adalah ungkapan ucapan selamat atas prestasi seseorang.',
    points: 2
  },
  {
    id: 'q-50-32',
    type: 'mc',
    questionText: 'Complete with the superlative adjective: "This is the ___ English quiz I have ever taken."',
    options: ['most interesting', 'more interesting', 'interestingest', 'as interesting'],
    correctAnswer: 0,
    explanation: 'Kata sifat dengan lebih dari dua suku kata "interesting" menggunakan awalan "most" dalam bentuk superlative: "the most interesting".',
    points: 2
  },
  {
    id: 'q-50-33',
    type: 'mc',
    questionText: 'What does the caution sign "SILENCE, EXAMINATION IN PROGRESS" mean?',
    options: ['You must not make any noise because an exam is taking place.', 'You are allowed to shout loudly.', 'The classroom is empty.', 'Students may play games here.'],
    correctAnswer: 0,
    explanation: 'Tanda tersebut menginstruksikan pengunjung dan siswa untuk hening karena sedang ada ujian.',
    points: 2
  },
  {
    id: 'q-50-34',
    type: 'mc',
    questionText: 'Identify the adverb in the sentence: "Andi answered the English questions easily."',
    options: ['Easily', 'Answered', 'Questions', 'English'],
    correctAnswer: 0,
    explanation: '"Easily" (dengan mudah) adalah adverb of manner yang menerangkan kata kerja "answered".',
    points: 2
  },
  {
    id: 'q-50-35',
    type: 'mc',
    questionText: 'Which sentence is written in the Present Continuous Tense?',
    options: ['The students are listening to the audio script carefully.', 'The students listened to the audio script yesterday.', 'The students listen to the audio script every day.', 'The students will listen to the audio script.'],
    correctAnswer: 0,
    explanation: 'Pola "to be (are) + Verb-ing (listening)" menyatakan kejadian yang sedang berlangsung saat ini.',
    points: 2
  },
  {
    id: 'q-50-36',
    type: 'mc',
    questionText: 'What is the characteristic resolution in a Narrative Text?',
    options: ['The crisis or problem faced by the characters is resolved', 'The characters are introduced for the first time', 'The steps of making food are listed', 'The moral message is removed'],
    correctAnswer: 0,
    explanation: 'Tahap Resolution dalam teks naratif adalah saat masalah atau konflik utama berhasil diselesaikan.',
    points: 2
  },
  {
    id: 'q-50-37',
    type: 'mc',
    questionText: 'Which sentence shows polite asking for permission from a teacher?',
    options: ['May I borrow an English dictionary, Sir?', 'Give me that dictionary now.', 'I must take your book.', 'You have to give me the dictionary.'],
    correctAnswer: 0,
    explanation: '"May I...?" adalah bentuk permohonan izin yang paling santun dalam bahasa Inggris.',
    points: 2
  },
  {
    id: 'q-50-38',
    type: 'mc',
    questionText: 'Complete the sentence: "You ___ drink more water after doing physical exercise."',
    options: ['should', 'should not', 'are', 'were'],
    correctAnswer: 0,
    explanation: 'Modal "should" digunakan untuk memberikan anjuran atau saran positif yang bermanfaat.',
    points: 2
  },
  {
    id: 'q-50-39',
    type: 'mc',
    questionText: 'Which statement demonstrates an expression of giving an opinion?',
    options: ['In my opinion, learning English with interactive AI is very effective.', 'I am going to school.', 'Can you help me?', 'What time is it now?'],
    correctAnswer: 0,
    explanation: '"In my opinion, ..." adalah frasa kunci baku untuk mengemukakan pendapat pribadi.',
    points: 2
  },
  {
    id: 'q-50-40',
    type: 'mc',
    questionText: 'What is the translation of "DEEP LEARNING: MINDFUL, MEANINGFUL, JOYFUL LEARNING" in Indonesian educational context?',
    options: ['Pembelajaran Mendalam: Berkesadaran, Bermakna, dan Menggembirakan', 'Pembelajaran Cepat: Menghafal, Ujian, dan Nilai', 'Pembelajaran Rumit: Sulit, Membosankan, dan Menakutkan', 'Pembelajaran Otomatis: Tanpa Guru dan Siswa'],
    correctAnswer: 0,
    explanation: 'Tiga pilar Deep Learning Kemendikdasmen adalah Mindful (berkesadaran), Meaningful (bermakna), dan Joyful (menggembirakan).',
    points: 2
  },

  // 10 ESSAI (41 s.d. 50)
  {
    id: 'q-50-41',
    type: 'essay',
    questionText: 'Soal Essai 1: Tuliskan satu paragraf perkenalan diri dalam Bahasa Inggris (Self-Introduction) sebanyak 4-6 kalimat. Cantumkan nama lengkap, nama panggilan, umur, kelas, alamat sekolah, dan hobi bahasa Inggrismu.',
    correctAnswer: 'Hello everyone! My name is Ahmad Rizky, and you can call me Rizky. I am 13 years old and I study in Grade VII at SMP Negeri 1 Cerdas Bangsa. I live with my family in Bandung. In my free time, I really enjoy speaking English and practicing pronunciation with AI Miss Sarah. Nice to meet you all!',
    sampleAnswer: 'Hello everyone! My name is Ahmad Rizky, and you can call me Rizky. I am 13 years old and I study in Grade VII at SMP Negeri 1 Cerdas Bangsa. I live with my family in Bandung. In my free time, I really enjoy speaking English and practicing pronunciation with AI Miss Sarah. Nice to meet you all!',
    rubricCriteria: ['Kelengkapan data perkenalan (nama, umur, kelas, hobi)', 'Kesesuaian tata bahasa Simple Present dan to be', 'Kerapian dan variasi kosakata'],
    minWords: 25,
    explanation: 'Rubrik Penilaian: Siswa menuliskan perkenalan terstruktur dengan pembuka, data diri lengkap, serta penutup ramah (Nice to meet you).',
    points: 2
  },
  {
    id: 'q-50-42',
    type: 'essay',
    questionText: 'Soal Essai 2: Tuliskan satu paragraf teks deskriptif (Descriptive Text) singkat (4-5 kalimat) tentang guru Bahasa Inggrismu atau teman sekelasmu. Sertakan ciri fisik (appearance) dan sifat positif (personality).',
    correctAnswer: 'My favorite English teacher is Miss Sarah. She is tall, has friendly eyes, and always wears a beautiful smile. She is very patient and kind when explaining difficult grammar topics. Miss Sarah always inspires us to speak English with confidence and courage. All students in our class respect and love her.',
    sampleAnswer: 'My favorite English teacher is Miss Sarah. She is tall, has friendly eyes, and always wears a beautiful smile. She is very patient and kind when explaining difficult grammar topics. Miss Sarah always inspires us to speak English with confidence and courage. All students in our class respect and love her.',
    rubricCriteria: ['Penyebutan ciri fisik dan sifat kepribadian', 'Penggunaan kata sifat (adjectives) yang tepat', 'Konsistensi Simple Present Tense'],
    minWords: 25,
    explanation: 'Rubrik Penilaian: Menghadirkan identifikasi objek, pendeskripsian ciri fisik, dan sifat kepribadian dengan kata sifat deskriptif.',
    points: 2
  },
  {
    id: 'q-50-43',
    type: 'essay',
    questionText: 'Soal Essai 3: Tuliskan 3 pasangan ungkapan salam kesantunan (Greeting) beserta respons jawaban yang tepat dan waktu penggunaannya dalam kehidupan sehari-hari di SMP.',
    correctAnswer: '1. "Good morning, Sir!" - Respons: "Good morning! Are you ready to learn today?" (Digunakan pukul 06.00 - 12.00 pagi). 2. "Good afternoon, Ma\'am!" - Respons: "Good afternoon, students!" (Digunakan pukul 12.00 - 18.00 sore). 3. "Good evening, friends!" - Respons: "Good evening!" (Digunakan setelah pukul 18.00 saat pertemuan malam).',
    sampleAnswer: '1. "Good morning, Sir!" - Respons: "Good morning! Are you ready to learn today?" (Digunakan pukul 06.00 - 12.00 pagi). 2. "Good afternoon, Ma\'am!" - Respons: "Good afternoon, students!" (Digunakan pukul 12.00 - 18.00 sore). 3. "Good evening, friends!" - Respons: "Good evening!" (Digunakan setelah pukul 18.00 saat pertemuan malam).',
    rubricCriteria: ['Kebenaran 3 ungkapan salam', 'Ketepatan respons balik', 'Kesesuaian rentang waktu'],
    minWords: 20,
    explanation: 'Rubrik Penilaian: Menyajikan 3 pasangan salam santun lengkap dengan respons dan kejelasan waktu penggunaannya.',
    points: 2
  },
  {
    id: 'q-50-44',
    type: 'essay',
    questionText: 'Soal Essai 4: Jelaskan secara ringkas perbedaan penggunaan preposisi tempat "in", "on", dan "at" dalam Bahasa Inggris, serta berikan masing-masing 1 contoh kalimat lengkap!',
    correctAnswer: 'Preposisi "in" digunakan untuk area geografis umum yang luas seperti kota atau negara (Contoh: "I live in Jakarta"). Preposisi "on" digunakan untuk nama jalan atau lantai gedung (Contoh: "The bookstore is on Merdeka Street"). Preposisi "at" digunakan untuk alamat spesifik bernomor rumah atau lokasi pinpoint tertentu (Contoh: "We study at SMP Negeri 1 on Melati Street No. 10").',
    sampleAnswer: 'Preposisi "in" digunakan untuk area geografis umum yang luas seperti kota atau negara (Contoh: "I live in Jakarta"). Preposisi "on" digunakan untuk nama jalan atau lantai gedung (Contoh: "The bookstore is on Merdeka Street"). Preposisi "at" digunakan untuk alamat spesifik bernomor rumah atau lokasi pinpoint tertentu (Contoh: "We study at SMP Negeri 1 on Melati Street No. 10").',
    rubricCriteria: ['Pemahaman konsep gradasi in -> on -> at', 'Ketepatan 3 contoh kalimat bahasa Inggris', 'Kejelasan pemaparan'],
    minWords: 25,
    explanation: 'Rubrik Penilaian: Menjelaskan perbedaan tingkat spesifikasi tempat: "in" (kota/negara), "on" (jalan), "at" (alamat spesifik bernomor).',
    points: 2
  },
  {
    id: 'q-50-45',
    type: 'essay',
    questionText: 'Soal Essai 5: Tuliskan satu paragraf Recount Text (4-5 kalimat) tentang aktivitas liburan akhir pekan lalu. Gunakan kata kerja bentuk lampau (Past Tense Verb 2) dengan benar.',
    correctAnswer: 'Last Sunday was a wonderful day for me. In the morning, I woke up early and helped my mother clean our living room. After that, I rode my bicycle to the city park with my best friend Andi. In the afternoon, we practiced speaking English and completed an evaluation quiz on the SI CERDAS app. I went to sleep at night feeling very happy and fulfilled.',
    sampleAnswer: 'Last Sunday was a wonderful day for me. In the morning, I woke up early and helped my mother clean our living room. After that, I rode my bicycle to the city park with my best friend Andi. In the afternoon, we practiced speaking English and completed an evaluation quiz on the SI CERDAS app. I went to sleep at night feeling very happy and fulfilled.',
    rubricCriteria: ['Konsistensi kata kerja Verb 2 (woke, helped, rode, practiced, went)', 'Kejelasan urutan kronologis waktu', 'Koherensi isi paragraf'],
    minWords: 25,
    explanation: 'Rubrik Penilaian: Menuliskan runtutan pengalaman masa lalu dengan menggunakan kata kerja Verb 2 dan penanda waktu yang logis.',
    points: 2
  },
  {
    id: 'q-50-46',
    type: 'essay',
    questionText: 'Soal Essai 6: Buatlah teks dialog percakapan antara dua siswa (Student A dan Student B) yang saling bertanya tentang hobi kegemaran masing-masing (minimal 6 giliran bicara / 6 baris kalimat).',
    correctAnswer: 'Student A: "Hello Siti, what do you like to do in your leisure time?"\nStudent B: "Hi Rian! My favorite hobby is reading English comic stories and listening to pop music. How about you?"\nStudent A: "I really love playing basketball with our school club every Tuesday."\nStudent B: "That sounds very active and healthy! How long have you played basketball?"\nStudent A: "I have played for about two years. It gives me high energy and spirit."\nStudent B: "Awesome! Let us always enjoy our positive hobbies."',
    sampleAnswer: 'Student A: "Hello Siti, what do you like to do in your leisure time?"\nStudent B: "Hi Rian! My favorite hobby is reading English comic stories and listening to pop music. How about you?"\nStudent A: "I really love playing basketball with our school club every Tuesday."\nStudent B: "That sounds very active and healthy! How long have you played basketball?"\nStudent A: "I have played for about two years. It gives me high energy and spirit."\nStudent B: "Awesome! Let us always enjoy our positive hobbies."',
    rubricCriteria: ['Format dialog minimal 6 baris pergantian bicara', 'Pola tanya-jawab mengenai hobi yang runtut', 'Ekspresi kesantunan interaktif'],
    minWords: 30,
    explanation: 'Rubrik Penilaian: Dialog komunikatif dua arah mengenai hobi dengan kosakata yang relevan dan santun.',
    points: 2
  },
  {
    id: 'q-50-47',
    type: 'essay',
    questionText: 'Soal Essai 7: Berikan 3 saran konkret dalam Bahasa Inggris untuk teman sekelasmu agar tidak merasa cemas atau malu saat berbicara Bahasa Inggris (sesuai semangat "Learn with Confidence, Speak with Courage!").',
    correctAnswer: '1. Practice speaking aloud in front of a mirror or with AI Miss Sarah every single day without being afraid of making grammar mistakes. 2. Memorize and practice 3 to 5 new English words daily by using them directly in daily conversations with your classmates. 3. Always believe in yourself and remember that making mistakes is the natural stepping stone to mastering English fluently!',
    sampleAnswer: '1. Practice speaking aloud in front of a mirror or with AI Miss Sarah every single day without being afraid of making grammar mistakes. 2. Memorize and practice 3 to 5 new English words daily by using them directly in daily conversations with your classmates. 3. Always believe in yourself and remember that making mistakes is the natural stepping stone to mastering English fluently!',
    rubricCriteria: ['3 poin saran yang konkret dan memotivasi', 'Penggunaan kalimat instruksi yang tepat', 'Pilihan kosakata yang menggugah keberanian'],
    minWords: 25,
    explanation: 'Rubrik Penilaian: Menyajikan 3 rekomendasi aplikatif untuk menumbuhkan rasa percaya diri berkomunikasi lisan.',
    points: 2
  },
  {
    id: 'q-50-48',
    type: 'essay',
    questionText: 'Soal Essai 8: Susunlah teks prosedur (Procedure Text) singkat berjudul "How to Use SI CERDAS ENGLISH to Improve English Skills" yang memuat Goal, Materials, dan 4 Langkah Berurutan (Steps).',
    correctAnswer: 'Goal: How to Use SI CERDAS ENGLISH to Improve English Skills.\nMaterials: Smartphone / Computer, Internet connection, and Headset.\nSteps:\n1. First, launch the SI CERDAS ENGLISH application and choose your grade level.\n2. Second, expand your active vocabulary through the Vocabulary Builder and practice accurate pronunciation.\n3. Third, enter the AI Speaking Partner to have a cheerful 5-minute conversation with Miss Sarah.\n4. Finally, complete the daily evaluation quiz to measure your learning progress.',
    sampleAnswer: 'Goal: How to Use SI CERDAS ENGLISH to Improve English Skills.\nMaterials: Smartphone / Computer, Internet connection, and Headset.\nSteps:\n1. First, launch the SI CERDAS ENGLISH application and choose your grade level.\n2. Second, expand your active vocabulary through the Vocabulary Builder and practice accurate pronunciation.\n3. Third, enter the AI Speaking Partner to have a cheerful 5-minute conversation with Miss Sarah.\n4. Finally, complete the daily evaluation quiz to measure your learning progress.',
    rubricCriteria: ['Kelengkapan struktur teks prosedur (Goal, Materials, Steps)', 'Penggunaan kata urutan waktu (First, Second, Third, Finally)', 'Penggunaan action verbs imperatif'],
    minWords: 35,
    explanation: 'Rubrik Penilaian: Teks prosedur terstruktur runtut dengan tujuan, bahan, serta 4 langkah aksi yang jelas.',
    points: 2
  },
  {
    id: 'q-50-49',
    type: 'essay',
    questionText: 'Soal Essai 9: Mengapa penguasaan Bahasa Inggris sangat penting bagi masa depan siswa SMP di era teknologi saat ini? Tuliskan pendapatmu dalam 4-5 kalimat berbahasa Inggris dengan alasan yang logis.',
    correctAnswer: 'Mastering English is extremely crucial for junior high school students today. Firstly, English is the primary international language that allows us to communicate with global communities. Secondly, the majority of world knowledge, digital educational tools, and scientific literature are written in English. Furthermore, strong English proficiency will open countless scholarships and career opportunities in the future. Therefore, learning English empowers us to achieve our highest ambitions.',
    sampleAnswer: 'Mastering English is extremely crucial for junior high school students today. Firstly, English is the primary international language that allows us to communicate with global communities. Secondly, the majority of world knowledge, digital educational tools, and scientific literature are written in English. Furthermore, strong English proficiency will open countless scholarships and career opportunities in the future. Therefore, learning English empowers us to achieve our highest ambitions.',
    rubricCriteria: ['Penyampaian gagasan argumentatif yang logis', 'Penggunaan connectors (Firstly, Secondly, Furthermore, Therefore)', 'Ketepatan struktur kalimat formal'],
    minWords: 30,
    explanation: 'Rubrik Penilaian: Mengemukakan argumentasi logis mengenai pentingnya bahasa Inggris dengan kata penghubung penalaran.',
    points: 2
  },
  {
    id: 'q-50-50',
    type: 'essay',
    questionText: 'Soal Essai 10: Buatlah teks undangan resmi singkat (Invitation Message) dari panitia kelas kepada Kepala Sekolah dan Guru untuk menghadiri acara "English Day & Speech Competition" di sekolahmu.',
    correctAnswer: 'Dear Principal and Respected Teachers,\nYou are cordially invited to attend our Class VII English Day & Speech Competition.\nDay/Date: Saturday, November 28, 2026\nTime: 08:30 a.m. - 12:00 p.m.\nVenue: SMP Negeri 1 Main Hall\nWe sincerely hope for your honorable presence to motivate and support our students\' creative English talents. Thank you very much for your continuous guidance.\nSincerely yours,\nEnglish Day Organizing Committee',
    sampleAnswer: 'Dear Principal and Respected Teachers,\nYou are cordially invited to attend our Class VII English Day & Speech Competition.\nDay/Date: Saturday, November 28, 2026\nTime: 08:30 a.m. - 12:00 p.m.\nVenue: SMP Negeri 1 Main Hall\nWe sincerely hope for your honorable presence to motivate and support our students\' creative English talents. Thank you very much for your continuous guidance.\nSincerely yours,\nEnglish Day Organizing Committee',
    rubricCriteria: ['Kejelasan pihak yang diundang dan tujuan acara', 'Kelengkapan waktu, tanggal, dan tempat', 'Bahasa formal, sopan, dan santun'],
    minWords: 30,
    explanation: 'Rubrik Penilaian: Format teks undangan resmi yang memuat penerima, nama acara, waktu, tanggal, tempat, dan penutup santun.',
    points: 2
  }
];

export const fiftyQuestionQuiz: Quiz = {
  id: 'qz-standard-50',
  title: 'Ujian Standar Komprehensif Bahasa Inggris SMP (50 Nomor: 40 Pilihan Ganda & 10 Essai)',
  grade: 'VII',
  topic: 'Evaluasi Standar Lengkap (Grammar, Vocabulary, Reading, Speaking & Writing)',
  category: 'post-test',
  durationMinutes: 60,
  maxAttempts: 2,
  releaseAnswerKey: true,
  isPublished: true,
  createdAt: '2026-10-15T08:00:00Z',
  questions: initialFiftyQuestions
};

export function buildFiftyQuestions(
  topic: string = 'General English Assessment',
  grade: GradeLevel = 'VII',
  format: 'mixed' | 'mc' | 'essay' = 'mixed'
): QuizQuestion[] {
  if (format === 'mc') {
    // 50 Multiple Choice
    const result: QuizQuestion[] = [];
    const mcPool = initialFiftyQuestions.filter((q) => q.type === 'mc');
    for (let i = 0; i < 50; i++) {
      const base = mcPool[i % mcPool.length];
      const repeatIdx = Math.floor(i / mcPool.length);
      result.push({
        ...base,
        id: `q-mc50-${i + 1}`,
        questionText: repeatIdx > 0 ? `${base.questionText} (Butir ${i + 1})` : base.questionText,
        points: 2
      });
    }
    return result;
  }

  if (format === 'essay') {
    // 50 Essay
    const result: QuizQuestion[] = [];
    const essayPool = initialFiftyQuestions.filter((q) => q.type === 'essay');
    for (let i = 0; i < 50; i++) {
      const base = essayPool[i % essayPool.length];
      const repeatIdx = Math.floor(i / essayPool.length);
      result.push({
        ...base,
        id: `q-ess50-${i + 1}`,
        questionText: repeatIdx > 0 ? `${base.questionText} [Variasi ${repeatIdx + 1}]` : base.questionText,
        points: 2
      });
    }
    return result;
  }

  // Mixed: 40 Multiple Choice + 10 Essay
  return initialFiftyQuestions.map((q, idx) => ({
    ...q,
    id: `q-std50-${idx + 1}`
  }));
}
