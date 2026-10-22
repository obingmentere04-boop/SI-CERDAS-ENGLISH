import { AppDatabase } from '../types';
import { fiftyQuestionQuiz } from './fiftyQuestionQuiz';

export const initialDatabase: AppDatabase = {
  teacher: {
    id: 'teacher-1',
    name: 'Siti Rahmawati, S.Pd.',
    nip: '19880415 201402 2 003',
    school: 'SMP Negeri 1 Cerdas Bangsa',
    subject: 'Bahasa Inggris',
    classesTaught: ['VII-A', 'VII-B', 'VIII-A', 'IX-A'],
    email: 'siti.rahmawati@smp1cerdas.sch.id',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    bio: 'Guru Bahasa Inggris SMP dengan pengalaman 10 tahun. Mengembangkan pembelajaran interaktif, komunikatif, dan berbasis AI untuk memupuk kepercayaan diri peserta didik dalam berbahasa Inggris.',
    phone: '0812-3456-7890'
  },
  classes: [
    { id: 'cls-7a', name: 'VII-A', grade: 'VII', academicYear: '2026/2027', semester: 1, studentCount: 32, description: 'Kelas VII Unggulan Bahasa' },
    { id: 'cls-7b', name: 'VII-B', grade: 'VII', academicYear: '2026/2027', semester: 1, studentCount: 30, description: 'Kelas VII Reguler' },
    { id: 'cls-8a', name: 'VIII-A', grade: 'VIII', academicYear: '2026/2027', semester: 1, studentCount: 32, description: 'Kelas VIII Komunikatif' },
    { id: 'cls-9a', name: 'IX-A', grade: 'IX', academicYear: '2026/2027', semester: 1, studentCount: 28, description: 'Kelas IX Persiapan Kelulusan' }
  ],
  students: [
    {
      id: 'std-1',
      name: 'Andi Pratama',
      nisn: '0098123456',
      grade: 'VII',
      className: 'VII-A',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      points: 340,
      streakDays: 4,
      completedLessonsCount: 6,
      preTestScore: 55,
      postTestScore: 85,
      vocabMasteredCount: 42,
      grammarAccuracy: 78,
      speakingSessionsCount: 5,
      writingSubmissionsCount: 2,
      lastActive: '2026-10-12T03:30:00Z'
    },
    {
      id: 'std-2',
      name: 'Dewi Lestari',
      nisn: '0098123457',
      grade: 'VII',
      className: 'VII-A',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      points: 420,
      streakDays: 7,
      completedLessonsCount: 8,
      preTestScore: 60,
      postTestScore: 92,
      vocabMasteredCount: 56,
      grammarAccuracy: 88,
      speakingSessionsCount: 8,
      writingSubmissionsCount: 3,
      lastActive: '2026-10-12T02:15:00Z'
    },
    {
      id: 'std-3',
      name: 'Budi Santoso',
      nisn: '0098123458',
      grade: 'VII',
      className: 'VII-A',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      points: 210,
      streakDays: 2,
      completedLessonsCount: 4,
      preTestScore: 48,
      postTestScore: 70,
      vocabMasteredCount: 28,
      grammarAccuracy: 65,
      speakingSessionsCount: 3,
      writingSubmissionsCount: 1,
      lastActive: '2026-10-11T09:00:00Z'
    },
    {
      id: 'std-4',
      name: 'Rina Anggraini',
      nisn: '0098123459',
      grade: 'VIII',
      className: 'VIII-A',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      points: 380,
      streakDays: 5,
      completedLessonsCount: 7,
      preTestScore: 65,
      postTestScore: 88,
      vocabMasteredCount: 50,
      grammarAccuracy: 82,
      speakingSessionsCount: 6,
      writingSubmissionsCount: 3,
      lastActive: '2026-10-10T14:20:00Z'
    },
    {
      id: 'std-5',
      name: 'Fajar Nugraha',
      nisn: '0098123460',
      grade: 'IX',
      className: 'IX-A',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      points: 510,
      streakDays: 12,
      completedLessonsCount: 11,
      preTestScore: 70,
      postTestScore: 95,
      vocabMasteredCount: 75,
      grammarAccuracy: 92,
      speakingSessionsCount: 10,
      writingSubmissionsCount: 4,
      lastActive: '2026-10-12T04:10:00Z'
    }
  ],
  modules: [
    {
      id: 'mod-demo-7-intro',
      title: 'Modul Demonstrasi Resmi: Introducing Yourself',
      grade: 'VII',
      semester: 1,
      academicYear: '2026/2027',
      topic: 'Introducing Yourself & Social Interactions',
      description: 'Modul percontohan kurikulum merdeka Kelas VII SMP untuk melatih keberanian siswa menyapa, memperkenalkan diri dan teman, serta menutup percakapan dengan sopan dan natural.',
      isDemoModule: true,
      sections: [
        {
          id: 'sec-1',
          title: '1. Greetings (Salam Pembuka)',
          content: 'Salam pembuka digunakan saat pertama kali bertemu seseorang. Perhatikan waktu penggunaannya:',
          dialogue: [
            { speaker: 'Edo', textEn: 'Good morning, Mr. Ahmad! How are you today?', textId: 'Selamat pagi, Pak Ahmad! Bagaimana kabar Bapak hari ini?' },
            { speaker: 'Mr. Ahmad', textEn: 'Good morning, Edo. I am very well, thank you. And you?', textId: 'Selamat pagi, Edo. Bapak sangat baik, terima kasih. Bagaimana denganmu?' },
            { speaker: 'Edo', textEn: 'I am fine too, Sir.', textId: 'Saya juga baik-baik saja, Pak.' }
          ],
          audioScript: 'Good morning. How are you today? I am fine, thank you.',
          vocabularyIds: ['voc-1', 'voc-2', 'voc-3']
        },
        {
          id: 'sec-2',
          title: '2. Introducing Yourself (Memperkenalkan Diri Sendiri)',
          content: 'Untuk memperkenalkan diri, sebutkan nama, usia, asal sekolah, dan hal singkat tentang dirimu. Gunakan kalimat yang jelas dan percaya diri.',
          dialogue: [
            { speaker: 'Siti', textEn: 'Hello everyone! My name is Siti Rahma. You can call me Siti.', textId: 'Halo semuanya! Nama saya Siti Rahma. Kalian bisa memanggil saya Siti.' },
            { speaker: 'Siti', textEn: 'I am thirteen years old. I am a student of SMP Negeri 1.', textId: 'Saya berusia tiga belas tahun. Saya adalah siswa SMP Negeri 1.' },
            { speaker: 'Class', textEn: 'Nice to meet you, Siti!', textId: 'Senang berkenalan denganmu, Siti!' }
          ],
          audioScript: 'Hello, my name is Siti Rahma. I am thirteen years old. Nice to meet you.',
          vocabularyIds: ['voc-4', 'voc-5', 'voc-6']
        },
        {
          id: 'sec-3',
          title: '3. Asking Someone’s Name (Menanyakan Nama Orang Lain)',
          content: 'Tanyakan nama lawan bicara dengan sopan:',
          dialogue: [
            { speaker: 'Andi', textEn: 'Excuse me, what is your name?', textId: 'Permisi, siapa namamu?' },
            { speaker: 'Budi', textEn: 'My name is Budi. And yours?', textId: 'Nama saya Budi. Dan namamu?' },
            { speaker: 'Andi', textEn: 'I am Andi. May I know your nickname?', textId: 'Saya Andi. Bolehkah saya tahu nama panggilanmu?' },
            { speaker: 'Budi', textEn: 'You can call me Bud.', textId: 'Kamu bisa memanggil saya Bud.' }
          ],
          audioScript: 'Excuse me, what is your name? My name is Budi. Nice to meet you.',
          vocabularyIds: ['voc-7', 'voc-8']
        },
        {
          id: 'sec-4',
          title: '4. Asking Where Someone Lives (Menanyakan Tempat Tinggal)',
          content: 'Gunakan preposisi yang tepat: "in" untuk kota/desa (in Sukamaju), "on" untuk nama jalan (on Jl. Merdeka), "at" untuk alamat lengkap beserta nomor rumah (at Jl. Merdeka No. 5).',
          dialogue: [
            { speaker: 'Rani', textEn: 'Where do you live, Andi?', textId: 'Di mana kamu tinggal, Andi?' },
            { speaker: 'Andi', textEn: 'I live in a small village called Melati Village.', textId: 'Saya tinggal di sebuah desa kecil bernama Desa Melati.' },
            { speaker: 'Rani', textEn: 'Do you live on Melati Street?', textId: 'Apakah kamu tinggal di Jalan Melati?' },
            { speaker: 'Andi', textEn: 'Yes, I live at Melati Street Number 12.', textId: 'Ya, saya tinggal di Jalan Melati Nomor 12.' }
          ],
          audioScript: 'Where do you live? I live in a quiet village. It is green and peaceful.',
          vocabularyIds: ['voc-9', 'voc-10']
        },
        {
          id: 'sec-5',
          title: '5. Asking About Hobbies (Menanyakan Kegemaran)',
          content: 'Membicarakan hobi membuat percakapan terasa hangat dan bersahabat. Pola kalimat: "My hobby is [verb-ing]" atau "I like [verb-ing]".',
          dialogue: [
            { speaker: 'Bayu', textEn: 'What is your hobby, Dika?', textId: 'Apa hobimu, Dika?' },
            { speaker: 'Dika', textEn: 'I love playing badminton and reading comic books. What about you?', textId: 'Saya suka bermain bulu tangkis dan membaca buku komik. Bagaimana denganmu?' },
            { speaker: 'Bayu', textEn: 'My hobby is cycling. I cycle to school every morning!', textId: 'Hobiku bersepeda. Saya bersepeda ke sekolah setiap pagi!' }
          ],
          audioScript: 'What is your hobby? My hobby is playing badminton and cycling.',
          vocabularyIds: ['voc-11', 'voc-12']
        },
        {
          id: 'sec-6',
          title: '6. Introducing a Friend (Memperkenalkan Teman)',
          content: 'Perkenalkan temanmu kepada orang lain dengan ungkapan: "This is my friend, [Nama]..." atau "I would like you to meet..."',
          dialogue: [
            { speaker: 'Siti', textEn: 'Andi, this is my classmate, Dewi.', textId: 'Andi, ini teman sekelasku, Dewi.' },
            { speaker: 'Andi', textEn: 'Hi, Dewi! Glad to meet you.', textId: 'Hai, Dewi! Senang bertemu denganmu.' },
            { speaker: 'Dewi', textEn: 'Glad to meet you too, Andi! Siti told me a lot about you.', textId: 'Senang bertemu denganmu juga, Andi! Siti banyak bercerita tentangmu.' }
          ],
          audioScript: 'This is my friend Dewi. She is a cheerful classmate. Glad to meet you.',
          vocabularyIds: ['voc-13', 'voc-14']
        },
        {
          id: 'sec-7',
          title: '7. Closing a Conversation (Menutup Percakapan)',
          content: 'Akhiri percakapan dengan salam perpisahan yang ramah dan sopan:',
          dialogue: [
            { speaker: 'Rian', textEn: 'It was nice talking to you, Andi, but the bell is ringing.', textId: 'Senang mengobrol denganmu, Andi, tapi bel sudah berbunyi.' },
            { speaker: 'Andi', textEn: 'Sure! Let us go to the classroom. See you later!', textId: 'Tentu! Mari kita ke ruang kelas. Sampai jumpa lagi!' },
            { speaker: 'Rian', textEn: 'See you! Have a great day!', textId: 'Sampai jumpa! Semoga harimu menyenangkan!' }
          ],
          audioScript: 'It was nice talking to you. See you later! Have a great day!',
          vocabularyIds: ['voc-15']
        }
      ]
    },
    {
      id: 'mod-8-descriptive',
      title: 'Modul Kelas VIII: Descriptive Text & My Daily Routine',
      grade: 'VIII',
      semester: 1,
      academicYear: '2026/2027',
      topic: 'Descriptive Text & Daily Activities',
      description: 'Mendeskripsikan orang, hewan, tempat wisata, serta menceritakan rutinitas harian dengan Simple Present Tense yang tepat.',
      sections: [
        {
          id: 'sec-8-1',
          title: 'Describing My Beloved School',
          content: 'Descriptive text bertujuan menggambarkan objek secara spesifik. Struktur teks: Identification (pengenalan) dan Description (karakteristik fisik dan sifat).',
          audioScript: 'My school is clean and beautiful. There is a wide field with tall green trees.',
          vocabularyIds: ['voc-9', 'voc-10']
        }
      ]
    },
    {
      id: 'mod-9-procedure',
      title: 'Modul Kelas IX: Procedure Text & Past Experiences',
      grade: 'IX',
      semester: 1,
      academicYear: '2026/2027',
      topic: 'Procedure Text & Recount Memories',
      description: 'Menuliskan resep, petunjuk manual langkah demi langkah (Goal, Materials, Steps), serta berbagi pengalaman liburan lampau.',
      sections: [
        {
          id: 'sec-9-1',
          title: 'How to Make Delicious Fried Rice',
          content: 'Procedure text menggunakan kata kerja tindakan (action verbs) seperti stir, fry, chop, serta kata urutan waktu (first, next, then, finally).',
          audioScript: 'First, heat the cooking oil. Then add chopped garlic and shallots. Stir well.',
          vocabularyIds: ['voc-11']
        }
      ]
    }
  ],
  vocabulary: [
    {
      id: 'voc-1',
      word: 'Greeting',
      meaningId: 'Salam / Sapaan',
      partOfSpeech: 'noun',
      phonetic: '/ˈɡriː.tɪŋ/',
      exampleEn: 'A warm greeting makes people smile.',
      exampleId: 'Sapaan yang hangat membuat orang tersenyum.',
      topic: 'Greetings and Partings',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-2',
      word: 'Introduce',
      meaningId: 'Memperkenalkan',
      partOfSpeech: 'verb',
      phonetic: '/ˌɪn.trəˈdjuːs/',
      exampleEn: 'Let me introduce myself to the new class.',
      exampleId: 'Izinkan saya memperkenalkan diri kepada kelas baru.',
      topic: 'Introducing Yourself',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-3',
      word: 'Pleasure',
      meaningId: 'Kesenangan / Kehormatan',
      partOfSpeech: 'noun',
      phonetic: '/ˈpleʒ.ər/',
      exampleEn: 'It is a pleasure to meet you here.',
      exampleId: 'Merupakan kesenangan bertemu dengan Anda di sini.',
      topic: 'Greetings and Partings',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-4',
      word: 'Classmate',
      meaningId: 'Teman sekelas',
      partOfSpeech: 'noun',
      phonetic: '/ˈklɑːs.meɪt/',
      exampleEn: 'Budi is my favorite classmate in grade seven.',
      exampleId: 'Budi adalah teman sekelas favoritku di kelas tujuh.',
      topic: 'At School',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-5',
      word: 'Nickname',
      meaningId: 'Nama panggilan',
      partOfSpeech: 'noun',
      phonetic: '/ˈnɪk.neɪm/',
      exampleEn: 'My full name is Muhammad Rizky, but my nickname is Kiki.',
      exampleId: 'Nama lengkap saya Muhammad Rizky, tapi nama panggilan saya Kiki.',
      topic: 'Introducing Yourself',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-6',
      word: 'Courage',
      meaningId: 'Keberanian',
      partOfSpeech: 'noun',
      phonetic: '/ˈkʌr.ɪdʒ/',
      exampleEn: 'She speaks English with great courage.',
      exampleId: 'Dia berbicara Bahasa Inggris dengan keberanian yang besar.',
      topic: 'Introducing Yourself',
      grade: 'VII',
      difficulty: 'Elementary'
    },
    {
      id: 'voc-7',
      word: 'Confidence',
      meaningId: 'Rasa percaya diri',
      partOfSpeech: 'noun',
      phonetic: '/ˈkɒn.fɪ.dəns/',
      exampleEn: 'Practice gives you confidence to speak in public.',
      exampleId: 'Latihan memberimu kepercayaan diri untuk berbicara di depan umum.',
      topic: 'Introducing Yourself',
      grade: 'VII',
      difficulty: 'Elementary'
    },
    {
      id: 'voc-8',
      word: 'Polite',
      meaningId: 'Sopan',
      partOfSpeech: 'adjective',
      phonetic: '/pəˈlaɪt/',
      exampleEn: 'Always give a polite answer when someone asks for help.',
      exampleId: 'Selalu berikan jawaban sopan saat seseorang meminta bantuan.',
      topic: 'Greetings and Partings',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-9',
      word: 'Village',
      meaningId: 'Desa / Kampung',
      partOfSpeech: 'noun',
      phonetic: '/ˈvɪl.ɪdʒ/',
      exampleEn: 'Our village has fresh air and green rice fields.',
      exampleId: 'Desa kami memiliki udara segar dan sawah yang hijau.',
      topic: 'Talking About My Village',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-10',
      word: 'Peaceful',
      meaningId: 'Damai / Tenang',
      partOfSpeech: 'adjective',
      phonetic: '/ˈpiːs.fəl/',
      exampleEn: 'The countryside is peaceful and calm at night.',
      exampleId: 'Pedesaan terasa damai dan tenang di malam hari.',
      topic: 'Talking About My Village',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-11',
      word: 'Hobby',
      meaningId: 'Kegemaran / Hobi',
      partOfSpeech: 'noun',
      phonetic: '/ˈhɒb.i/',
      exampleEn: 'My brother’s hobby is playing football after school.',
      exampleId: 'Hobi saudaraku adalah bermain sepak bola sepulang sekolah.',
      topic: 'My Hobbies',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-12',
      word: 'Gardening',
      meaningId: 'Berkebun',
      partOfSpeech: 'noun',
      phonetic: '/ˈɡɑː.dən.ɪŋ/',
      exampleEn: 'My mother loves gardening in our backyard.',
      exampleId: 'Ibuku suka berkebun di halaman belakang kami.',
      topic: 'My Hobbies',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-13',
      word: 'Generous',
      meaningId: 'Dermawan / Baik hati',
      partOfSpeech: 'adjective',
      phonetic: '/ˈdʒen.ər.əs/',
      exampleEn: 'My grandfather is a generous man who helps everyone.',
      exampleId: 'Kakek saya adalah pria dermawan yang menolong semua orang.',
      topic: 'Talking About Family',
      grade: 'VIII',
      difficulty: 'Elementary'
    },
    {
      id: 'voc-14',
      word: 'Dream',
      meaningId: 'Cita-cita / Impian',
      partOfSpeech: 'noun',
      phonetic: '/driːm/',
      exampleEn: 'My dream is to become an astronaut.',
      exampleId: 'Cita-cita saya adalah menjadi seorang antariksawan.',
      topic: 'Talking About My Dreams',
      grade: 'VIII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-15',
      word: 'Directions',
      meaningId: 'Petunjuk arah',
      partOfSpeech: 'noun',
      phonetic: '/daɪˈrek.ʃənz/',
      exampleEn: 'Can you give me directions to the nearest library?',
      exampleId: 'Bisakah Anda memberi saya petunjuk arah ke perpustakaan terdekat?',
      topic: 'Asking for Directions',
      grade: 'VIII',
      difficulty: 'Elementary'
    },
    {
      id: 'voc-16',
      word: 'Delicious',
      meaningId: 'Lezat / Enak',
      partOfSpeech: 'adjective',
      phonetic: '/dɪˈlɪʃ.əs/',
      exampleEn: 'This traditional soup tastes so delicious.',
      exampleId: 'Sup tradisional ini rasanya sangat lezat.',
      topic: 'Ordering Food',
      grade: 'VII',
      difficulty: 'Beginner'
    },
    {
      id: 'voc-17',
      word: 'Discount',
      meaningId: 'Potongan harga',
      partOfSpeech: 'noun',
      phonetic: '/ˈdɪs.kaʊnt/',
      exampleEn: 'The bookstore gives a special discount for students.',
      exampleId: 'Toko buku memberikan diskon khusus untuk pelajar.',
      topic: 'Shopping',
      grade: 'VIII',
      difficulty: 'Elementary'
    },
    {
      id: 'voc-18',
      word: 'Achieve',
      meaningId: 'Meraih / Mencapai',
      partOfSpeech: 'verb',
      phonetic: '/əˈtʃiːv/',
      exampleEn: 'You can achieve your goals with hard study.',
      exampleId: 'Kamu dapat meraih tujuanmu dengan belajar keras.',
      topic: 'Talking About My Dreams',
      grade: 'IX',
      difficulty: 'Intermediate'
    }
  ],
  grammarTopics: [
    {
      id: 'grm-1',
      title: 'Subject Pronouns',
      titleId: 'Kata Ganti Subjek (I, You, They, We, He, She, It)',
      grade: 'VII',
      category: 'Dasar Bahasa',
      summary: 'Kata ganti yang berfungsi sebagai pelaku aksi dalam sebuah kalimat.',
      formula: 'Subject Pronoun + Verb / Be',
      explanation: 'Subject pronoun menggantikan nama orang atau benda agar kalimat tidak berulang-ulang. Ingat pasangan subjek:\n- I (Saya)\n- You (Kamu/Kalian)\n- They (Mereka - jamak)\n- We (Kita/Kami)\n- He (Dia laki-laki tunggal)\n- She (Dia perempuan tunggal)\n- It (Benda / hewan tunggal)',
      examples: [
        { en: 'I am a junior high school student.', id: 'Saya adalah siswa SMP.' },
        { en: 'He lives in Sukamaju Village.', id: 'Dia tinggal di Desa Sukamaju.' },
        { en: 'They play football every Sunday.', id: 'Mereka bermain sepak bola setiap hari Minggu.' }
      ],
      commonMistakes: [
        {
          wrong: 'Me go to school with Budi.',
          right: 'I go to school with Budi.',
          explanation: '"Me" adalah object pronoun. Untuk subjek kalimat, selalu gunakan "I".'
        },
        {
          wrong: 'Her is my English teacher.',
          right: 'She is my English teacher.',
          explanation: '"Her" adalah kata ganti kepunyaan atau objek. Gunakan "She" untuk subjek perempuan tunggal.'
        }
      ],
      exercises: [
        {
          id: 'ex-g1-1',
          question: '___ is my older brother. His name is Rian.',
          options: ['He', 'Him', 'His', 'She'],
          correctIndex: 0,
          explanation: 'Rian adalah laki-laki dan posisinya sebagai subjek kalimat, sehingga kata ganti yang tepat adalah "He".'
        },
        {
          id: 'ex-g1-2',
          question: 'Andi and I are classmates. ___ study English together.',
          options: ['They', 'We', 'You', 'Them'],
          correctIndex: 1,
          explanation: '"Andi and I" mencakup diri pembicara (kami/kita), sehingga kata ganti subjeknya adalah "We".'
        }
      ]
    },
    {
      id: 'grm-2',
      title: 'To Be: Am, Is, Are',
      titleId: 'Kata Kerja Bantu: Am, Is, Are',
      grade: 'VII',
      category: 'Tata Bahasa Dasar',
      summary: 'Kata kerja penghubung untuk menyatakan keadaan, identitas, sifat, atau lokasi pada masa sekarang.',
      formula: 'Subject + To Be (am/is/are) + Adjective / Noun / Adverb',
      explanation: 'Aturan memasangkan To Be dengan Subjek:\n- I -> am\n- He / She / It / Nama Tunggal -> is\n- You / They / We / Jamak -> are',
      examples: [
        { en: 'I am proud of my school.', id: 'Saya bangga dengan sekolah saya.' },
        { en: 'She is a talented singer.', id: 'Dia adalah penyanyi yang berbakat.' },
        { en: 'We are ready to learn.', id: 'Kami siap untuk belajar.' }
      ],
      commonMistakes: [
        {
          wrong: 'They is very friendly.',
          right: 'They are very friendly.',
          explanation: '"They" adalah jamak, jadi harus dipasangkan dengan "are", bukan "is".'
        },
        {
          wrong: 'I is twelve years old.',
          right: 'I am twelve years old.',
          explanation: 'Subjek "I" hanya berpasangan dengan "am".'
        }
      ],
      exercises: [
        {
          id: 'ex-g2-1',
          question: 'The students ___ in the school library right now.',
          options: ['is', 'am', 'are', 'be'],
          correctIndex: 2,
          explanation: '"The students" berakhiran -s (jamak/plural), maka to be yang tepat adalah "are".'
        }
      ]
    },
    {
      id: 'grm-3',
      title: 'Simple Present Tense',
      titleId: 'Kejadian Rutin & Kebenaran Umum',
      grade: 'VII',
      category: 'Tenses',
      summary: 'Digunakan untuk menceritakan rutinitas sehari-hari, kebiasaan, dan fakta umum.',
      formula: '(+) S + V1 (-s/-es untuk He/She/It)\n(-) S + do/does not + V1\n(?) Do/Does + S + V1?',
      explanation: 'Perhatikan penambahan -s atau -es jika subjeknya orang ketiga tunggal (He, She, It, nama satu orang):\n- He plays badminton.\n- She washes the dishes.\nUntuk subjek I, You, They, We, gunakan kata kerja dasar tanpa akhiran (They play).',
      examples: [
        { en: 'The sun rises in the east.', id: 'Matahari terbit di sebelah timur.' },
        { en: 'Dewi reads a book every night.', id: 'Dewi membaca buku setiap malam.' },
        { en: 'They do not drink coffee.', id: 'Mereka tidak minum kopi.' }
      ],
      commonMistakes: [
        {
          wrong: 'He play football every afternoon.',
          right: 'He plays football every afternoon.',
          explanation: 'Karena subjeknya "He" (tunggal), tambahkan -s pada kata kerja dasar: "plays".'
        },
        {
          wrong: 'She does not likes spicy food.',
          right: 'She does not like spicy food.',
          explanation: 'Setelah kata bantu "does not", kata kerja kembali ke bentuk dasar: "like".'
        }
      ],
      exercises: [
        {
          id: 'ex-g3-1',
          question: 'My mother ___ delicious fried rice every Sunday morning.',
          options: ['cook', 'cooks', 'cooking', 'cooked'],
          correctIndex: 1,
          explanation: '"My mother" adalah She (orang ketiga tunggal), sehingga kata kerjanya ditambah -s menjadi "cooks".'
        }
      ]
    },
    {
      id: 'grm-4',
      title: 'Present Continuous Tense',
      titleId: 'Kegiatan yang Sedang Berlangsung',
      grade: 'VII',
      category: 'Tenses',
      summary: 'Menyatakan aksi yang sedang berlangsung tepat saat kita berbicara.',
      formula: 'S + is/am/are + Verb-ing',
      explanation: 'Keterangan waktu yang sering digunakan: now, right now, at the moment, look!, listen!',
      examples: [
        { en: 'Listen! The teacher is speaking.', id: 'Dengarkan! Guru sedang berbicara.' },
        { en: 'We are learning English together.', id: 'Kita sedang belajar Bahasa Inggris bersama-sama.' }
      ],
      commonMistakes: [
        {
          wrong: 'I studying English now.',
          right: 'I am studying English now.',
          explanation: 'Jangan lupa memasang to be (am/is/are) sebelum Verb-ing.'
        }
      ],
      exercises: [
        {
          id: 'ex-g4-1',
          question: 'Look! The birds ___ in the bright blue sky.',
          options: ['fly', 'is flying', 'are flying', 'flying'],
          correctIndex: 2,
          explanation: '"The birds" jamak, to be yang sesuai adalah "are" diikuti verb-ing: "are flying".'
        }
      ]
    },
    {
      id: 'grm-5',
      title: 'Simple Past Tense',
      titleId: 'Menceritakan Kejadian Masa Lampau',
      grade: 'VIII',
      category: 'Tenses',
      summary: 'Digunakan untuk menyatakan peristiwa yang sudah selesai di masa lalu.',
      formula: '(+) S + V2\n(-) S + did not + V1\n(?) Did + S + V1?',
      explanation: 'Kata kerja bentuk kedua (V2) terbagi menjadi regular verbs (tambah -ed seperti visited, walked) dan irregular verbs (went, saw, ate).',
      examples: [
        { en: 'Yesterday, I visited my grandparents.', id: 'Kemarin, saya mengunjungi kakek-nenek saya.' },
        { en: 'We went to Bali last holiday.', id: 'Kami pergi ke Bali liburan lalu.' }
      ],
      commonMistakes: [
        {
          wrong: 'I did not went to school yesterday.',
          right: 'I did not go to school yesterday.',
          explanation: 'Setelah kata "did not", kata kerja kembali ke bentuk pertama (V1: "go").'
        }
      ],
      exercises: [
        {
          id: 'ex-g5-1',
          question: 'Last week, Andi and his father ___ fresh fish in the river.',
          options: ['catch', 'caught', 'catching', 'catches'],
          correctIndex: 1,
          explanation: '"Last week" menunjukkan masa lampau, bentuk V2 dari catch adalah "caught".'
        }
      ]
    },
    {
      id: 'grm-6',
      title: 'Personal Information & Questions',
      titleId: 'Identitas Diri & Kalimat Tanya WH-Questions',
      grade: 'VII',
      category: 'Struktur Kalimat',
      summary: 'Menggunakan kata tanya What, Where, When, Who, Why, How untuk menanyakan informasi pribadi.',
      formula: 'WH-Word + to be/auxiliary + Subject + (Verb)?',
      explanation: '- What (Apa - menanyakan nama, benda)\n- Where (Di mana - tempat)\n- When (Kapan - waktu)\n- Who (Siapa - orang)\n- How (Bagaimana - cara, keadaan)',
      examples: [
        { en: 'What is your hobby?', id: 'Apa hobimu?' },
        { en: 'Where do you come from?', id: 'Dari mana asalmu?' }
      ],
      commonMistakes: [
        {
          wrong: 'Where you live?',
          right: 'Where do you live?',
          explanation: 'Pada Simple Present Tense, kalimat tanya butuh auxiliary do/does.'
        }
      ],
      exercises: [
        {
          id: 'ex-g6-1',
          question: '___ old are you? I am thirteen years old.',
          options: ['What', 'Where', 'How', 'Who'],
          correctIndex: 2,
          explanation: 'Untuk menanyakan usia, gunakan frasa "How old".'
        }
      ]
    },
    {
      id: 'grm-7',
      title: 'Descriptive Text Structure',
      titleId: 'Struktur Teks Deskriptif',
      grade: 'VII',
      category: 'Jenis Teks',
      summary: 'Struktur teks untuk mendeskripsikan ciri-ciri khusus orang, binatang, atau benda.',
      formula: '1. Identification (Pengenalan)\n2. Description (Ciri-ciri fisik, sifat, kebiasaan)',
      explanation: 'Teks deskriptif menggunakan Simple Present Tense dan kata sifat (adjectives) yang kaya seperti beautiful, friendly, tall, colorful.',
      examples: [
        { en: 'My cat, Miko, has white soft fur and sharp green eyes.', id: 'Kucingku, Miko, memiliki bulu putih lembut dan mata hijau yang tajam.' }
      ],
      commonMistakes: [
        {
          wrong: 'Using past tense to describe current physical characteristics.',
          right: 'Use simple present tense for general facts and descriptions.',
          explanation: 'Gunakan Simple Present Tense saat mendeskripsikan ciri fisik saat ini.'
        }
      ],
      exercises: [
        {
          id: 'ex-g7-1',
          question: 'Which sentence best fits the "Description" part of a descriptive text?',
          options: ['I have a lovely rabbit named Snow.', 'Snow loves carrots and hops happily around the garden.', 'Once upon a time there was a rabbit.', 'Finally, they went home.'],
          correctIndex: 1,
          explanation: 'Pilihan B mendeskripsikan makanan kesukaan dan tingkah laku spesifik objek.'
        }
      ]
    },
    {
      id: 'grm-8',
      title: 'Procedure Text Structure',
      titleId: 'Struktur Teks Prosedur',
      grade: 'IX',
      category: 'Jenis Teks',
      summary: 'Teks yang menjelaskan langkah-langkah membuat atau mengoperasikan sesuatu.',
      formula: '1. Goal / Aim (Tujuan)\n2. Materials / Ingredients (Alat dan Bahan)\n3. Steps / Methods (Langkah-langkah)',
      explanation: 'Gunakan kalimat perintah (imperative sentence) seperti: "Boil the water", "Cut the mango", dan connective words (First, Next, Then, Finally).',
      examples: [
        { en: 'First, wash your hands with clean water and soap.', id: 'Pertama, cuci tanganmu dengan air bersih dan sabun.' }
      ],
      commonMistakes: [
        {
          wrong: 'You must to boil water.',
          right: 'Boil the water.',
          explanation: 'Langkah teks prosedur memakai kata kerja imperatif langsung.'
        }
      ],
      exercises: [
        {
          id: 'ex-g8-1',
          question: '___, pour the hot water into the glass with tea bag.',
          options: ['First', 'Yesterday', 'Because', 'Although'],
          correctIndex: 0,
          explanation: '"First" adalah kata penghubung sekuensial yang menandai langkah pertama prosedur.'
        }
      ]
    },
    {
      id: 'grm-9',
      title: 'Pronouns (Object & Possessive)',
      titleId: 'Kata Ganti Objek dan Kepunyaan',
      grade: 'VII',
      category: 'Tata Bahasa Dasar',
      summary: 'Membedakan me, him, her, us, them (objek) dengan my, your, his, their (kepunyaan).',
      formula: 'Possessive Adjective + Noun | Verb + Object Pronoun',
      explanation: '- I -> me -> my (buku saya = my book)\n- You -> you -> your (temanmu = your friend)\n- He -> him -> his (topinya = his cap)\n- She -> her -> her (sepatunya = her shoes)\n- They -> them -> their (rumah mereka = their house)\n- We -> us -> our (kelas kita = our classroom)',
      examples: [
        { en: 'This is my classroom, and our teacher is very kind.', id: 'Ini adalah ruang kelasku, dan guru kami sangat baik.' },
        { en: 'Can you help me, please?', id: 'Bisakah kamu menolong saya?' }
      ],
      commonMistakes: [
        {
          wrong: 'This is he bicycle.',
          right: 'This is his bicycle.',
          explanation: 'Gunakan possessive "his" sebelum kata benda "bicycle".'
        }
      ],
      exercises: [
        {
          id: 'ex-g9-1',
          question: 'Dewi lost ___ pencil case yesterday.',
          options: ['she', 'her', 'hers', 'him'],
          correctIndex: 1,
          explanation: '"her" adalah kata sifat kepunyaan untuk perempuan tunggal sebelum kata benda "pencil case".'
        }
      ]
    },
    {
      id: 'grm-10',
      title: 'Prepositions of Place & Time',
      titleId: 'Kata Depan Tempat dan Waktu (In, On, At)',
      grade: 'VII',
      category: 'Preposisi',
      summary: 'Menggunakan in, on, dan at secara tepat untuk alamat, tempat, dan waktu.',
      formula: 'In (luas/umum) -> On (jalan/permukaan) -> At (spesifik/titik tepat)',
      explanation: 'Tempat:\n- In: in Indonesia, in Bandung, in a village\n- On: on Merdeka Street, on the table\n- At: at Jl. Sudirman No. 10, at school, at home\nWaktu:\n- In: in the morning, in 2026, in July\n- On: on Monday, on August 17th\n- At: at 7 o’clock, at noon, at night',
      examples: [
        { en: 'The flag ceremony starts at 7 o’clock.', id: 'Upacara bendera dimulai pada pukul 7 tepat.' },
        { en: 'I was born in October.', id: 'Saya lahir pada bulan Oktober.' }
      ],
      commonMistakes: [
        {
          wrong: 'We meet in Monday.',
          right: 'We meet on Monday.',
          explanation: 'Nama hari selalu menggunakan preposisi "on".'
        }
      ],
      exercises: [
        {
          id: 'ex-g10-1',
          question: 'English class begins ___ 07.30 a.m.',
          options: ['in', 'on', 'at', 'by'],
          correctIndex: 2,
          explanation: 'Jam spesifik selalu menggunakan "at".'
        }
      ]
    },
    {
      id: 'grm-11',
      title: 'Modal Verbs (Can, Must, Should)',
      titleId: 'Kata Kerja Bantu Modal: Kemampuan, Keharusan, Saran',
      grade: 'VIII',
      category: 'Tata Bahasa',
      summary: 'Menyatakan kemampuan (can), keharusan (must), dan saran (should).',
      formula: 'Subject + Modal + Verb 1 (tanpa to, tanpa -s)',
      explanation: '- Can = bisa / mampu (I can speak English)\n- Must = harus / wajib (We must wear uniform)\n- Should = sebaiknya / saran (You should study diligently)',
      examples: [
        { en: 'Students must obey the school rules.', id: 'Siswa wajib mematuhi peraturan sekolah.' },
        { en: 'You should drink enough water every day.', id: 'Kamu sebaiknya minum cukup air setiap hari.' }
      ],
      commonMistakes: [
        {
          wrong: 'He can speaks English.',
          right: 'He can speak English.',
          explanation: 'Setelah modal verb seperti "can", kata kerja tidak boleh ditambah -s meskipun subjeknya He.'
        }
      ],
      exercises: [
        {
          id: 'ex-g11-1',
          question: 'You look tired. You ___ take a rest.',
          options: ['should', 'must to', 'can to', 'shall not'],
          correctIndex: 0,
          explanation: '"should" digunakan untuk memberikan anjuran atau saran bersahabat.'
        }
      ]
    },
    {
      id: 'grm-12',
      title: 'Comparative and Superlative',
      titleId: 'Tingkat Perbandingan (Lebih & Paling)',
      grade: 'VIII',
      category: 'Adjectives',
      summary: 'Membandingkan sifat dua benda (Comparative: -er / more) atau lebih dari dua benda (Superlative: -est / most).',
      formula: 'Comparative: Adjective-er + than / more + Adjective + than\nSuperlative: the + Adjective-est / the most + Adjective',
      explanation: 'Satu suku kata:\n- tall -> taller than -> the tallest\nDua suku kata atau lebih:\n- beautiful -> more beautiful than -> the most beautiful',
      examples: [
        { en: 'Mount Bromo is colder than Jakarta.', id: 'Gunung Bromo lebih dingin daripada Jakarta.' },
        { en: 'Dewi is the smartest student in our class.', id: 'Dewi adalah siswa terpintar di kelas kami.' }
      ],
      commonMistakes: [
        {
          wrong: 'He is more taller than me.',
          right: 'He is taller than me.',
          explanation: 'Jangan menggabungkan "more" dengan akhiran "-er" secara bersamaan.'
        }
      ],
      exercises: [
        {
          id: 'ex-g12-1',
          question: 'An airplane is ___ than a train.',
          options: ['fast', 'faster', 'fastest', 'more fast'],
          correctIndex: 1,
          explanation: 'Membandingkan dua hal dengan kata sifat satu suku kata menggunakan "-er than": "faster".'
        }
      ]
    }
  ],
  pronunciationItems: [
    {
      id: 'pr-1',
      wordOrPhrase: 'Hello',
      phonetic: '/həˈloʊ/',
      meaningId: 'Halo / Salam',
      difficulty: 'Mudah',
      audioModelText: 'Hello',
      syllables: 'Hel - lo',
      tip: 'Tekankan pada suku kata kedua: hel-LO.'
    },
    {
      id: 'pr-2',
      wordOrPhrase: 'Teacher',
      phonetic: '/ˈtiː.tʃər/',
      meaningId: 'Guru',
      difficulty: 'Mudah',
      audioModelText: 'Teacher',
      syllables: 'Tea - cher',
      tip: 'Ucapkan bunyi "ea" panjang seperti /iː/ dan akhiri dengan /tʃər/ yang bersih.'
    },
    {
      id: 'pr-3',
      wordOrPhrase: 'School',
      phonetic: '/skuːl/',
      meaningId: 'Sekolah',
      difficulty: 'Mudah',
      audioModelText: 'School',
      syllables: 'School',
      tip: 'Mulai langsung dari huruf S tanpa menambahkan huruf "e" di depannya (bukan eskul).'
    },
    {
      id: 'pr-4',
      wordOrPhrase: 'Village',
      phonetic: '/ˈvɪl.ɪdʒ/',
      meaningId: 'Desa / Kampung',
      difficulty: 'Sedang',
      audioModelText: 'Village',
      syllables: 'Vil - lage',
      tip: 'Gigi atas menyentuh bibir bawah untuk bunyi /v/, lalu akhiri dengan bunyi /dʒ/ lembut.'
    },
    {
      id: 'pr-5',
      wordOrPhrase: 'Beautiful',
      phonetic: '/ˈbjuː.tɪ.fəl/',
      meaningId: 'Indah / Cantik',
      difficulty: 'Sedang',
      audioModelText: 'Beautiful',
      syllables: 'Beau - ti - ful',
      tip: 'Tiga suku kata: byu-ti-ful. Tekanan di awal kata.'
    },
    {
      id: 'pr-6',
      wordOrPhrase: 'Thank you',
      phonetic: '/ˈθæŋk juː/',
      meaningId: 'Terima kasih',
      difficulty: 'Sedang',
      audioModelText: 'Thank you',
      syllables: 'Thank - you',
      tip: 'Ujung lidah di antara gigi atas dan bawah untuk membunyikan "th" (/θ/).'
    },
    {
      id: 'pr-7',
      wordOrPhrase: 'Nice to meet you',
      phonetic: '/naɪs tuː miːt juː/',
      meaningId: 'Senang berkenalan denganmu',
      difficulty: 'Tantangan',
      audioModelText: 'Nice to meet you',
      syllables: 'Nice - to - meet - you',
      tip: 'Ucapkan mengalir dengan intonasi ramah dan ceria.'
    },
    {
      id: 'pr-8',
      wordOrPhrase: 'Where do you live?',
      phonetic: '/wɛər duː juː lɪv/',
      meaningId: 'Di mana kamu tinggal?',
      difficulty: 'Sedang',
      audioModelText: 'Where do you live?',
      syllables: 'Where - do - you - live',
      tip: 'Intonasi turun di akhir kalimat tanya WH-Question.'
    }
  ],
  pronunciationAttempts: [
    {
      id: 'pra-1',
      studentId: 'std-1',
      itemId: 'pr-1',
      targetText: 'Hello',
      recognizedText: 'hello',
      score: 95,
      feedback: 'Pengucapan sangat jelas dan tepat!',
      timestamp: '2026-10-12T02:40:00Z'
    },
    {
      id: 'pra-2',
      studentId: 'std-1',
      itemId: 'pr-6',
      targetText: 'Thank you',
      recognizedText: 'thank you',
      score: 90,
      feedback: 'Bagus sekali! Bunyi "th" terdengar natural.',
      timestamp: '2026-10-12T02:45:00Z'
    }
  ],
  readingExercises: [
    {
      id: 'read-1',
      title: 'A New Friend in Class 7A',
      grade: 'VII',
      topic: 'Introducing Yourself',
      difficulty: 'Beginner',
      passage: `Today is Monday. It is the first day of the new semester at SMP Negeri 1. A new student named Farhan enters Class 7A. 
Farhan stands in front of the classroom with a bright smile. He says, "Good morning, friends! My name is Farhan Pratama. You can call me Farhan. I am thirteen years old. I moved here from a quiet village in West Java because my father works in this town. My hobby is playing badminton and my dream is to be an athlete. Nice to meet all of you!"
All the students in Class 7A clap their hands warmly. Andi, the class captain, welcomes Farhan with enthusiasm. Farhan feels very happy and confident.`,
      glossary: [
        { word: 'Bright smile', meaning: 'Senyuman cerah' },
        { word: 'Quiet village', meaning: 'Desa yang tenang' },
        { word: 'Athlete', meaning: 'Atlet / Olahragawan' },
        { word: 'Warmly', meaning: 'Dengan hangat' },
        { word: 'Confident', meaning: 'Percaya diri' }
      ],
      questions: [
        {
          id: 'rq-1',
          question: 'What is the main topic of the passage?',
          options: [
            'A badminton competition',
            'A new student introducing himself to the class',
            'A holiday in West Java',
            'The daily schedule of SMP Negeri 1'
          ],
          correctIndex: 1,
          explanation: 'Teks menceritakan Farhan, siswa baru di kelas 7A, yang memperkenalkan dirinya di depan kelas.'
        },
        {
          id: 'rq-2',
          question: 'Why did Farhan move to the town?',
          options: [
            'Because he won a badminton cup',
            'Because his father works in this town',
            'Because he wanted to visit his grandparents',
            'Because the village school was closed'
          ],
          correctIndex: 1,
          explanation: 'Tertulis dalam paragraf kedua: "...because my father works in this town."'
        },
        {
          id: 'rq-3',
          question: 'What is Farhan’s hobby and dream?',
          options: [
            'Cycling and being a teacher',
            'Reading books and being a doctor',
            'Playing badminton and being an athlete',
            'Singing and being an artist'
          ],
          correctIndex: 2,
          explanation: 'Farhan menyatakan: "My hobby is playing badminton and my dream is to be an athlete."'
        }
      ]
    },
    {
      id: 'read-2',
      title: 'Describing My Beloved English Corner',
      grade: 'VIII',
      topic: 'Descriptive Text',
      difficulty: 'Elementary',
      passage: `Our school has a special room called the English Corner. It is located on the second floor next to the library. The room is painted light blue, which makes it feel calm and fresh.
Inside the English Corner, there are colorful bookshelves full of English storybooks, comic magazines, and bilingual dictionaries. In the center of the room, there are comfortable beanbags where students can sit and read. On the walls, we hang posters about English grammar tips, inspiring quotes, and famous world landmarks.
Every Wednesday afternoon, the English Club holds speaking games here. It is our favorite place to practice English without fear of making mistakes.`,
      glossary: [
        { word: 'Bilingual', meaning: 'Dua bahasa' },
        { word: 'Beanbags', meaning: 'Bantal duduk santai' },
        { word: 'Landmarks', meaning: 'Bangunan terkenal / ikon' }
      ],
      questions: [
        {
          id: 'rq-4',
          question: 'Where is the English Corner located?',
          options: [
            'Next to the cafeteria',
            'On the second floor next to the library',
            'Near the school entrance gate',
            'In the school garden'
          ],
          correctIndex: 1,
          explanation: 'Sesuai kalimat kedua: "It is located on the second floor next to the library."'
        }
      ]
    }
  ],
  listeningExercises: [
    {
      id: 'list-1',
      title: 'Listening Practice: Meeting at the Canteen',
      grade: 'VII',
      topic: 'Greetings and Ordering',
      audioScript: `Hello! My name is Sarah. I am twelve years old. During the break time, I go to the school canteen with my friend Riko. 
Sarah: Good morning, Mrs. Tina! May I have one bowl of chicken noodle and one glass of iced tea, please?
Mrs. Tina: Good morning, Sarah. Sure! That will be fifteen thousand rupiahs.
Sarah: Here is the money. Thank you very much!
Mrs. Tina: You are welcome, Sarah. Enjoy your meal!`,
      maxPlayCount: 3,
      questions: [
        {
          id: 'lq-1',
          question: 'What does Sarah order at the school canteen?',
          options: [
            'Fried rice and orange juice',
            'Chicken noodle and iced tea',
            'Meatball soup and mineral water',
            'Sandwich and milk'
          ],
          correctIndex: 1,
          explanation: 'Sarah memesan: "one bowl of chicken noodle and one glass of iced tea".'
        },
        {
          id: 'lq-2',
          question: 'How much does Sarah pay for her order?',
          options: [
            'Ten thousand rupiahs',
            'Fifteen thousand rupiahs',
            'Twenty thousand rupiahs',
            'Five thousand rupiahs'
          ],
          correctIndex: 1,
          explanation: 'Ibu kantin menyebutkan: "That will be fifteen thousand rupiahs."'
        }
      ]
    }
  ],
  writingTasks: [
    {
      id: 'wrt-1',
      title: 'Menulis Perkenalan Diri (Introducing Yourself)',
      grade: 'VII',
      type: 'Personal Essay',
      prompt: 'Tulis satu paragraf perkenalan diri dalam Bahasa Inggris (minimal 40 kata). Ceritakan nama lengkap, nama panggilan, usia, asal sekolah, tempat tinggal, hobi, dan cita-citamu.',
      guideQuestions: [
        'What is your full name and nickname?',
        'How old are you and where do you go to school?',
        'Where do you live?',
        'What is your favorite hobby and why do you like it?',
        'What is your dream in the future?'
      ],
      minWords: 40,
      rubricFocus: ['Grammar', 'Vocabulary', 'Spelling', 'Structure', 'Organization']
    },
    {
      id: 'wrt-2',
      title: 'Menulis Deskripsi Tempat Tinggal (My Village or Town)',
      grade: 'VII',
      type: 'Descriptive Paragraph',
      prompt: 'Gambarkan desa atau lingkungan tempat tinggalmu dalam 50-70 kata. Jelaskan apa yang membuat tempat tersebut istimewa (suasana, pemandangan, atau keramahan warganya).',
      guideQuestions: [
        'What is the name of your village or town?',
        'What does it look like? (peaceful, crowded, green)',
        'What do you like most about your neighborhood?'
      ],
      minWords: 50,
      rubricFocus: ['Grammar', 'Vocabulary', 'Descriptive Details']
    }
  ],
  writingSubmissions: [
    {
      id: 'sub-1',
      taskId: 'wrt-1',
      studentId: 'std-1',
      studentName: 'Andi Pratama',
      content: 'Hello everyone! My name is Andi Pratama. You can call me Andi. I am thirteen years old. I am a student at SMP Negeri 1. I live in Melati Village with my family. My village is green and peaceful. My hobby is playing badminton every afternoon with my friends. In the future, I want to be a teacher because I love helping people learn.',
      wordCount: 68,
      submittedAt: '2026-10-11T10:30:00Z',
      status: 'graded',
      aiFeedback: {
        grammarScore: 90,
        vocabularyScore: 88,
        spellingScore: 95,
        structureScore: 92,
        organizationScore: 90,
        overallEstimatedScore: 91,
        strengths: [
          'Penggunaan to be dan kalimat Simple Present Tense sudah sangat akurat.',
          'Pilihan kosakata sesuai konteks siswa SMP (green and peaceful, helping people learn).',
          'Alur paragraf runut dari sapaan hingga penutup.'
        ],
        improvements: [
          'Dapat menambahkan variasi penghubung kalimat seperti "Besides that," atau "Moreover,".',
          'Bagus sekali! Pertahankan keberanian menulis.'
        ],
        sampleCorrection: 'Hello everyone! My name is Andi Pratama, and you can call me Andi. I am thirteen years old and study at SMP Negeri 1. I live in Melati Village, which is green and peaceful. My hobby is playing badminton every afternoon with my friends. In the future, my dream is to become a teacher because I love helping others learn.',
        detailedNotes: 'Tulisan Andi memenuhi semua kriteria tugas perkenalan diri dengan sangat memuaskan.'
      },
      teacherScore: 92,
      teacherComment: 'Luar biasa, Andi! Kalimatmu sangat rapi dan percaya diri. Terus berlatih ya!'
    }
  ],
  quizzes: [
    {
      id: 'qz-pre-7',
      title: 'Evaluasi Awal (Pre-Test): Kemampuan Dasar Bahasa Inggris Kelas VII',
      grade: 'VII',
      topic: 'Greetings, Introducing, & Basic Grammar',
      category: 'pre-test',
      durationMinutes: 15,
      maxAttempts: 1,
      releaseAnswerKey: false,
      isPublished: true,
      createdAt: '2026-10-01T08:00:00Z',
      questions: [
        {
          id: 'q-pre-1',
          type: 'mc',
          questionText: 'When you meet your teacher at 07.00 a.m., what greeting should you say?',
          options: ['Good afternoon, Sir.', 'Good morning, Sir.', 'Good evening, Sir.', 'Good night, Sir.'],
          correctAnswer: 1,
          explanation: 'Pukul 07.00 pagi menggunakan salam "Good morning".',
          points: 20
        },
        {
          id: 'q-pre-2',
          type: 'mc',
          questionText: 'Farhan: "What is your name?" - Budi: "___ name is Budi."',
          options: ['My', 'Your', 'His', 'Her'],
          correctAnswer: 0,
          explanation: 'Budi menjawab untuk dirinya sendiri, jadi kata sifat kepunyaan yang tepat adalah "My".',
          points: 20
        },
        {
          id: 'q-pre-3',
          type: 'tf',
          questionText: 'Is the sentence "She are a doctor" grammatically correct?',
          correctAnswer: false,
          explanation: 'Salah. Subjek tunggal "She" harus berpasangan dengan "is" (She is a doctor).',
          points: 20
        },
        {
          id: 'q-pre-4',
          type: 'fill',
          questionText: 'Lengkapilah kalimat: "Where ___ you live?" (Gunakan kata bantu do/does)',
          correctAnswer: 'do',
          explanation: 'Subjek "you" menggunakan kata bantu "do" dalam kalimat tanya Simple Present.',
          points: 20
        },
        {
          id: 'q-pre-5',
          type: 'unscramble',
          questionText: 'Susunlah kata-kata acak berikut menjadi kalimat yang benar: [to / Nice / meet / you]',
          scrambledWords: ['to', 'Nice', 'meet', 'you'],
          correctAnswer: 'Nice to meet you',
          explanation: 'Susunan yang benar adalah ungkapan perkenalan: "Nice to meet you".',
          points: 20
        }
      ]
    },
    {
      id: 'qz-post-7',
      title: 'Evaluasi Akhir (Post-Test): Modul Introducing Yourself Kelas VII',
      grade: 'VII',
      topic: 'Introducing Yourself & Daily Social Expressions',
      category: 'post-test',
      durationMinutes: 20,
      maxAttempts: 2,
      releaseAnswerKey: true,
      isPublished: true,
      createdAt: '2026-10-10T08:00:00Z',
      questions: [
        {
          id: 'q-post-1',
          type: 'mc',
          questionText: 'Andi: "Hello Dewi, this is my friend Budi." - Dewi: "Hi Budi, ___"',
          options: ['I am fine.', 'Glad to meet you.', 'Goodbye.', 'Where do you go?'],
          correctAnswer: 1,
          explanation: 'Saat diperkenalkan kepada teman baru, respons yang sopan dan tepat adalah "Glad to meet you" atau "Nice to meet you".',
          points: 20
        },
        {
          id: 'q-post-2',
          type: 'mc',
          questionText: 'Which preposition is correct for a specific street address with house number? "I live ___ Melati Street No. 12."',
          options: ['in', 'on', 'at', 'by'],
          correctAnswer: 2,
          explanation: 'Alamat lengkap beserta nomor rumah menggunakan preposisi "at".',
          points: 20
        },
        {
          id: 'q-post-3',
          type: 'fill',
          questionText: 'Complete the sentence: "My sister ___ (like) reading story books."',
          correctAnswer: 'likes',
          explanation: 'Subjek "My sister" (She) memerlukan penambahan -s pada kata kerja Simple Present Tense: "likes".',
          points: 20
        },
        {
          id: 'q-post-4',
          type: 'match',
          questionText: 'Jodohkan ungkapan Bahasa Inggris dengan maknanya dalam Bahasa Indonesia:',
          matchingPairs: [
            { left: 'Good morning', right: 'Selamat pagi' },
            { left: 'See you later', right: 'Sampai jumpa lagi' },
            { left: 'Excuse me', right: 'Permisi' }
          ],
          correctAnswer: 'Good morning:Selamat pagi|See you later:Sampai jumpa lagi|Excuse me:Permisi',
          explanation: 'Pasangan arti kata baku dalam percakapan sehari-hari.',
          points: 20
        },
        {
          id: 'q-post-5',
          type: 'unscramble',
          questionText: 'Susunlah kata-kata berikut: [is / hobby / My / football / playing]',
          scrambledWords: ['is', 'hobby', 'My', 'football', 'playing'],
          correctAnswer: 'My hobby is playing football',
          explanation: 'Struktur yang tepat: My hobby + is + playing football.',
          points: 20
        }
      ]
    },
    fiftyQuestionQuiz
  ],
  quizAttempts: [
    {
      id: 'att-1',
      quizId: 'qz-pre-7',
      quizTitle: 'Evaluasi Awal (Pre-Test): Kemampuan Dasar Bahasa Inggris Kelas VII',
      studentId: 'std-1',
      studentName: 'Andi Pratama',
      studentGrade: 'VII',
      score: 55,
      maxScore: 100,
      percentage: 55,
      answers: { 'q-pre-1': 1, 'q-pre-2': 0, 'q-pre-3': true, 'q-pre-4': 'are', 'q-pre-5': 'Nice to meet you' },
      completedAt: '2026-10-02T08:30:00Z',
      feedback: 'Perlu penguatan pada konsep To Be dan penggunaan auxiliary do/does.'
    },
    {
      id: 'att-2',
      quizId: 'qz-post-7',
      quizTitle: 'Evaluasi Akhir (Post-Test): Modul Introducing Yourself Kelas VII',
      studentId: 'std-1',
      studentName: 'Andi Pratama',
      studentGrade: 'VII',
      score: 85,
      maxScore: 100,
      percentage: 85,
      answers: { 'q-post-1': 1, 'q-post-2': 2, 'q-post-3': 'likes', 'q-post-4': 'Good morning:Selamat pagi|See you later:Sampai jumpa lagi|Excuse me:Permisi', 'q-post-5': 'My hobby is playing football' },
      completedAt: '2026-10-11T09:15:00Z',
      feedback: 'Peningkatan luar biasa! Skor meningkat dari 55 (Pre-Test) menjadi 85 (Post-Test).'
    },
    {
      id: 'att-3',
      quizId: 'qz-pre-7',
      quizTitle: 'Evaluasi Awal (Pre-Test): Kemampuan Dasar Bahasa Inggris Kelas VII',
      studentId: 'std-2',
      studentName: 'Dewi Lestari',
      studentGrade: 'VII',
      score: 60,
      maxScore: 100,
      percentage: 60,
      answers: { 'q-pre-1': 1, 'q-pre-2': 0, 'q-pre-3': false, 'q-pre-4': 'is', 'q-pre-5': 'Nice to meet you' },
      completedAt: '2026-10-02T08:30:00Z',
      feedback: 'Pemahaman awal cukup baik, siap untuk pendalaman modul.'
    },
    {
      id: 'att-4',
      quizId: 'qz-post-7',
      quizTitle: 'Evaluasi Akhir (Post-Test): Modul Introducing Yourself Kelas VII',
      studentId: 'std-2',
      studentName: 'Dewi Lestari',
      studentGrade: 'VII',
      score: 92,
      maxScore: 100,
      percentage: 92,
      answers: { 'q-post-1': 1, 'q-post-2': 2, 'q-post-3': 'likes', 'q-post-4': 'Good morning:Selamat pagi|See you later:Sampai jumpa lagi|Excuse me:Permisi', 'q-post-5': 'My hobby is playing football' },
      completedAt: '2026-10-11T09:15:00Z',
      feedback: 'Sangat memuaskan! Dewi memahami materi perkenalan dan preposisi dengan sangat baik.'
    }
  ],
  rubrics: {
    speaking: [
      {
        id: 'rub-sp-1',
        name: 'Fluency (Kelancaran)',
        weightPercent: 20,
        descriptors: {
          level4: 'Berbicara lancar tanpa jeda panjang, intonasi wajar dan percaya diri.',
          level3: 'Cukup lancar dengan sedikit keraguan sesekali saat memilih kata.',
          level2: 'Sering berhenti atau terdiam cukup lama untuk mengingat kata.',
          level1: 'Sangat terbata-bata dan membutuhkan dorongan berulang kali.'
        }
      },
      {
        id: 'rub-sp-2',
        name: 'Pronunciation (Pelafalan)',
        weightPercent: 25,
        descriptors: {
          level4: 'Pengucapan kata jelas, artikulasi tepat, aksen mudah dipahami.',
          level3: 'Pengucapan sebagian besar tepat, sedikit kesalahan yang tidak mengganggu makna.',
          level2: 'Beberapa kesalahan pengucapan yang membuat lawan bicara harus mengulang.',
          level1: 'Banyak pengucapan keliru sehingga makna sulit dipahami.'
        }
      },
      {
        id: 'rub-sp-3',
        name: 'Vocabulary (Penguasaan Kosakata)',
        weightPercent: 20,
        descriptors: {
          level4: 'Kosakata variatif, tepat sasaran sesuai topik SMP dan natural.',
          level3: 'Kosakata memadai untuk kebutuhan percakapan dasar sehari-hari.',
          level2: 'Kosakata sangat terbatas, sering mengulang kata yang sama.',
          level1: 'Kosakata tidak mencukupi untuk menyampaikan pesan.'
        }
      },
      {
        id: 'rub-sp-4',
        name: 'Grammar (Tata Bahasa Lisan)',
        weightPercent: 20,
        descriptors: {
          level4: 'Struktur kalimat dasar benar (Simple Present, to be, kata ganti subjek).',
          level3: 'Ada kesalahan tata bahasa kecil yang masih dapat dimaklumi dan tidak mengubah pesan.',
          level2: 'Kesalahan tata bahasa cukup sering terjadi (misal to be tertukar).',
          level1: 'Tata bahasa membingungkan dan tidak beraturan.'
        }
      },
      {
        id: 'rub-sp-5',
        name: 'Interaction (Interaksi & Respons)',
        weightPercent: 15,
        descriptors: {
          level4: 'Merespons pertanyaan AI/lawan bicara secara spontan dan kontekstual.',
          level3: 'Merespons dengan baik setelah mencerna pertanyaan.',
          level2: 'Respons lambat dan memerlukan petunjuk kalimat (hint).',
          level1: 'Sulit merespons meski telah diberikan petunjuk.'
        }
      }
    ],
    writing: [
      {
        id: 'rub-wr-1',
        name: 'Content (Kesesuaian Isi)',
        weightPercent: 25,
        descriptors: {
          level4: 'Isi tulisan sangat lengkap, menjawab seluruh pertanyaan panduan dengan detail.',
          level3: 'Isi tulisan relevan dan menjawab sebagian besar panduan.',
          level2: 'Isi tulisan kurang lengkap dan hanya membahas sebagian kecil instruksi.',
          level1: 'Isi tulisan keluar dari topik yang ditugaskan.'
        }
      },
      {
        id: 'rub-wr-2',
        name: 'Grammar (Tata Bahasa Tulis)',
        weightPercent: 25,
        descriptors: {
          level4: 'Penggunaan tenses, kata kerja, dan to be sangat rapi dan konsisten.',
          level3: 'Terdapat beberapa kesalahan kecil pada kata kerja tunggal/jamak.',
          level2: 'Banyak kesalahan tata bahasa dasar yang perlu perbaikan.',
          level1: 'Kesalahan tata bahasa mendominasi sehingga sulit dimengerti.'
        }
      },
      {
        id: 'rub-wr-3',
        name: 'Vocabulary (Pilihan Kata)',
        weightPercent: 20,
        descriptors: {
          level4: 'Pilihan kata kaya, sesuai konteks SMP, dan ejaan tepat.',
          level3: 'Pilihan kata memadai untuk menyampaikan maksud.',
          level2: 'Pilihan kata terbatas dan repetitif.',
          level1: 'Banyak kata yang tidak tepat arti atau terjemahan harfiah salah.'
        }
      },
      {
        id: 'rub-wr-4',
        name: 'Organization (Struktur & Keteraturan)',
        weightPercent: 15,
        descriptors: {
          level4: 'Paragraf tersusun rapi dengan kalimat pembuka, isi, dan penutup yang jelas.',
          level3: 'Alur kalimat cukup runtut dan mudah diikuti pembaca.',
          level2: 'Gagasan melompat-lompat tanpa kata penghubung.',
          level1: 'Tidak memiliki struktur paragraf yang teratur.'
        }
      },
      {
        id: 'rub-wr-5',
        name: 'Mechanics (Ejaan & Tanda Baca)',
        weightPercent: 15,
        descriptors: {
          level4: 'Huruf kapital, titik, koma, dan ejaan kata digunakan dengan benar.',
          level3: 'Sedikit kesalahan penulisan huruf kapital atau ejaan kata.',
          level2: 'Cukup banyak salah eja (typo) dan tanda baca yang hilang.',
          level1: 'Tanda baca dan huruf kapital diabaikan sama sekali.'
        }
      }
    ],
    reading: [
      {
        id: 'rub-rd-1',
        name: 'Understanding Main Ideas (Ide Pokok)',
        weightPercent: 40,
        descriptors: {
          level4: 'Mampu menyimpulkan ide pokok dan tujuan teks dengan tepat.',
          level3: 'Mampu menemukan ide pokok dengan bantuan kata kunci.',
          level2: 'Kesulitan membedakan ide pokok dan informasi pendukung.',
          level1: 'Belum memahami gagasan utama teks.'
        }
      },
      {
        id: 'rub-rd-2',
        name: 'Understanding Details (Informasi Rinci)',
        weightPercent: 35,
        descriptors: {
          level4: 'Menjawab pertanyaan informasi spesifik dengan akurat.',
          level3: 'Menjawab sebagian besar pertanyaan fakta spesifik.',
          level2: 'Menjawab sedikit informasi spesifik.',
          level1: 'Tidak mampu menemukan informasi rinci.'
        }
      },
      {
        id: 'rub-rd-3',
        name: 'Vocabulary in Context (Kosakata Kontekstual)',
        weightPercent: 25,
        descriptors: {
          level4: 'Memahami arti kata dan rujukan kata ganti dalam teks.',
          level3: 'Memahami sebagian besar arti kata dalam teks.',
          level2: 'Sering keliru menafsirkan arti kata.',
          level1: 'Kosakata teks tidak dapat dipahami.'
        }
      }
    ],
    listening: [
      {
        id: 'rub-ls-1',
        name: 'Understanding Main Ideas (Ide Utama Audio)',
        weightPercent: 40,
        descriptors: {
          level4: 'Memahami konteks umum dan inti percakapan audio sekali dengar.',
          level3: 'Memahami ide utama setelah dua kali pemutaran audio.',
          level2: 'Membutuhkan bantuan naskah untuk memahami ide utama.',
          level1: 'Belum memahami topik pembicaraan.'
        }
      },
      {
        id: 'rub-ls-2',
        name: 'Identifying Details (Menangkap Informasi Rinci)',
        weightPercent: 35,
        descriptors: {
          level4: 'Menangkap nama, angka, atau pilihan dengan tepat dari tuturan.',
          level3: 'Menangkap sebagian besar informasi rinci.',
          level2: 'Sering melewatkan detail penting.',
          level1: 'Tidak mampu mencatat detail.'
        }
      },
      {
        id: 'rub-ls-3',
        name: 'Understanding Instructions (Memahami Arahan)',
        weightPercent: 25,
        descriptors: {
          level4: 'Dapat mengikuti instruksi lisan penutur dengan cepat.',
          level3: 'Mengikuti instruksi dengan baik.',
          level2: 'Ragu-ragu saat menjalankan instruksi lisan.',
          level1: 'Tidak merespons instruksi lisan.'
        }
      }
    ]
  },
  lessonPlans: [
    {
      id: 'lp-1',
      title: 'Modul Ajar Bahasa Inggris Kelas VII: Introducing Yourself and Greetings',
      grade: 'VII',
      semester: 1,
      academicYear: '2026/2027',
      subject: 'Bahasa Inggris',
      topic: 'Introducing Yourself & Greetings',
      timeAllocation: '2 x 40 menit (1 Pertemuan)',
      studentLevel: 'Beginner - SMP Fase D',
      learningModel: 'Communicative Language Teaching (CLT) & Problem-Based Learning',
      media: ['Aplikasi SI CERDAS ENGLISH', 'Audio TTS', 'Proyektor / Smartphone Siswa'],
      specialNeedsNotes: 'Dukungan tombol "Explain in Indonesian" dan teks alternatif bagi siswa dengan kecepatan belajar adaptif.',
      identitas: {
        sekolah: 'SMP Negeri 1 Cerdas Bangsa',
        guru: 'Siti Rahmawati, S.Pd.',
        mataPelajaran: 'Bahasa Inggris',
        kelasSemester: 'Kelas VII / Semester Ganjil',
        alokasiWaktu: '2 Jam Pelajaran (2 x 40 Menit)'
      },
      tujuanPembelajaran: [
        'Peserta didik mampu mengidentifikasi fungsi sosial dan ungkapan sapaan (greetings) serta perkenalan diri dengan benar.',
        'Peserta didik mampu menyusun kalimat perkenalan diri sederhana mencakup nama, usia, alamat, dan hobi.',
        'Peserta didik memiliki keberanian memperagakan percakapan perkenalan diri menggunakan AI Speaking Partner dengan percaya diri.'
      ],
      kegiatanPendahuluan: [
        'Guru menyapa peserta didik dengan salam Bahasa Inggris ceria: "Good morning, class! How are you today?"',
        'Apersepsi: Guru menampilkan video pendek siswa menyapa teman baru di sekolah.',
        'Guru menyampaikan tujuan pembelajaran dan mengaitkannya dengan tagline: "Learn with Confidence, Speak with Courage!".'
      ],
      kegiatanInti: [
        'Tahap 1 (Orientasi): Siswa membuka aplikasi SI CERDAS ENGLISH pada Modul Demonstrasi Kelas VII.',
        'Tahap 2 (Eksplorasi): Siswa mendengarkan contoh audio pelafalan salam dan memperkenalkan diri.',
        'Tahap 3 (Praktik Terbimbing): Siswa mencoba percakapan interaktif dengan AI Speaking Partner tingkat Beginner.',
        'Tahap 4 (Diferensiasi): Siswa yang membutuhkan panduan menggunakan tombol "Give Me a Hint", sedangkan siswa yang mahir mencoba memperluas topik.',
        'Tahap 5 (Unjuk Kerja): Siswa secara berpasangan mempraktikkan dialog perkenalan diri di depan kelas.'
      ],
      kegiatanPenutup: [
        'Refleksi bersama: Siswa menyampaikan kosakata baru yang dipelajari hari ini.',
        'Guru memberikan umpan balik positif atas keberanian siswa berbicara.',
        'Penutup dengan salam: "Thank you for your active participation. See you next meeting!"'
      ],
      mediaDanSumber: [
        'Platform SI CERDAS ENGLISH (Fitur Speaking Partner, Vocabulary Builder, Pronunciation)',
        'Lembar Kerja Siswa Digital',
        'Buku Teks Bahasa Inggris SMP Kelas VII Kemendikbudristek'
      ],
      aktivitasSiswa: [
        'Menyimak audio pelafalan ungkapan salam',
        'Mencocokkan kosakata baru di Vocabulary Builder',
        'Berlatih percakapan lisan 5 giliran bersama AI Speaking Partner',
        'Menuliskan 1 paragraf perkenalan diri'
      ],
      asesmen: {
        diagnostik: 'Pre-Test 5 butir soal di awal bab untuk mengukur pengetahuan dasar.',
        formatif: 'Observasi keaktifan percakapan dengan AI Speaking Partner dan kuis kosakata interaktif.',
        sumatif: 'Post-test tertulis dan penilaian unjuk kerja berbicara (speaking rubric).'
      },
      rubrikPenilaian: 'Menggunakan Rubrik Keterampilan Berbicara SI CERDAS ENGLISH (Fluency 20%, Pronunciation 25%, Vocabulary 20%, Grammar 20%, Interaction 15%).',
      refleksiPembelajaran: 'Apakah seluruh siswa berani berbicara minimal satu kalimat perkenalan dalam Bahasa Inggris? Jika ada siswa pemalu, fasilitasi dengan latihan mandiri bersama AI terlebih dahulu sebelum tampil di hadapan teman.',
      createdAt: '2026-10-10T12:00:00Z'
    }
  ]
};
