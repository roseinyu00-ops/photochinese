(() => {
  const KEY = 'photoChineseLanguage';
  const translations = {
    'Изучение':'Learn','Мемы':'Memes','Обучение':'Study','Тест HSK':'HSK Test','Мой словарь':'My Dictionary','Профиль':'Profile','Панель владельца':'Owner Panel',
    'Настройки':'Settings','Закрыть настройки':'Close settings','Язык сайта':'Website language','Выбери язык интерфейса PhotoChinese.':'Choose the PhotoChinese interface language.','Русский':'Russian','Английский':'English',
    'Размер текста':'Text size','Выбери, как удобно читать материалы.':'Choose the text size that feels comfortable.','Меньше':'Smaller','Обычно':'Default','Больше':'Larger',
    'Звук':'Sound','Озвучивание китайских слов и фраз':'Pronunciation of Chinese words and phrases','Тема оформления':'Appearance','Светлая':'Light','Тёмная':'Dark',
    'Безопасность аккаунта':'Account security','Управляй дополнительной защитой своего аккаунта PhotoChinese.':'Manage extra protection for your PhotoChinese account.',
    'Проверяем настройки защиты…':'Checking security settings…','Подключи приложение-аутентификатор, поддерживающее одноразовые коды TOTP.':'Connect an authenticator app that supports TOTP codes.',
    'Подключить приложение':'Connect authenticator','Отсканируй QR-код в приложении-аутентификаторе. Если сканирование недоступно, можно ввести секрет вручную.':'Scan the QR code in your authenticator app. If scanning is unavailable, enter the secret manually.',
    'Секрет для ручного добавления:':'Secret key for manual setup:','Код из приложения':'Code from app','Подтвердить подключение':'Confirm setup',
    'Двухэтапная проверка подключена. При следующих входах понадобится одноразовый код.':'Two-factor authentication is enabled. You will need a one-time code when signing in.',
    'Отключить двухэтапную проверку':'Disable two-factor authentication','Изменения применяются сразу и сохраняются автоматически.':'Changes are applied instantly and saved automatically.',
    'Китайский начинается':'Chinese starts','одного':'one','Распознавание по фото временно недоступно':'Photo recognition is temporarily unavailable',
    'Мы пока приостановили эту функцию, чтобы доработать качество распознавания китайских иероглифов. Она вернётся, когда будет работать надёжнее.':'We have temporarily paused this feature while we improve Chinese character recognition. It will return when it is more reliable.',
    'Фото и камера временно отключены':'Photo and camera are temporarily disabled',
    'Начни вводить слово, пиньинь, перевод или название темы.':'Start typing a word, pinyin, translation, or topic.',
    'Введи ещё хотя бы один символ.':'Enter at least one more character.','Ничего не найдено. Попробуй другой запрос.':'No results found. Try another search.',
    'Открыть урок':'Open lesson','совпадение в теме, словах или объяснении':'match in topic, vocabulary, or explanation',
    'Показаны первые 30 совпадений.':'Showing the first 30 matches.','Пока нет избранных уроков. Нажми ☆ рядом с уроком, чтобы сохранить его здесь.':'No favorite lessons yet. Tap ☆ next to a lesson to save it here.',
    'Открыть сохранённый урок':'Open saved lesson','♡ Избранные уроки':'♡ Favorite lessons','♡ Скрыть избранное':'♡ Hide favorites',
    'Загрузить фото':'Upload photo','Открыть камеру':'Open camera','Перетащи изображение сюда':'Drop an image here'
  };
  const reverse = Object.fromEntries(Object.entries(translations).map(([ru,en]) => [en,ru]));
  const getLang = () => localStorage.getItem(KEY) === 'en' ? 'en' : 'ru';
  function translateTextNode(node, lang) {
    const raw = node.nodeValue;
    const trimmed = raw.trim();
    if (!trimmed) return;
    const dict = lang === 'en' ? translations : reverse;
    const translated = dict[trimmed];
    if (translated && translated !== trimmed) node.nodeValue = raw.replace(trimmed, translated);
  }
  function translateElement(el, lang) {
    if (el.nodeType === Node.TEXT_NODE) { translateTextNode(el, lang); return; }
    if (el.nodeType !== Node.ELEMENT_NODE) return;
    if (el.matches('script,style,textarea,[contenteditable="true"]')) return;
    for (const attr of ['placeholder','title','aria-label']) {
      const value = el.getAttribute(attr);
      if (!value) continue;
      const dict = lang === 'en' ? translations : reverse;
      if (dict[value]) el.setAttribute(attr, dict[value]);
    }
    for (const child of el.childNodes) translateElement(child, lang);
  }
  function applyLanguage(lang, persist = true) {
    lang = lang === 'en' ? 'en' : 'ru';
    if (persist) localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
    translateElement(document.body, lang);
    document.querySelectorAll('[data-language-choice]').forEach(button => {
      const active = button.dataset.languageChoice === lang;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    document.dispatchEvent(new CustomEvent('photoChineseLanguageChanged', { detail: { language: lang } }));
  }
  window.photoChineseGetLanguage = getLang;
  window.photoChineseSetLanguage = applyLanguage;
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-language-choice]').forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.languageChoice)));
    applyLanguage(getLang(), false);
    const observer = new MutationObserver(records => {
      const lang = getLang();
      for (const record of records) {
        if (record.type === 'characterData') translateTextNode(record.target, lang);
        else record.addedNodes.forEach(node => translateElement(node, lang));
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();