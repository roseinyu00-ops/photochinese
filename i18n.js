/* PhotoChinese bilingual interface. Russian is the source language; English strings are professionally edited UI translations. */
(() => {
  'use strict';
  const STORAGE_KEY = 'photoChineseLanguage';
  const translations = {
  "PhotoChinese — учи китайский через фото": "PhotoChinese — Learn Chinese Through Photos",
  "Изучение": "Explore",
  "Мемы": "Memes",
  "Обучение": "Learning",
  "Тест HSK": "HSK Test",
  "Мой словарь": "My Dictionary",
  "Профиль": "Profile",
  "✦ Панель владельца": "✦ Owner Dashboard",
  "Китайский начинается": "Chinese begins with",
  "одного": "a single",
  "фото.": "photo.",
  "Наведи камеру на текст или загрузи изображение — PhotoChinese поможет": "Point your camera at text or upload an image — PhotoChinese will help you",
  "прочитать, понять и запомнить": "read, understand, and remember",
  "каждый иероглиф.": "every Chinese character.",
  "Распознавание по фото временно недоступно": "Photo recognition is temporarily unavailable",
  "Мы пока приостановили эту функцию, чтобы доработать качество распознавания китайских иероглифов. Она вернётся, когда будет работать надёжнее.": "We’ve temporarily paused this feature while we improve Chinese character recognition. It will return once it is more reliable.",
  "Фото и камера временно отключены": "Photo upload and camera are temporarily disabled",
  "＋ Загрузить фото": "＋ Upload a photo",
  "◎ Открыть камеру": "◎ Open camera",
  "Перетащи изображение сюда": "Drag an image here",
  "Распознавание по фото временно отключено.": "Photo recognition is temporarily disabled.",
  "Распознанный китайский текст": "Recognized Chinese text",
  "Копировать текст": "Copy text",
  "Разобрать распознанное": "Analyze recognized text",
  "Отправить в раздел «Мемы»": "Send to Memes",
  "Точность зависит от качества фото, освещения и шрифта. Проверь распознанный текст вручную.": "Accuracy depends on image quality, lighting, and font. Please check the recognized text manually.",
  "Разбор иероглифов и предложений": "Character and sentence analysis",
  "Вставь китайский текст вручную или отправь сюда текст, распознанный с фотографии. Приложение ищет слова в большой китайско-русской базе.": "Enter Chinese text or send text recognized from a photo. The app looks up words in its extensive Chinese dictionary.",
  "Китайский текст": "Chinese text",
  "Разобрать текст": "Analyze text",
  "Загружаем большой китайский словарь…": "Loading the Chinese dictionary…",
  "Загружаем сведения о ключах и компонентах…": "Loading radicals and character components…",
  "Как написать иероглиф": "How to write a character",
  "Нажми «Показать черты», чтобы увидеть анимацию.": "Select “Show strokes” to see the animation.",
  "Показать черты": "Show strokes",
  "Анимация загружается из открытой базы Hanzi Writer. Для неё нужен интернет.": "The animation is provided by the open Hanzi Writer database and requires an internet connection.",
  "Переведи мем 🇨🇳": "Translate a meme 🇨🇳",
  "Загрузи мем с китайским текстом или вставь фразу вручную. PhotoChinese распознает надпись и поможет разобрать слова.": "Upload a meme containing Chinese text or enter a phrase manually. PhotoChinese will recognize the text and help you understand the words.",
  "＋ Загрузить мем": "＋ Upload a meme",
  "Китайский текст (можно исправить после распознавания)": "Chinese text (you can edit it after recognition)",
  "Распознавание работает в браузере. Текст не отправляется на сервер. Контекстный разбор сленга и скрытого смысла с помощью ИИ появится после подключения защищённого ИИ-сервиса.": "Recognition runs in your browser. Your text is not sent to a server. AI-powered explanations of slang and implied meaning will be available once a secure AI service is connected.",
  "PHOTOCHINESE · ТВОЙ ПУТЬ В КИТАЙСКИЙ": "PHOTOCHINESE · YOUR CHINESE LEARNING JOURNEY",
  "с интересом": "with curiosity",
  "Выбирай формат занятий и двигайся в своём темпе.": "Choose how you want to study and learn at your own pace.",
  "Курс HSK": "HSK Course",
  "ИИ-учитель": "AI Tutor",
  "Тренажёр иероглифов": "Character Practice",
  "Мини-игры": "Mini-games",
  "Грамматика": "Grammar",
  "Разговорник": "Phrasebook",
  "Словообразование": "Word Builder",
  "Найти урок или слово": "Find a lesson or word",
  "Поиск по всем уровням HSK, названиям уроков, словам, пиньиню и переводам.": "Search all HSK levels, lesson titles, vocabulary, pinyin, and translations.",
  "♡ Избранные уроки": "♡ Favorite lessons",
  "Твой преподаватель китайского": "Your Chinese tutor",
  "Последовательный курс, практика и подсказки. Выбери уровень сам или начни с результата теста HSK.": "A structured course with practice and helpful hints. Choose your level or start with your HSK test result.",
  "Уровень обучения": "Learning level",
  "HSK 1 · Начальный": "HSK 1 · Beginner",
  "HSK 2 · Базовый": "HSK 2 · Elementary",
  "HSK 3 · Элементарный": "HSK 3 · Pre-intermediate",
  "HSK 4 · Средний": "HSK 4 · Intermediate",
  "HSK 5 · Выше среднего": "HSK 5 · Upper-intermediate",
  "HSK 6 · Продвинутый": "HSK 6 · Advanced",
  "Определить уровень": "Find my level",
  "Курс HSK 1": "HSK 1 Course",
  "Последовательно изучай темы и возвращайся к пройденному.": "Work through the topics step by step and revisit previous lessons.",
  "Итоговая проверка PhotoChinese": "PhotoChinese Course Assessment",
  "Сначала заверши все уроки этого уровня. Затем откроется проверка по изученному материалу.": "Complete all lessons at this level to unlock the assessment.",
  "Начать итоговую проверку": "Start final assessment",
  "← К урокам": "← Back to lessons",
  "Итоговая проверка": "Final assessment",
  "Проверь, насколько хорошо усвоен материал курса.": "Check how well you have mastered the course material.",
  "Осталось времени: 75:00": "Time remaining: 75:00",
  "Следующее задание": "Next question",
  "← Все уроки": "← All lessons",
  "Диалог в контексте": "Dialogue in context",
  "Разбор и закрепление": "Explanation and review",
  "Практика по уроку": "Lesson practice",
  "Повторить практику": "Try again",
  "Завершить урок": "Complete lesson",
  "Полный список новых слов и фраз": "Complete vocabulary and phrase list",
  "Полный тематический список слов и выражений урока. Отмечай слова, которые уже выучила.": "A complete topic-based list of words and expressions from this lesson. Mark the words you have learned.",
  "Слова и выражения": "Words and expressions",
  "Готовые фразы": "Useful phrases",
  "Спросить преподавателя": "Ask the tutor",
  "Выбери, что нужно объяснить подробнее.": "Choose what you would like explained in more detail.",
  "Объясни правило проще": "Explain the rule more simply",
  "Ещё примеры": "More examples",
  "Как запомнить?": "How can I remember this?",
  "Мой преподаватель": "My tutor",
  "Выбери стиль обратной связи — содержание уроков от этого не меняется.": "Choose your preferred feedback style. The lesson content stays the same.",
  "Требовательный": "Strict",
  "Спокойный": "Calm",
  "Поддерживающий": "Encouraging",
  "Напиши свой вопрос или предложение на китайском": "Write your question or sentence in Chinese",
  "Разобрать с преподавателем": "Discuss with the tutor",
  "Сейчас это учебный помощник на основе подготовленных уроков и правил, а не подключённая генеративная языковая модель. Свободная проверка любых фраз появится после отдельной ИИ-интеграции.": "This learning assistant is currently based on prepared lessons and language rules, not a connected generative AI model. Open-ended sentence checking will be available after a separate AI integration.",
  "ПИШИ · ПОВТОРЯЙ · ЗАПОМИНАЙ": "WRITE · REVIEW · REMEMBER",
  "Смотри, как правильно строится иероглиф, а затем повторяй его черты на поле. Тренажёр проверяет порядок и направление написания.": "See how a character is written, then practise its strokes on the canvas. The trainer checks stroke order and direction.",
  "Найди слово, которое уже выучила": "Find a word you have learned",
  "Начни вводить слово — покажу совпадения из твоей коллекции.": "Start typing to find matching words in your collection.",
  "После выбора слова нажми на нужный иероглиф, чтобы потренировать его отдельно.": "After selecting a word, choose a character to practise it individually.",
  "Иероглиф для практики": "Character to practise",
  "Выбрать": "Select",
  "Пока можно вводить по одному китайскому иероглифу. Доступность данных черт зависит от выбранного знака.": "For now, enter one Chinese character at a time. Stroke data availability depends on the selected character.",
  "ШАГ 1": "STEP 1",
  "Посмотри порядок черт": "Watch the stroke order",
  "Показать написание": "Show how to write it",
  "ШАГ 2": "STEP 2",
  "Повтори самостоятельно": "Practise on your own",
  "Начать практику": "Start practising",
  "Нажми «Начать практику», чтобы попробовать написать иероглиф.": "Select “Start practising” to try writing the character.",
  "Как оценивается написание?": "How is your writing evaluated?",
  "Проверяется последовательность и направление черт по данным Hanzi Writer. Это учебная проверка, а не экспертная оценка каллиграфии: небольшие отличия почерка допустимы.": "Stroke order and direction are checked using Hanzi Writer data. This is a learning aid, not an expert calligraphy assessment, so minor handwriting differences are fine.",
  "PHOTOCHINESE · УЧЁБА МОЖЕТ БЫТЬ ИГРОЙ": "PHOTOCHINESE · LEARNING CAN BE FUN",
  "для практики": "practice",
  "Закрепляй слова и грамматику в коротких заданиях. Выбирай уровень, повторяй знакомые слова и открывай новые.": "Reinforce vocabulary and grammar with short exercises. Choose a level, review familiar words, and discover new ones.",
  "Уровень заданий": "Exercise level",
  "Все уровни · смешанная практика": "All levels · mixed practice",
  "HSK 1 · основы": "HSK 1 · basics",
  "HSK 2 · повседневное общение": "HSK 2 · everyday communication",
  "HSK 3 · расширяем речь": "HSK 3 · building fluency",
  "HSK 4 · уверенное общение": "HSK 4 · confident communication",
  "HSK 5 · продвинутая лексика": "HSK 5 · advanced vocabulary",
  "HSK 6 · высокий уровень": "HSK 6 · proficiency",
  "Мои выученные слова": "My learned words",
  "В задания также попадут слова, отмеченные тобой как выученные.": "Words you have marked as learned will also appear in exercises.",
  "очков набрано": "points earned",
  "Собери предложение": "Build a sentence",
  "Выбери правильный перевод на китайском": "Choose the correct Chinese translation",
  "Найди пару": "Match the pairs",
  "Соедини слово с его переводом": "Match each word with its translation",
  "Угадай пропущенный иероглиф": "Find the missing character",
  "Восстанови слово или короткую фразу": "Complete the word or short phrase",
  "Расставь слова": "Put the words in order",
  "Составь китайское предложение в верном порядке": "Arrange the words to form a correct Chinese sentence",
  "ИГРА 01 · ЗАДАНИЕ 1": "GAME 01 · QUESTION 1",
  "Как сказать по-китайски?": "How do you say it in Chinese?",
  "Выбери ответ, чтобы проверить себя.": "Choose an answer to check your knowledge.",
  "Начать заново": "Start over",
  "Задания составлены по базовой лексике и грамматике курса HSK. Результат сохраняется на этом устройстве.": "Exercises are based on core HSK course vocabulary and grammar. Your results are saved on this device.",
  "PHOTOCHINESE · ГРАММАТИКА": "PHOTOCHINESE · GRAMMAR",
  "Грамматика китайского": "Chinese grammar",
  "без путаницы": "made simple",
  "Понятные схемы, живые примеры и короткие задания для закрепления. Начни с основ или выбери интересующую конструкцию.": "Clear explanations, natural examples, and short practice exercises. Start with the basics or choose a topic.",
  "17 конструкций": "17 grammar topics",
  "Практика внутри каждой темы": "Practice in every topic",
  "Выбери тему": "Choose a topic",
  "17 конструкций · HSK 1–4": "17 topics · HSK 1–4",
  "Уровень HSK": "HSK level",
  "Все уровни": "All levels",
  "PHOTOCHINESE · РЕЧЕВАЯ ПРАКТИКА": "PHOTOCHINESE · SPEAKING PRACTICE",
  "на каждый день": "for everyday life",
  "Диалоги в ситуациях, с которыми действительно можно столкнуться: от заказа кофе до разговора с однокурсником.": "Practical dialogues for real-life situations, from ordering coffee to chatting with a classmate.",
  "13 ситуаций": "13 situations",
  "Реплики с пиньинем": "Dialogue lines with pinyin",
  "Озвучивание": "Audio",
  "Выбери раздел": "Choose a section",
  "13 диалогов · реальные ситуации": "13 dialogues · real-life situations",
  "ПОИСК ПО РАЗГОВОРНИКУ": "PHRASEBOOK SEARCH",
  "Выбери ситуацию, чтобы открыть диалог.": "Choose a situation to open the dialogue.",
  "PHOTOCHINESE · СТРОЕНИЕ СЛОВ": "PHOTOCHINESE · WORD BUILDING",
  "Один иероглиф —": "One character —",
  "много слов": "many words",
  "Выбери изученный иероглиф или введи любой знак. Посмотри, как он соединяется с другими и меняет значение в составе слов.": "Choose a character you have studied or enter any character. See how it combines with others to form words and meanings.",
  "Выбери иероглиф": "Choose a character",
  "Сначала показаны твои изученные знаки, ниже — популярные для старта.": "Your learned characters appear first, followed by popular characters for beginners.",
  "Или введи любой иероглиф": "Or enter any Chinese character",
  "Найти слова": "Find words",
  "Выбери знак выше или введи его вручную.": "Choose a character above or enter it manually.",
  "PHOTOCHINESE · ДИАГНОСТИКА": "PHOTOCHINESE · LEVEL CHECK",
  "Определи свой уровень HSK": "Find your HSK level",
  "72 задания — по 12 на каждый уровень HSK. Вопросы проверяют лексику, грамматику, чтение контекста, оттенки значений и устойчивые конструкции; для подтверждения ступени нужно набрать минимум 9 из 12. В конце ты получишь ориентировочную оценку от HSK 1 до HSK 6.": "72 questions — 12 for each HSK level. The test covers vocabulary, grammar, reading in context, shades of meaning, and common structures. You need at least 9 out of 12 to demonstrate a level. At the end, you’ll receive an estimated result from HSK 1 to HSK 6.",
  "задания": "questions",
  "ступеней сложности": "difficulty levels",
  "минут": "minutes",
  "Отвечай самостоятельно, не пользуясь словарём. Это внутренняя диагностическая проверка PhotoChinese, а не официальный экзамен и не точная сертификация уровня.": "Answer on your own without using a dictionary. This is PhotoChinese’s placement test, not an official exam or formal certification.",
  "Начать тест": "Start the test",
  "Задание 1 из 72": "Question 1 of 72",
  "Лексика": "Vocabulary",
  "Выйти из теста": "Exit test",
  "РЕЗУЛЬТАТ ДИАГНОСТИКИ": "PLACEMENT TEST RESULTS",
  "Перейти к этому уровню в ИИ-учителе": "Open this level in the AI Tutor",
  "Пройти ещё раз": "Try again",
  "Твой прогресс": "Your progress",
  "Текущий уровень": "Current level",
  "Пока не определён": "Not determined yet",
  "Пройди диагностику HSK, чтобы определить стартовый уровень": "Take the HSK placement test to find your starting level",
  "иероглифов изучено": "characters learned",
  "дней подряд": "day streak",
  "уроков завершено": "lessons completed",
  "слов в словаре": "words in your dictionary",
  "Уроки ИИ-учителя": "AI Tutor lessons",
  "Начни первый урок, и здесь появится твоя статистика": "Start your first lesson to see your statistics here",
  "Продолжить обучение": "Continue learning",
  "Диагностика HSK": "HSK placement test",
  "Данные сохраняются на этом устройстве. После входа в аккаунт они синхронизируются.": "Your data is saved on this device and synced when you sign in.",
  "Слово дня": "Word of the day",
  "✎ Изменить баннер": "✎ Change banner",
  "✎ Редактировать": "✎ Edit",
  "Изучаю китайский, собираю иероглифы и создаю свой маленький мир.": "I’m learning Chinese, collecting characters, and creating my own little world.",
  "Любимый иероглиф:": "Favourite character:",
  "Подпись под ником": "Profile tagline",
  "Обо мне": "About me",
  "Любимый иероглиф": "Favourite character",
  "Сохранить информацию": "Save changes",
  "Изменить никнейм": "Change username",
  "Сохранить": "Save",
  "Мой компаньон": "My companion",
  "Лисёнок": "Little fox",
  "Твой маленький спутник в изучении китайского": "Your little companion on your Chinese learning journey",
  "Все компаньоны": "All companions",
  "Новые спутники будут открываться вместе с уровнями HSK. Выбрать другого можно в режиме редактирования.": "New companions unlock as you progress through HSK levels. You can choose another one in edit mode.",
  "Достижения": "Achievements",
  "Первые шаги": "First steps",
  "Изучи первый иероглиф": "Learn your first character",
  "Любознательный": "Curious learner",
  "Изучи 10 иероглифов": "Learn 10 characters",
  "Новичок": "Beginner",
  "Заверши первый урок": "Complete your first lesson",
  "Все достижения": "All achievements",
  "Первые три достижения — начало твоего пути ♡": "Your first three achievements are just the beginning ♡",
  "Легендарные достижения": "Legendary achievements",
  "Особые испытания для тех, кто прошёл долгий путь. Каждое открывает уникального компаньона.": "Special challenges for those who have come a long way. Each one unlocks a unique companion.",
  "Показать легендарные": "Show legendary achievements",
  "Моя коллекция": "My collection",
  "Мои иероглифы": "My characters",
  "Пока ничего не сохранено...": "Nothing saved yet...",
  "Сохранено иероглифов: 0": "Characters saved: 0",
  "Выученные слова": "Learned words",
  "Слова, которые ты отметила как выученные в ИИ-учителе. Они сохраняются здесь вместе с пиньинем, переводом и уровнем курса.": "Words you mark as learned in the AI Tutor are saved here with their pinyin, translation, and course level.",
  "Пока нет отмеченных слов. Выучи первые слова в ИИ-учителе — и они появятся здесь.": "You haven’t marked any words as learned yet. Learn your first words in the AI Tutor and they’ll appear here.",
  "Выучено слов: 0": "Words learned: 0",
  "Награды": "Rewards",
  "Пока нет наград...": "No rewards yet...",
  "Получено предметов: 0": "Items collected: 0",
  "Снять украшение": "Remove accessory",
  "Мои достижения": "My achievements",
  "достижений": "achievements",
  "Мой прогресс HSK": "My HSK progress",
  "Подготовка к HSK 2": "Preparing for HSK 2",
  "Прогресс будет рассчитываться по изученным словам выбранного уровня.": "Progress is calculated from the words you have learned at the selected level.",
  "Подтверди вход": "Confirm sign-in",
  "Введи одноразовый код из приложения-аутентификатора, чтобы завершить вход в PhotoChinese.": "Enter the one-time code from your authenticator app to finish signing in to PhotoChinese.",
  "Код подтверждения": "Verification code",
  "Подтвердить": "Confirm",
  "Отмена": "Cancel",
  "Выйти из аккаунта": "Sign out",
  "今日单词 · Слово дня": "今日单词 · Word of the day",
  "Твой профиль ждёт тебя": "Your profile is waiting",
  "Войди или создай аккаунт, чтобы открыть свой личный мир PhotoChinese.": "Sign in or create an account to open your personal PhotoChinese space.",
  "Зарегистрироваться / войти": "Sign up / Sign in",
  "Панель владельца": "Owner dashboard",
  "Привет, создатель! Здесь собрана основная информация о пользователях проекта.": "Welcome, creator! Here you can find key information about the project’s users.",
  "Аккаунтов": "Accounts",
  "С описанием": "With a bio",
  "Без описания": "Without a bio",
  "Твоя роль": "Your role",
  "Твой ID": "Your ID",
  "Пользователи": "Users",
  "Список профилей, сохранённых в облаке PhotoChinese.": "Profiles saved in the PhotoChinese cloud.",
  "↻ Обновить": "↻ Refresh",
  "Все профили": "All profiles",
  "Загружаем список пользователей…": "Loading users…",
  "Профиль пользователя": "User profile",
  "Изучено иероглифов": "Characters learned",
  "Пройдено уроков": "Lessons completed",
  "Сейчас доступны просмотр и поиск. Действия, влияющие на аккаунты, подключим отдельно через защищённую серверную проверку прав.": "Viewing and search are currently available. Account-changing actions require a separate, secure server-side permission check.",
  "Твой личный китайский словарь": "Your personal Chinese dictionary",
  "Собирай слова из уроков, повторяй их с интервалами и тренируй произношение.": "Collect words from lessons, review them at spaced intervals, and practise pronunciation.",
  "Повторение": "Review",
  "Словарь": "Dictionary",
  "Произношение": "Pronunciation",
  "Пора вспомнить слова": "Time to review your words",
  "Вспомни значение и произношение.": "Recall the meaning and pronunciation.",
  "Послушать": "Listen",
  "Произношение (пиньинь)": "Pronunciation (pinyin)",
  "Значение": "Meaning",
  "Проверить ответ": "Check answer",
  "Трудно": "Hard",
  "Не вспомнил": "Again",
  "Хорошо": "Good",
  "Легко": "Easy",
  "После ответа оцени, насколько легко вспомнила слово. Сложные слова появятся раньше, знакомые — позже.": "After answering, rate how easily you remembered the word. Difficult words will appear sooner, while familiar ones will appear later.",
  "Все твои слова": "All your words",
  "Сюда автоматически попадают слова, отмеченные как выученные в ИИ-учителе, и сохранённые иероглифы.": "Words marked as learned in the AI Tutor and saved characters are added here automatically.",
  "Твой следующий шаг": "Your next step",
  "PhotoChinese подсказывает, чему уделить внимание": "PhotoChinese suggests what to focus on next",
  "Поиск по иероглифу, пиньиню или переводу": "Search by character, pinyin, or translation",
  "Уровень": "Level",
  "Без уровня": "No level",
  "Добавить своё слово": "Add a custom word",
  "Иероглифы": "Characters",
  "Пиньинь": "Pinyin",
  "Перевод": "Translation",
  "＋ Добавить в словарь": "＋ Add to dictionary",
  "Слушай и повторяй": "Listen and repeat",
  "Выбери слово из своего словаря, послушай произношение на китайском и попробуй повторить.": "Choose a word from your dictionary, listen to its Chinese pronunciation, and try to repeat it.",
  "Слово для тренировки": "Word to practise",
  "Прослушать": "Play audio",
  "Повторить": "Repeat",
  "Озвучка использует китайский голос, установленный в браузере или устройстве. Распознавание речи — ориентировочное: оно может распознать слово, но не умеет надёжно оценивать правильность тонов.": "Audio uses the Chinese voice available in your browser or device. Speech recognition is approximate: it may recognize a word, but cannot reliably assess tone accuracy.",
  "PhotoChinese · Учись видеть смысл в каждом иероглифе": "PhotoChinese · Discover the meaning behind every character",
  "Словарные данные: Maqsudjonpolatov, HSK Chinese–Uzbek–Russian ·": "Dictionary data: Maqsudjonpolatov, HSK Chinese–Uzbek–Russian ·",
  "источник": "source",
  "Данные о структуре иероглифов: Make Me a Hanzi · LGPL-3.0-or-later; данные черт: Arphic Public License ·": "Character structure data: Make Me a Hanzi · LGPL-3.0-or-later; stroke data: Arphic Public License ·",
  "источник и лицензии": "sources and licences",
  "Твой личный мир китайского языка": "Your personal Chinese learning space",
  "Войти": "Sign in",
  "Регистрация": "Sign up",
  "Электронная почта": "Email address",
  "Пароль": "Password",
  "Настройки": "Settings",
  "Размер текста": "Text size",
  "Выбери, как удобно читать материалы.": "Choose the text size that works best for you.",
  "Меньше": "Smaller",
  "Обычно": "Default",
  "Больше": "Larger",
  "Звук": "Sound",
  "Озвучивание китайских слов и фраз": "Audio for Chinese words and phrases",
  "Тема оформления": "Appearance",
  "Светлая": "Light",
  "Тёмная": "Dark",
  "Безопасность аккаунта": "Account security",
  "Управляй дополнительной защитой своего аккаунта PhotoChinese.": "Manage additional security for your PhotoChinese account.",
  "Проверяем настройки защиты…": "Checking security settings…",
  "Подключи приложение-аутентификатор, поддерживающее одноразовые коды TOTP.": "Connect an authenticator app that supports TOTP codes.",
  "Подключить приложение": "Connect authenticator app",
  "Отсканируй QR-код в приложении-аутентификаторе. Если сканирование недоступно, можно ввести секрет вручную.": "Scan the QR code with your authenticator app. If you cannot scan it, you can enter the secret manually.",
  "Секрет для ручного добавления:": "Secret for manual setup:",
  "Код из приложения": "Code from authenticator app",
  "Подтвердить подключение": "Confirm setup",
  "Двухэтапная проверка подключена. При следующих входах понадобится одноразовый код.": "Two-step verification is enabled. You’ll need a one-time code the next time you sign in.",
  "Отключить двухэтапную проверку": "Turn off two-step verification",
  "Изменения применяются сразу и сохраняются автоматически.": "Changes are applied immediately and saved automatically."
};
  const reverse = Object.fromEntries(Object.entries(translations).map(([ru,en]) => [en,ru]));
  const normalize = value => String(value ?? '').replace(/\s+/g,' ').trim();
  const current = () => localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ru';
  const translate = value => {
    const raw = String(value ?? '');
    const key = normalize(raw);
    if (!key) return raw;
    const table = current() === 'en' ? translations : reverse;
    if (table[key]) return raw.replace(key, table[key]);
    // Translate known phrases inside dynamic labels while preserving counters and user data.
    let result = raw;
    const entries = Object.entries(table).sort((a,b)=>b[0].length-a[0].length);
    for (const [from,to] of entries) {
      if (from.length < 5 || !result.includes(from)) continue;
      result = result.split(from).join(to);
    }
    return result;
  };
  const skip = node => {
    const parent = node.parentElement;
    return !parent || !!parent.closest('script,style,noscript,textarea,input,select,option,[contenteditable="true"],.hanzi-writer,.character-canvas');
  };
  function translateNode(node) {
    if (skip(node)) return;
    const value = node.nodeValue;
    const next = translate(value);
    if (next !== value) node.nodeValue = next;
  }
  function translateAttributes(root=document) {
    const selectors = '[placeholder],[title],[aria-label]';
    if (root.nodeType === 1 && root.matches(selectors)) {
      for (const attr of ['placeholder','title','aria-label']) {
        const value = root.getAttribute(attr);
        if (value) root.setAttribute(attr, translate(value));
      }
    }
    root.querySelectorAll?.(selectors).forEach(el => {
      for (const attr of ['placeholder','title','aria-label']) {
        const value = el.getAttribute(attr);
        if (value) el.setAttribute(attr, translate(value));
      }
    });
  }
  function applyLanguage(language, persist=true) {
    const lang = language === 'en' ? 'en' : 'ru';
    if (persist) localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.title = lang === 'en' ? 'PhotoChinese — Learn Chinese Through Photos' : 'PhotoChinese — учи китайский через фото';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateNode(node);
    translateAttributes();
    const ru = document.getElementById('languageRu');
    const en = document.getElementById('languageEn');
    if (ru && en) {
      ru.classList.toggle('is-selected', lang === 'ru');
      en.classList.toggle('is-selected', lang === 'en');
      ru.setAttribute('aria-pressed', lang === 'ru' ? 'true' : 'false');
      en.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    }
    document.querySelectorAll('[data-language-label]').forEach(el => {
      el.textContent = lang === 'en' ? 'Language' : 'Язык';
    });
    window.dispatchEvent(new CustomEvent('photoChineseLanguageChanged', {detail:{language:lang}}));
  }
  window.photoChineseSetLanguage = applyLanguage;
  window.photoChineseGetLanguage = current;
  window.photoChineseTranslate = translate;
  document.addEventListener('DOMContentLoaded', () => {
    const settings = document.querySelector('.settings-card');
    if (settings && !document.getElementById('languageSetting')) {
      const section = document.createElement('section');
      section.className = 'settings-section';
      section.id = 'languageSetting';
      section.innerHTML = '<h3 data-language-label>Язык</h3><p>' +
        (current() === 'en' ? 'Choose the language used across the website.' : 'Выбери язык всего сайта.') +
        '</p><div class="settings-segmented" role="group" aria-label="Language"><button id="languageRu" type="button">Русский</button><button id="languageEn" type="button">English</button></div>';
      settings.insertBefore(section, settings.firstElementChild.nextElementSibling);
      section.querySelector('#languageRu').addEventListener('click', () => applyLanguage('ru'));
      section.querySelector('#languageEn').addEventListener('click', () => applyLanguage('en'));
    }
    applyLanguage(current(), false);
  }, {once:true});
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') translateNode(record.target);
      for (const added of record.addedNodes || []) {
        if (added.nodeType === Node.TEXT_NODE) translateNode(added);
        else if (added.nodeType === Node.ELEMENT_NODE) {
          const walker = document.createTreeWalker(added, NodeFilter.SHOW_TEXT);
          let node; while ((node = walker.nextNode())) translateNode(node);
          translateAttributes(added);
        }
      }
    }
  });
  observer.observe(document.documentElement, {subtree:true,childList:true,characterData:true});
})();
