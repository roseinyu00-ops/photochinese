
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
    if (!synth || !synth.getVoices) return;
    chineseVoices = synth.getVoices().filter(v => /^zh([_-]|$)/i.test(v.lang) || /chinese|中文|mandarin/i.test(v.name));
  }

  let activeAudio = null;
  let speechRequestId = 0;
  function speakWithBrowser(text, statusElement, requestId) {
    const synth = window.speechSynthesis;
    if (!synth || typeof window.SpeechSynthesisUtterance !== "function") {
      if (statusElement && requestId === speechRequestId) statusElement.textContent = "Системная озвучка недоступна в этом браузере.";
      return;
    }
    try {
      refreshChineseVoices();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.82;
      const voice = chineseVoices.find(v => /^zh[-_]?(cn|hans)/i.test(v.lang))
        || chineseVoices.find(v => /^zh/i.test(v.lang));
      if (voice) utterance.voice = voice;
      utterance.onstart = () => { if (statusElement && requestId === speechRequestId) statusElement.textContent = "▶ Воспроизводится системная китайская озвучка."; };
      utterance.onend = () => { if (statusElement && requestId === speechRequestId) statusElement.textContent = "Воспроизведение завершено."; };
      utterance.onerror = event => {
        if (!statusElement || requestId !== speechRequestId) return;
        if (event.error === "interrupted" || event.error === "canceled") return;
        statusElement.textContent = "Системная озвучка не сработала (" + (event.error || "ошибка") + ").";
      };
      synth.resume();
      synth.speak(utterance);
      if (statusElement && requestId === speechRequestId) statusElement.textContent = "Запускаю системную китайскую озвучку…";
    } catch (_) {
      if (statusElement && requestId === speechRequestId) statusElement.textContent = "Не удалось запустить системную озвучку.";
    }
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
    const synth = window.speechSynthesis;
    if (synth && (synth.speaking || synth.pending)) synth.cancel();

    // Сначала пробуем сетевую запись китайской речи, затем системный TTS.
    const url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=" + encodeURIComponent(phrase);
    try {
      const audio = new Audio(url);
      activeAudio = audio;
      audio.preload = "auto";
      audio.onplaying = () => { if (statusElement && requestId === speechRequestId) statusElement.textContent = "▶ Воспроизводится китайская аудиозапись."; };
      audio.onended = () => { if (requestId === speechRequestId) { activeAudio = null; if (statusElement) statusElement.textContent = "Воспроизведение завершено."; } };
      const fallback = () => {
        if (requestId !== speechRequestId) return;
        if (activeAudio === audio) activeAudio = null;
        if (statusElement) statusElement.textContent = "Онлайн-аудио недоступно. Переключаюсь на системную озвучку…";
        speakWithBrowser(phrase, statusElement, requestId);
      };
      audio.onerror = fallback;
      const result = audio.play();
      if (result && typeof result.catch === "function") result.catch(fallback);
      if (statusElement) statusElement.textContent = "Загружаю китайское произношение…";
    } catch (_) {
      if (statusElement) statusElement.textContent = "Онлайн-аудио недоступно. Переключаюсь на системную озвучку…";
      speakWithBrowser(phrase, statusElement, requestId);
    }
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

  function rateReview(rating) {
    if (!currentReviewId) return;
    const state = safeRead(REVIEW_KEY,{});
    const old = state[currentReviewId] || {interval:0,ease:2.5,reps:0};
    let interval;
    if (rating === "again") { interval = 1/1440; old.reps = 0; old.ease = Math.max(1.3,(old.ease||2.5)-0.2); }
    else if (rating === "hard") { interval = Math.max(1,(old.interval||1)*1.2); old.reps = (old.reps||0)+1; old.ease = Math.max(1.3,(old.ease||2.5)-0.15); }
    else if (rating === "good") { interval = old.interval ? Math.max(2,old.interval*(old.ease||2.5)) : 1; old.reps = (old.reps||0)+1; }
    else { interval = old.interval ? Math.max(4,old.interval*(old.ease||2.5)*1.3) : 4; old.reps = (old.reps||0)+1; old.ease = Math.min(3.2,(old.ease||2.5)+0.15); }
    state[currentReviewId] = {...old,interval,due:Date.now()+interval*86400000,lastReviewed:Date.now()};
    safeWrite(REVIEW_KEY,state);
    renderReview();
  }

  function renderDictionary() {
    const words = getWords();
    const query = clean($("studyDictionarySearch").value).toLowerCase();
    const level = $("studyDictionaryLevel").value;
    const filtered = words.filter(w => {
      const matches = [w.hanzi,w.pinyin,w.translation].join(" ").toLowerCase().includes(query);
      return matches && (level === "all" || String(w.level||0) === level);
    });
    $("studyDictionaryCount").textContent = "Найдено: " + filtered.length + " из " + words.length;
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
