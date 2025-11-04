const arabicToEnglish = {
  "ض":"q","ص":"w","ث":"e","ق":"r","ف":"t","غ":"y",
  "ع":"u","ه":"i","خ":"o","ح":"p","ج":"[","د":"]",
  "ش":"a","س":"s","ي":"d","ب":"f","ل":"g","ا":"h",
  "ت":"j","ن":"k","م":"l","ك":";","ط":"'","\\":"\\",
  "ئ":"z","ء":"x","ؤ":"c","ر":"v","لا":"b","ى":"n",
  "ة":"m","و":",","ز":".","ظ":"/","`":"ذ"
};

const englishToArabic = {
  "q":"ض","w":"ص","e":"ث","r":"ق","t":"ف","y":"غ",
  "u":"ع","i":"ه","o":"خ","p":"ح","[":"ج","]":"د",
  "a":"ش","s":"س","d":"ي","f":"ب","g":"ل","h":"ا",
  "j":"ت","k":"ن","l":"م",";":"ك","'":"ط",
  "\\":"\\",
  "z":"ئ","x":"ء","c":"ؤ","v":"ر","b":"لا","n":"ى",
  "m":"ة",",":"و",".":"ز","/":"ظ",
  "`":"ذ"
};

let lastConvertTime = 0;

function detectLanguage(text) {
  const arabicChars = text.match(/[\u0600-\u06FF]/g);
  const englishChars = text.match(/[a-zA-Z]/g);
  
  const arabicCount = arabicChars ? arabicChars.length : 0;
  const englishCount = englishChars ? englishChars.length : 0;
  
  return arabicCount > englishCount ? 'arabic' : 'english';
}

// دالة التحويل
function convertText(text) {
  const isArabic = detectLanguage(text) === 'arabic';
  const map = isArabic ? arabicToEnglish : englishToArabic;
  let result = "";
  
  if (isArabic) {
    for (let i = 0; i < text.length;) {
      const two = text.slice(i, i + 2);
      if (two === "لا" && map["لا"]) {
        result += map["لا"];
        i += 2;
      } else {
        const ch = text[i];
        result += map[ch] || ch;
        i += 1;
      }
    }
  } else {
    for (let ch of text) {
      result += map[ch] || map[ch.toLowerCase()] || ch;
    }
  }
  
  return result;
}

// toast
let _toastEl = null;
function showModeToast(text) {
  try {
    if (!_toastEl) {
      _toastEl = document.createElement("div");
      _toastEl.style.cssText = `
        position:fixed;z-index:2147483647;bottom:16px;right:16px;
        background:#111;color:#fff;padding:8px 12px;border-radius:8px;
        font-family:sans-serif;font-size:12px;opacity:0.95;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);pointer-events:none;`;
      document.documentElement.appendChild(_toastEl);
    }
    _toastEl.textContent = text;
    _toastEl.style.display = "block";
    clearTimeout(showModeToast._t);
    showModeToast._t = setTimeout(() => {
      if (_toastEl) _toastEl.style.display = "none";
    }, 1500);
  } catch {}
}

function handleShortcut(e) {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "m") {
    const active = document.activeElement;
    if (!active) return;
    
    const now = Date.now();
    if (now - lastConvertTime < 300) {
      return;
    }
    lastConvertTime = now;
    
    e.preventDefault();

    let originalText = "";
    let isArabic = false;

    if (active.tagName === "INPUT" || active.tagName === "TEXTAREA") {
      originalText = active.value;
      if (!originalText.trim()) return;
      
      isArabic = detectLanguage(originalText) === 'arabic';
      active.value = convertText(originalText);
      active.focus();
      active.setSelectionRange(0, active.value.length);
      showModeToast(isArabic ? "Arabic → English" : "English → Arabic");
    } else if (active.isContentEditable) {
      originalText = active.innerText;
      if (!originalText.trim()) return;
      
      isArabic = detectLanguage(originalText) === 'arabic';
      active.innerText = convertText(originalText);
      active.focus();
      const range = document.createRange();
      range.selectNodeContents(active);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      showModeToast(isArabic ? "Arabic → English" : "English → Arabic");
    }
  }
}

document.addEventListener("keydown", handleShortcut, true);