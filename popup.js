// خريطة التحويل عربي → إنجليزي
const arabicToEnglish = {
  "ض":"q","ص":"w","ث":"e","ق":"r","ف":"t","غ":"y",
  "ع":"u","ه":"i","خ":"o","ح":"p","ج":"[","د":"]",
  "ش":"a","س":"s","ي":"d","ب":"f","ل":"g","ا":"h",
  "ت":"j","ن":"k","م":"l","ك":";","ط":"'","\\":"\\",
  "ئ":"z","ء":"x","ؤ":"c","ر":"v","لا":"b","ى":"n",
  "ة":"m","و":",","ز":".","ظ":"/","`":"ذ"
};

// خريطة التحويل الإنجليزي → العربي
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

// دالة الكشف التلقائي
function detectLanguage(text) {
  const arabicChars = text.match(/[\u0600-\u06FF]/g);
  const englishChars = text.match(/[a-zA-Z]/g);
  
  const arabicCount = arabicChars ? arabicChars.length : 0;
  const englishCount = englishChars ? englishChars.length : 0;
  
  return arabicCount > englishCount ? 'arabic' : 'english';
}

// دالة التحويل
function convertText(text) {
  if (!text || !text.trim()) return text;
  
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

// انتظار تحميل الصفحة
const input = document.getElementById('input');
const convertBtn = document.getElementById('convert');

// لما تضغط على الزر
convertBtn.onclick = function() {
  const text = input.value;
  if (text && text.trim()) {
    input.value = convertText(text);
    input.select();
  }
};

// لما تضغط Enter في الـ input
input.onkeypress = function(e) {
  if (e.key === 'Enter') {
    convertBtn.click();
  }
};

// لما تضغط Ctrl+Shift+M في الـ popup نفسه
input.onkeydown = function(e) {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') {
    e.preventDefault();
    convertBtn.click();
  }
};

// تركيز تلقائي على الـ input
input.focus();
