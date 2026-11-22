
/* PhotoChinese: dictionary, spaced repetition and pronunciation */
(() => {
  "use strict";
  const WORDS_KEY = "photoChineseStudyWords";
  const REVIEW_KEY = "photoChineseReviewState";
  const $ = id => document.getElementById(id);
  const safeRead = (key, fallback) => {
    try { const value = JSON.parse(localStorage.getItem(key) || "null"); return value == null ? fallback : value; }
    catch (_) { return fallback; }
  };
  const safeWrite = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    window.photoChineseSync?.();
  };
  const clean = value => String(value || "").trim();
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const day = ms => new Date(ms).toLocaleDateString("ru-RU", {day:"numeric",month:"short"});
  let activeView = "dictionary";
  let currentReviewId = null;
  let currentReviewCheck = null;
  let currentSpeakId = null;
  let recognition = null;

  function getWords() {
    const words = new Map();
    const add = word => {
      const hanzi = clean(word.hanzi);
      if (!hanzi) return;
      const pinyin = clean(word.pinyin);
      const id = hanzi + "|" + pinyin;
      const old = words.get(id) || {};
      words.set(id, {...old, ...word, id, hanzi, pinyin, translation:clean(word.translation) || old.translation || "Перевод пока не добавлен", level:Number(word.level) || old.level || 0});
    };
    try {
      if (typeof getLearnedCoachVocabularyRecords === "function") {
        getLearnedCoachVocabularyRecords().forEach(w => add({hanzi:w.hanzi,pinyin:w.pinyin,translation:w.translation,level:w.level,source:"Курс HSK"}));
      }
    } catch (e) { console.warn("Не удалось прочитать слова курса:", e); }
    // В общий прогресс и коллекцию символы записываются в разные ключи.
    // Читаем оба источника, чтобы выученные иероглифы не терялись в словаре.
    const learnedChars = safeRead("learnedCharacters", []);
    const savedChars = safeRead("savedCharacters", []);
    const allChars = new Set([
      ...(Array.isArray(learnedChars) ? learnedChars : []),
      ...(Array.isArray(savedChars) ? savedChars : [])
    ]);
    allChars.forEach(ch => {
      if (typeof ch !== "string" || !ch.trim()) return;
      let info = {};
      try { info = typeof getCharInfo === "function" ? (getCharInfo(ch) || {}) : {}; } catch (_) {}
      add({
        hanzi:ch,
        pinyin:info.p || info.pinyin || info.pinyinMMH || "",
        translation:info.m || info.meaning || info.definition || "Выученный иероглиф",
        level:0,
        source:Array.isArray(savedChars) && savedChars.includes(ch) ? "Коллекция" : "Выученные иероглифы"
      });
    });
    const custom = safeRead(WORDS_KEY, []);
    if (Array.isArray(custom)) custom.forEach(w => add({...w,source:w.source || "Мой словарь"}));
    return Array.from(words.values()).sort((a,b) => (a.level||99)-(b.level||99) || a.hanzi.localeCompare(b.hanzi));
  }

  function getReviewState(words) {
    const state = safeRead(REVIEW_KEY, {});
    let changed = false;
    words.forEach(w => {
      if (!state[w.id]) { state[w.id] = {due:Date.now(), interval:0, ease:2.5, reps:0}; changed = true; }
    });
    if (changed) safeWrite(REVIEW_KEY, state);
    return state;
  }

  let chineseVoices = [];
  function refreshChineseVoices() {
    const synth = window.speechSynthesis;
    if (!synth || !synth.getVoices) {
      chineseVoices = [];
      return [];
    }
    chineseVoices = synth.getVoices().filter(v => /^zh([_-]|$)/i.test(v.lang) || /chinese|中文|mandarin/i.test(v.name));
    return chineseVoices;
  }

  let activeAudio = null;
  let speechRequestId = 0;

  function mediaErrorDescription(audio) {
    const code = audio.error?.code || 0;
    const descriptions = {
      1: "загрузка отменена браузером",
      2: "сетевая ошибка при загрузке",
      3: "браузер не смог декодировать аудио",
      4: "формат или источник аудио не поддерживается"
    };
    return code ? descriptions[code] + " (MediaError " + code + ")" : "браузер не сообщил код MediaError";
  }

  function playErrorDescription(error) {
    if (!error) return "браузер не сообщил причину";
    const descriptions = {
      NotAllowedError: "браузер запретил запуск воспроизведения",
      NotSupportedError: "формат аудио не поддерживается",
      AbortError: "воспроизведение было прервано",
      SecurityError: "браузер заблокировал источник по соображениям безопасности",
      TypeError: "не удалось обработать адрес аудио"
    };
    return descriptions[error.name] || ((error.name || "Ошибка") + (error.message ? ": " + error.message : ""));
  }

  function speakWithBrowser(text, statusElement, requestId, failures, onFailure) {
    const synth = window.speechSynthesis;
    if (!synth || typeof window.SpeechSynthesisUtterance !== "function") {
      if (statusElement && requestId === speechRequestId) {
        statusElement.textContent = failures.join("\n") + "\nСистемный голос: Web Speech API недоступен в этом браузере.";
      }
      return;
    }
    try {
      const voices = refreshChineseVoices();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.82;
      const voice = voices.find(v => /^zh[-_]?(cn|hans)/i.test(v.lang))
        || voices.find(v => /^zh/i.test(v.lang));
      if (voice) utterance.voice = voice;
      const voiceSummary = voices.length
        ? voices.map(v => v.name + " [" + v.lang + "]").slice(0, 4).join(", ")
        : "китайские голоса не обнаружены";
      let startTimer = null;
      utterance.onstart = () => {
        if (startTimer) clearTimeout(startTimer);
        if (statusElement && requestId === speechRequestId) {
          statusElement.textContent = failures.join("\n") + "\nСистемный голос: запущен" + (voice ? " — " + voice.name + " [" + voice.lang + "]" : " — выбран по языку zh-CN") + ".";
        }
      };
      utterance.onend = () => {
        if (startTimer) clearTimeout(startTimer);
        if (statusElement && requestId === speechRequestId) statusElement.textContent = "Воспроизведение завершено.";
      };
      utterance.onerror = event => {
        if (startTimer) clearTimeout(startTimer);
        if (!statusElement || requestId !== speechRequestId) return;
        if (event.error === "interrupted" || event.error === "canceled") return;
        statusElement.textContent = failures.join("\n") + "\nСистемный голос: ошибка " + (event.error || "unknown") + ". Доступные китайские голоса: " + voiceSummary + ".";
        if (typeof onFailure === "function") onFailure("ошибка " + (event.error || "unknown"));
      };
      synth.resume();
      synth.speak(utterance);
      if (statusElement && requestId === speechRequestId) {
        statusElement.textContent = failures.join("\n") + "\nСистемный голос: запускаю… Доступные китайские голоса: " + voiceSummary + ".";
        startTimer = setTimeout(() => {
          if (requestId === speechRequestId) {
            statusElement.textContent = failures.join("\n") + "\nСистемный голос: событие запуска не пришло за 6 секунд. Доступные китайские голоса: " + voiceSummary + ".";
            if (typeof onFailure === "function") onFailure("не пришло событие запуска");
          }
        }, 6000);
      }
    } catch (error) {
      if (statusElement && requestId === speechRequestId) {
        statusElement.textContent = failures.join("\n") + "\nСистемный голос: не удалось запустить — " + playErrorDescription(error) + ".";
      }
    }
  }

  function playOnlineSpeech(phrase, statusElement, requestId) {
    const encoded = encodeURIComponent(phrase);
    const sources = [
      // tw-ob обычно отдаёт MP3, в отличие от некоторых ответов gtx,
      // которые отдельные браузеры Android определяют как неизвестный формат.
      {label:"Google audio (tw-ob)", url:"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=" + encoded},
      {label:"Google audio (gtx)", url:"https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=zh-CN&q=" + encoded}
    ];
    const failures = [];
    const tryAudio = index => {
      if (requestId !== speechRequestId) return;
      if (index >= sources.length) {
        if (statusElement) statusElement.textContent = failures.join("\\n") + "\\nОнлайн-озвучка тоже не запустилась.";
        return;
      }
      const source = sources[index];
      let settled = false;
      const audio = new Audio();
      activeAudio = audio;
      audio.preload = "auto";
      let audioAttemptTimer = setTimeout(() => fail("тайм-аут (readyState=" + audio.readyState + ", networkState=" + audio.networkState + ")"), 8000);
      const clearAttempt = () => { if (audioAttemptTimer) clearTimeout(audioAttemptTimer); };
      const fail = reason => {
        if (settled || requestId !== speechRequestId) return;
        settled = true;
        clearAttempt();
        failures.push(source.label + ": " + reason);
        if (activeAudio === audio) activeAudio = null;
        try { audio.pause(); } catch (_) {}
        tryAudio(index + 1);
      };
      audio.onplaying = () => {
        if (requestId !== speechRequestId) return;
        settled = true;
        clearAttempt();
        if (statusElement) statusElement.textContent = "▶ Китайская аудиозапись воспроизводится (" + source.label + ").";
      };
      audio.onended = () => {
        clearAttempt();
        if (requestId === speechRequestId) {
          activeAudio = null;
          if (statusElement) statusElement.textContent = "Воспроизведение завершено.";
        }
      };
      audio.onerror = () => fail(mediaErrorDescription(audio));
      audio.src = source.url;
      const result = audio.play();
      if (result && typeof result.catch === "function") result.catch(error => fail(playErrorDescription(error)));
      if (statusElement && requestId === speechRequestId) statusElement.textContent = "Проверяю онлайн-озвучку " + (index + 1) + "/" + sources.length + "…";
    };
    try { tryAudio(0); }
    catch (error) {
      if (statusElement) statusElement.textContent = "Не удалось запустить онлайн-озвучку: " + playErrorDescription(error);
    }
  }

  // Готовые записи носителей китайского из открытого набора audio-cmn.
  // Источник: https://github.com/hugolpz/audio-cmn — лицензия CC BY-SA.
  const RECORDED_AUDIO_BASE = "https://raw.githubusercontent.com/hugolpz/audio-cmn/master/96k/hsk/cmn-";
  // Отдельная цельная запись 你好 из Wikimedia Commons (Lingua Libre).
  // Автор записи: Luilui6666; лицензия CC BY-SA 4.0 / CC0.
  const SPECIAL_AUDIO = {
    "你好": "https://upload.wikimedia.org/wikipedia/commons/7/77/LL-Q9192_%28cmn%29-Luilui6666-%E4%BD%A0%E5%A5%BD.wav"
  };
  function playRecordedSpeech(text, statusElement, requestId) {
    const phrase = clean(text).replace(/[\\s，。！？、,.!?]+/g, "");
    if (!phrase) return;

    // Сначала пробуем цельную запись слова/фразы. Если её нет в каталоге,
    // последовательно воспроизводим записи отдельных иероглифов.
    const specialUrl = SPECIAL_AUDIO[phrase];
    const candidates = [phrase];
    if (!specialUrl && [...phrase].length > 1) candidates.push(...[...phrase]);
    let candidateIndex = 0;
    let currentAudio = null;

    const playNext = () => {
      if (requestId !== speechRequestId) return;
      if (candidateIndex >= candidates.length) {
        if (statusElement) {
          statusElement.textContent = "Для «" + phrase + "» не нашлось готовой записи — ни целой фразы, ни одного из её иероглифов.";
        }
        if (activeAudio === currentAudio) activeAudio = null;
        return;
      }

      const candidate = candidates[candidateIndex++];
      const audio = new Audio();
      currentAudio = audio;
      activeAudio = audio;
      audio.preload = "auto";
      let started = false;

      audio.onplaying = () => {
        if (requestId !== speechRequestId) return;
        started = true;
        if (statusElement) {
          statusElement.textContent = candidate === phrase
            ? "▶ Воспроизводится готовая запись слова."
            : "▶ Нет общей записи — произношу иероглифы по отдельности.";
        }
      };
      audio.onended = () => {
        if (requestId !== speechRequestId) return;
        if (candidate !== phrase && candidateIndex < candidates.length) {
          playNext();
          return;
        }
        if (activeAudio === audio) activeAudio = null;
        if (statusElement) statusElement.textContent = "Воспроизведение завершено.";
      };
      audio.onerror = () => {
        if (requestId !== speechRequestId) return;
        if (!started) {
          playNext();
        } else {
          if (activeAudio === audio) activeAudio = null;
          if (statusElement) statusElement.textContent = "Воспроизведение записи прервалось.";
        }
      };

      audio.src = specialUrl
        ? specialUrl
        : RECORDED_AUDIO_BASE + encodeURIComponent(candidate) + ".mp3";
      const result = audio.play();
      if (result && typeof result.catch === "function") {
        result.catch(() => {
          if (requestId === speechRequestId && !started) playNext();
        });
      }
    };

    playNext();
  }

  function speak(text, statusElement) {
    const phrase = clean(text);
    if (!phrase) {
      if (statusElement) statusElement.textContent = "Нет текста для озвучивания.";
      return;
    }
    const requestId = ++speechRequestId;
    if (activeAudio) {
      try { activeAudio.pause(); activeAudio.currentTime = 0; } catch (_) {}
      activeAudio = null;
    }
    if (window.speechSynthesis && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
      window.speechSynthesis.cancel();
    }
    if (statusElement) statusElement.textContent = "Загружаю готовую запись…";
    playRecordedSpeech(phrase, statusElement, requestId);
  }
  function renderReview() {
    const words = getWords();
    const state = getReviewState(words);
    const due = words.filter(w => (state[w.id]?.due || 0) <= Date.now()).sort((a,b) => (state[a.id]?.due||0)-(state[b.id]?.due||0));
    const card = $("studyReviewCard"), empty = $("studyReviewEmpty");
    $("studyReviewAnswer").hidden = true;
    $("studyReviewInputArea").hidden = false;
    $("studyReviewPinyinInput").value = "";
    $("studyReviewMeaningInput").value = "";
    $("studyReviewCheckResult").textContent = "";
    currentReviewCheck = null;
    $("studyReviewReveal").disabled = false;
    $("studyReviewReveal").hidden = false;
    $("studyReviewRatings").hidden = true;
    if (!due.length) {
      card.hidden = true; empty.hidden = false;
      if (!words.length) empty.textContent = "Пока слов нет. Отметь слова как выученные в ИИ-учителе или добавь их в личный словарь.";
      else {
        const next = Math.min(...words.map(w => state[w.id]?.due || Date.now()));
        empty.textContent = "На сегодня всё! Следующее повторение: " + day(next) + ". Можно добавить новые слова в словарь.";
      }
      currentReviewId = null;
      return;
    }
    empty.hidden = true; card.hidden = false;
    const word = due[0]; currentReviewId = word.id;
    $("studyReviewHanzi").textContent = word.hanzi;
    $("studyReviewPrompt").textContent = "Вспомни значение и произношение";
    $("studyReviewPinyin").textContent = word.pinyin || "Пиньинь не указан";
    $("studyReviewMeaning").textContent = word.translation;
    $("studyReviewLevel").textContent = word.level ? "HSK " + word.level : (word.source || "Личный словарь");
    $("studyReviewAnswer").hidden = true;
    $("studyReviewReveal").hidden = false;
  }

  function normalizeAnswer(value) {
    return clean(value).toLocaleLowerCase().normalize("NFC").replace(/[\s\p{P}\p{S}]+/gu, "");
  }

  function revealReview() {
    if (!currentReviewId) return;
    const word = getWords().find(item => item.id === currentReviewId);
    if (!word) return;
    const typedPinyin = normalizeAnswer($("studyReviewPinyinInput").value);
    const typedMeaning = normalizeAnswer($("studyReviewMeaningInput").value);
    if (!typedPinyin || !typedMeaning) {
      $("studyReviewCheckResult").textContent = "Заполни оба поля, чтобы проверить ответ.";
      return;
    }
    const correctPinyin = normalizeAnswer(word.pinyin || "");
    const correctMeaning = normalizeAnswer(word.translation || "");
    const pinyinCorrect = !!correctPinyin && typedPinyin === correctPinyin;
    const meaningCorrect = !!correctMeaning && typedMeaning === correctMeaning;
    const score = (pinyinCorrect ? 1 : 0) + (meaningCorrect ? 1 : 0);
    currentReviewCheck = {pinyinCorrect, meaningCorrect, checkedAt:Date.now()};
    $("studyReviewCheckResult").textContent = score === 2
      ? "✓ Всё верно! И произношение, и значение совпали."
      : score === 1
        ? "Частично верно. " + (pinyinCorrect ? "Пиньинь правильный." : "Проверь пиньинь.") + " " + (meaningCorrect ? "Перевод правильный." : "Проверь значение.")
        : "Пока есть ошибки. Сверь оба ответа с правильным вариантом ниже.";
    $("studyReviewPinyin").textContent = "Пиньинь: " + (word.pinyin || "не указан");
    $("studyReviewMeaning").textContent = "Значение: " + (word.translation || "не указано");
    $("studyReviewLevel").textContent = word.level ? "HSK " + word.level : (word.source || "Личный словарь");
    $("studyReviewInputArea").hidden = true;
    $("studyReviewAnswer").hidden = false;
    $("studyReviewRatings").hidden = false;
  }

  function calculateNextReview(rating, previous) {
    const next = {...previous};
    let interval;
    if (rating === "again") { interval = 1/1440; next.reps = 0; next.ease = Math.max(1.3,(next.ease||2.5)-0.2); }
    else if (rating === "hard") { interval = Math.max(1,(next.interval||1)*1.2); next.reps = (next.reps||0)+1; next.ease = Math.max(1.3,(next.ease||2.5)-0.15); }
    else if (rating === "good") { interval = next.interval ? Math.max(2,next.interval*(next.ease||2.5)) : 1; next.reps = (next.reps||0)+1; }
    else { interval = next.interval ? Math.max(4,next.interval*(next.ease||2.5)*1.3) : 4; next.reps = (next.reps||0)+1; next.ease = Math.min(3.2,(next.ease||2.5)+0.15); }
    return {...next,interval};
  }

  function formatReviewInterval(days) {
    const minutes = Math.max(1,Math.round(days*1440));
    if (minutes < 60) return "примерно через " + minutes + " мин";
    const hours = Math.round(minutes/60);
    if (hours < 24) return "примерно через " + hours + " ч";
    const count = Math.max(1,Math.round(days));
    const mod10 = count % 10, mod100 = count % 100;
    const noun = mod100 >= 11 && mod100 <= 14 ? "дней" : mod10 === 1 ? "день" : mod10 >= 2 && mod10 <= 4 ? "дня" : "дней";
    return "примерно через " + count + " " + noun;
  }

  function rateReview(rating) {
    if (!currentReviewId) return;
    const state = safeRead(REVIEW_KEY,{});
    const old = state[currentReviewId] || {interval:0,ease:2.5,reps:0};
    const next = calculateNextReview(rating,old);
    const stats = {...(old.stats || {})};
    stats.attempts = (stats.attempts || 0) + 1;
    stats.hardCount = (stats.hardCount || 0) + (rating === "hard" ? 1 : 0);
    stats.againCount = (stats.againCount || 0) + (rating === "again" ? 1 : 0);
    if (currentReviewCheck) {
      stats.pinyinErrors = (stats.pinyinErrors || 0) + (currentReviewCheck.pinyinCorrect ? 0 : 1);
      stats.meaningErrors = (stats.meaningErrors || 0) + (currentReviewCheck.meaningCorrect ? 0 : 1);
      stats.lastCheck = currentReviewCheck;
    }
    stats.lastRating = rating;
    state[currentReviewId] = {...next,stats,due:Date.now()+next.interval*86400000,lastReviewed:Date.now()};
    safeWrite(REVIEW_KEY,state);
    currentReviewCheck = null;
    renderReview();
    renderRecommendations();
  }

  function renderRecommendations() {
    const container = $("studyRecommendationsList");
    if (!container) return;
    const words = getWords();
    const state = getReviewState(words);
    const now = Date.now();
    const due = words.filter(word => (state[word.id]?.due || 0) <= now);
    const needsWork = words.map(word => {
      const stats = state[word.id]?.stats || {};
      const trouble = (stats.hardCount || 0) + (stats.againCount || 0);
      const errors = (stats.pinyinErrors || 0) + (stats.meaningErrors || 0);
      return {...word, trouble, errors, stats};
    }).filter(word => word.trouble >= 2 || word.errors >= 2)
      .sort((a,b) => (b.trouble + b.errors) - (a.trouble + a.errors))
      .slice(0,3);
    const cards = [];
    const addCard = (icon,title,description,action,label,tone) => cards.push({icon,title,description,action,label,tone});
    if (!words.length) {
      addCard("📚","Собери свой первый словарь","Отметь слова как выученные в ИИ-учителе или добавь их вручную — тогда рекомендации станут персональными.",null,"Открыть словарь","neutral");
    } else if (due.length) {
      addCard("⏰","Есть слова для повторения",due.length + " " + (due.length === 1 ? "слово уже ждёт повторения" : due.length < 5 ? "слова уже ждут повторения" : "слов уже ждут повторения") + ". Лучше закрепить их сейчас, пока материал свежий.","review","Перейти к повторению","focus");
    } else {
      const nextDue = Math.min(...words.map(word => state[word.id]?.due || now));
      const nextDate = new Date(nextDue).toLocaleString("ru-RU",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});
      addCard("🌱","На сегодня повторение выполнено","Следующее запланированное повторение: " + nextDate + ". Можно спокойно изучать новые слова.","review","Посмотреть повторение","calm");
    }
    if (needsWork.length) {
      const examples = needsWork.map(word => word.hanzi).join("、");
      const details = needsWork.map(word => {
        const reasons = [];
        if ((word.stats.hardCount || 0) + (word.stats.againCount || 0) >= 2) reasons.push("часто оценивается как сложное");
        if ((word.stats.pinyinErrors || 0) >= 2) reasons.push("есть ошибки в пиньине");
        if ((word.stats.meaningErrors || 0) >= 2) reasons.push("есть ошибки в переводе");
        return word.hanzi + ": " + reasons.join(", ");
      });
      addCard("🧩","Стоит уделить внимание отдельным словам", "По твоим ответам и оценкам стоит дополнительно повторить: " + examples + ". " + details.join("; ") + ".","review","Повторить слова","focus");
    }
    if (words.length && !due.length && !needsWork.length && words.every(word => !(state[word.id]?.stats?.attempts))) {
      addCard("✨","Давай познакомим систему с твоими знаниями","Пока ещё нет оценённых попыток повторения. После нескольких ответов рекомендации начнут учитывать, что даётся легко, а что требует практики.","review","Начать повторение","neutral");
    }
    container.innerHTML = "";
    cards.forEach(card => {
      const item = document.createElement("article");
      item.className = "study-recommendation-card" + (card.tone === "focus" ? " is-focus" : "");
      const icon = document.createElement("span"); icon.className = "study-recommendation-card-icon"; icon.textContent = card.icon;
      const body = document.createElement("div"); body.className = "study-recommendation-card-body";
      const title = document.createElement("strong"); title.textContent = card.title;
      const description = document.createElement("p"); description.textContent = card.description;
      body.append(title,description);
      item.append(icon,body);
      if (card.action) {
        const button = document.createElement("button"); button.type = "button"; button.className = "study-recommendation-action"; button.textContent = card.label;
        button.addEventListener("click",() => setView(card.action));
        item.appendChild(button);
      }
      container.appendChild(item);
    });
  }

  function renderDictionary() {
    renderRecommendations();
    const words = getWords();
    const query = clean($("studyDictionarySearch").value).toLowerCase();
    const level = $("studyDictionaryLevel").value;
    const filtered = words.filter(w => {
      const matches = [w.hanzi,w.pinyin,w.translation].join(" ").toLowerCase().includes(query);
      return matches && (level === "all" || String(w.level||0) === level);
    });
    $("studyDictionaryCount").textContent = "Найдено: " + filtered.length + " из " + words.length;
    const syncNote = $("studyDictionarySyncStatus");
    if (syncNote) {
      syncNote.textContent = window.photoChineseIsLoggedIn?.()
        ? "☁️ Ты вошла в аккаунт. Словарь и интервалы повторения сохраняются в облако и будут доступны после входа в тот же аккаунт на другом браузере."
        : "☁️ Сейчас слова хранятся только в этом браузере. Чтобы перенести их, войди в свой аккаунт в разделе «Профиль» — затем войди в него же в другом браузере.";
    }
    const list = $("studyDictionaryList"); list.innerHTML = "";
    if (!filtered.length) {
      const empty = document.createElement("div"); empty.className = "study-tools-empty";
      empty.textContent = words.length ? "По этому запросу ничего не найдено." : "Словарь пока пуст. Добавь слова из курса или внеси первое слово вручную.";
      list.appendChild(empty); return;
    }
    filtered.forEach(w => {
      const row = document.createElement("article"); row.className = "study-tools-word";
      const main = document.createElement("div"); main.className = "study-tools-word-main";
      const hanzi = document.createElement("span"); hanzi.className = "study-tools-word-hanzi"; hanzi.textContent = w.hanzi;
      const pinyin = document.createElement("span"); pinyin.className = "study-tools-word-pinyin"; pinyin.textContent = w.pinyin || "—";
      const meaning = document.createElement("div"); meaning.className = "study-tools-word-meaning"; meaning.textContent = w.translation;
      const meta = document.createElement("div"); meta.className = "study-tools-word-meta"; meta.textContent = (w.level ? "HSK "+w.level+" · " : "") + (w.source || "Личный словарь");
      main.append(hanzi,pinyin,meaning,meta);
      const actions = document.createElement("div"); actions.className = "study-tools-actions";
      const audio = document.createElement("button"); audio.type="button"; audio.className="study-tools-icon-btn"; audio.textContent="🔊"; audio.title="Прослушать"; audio.addEventListener("click",()=>speak(w.hanzi, status));
      const status = document.createElement("span"); status.className = "study-tools-word-status"; status.setAttribute("aria-live","polite");
      actions.appendChild(audio); row.append(main,actions,status); list.appendChild(row);
    });
  }

  function populateSpeakSelect() {
    const words = getWords();
    const select = $("studySpeakSelect");
    const previous = currentSpeakId || select.value;
    select.innerHTML = "";
    words.forEach(w => {
      const option = document.createElement("option"); option.value = w.id; option.textContent = w.hanzi + (w.pinyin ? " · "+w.pinyin : "") + " — " + w.translation;
      select.appendChild(option);
    });
    if (words.some(w=>w.id===previous)) select.value=previous;
    currentSpeakId = select.value || null;
    renderSpeakWord();
  }

  function renderSpeakWord() {
    const word = getWords().find(w=>w.id=== $("studySpeakSelect").value);
    currentSpeakId = word?.id || null;
    $("studySpeakHanzi").textContent = word?.hanzi || "文";
    $("studySpeakPinyin").textContent = word?.pinyin || "Добавь слова в словарь, чтобы тренироваться";
    $("studySpeakMeaning").textContent = word?.translation || "";
    $("studySpeakMic").disabled = !word || !(window.SpeechRecognition || window.webkitSpeechRecognition);
    $("studySpeakAudio").disabled = !word;
    $("studySpeakMicStatus").textContent = window.SpeechRecognition || window.webkitSpeechRecognition ? "Прослушай образец, затем попробуй произнести слово." : "Озвучка доступна, а распознавание речи этим браузером не поддерживается.";
  }

  function startRecognition() {
    const word = getWords().find(w=>w.id===currentSpeakId);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!word || !SpeechRecognition) return;
    if (recognition) { try { recognition.abort(); } catch (_) {} }
    recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    $("studySpeakMicStatus").textContent = "Слушаю… Произнеси слово после сигнала браузера.";
    recognition.onresult = event => {
      const heard = clean(event.results[0][0].transcript).replace(/[，。！？、,.!?\s]/g,"");
      const target = word.hanzi.replace(/[\s，。！？、,.!?]/g,"");
      const matched = heard === target || heard.includes(target);
      $("studySpeakMicStatus").textContent = matched
        ? "Распознавание услышало нужный иероглиф: " + heard + ". Это приблизительная проверка текста, не оценка тонов."
        : "Распознано: " + (heard || "не удалось разобрать") + ". Попробуй ещё раз или послушай образец. Распознавание не оценивает тоны надёжно.";
    };
    recognition.onerror = event => {
      $("studySpeakMicStatus").textContent = event.error === "not-allowed" ? "Нет доступа к микрофону. Проверь разрешения браузера." : "Не получилось распознать речь ("+event.error+"). Можно повторить попытку.";
    };
    recognition.onend = () => { recognition = null; };
    try { recognition.start(); } catch (e) { $("studySpeakMicStatus").textContent = "Не удалось запустить микрофон. Попробуй ещё раз."; }
  }

  function setView(view) {
    activeView = view;
    document.querySelectorAll("[data-study-view]").forEach(btn => btn.classList.toggle("active",btn.dataset.studyView===view));
    document.querySelectorAll(".study-tools-view").forEach(panel => panel.hidden = panel.id !== "studyView"+view.charAt(0).toUpperCase()+view.slice(1));
    if (view==="review") renderReview();
    if (view==="dictionary") renderDictionary();
    if (view==="speak") populateSpeakSelect();
  }

  function init() {
    if (!$("studyToolsRoot")) return;
    document.querySelectorAll("[data-study-view]").forEach(btn=>btn.addEventListener("click",()=>setView(btn.dataset.studyView)));
    $("studyReviewReveal").addEventListener("click",revealReview);
    $("studyReviewRatings").addEventListener("click",event=>{const btn=event.target.closest("[data-rating]");if(btn)rateReview(btn.dataset.rating);});
    $("studyDictionarySearch").addEventListener("input",renderDictionary);
    $("studyDictionaryLevel").addEventListener("change",renderDictionary);
    $("studyWordForm").addEventListener("submit",event=>{
      event.preventDefault();
      const hanzi=clean($("studyWordHanzi").value),pinyin=clean($("studyWordPinyin").value),translation=clean($("studyWordTranslation").value),level=Number($("studyWordLevel").value)||0;
      if(!hanzi||!translation)return;
      const saved=safeRead(WORDS_KEY,[]);
      const id=hanzi+"|"+pinyin;
      const next=Array.isArray(saved)?saved.filter(w=>(w.hanzi+"|"+(w.pinyin||""))!==id):[];
      next.push({hanzi,pinyin,translation,level,source:"Мой словарь"});
      safeWrite(WORDS_KEY,next);
      $("studyWordForm").reset(); renderDictionary(); renderReview(); populateSpeakSelect();
    });
    $("studySpeakSelect").addEventListener("change",renderSpeakWord);
    if (window.speechSynthesis) {
      refreshChineseVoices();
      window.speechSynthesis.addEventListener?.("voiceschanged", refreshChineseVoices);
      window.speechSynthesis.onvoiceschanged = refreshChineseVoices;
    }
    $("studySpeakAudio").addEventListener("click",()=>{const w=getWords().find(x=>x.id===currentSpeakId);if(w)speak(w.hanzi, $("studySpeakAudioStatus"));});
    $("studyReviewAudio").addEventListener("click",()=>{const w=getWords().find(x=>x.id===currentReviewId);if(w)speak(w.hanzi, $("studyReviewAudioStatus"));});
    $("studySpeakMic").addEventListener("click",startRecognition);
    setView("dictionary");
    renderRecommendations();
    // При переходе в раздел словаря обновляем данные: пользователь мог
    // отметить новые слова в ИИ-учителе после первоначальной загрузки.
    const studySection = $("studytools");
    if (studySection && typeof MutationObserver === "function") {
      const observer = new MutationObserver(() => {
        if (!studySection.hidden) {
          renderDictionary();
          renderReview();
          populateSpeakSelect();
        }
      });
      observer.observe(studySection, {attributes:true, attributeFilter:["hidden"]});
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true}); else init();
  window.addEventListener("photoChineseDataLoaded",()=>{renderReview();renderDictionary();populateSpeakSelect();});
})();
