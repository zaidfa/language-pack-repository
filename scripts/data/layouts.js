/*
 * Authored keyboard layouts for the VALIDATED subset of languages.
 *
 * A language is "available for download" if and only if it has an entry here.
 * Everything else in data/languages.js is catalog-only (listed, honestly marked
 * as not yet downloadable). This is the single source of truth that keeps
 * "listed" separate from "has a functional, validated pack".
 *
 * Layout model (schema v1), per key:
 *   string           -> output == label, no long-press
 *   { o, l, hold, code, w } object:
 *     o    : text committed to the editor (Unicode, may be multi-code-point)
 *     l    : visible label (defaults to o)
 *     hold : array of long-press alternative outputs
 *     code : special function key token (SHIFT|DELETE|ENTER|SPACE|SYMBOLS|
 *            ABC|SYMBOLS2|EMOJI|LANG|MODE)
 *     w    : relative width (default 1)
 *
 * Only letter rows + per-key long-press are authored here; the shared builder
 * (lib/pack.js) frames each layer with the SHIFT/DELETE row and the bottom
 * function row so every pack is consistent.
 */

// ----- shared symbol layers (QWERTY-world digits/punctuation) -----
const SYM_NUM   = "1 2 3 4 5 6 7 8 9 0".split(" ");
const SYM_ROW2  = "@ # $ _ & - + ( ) /".split(" ");
const SYM_ROW3  = "* \" ' : ; ! ?".split(" ");
const SYM2_ROW1 = "~ ` | • √ π ÷ × ¶ Δ".split(" ");
const SYM2_ROW2 = "£ ¢ € ¥ ^ ° = { }".split(" ");
const SYM2_ROW3 = "% © ® ™ ✓ [ ]".split(" ");

const DEFAULT_SYMBOLS = {
  symbols:  [SYM_NUM, SYM_ROW2, SYM_ROW3],
  symbols2: [SYM2_ROW1, SYM2_ROW2, SYM2_ROW3],
};

// Native digits for non-Latin packs.
const ARABIC_NUM  = "١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ٠".split(" ");
const PERSIAN_NUM = "۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ ۰".split(" ");
const DEVA_NUM    = "१ २ ३ ४ ५ ६ ७ ८ ९ ०".split(" ");
const BENG_NUM    = "১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ ০".split(" ");
const THAI_NUM    = "๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙ ๐".split(" ");

function arabicSymbols(num) {
  // RTL-friendly punctuation with Arabic comma / semicolon / question mark.
  return {
    symbols:  [num, "@ # $ ـ & - + ( ) /".split(" "), ["*", "\"", "'", ":", "؛", "!", "؟"]],
    symbols2: [SYM2_ROW1, SYM2_ROW2, ["،", "«", "»", "ـ", "؟", "[", "]"]],
  };
}
function nativeDigitSymbols(num) {
  return { symbols: [num, SYM_ROW2, SYM_ROW3], symbols2: [SYM2_ROW1, SYM2_ROW2, SYM2_ROW3] };
}

// ---------- builder helpers ----------
function row(str) { return str.split(" ").filter(Boolean); }

/** Latin/cased layout from three space-separated rows + accent long-press map. */
function cased(r1, r2, r3, holds, extra) {
  return Object.assign({
    cased: true, layoutType: "direct", inputMethod: "direct",
    rows: [row(r1), row(r2), row(r3)], holds: holds || {}, symbols: DEFAULT_SYMBOLS,
  }, extra || {});
}

/** Caseless / non-Latin layout. */
function caseless(r1, r2, r3, holds, extra) {
  return Object.assign({
    cased: false, layoutType: "direct", inputMethod: "direct",
    rows: [row(r1), row(r2), row(r3)], holds: holds || {}, symbols: DEFAULT_SYMBOLS,
  }, extra || {});
}

// Common Latin bases
const QWERTY = ["q w e r t y u i o p", "a s d f g h j k l", "z x c v b n m"];
const AZERTY = ["a z e r t y u i o p", "q s d f g h j k l m", "w x c v b n"];
const QWERTZ = ["q w e r t z u i o p", "a s d f g h j k l", "y x c v b n m"];

function latinQwerty(holds, extra) { return cased(QWERTY[0], QWERTY[1], QWERTY[2], holds, extra); }
function latinAzerty(holds, extra) { return cased(AZERTY[0], AZERTY[1], AZERTY[2], holds, extra); }
function latinQwertz(holds, extra) { return cased(QWERTZ[0], QWERTZ[1], QWERTZ[2], holds, extra); }

const LAYOUTS = {
  // ---------------- Latin: QWERTY ----------------
  "en":    latinQwerty(),
  "en-GB": latinQwerty(),
  "id":    latinQwerty(),
  "ms":    latinQwerty(),
  "sw":    latinQwerty(),
  "eo":    latinQwerty({ c: ["ĉ"], g: ["ĝ"], h: ["ĥ"], j: ["ĵ"], s: ["ŝ"], u: ["ŭ"] }),
  "af":    latinQwerty({ e: ["ê", "ë", "é", "è"], a: ["á", "à"], o: ["ô"], i: ["î", "ï"], u: ["û"] }),
  "sq":    latinQwerty({ e: ["ë"], c: ["ç"] }),
  "cy":    latinQwerty({ w: ["ŵ"], y: ["ŷ"], a: ["â"], e: ["ê"], i: ["î"], o: ["ô"], u: ["û"] }),
  "ga":    latinQwerty({ a: ["á"], e: ["é"], i: ["í"], o: ["ó"], u: ["ú"] }),
  "eu":    latinQwerty({ n: ["ñ"] }),
  "ca":    latinQwerty({ a: ["à"], e: ["é", "è"], i: ["í", "ï"], o: ["ó", "ò"], u: ["ú", "ü"], c: ["ç"] }),

  "es":    latinQwerty({ n: ["ñ"], a: ["á"], e: ["é"], i: ["í"], o: ["ó"], u: ["ú", "ü"] },
                       { symbols: { symbols: [SYM_NUM, SYM_ROW2, ["*", "\"", "'", "¡", "!", "¿", "?"]], symbols2: DEFAULT_SYMBOLS.symbols2 } }),
  "pt":    latinQwerty({ a: ["á", "à", "â", "ã"], e: ["é", "ê"], i: ["í"], o: ["ó", "ô", "õ"], u: ["ú"], c: ["ç"] }),
  "it":    latinQwerty({ a: ["à"], e: ["é", "è"], i: ["ì"], o: ["ò"], u: ["ù"] }),
  "ro":    latinQwerty({ a: ["ă", "â"], i: ["î"], s: ["ș"], t: ["ț"] }),
  "tr":    latinQwerty({ i: ["ı"], g: ["ğ"], s: ["ş"], c: ["ç"], o: ["ö"], u: ["ü"] }),
  "az":    latinQwerty({ e: ["ə"], g: ["ğ"], i: ["ı"], o: ["ö"], u: ["ü"], s: ["ş"], c: ["ç"] }),
  "vi":    latinQwerty({
             a: ["á", "à", "ả", "ã", "ạ", "â", "ă", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ắ", "ằ", "ẳ", "ẵ", "ặ"],
             e: ["é", "è", "ẻ", "ẽ", "ẹ", "ê", "ế", "ề", "ể", "ễ", "ệ"],
             i: ["í", "ì", "ỉ", "ĩ", "ị"],
             o: ["ó", "ò", "ỏ", "õ", "ọ", "ô", "ố", "ồ", "ổ", "ỗ", "ộ", "ơ", "ớ", "ờ", "ở", "ỡ", "ợ"],
             u: ["ú", "ù", "ủ", "ũ", "ụ", "ư", "ứ", "ừ", "ử", "ữ", "ự"],
             y: ["ý", "ỳ", "ỷ", "ỹ", "ỵ"], d: ["đ"],
           }),

  // Nordic
  "sv":    latinQwerty({ a: ["ä", "å", "à"], o: ["ö", "ø"], e: ["é"] }),
  "fi":    latinQwerty({ a: ["ä", "å"], o: ["ö"] }),
  "da":    latinQwerty({ a: ["å", "æ"], o: ["ø"], e: ["é"] }),
  "nb":    latinQwerty({ a: ["å", "æ"], o: ["ø"], e: ["é"] }),
  "is":    latinQwerty({ a: ["á", "æ"], e: ["é"], i: ["í"], o: ["ó"], u: ["ú"], y: ["ý"], d: ["ð"], t: ["þ"] }),

  // ---------------- Latin: AZERTY ----------------
  "fr":    latinAzerty({ a: ["à", "â", "æ"], e: ["é", "è", "ê", "ë"], i: ["î", "ï"], o: ["ô", "œ"], u: ["ù", "û", "ü"], c: ["ç"], y: ["ÿ"] }),

  // ---------------- Latin: QWERTZ ----------------
  "de":    latinQwertz({ a: ["ä"], o: ["ö"], u: ["ü"], s: ["ß"], e: ["é", "è"] }),
  "nl":    latinQwerty({ e: ["é", "ë", "ê", "è"], i: ["ï"], o: ["ö"], u: ["ü"], a: ["á", "ä"] }),
  "pl":    latinQwerty({ a: ["ą"], c: ["ć"], e: ["ę"], l: ["ł"], n: ["ń"], o: ["ó"], s: ["ś"], z: ["ż", "ź"] }),
  "cs":    latinQwertz({ e: ["é", "ě"], s: ["š"], c: ["č"], r: ["ř"], z: ["ž"], y: ["ý"], a: ["á"], i: ["í"], o: ["ó"], u: ["ú", "ů"], d: ["ď"], t: ["ť"], n: ["ň"] }),
  "sk":    latinQwertz({ a: ["á", "ä"], e: ["é"], i: ["í"], o: ["ó", "ô"], u: ["ú"], y: ["ý"], l: ["ĺ", "ľ"], r: ["ŕ"], s: ["š"], c: ["č"], z: ["ž"], t: ["ť"], d: ["ď"], n: ["ň"] }),
  "hu":    latinQwertz({ a: ["á"], e: ["é"], i: ["í"], o: ["ó", "ö", "ő"], u: ["ú", "ü", "ű"] }),
  "hr":    latinQwertz({ c: ["č", "ć"], s: ["š"], z: ["ž"], d: ["đ"] }),
  "sl":    latinQwertz({ c: ["č"], s: ["š"], z: ["ž"] }),
  "lt":    latinQwerty({ a: ["ą"], c: ["č"], e: ["ę", "ė"], i: ["į"], s: ["š"], u: ["ų", "ū"], z: ["ž"] }),
  "lv":    latinQwerty({ a: ["ā"], c: ["č"], e: ["ē"], g: ["ģ"], i: ["ī"], k: ["ķ"], l: ["ļ"], n: ["ņ"], s: ["š"], u: ["ū"], z: ["ž"] }),
  "et":    latinQwertz({ a: ["ä"], o: ["ö", "õ"], u: ["ü"], s: ["š"], z: ["ž"] }),

  // ---------------- Cyrillic (ЙЦУКЕН and nationals) ----------------
  "ru": caseless("й ц у к е н г ш щ з х", "ф ы в а п р о л д ж э", "я ч с м и т ь б ю",
                 { е: ["ё"], ь: ["ъ"] }, { cased: true, script: "Cyrl" }),
  "uk": caseless("й ц у к е н г ш щ з х", "ф і в а п р о л д ж є", "я ч с м и т ь б ю",
                 { і: ["ї"], г: ["ґ"] }, { cased: true, script: "Cyrl" }),
  "be": caseless("й ц у к е н г ш ў з х", "ф ы в а п р о л д ж э", "я ч с м і т ь б ю",
                 { ь: ["ъ"] }, { cased: true, script: "Cyrl" }),
  "bg": caseless("я в е р т ъ у и о п ч", "а с д ф г х й к л ш щ", "з ь ц ж б н м",
                 {}, { cased: true, script: "Cyrl" }),
  "sr": caseless("љ њ е р т з у и о п ш", "а с д ф г х ј к л ч ћ", "џ ц в б н м ђ ж",
                 {}, { cased: true, script: "Cyrl" }),
  "mk": caseless("љ њ е р т ѕ у и о п ш", "а с д ф г х ј к л ч ќ", "џ ц в б н м ѓ ж",
                 {}, { cased: true, script: "Cyrl" }),
  "kk": caseless("й ц у к е н г ш щ з х", "ф ы в а п р о л д ж э", "я ч с м и т ь б ю",
                 { е: ["ё"], ь: ["ъ"], а: ["ә"], о: ["ө"], у: ["ұ", "ү"], н: ["ң"], г: ["ғ"], к: ["қ"], и: ["і"], х: ["һ"] },
                 { cased: true, script: "Cyrl" }),

  // ---------------- Greek ----------------
  "el": caseless("ς ε ρ τ υ θ ι ο π", "α σ δ φ γ η ξ κ λ", "ζ χ ψ ω β ν μ",
                 { α: ["ά"], ε: ["έ"], η: ["ή"], ι: ["ί", "ϊ", "ΐ"], ο: ["ό"], υ: ["ύ", "ϋ", "ΰ"], ω: ["ώ"] },
                 { cased: true, script: "Grek" }),

  // ---------------- Arabic script (RTL) ----------------
  "ar": caseless("ض ص ث ق ف غ ع ه خ ح ج", "ش س ي ب ل ا ت ن م ك ط", "ئ ء ؤ ر ى ة و ز ظ د",
                 { ا: ["أ", "إ", "آ", "ء"], و: ["ؤ"], ي: ["ئ", "ى"], ه: ["ة"], ل: ["لا"] },
                 { direction: "rtl", script: "Arab", symbols: arabicSymbols(ARABIC_NUM) }),
  "fa": caseless("ض ص ث ق ف غ ع ه خ ح ج چ", "ش س ی ب ل ا ت ن م ک گ", "ظ ط ز ر ذ د پ و ژ",
                 { ا: ["آ", "أ", "إ"], و: ["ؤ"], ی: ["ئ"], ه: ["ة"] },
                 { direction: "rtl", script: "Arab", symbols: arabicSymbols(PERSIAN_NUM) }),
  "ur": caseless("ط ص ھ د ٹ پ ت ب ج ح", "م و ر ن ل ہ ا ک ی", "ق ف ے س ش غ ع خ ز",
                 { ا: ["آ", "أ", "إ"], ہ: ["ھ", "ۃ", "ة"], و: ["ؤ"], ی: ["ئ", "ے"] },
                 { direction: "rtl", script: "Arab", symbols: arabicSymbols(PERSIAN_NUM) }),
  "ps": caseless("ض ص ث ق ف غ ع ه خ ح ج", "ش س ي ب ل ا ت ن م ك", "ظ ط ز ر ذ د ړ و ږ ځ",
                 { ا: ["آ", "أ"], ی: ["ې", "ۍ", "ئ"], ک: ["ګ"], ه: ["ۀ"] },
                 { direction: "rtl", script: "Arab", symbols: arabicSymbols(ARABIC_NUM) }),

  // ---------------- Hebrew (RTL) ----------------
  "he": caseless("ק ר א ט ו ן ם פ ש", "ד ג כ ע י ח ל ך ף", "ז ס ב ה נ מ צ ת ץ",
                 {}, { direction: "rtl", script: "Hebr" }),

  // ---------------- Georgian (caseless, phonetic QWERTY positions) ----------------
  "ka": caseless("ქ წ ე რ ტ ყ უ ი ო პ", "ა ს დ ფ გ ჰ ჯ კ ლ", "ზ ხ ც ვ ბ ნ მ",
                 { წ: ["ჭ"], ტ: ["თ"], ჯ: ["ჟ"], ც: ["ჩ"], ზ: ["ძ"], ს: ["შ"], გ: ["ღ"] },
                 { cased: false, script: "Geor" }),

  // ---------------- Devanagari (direct Unicode, InScript-inspired) ----------------
  "hi": caseless("ौ ै ा ी ू ब ह ग द ज ड", "ो े ् ि ु प र क त च ट", "ं म न व ल स य भ",
                 { क: ["क़"], ख: ["ख़"], ग: ["ग़"], ज: ["ज़"], ड: ["ड़"], ढ: ["ढ़"], फ: ["फ़"] },
                 { script: "Deva", symbols: nativeDigitSymbols(DEVA_NUM), layoutType: "complex",
                   note: "Direct Unicode entry; conjuncts/matras shaped by Android text engine." }),
  "mr": caseless("ौ ै ा ी ू ब ह ग द ज ड", "ो े ् ि ु प र क त च ट", "ं म न व ल स य भ",
                 { ल: ["ळ"], क: ["क़"] }, { script: "Deva", symbols: nativeDigitSymbols(DEVA_NUM), layoutType: "complex",
                   note: "Direct Unicode entry; conjuncts/matras shaped by Android text engine." }),
  "ne": caseless("ौ ै ा ी ू ब ह ग द ज ड", "ो े ् ि ु प र क त च ट", "ं म न व ल स य भ",
                 {}, { script: "Deva", symbols: nativeDigitSymbols(DEVA_NUM), layoutType: "complex",
                   note: "Direct Unicode entry; conjuncts/matras shaped by Android text engine." }),

  // ---------------- Bengali (direct Unicode) ----------------
  "bn": caseless("ঔ ঐ আ ঈ ঊ ব হ গ দ জ ড", "ও এ অ ি ু প র ক ত চ ট", "ং ম ন ল স শ ষ",
                 { ক: ["ক্ষ"], জ: ["জ্ঞ"], ড: ["ড়", "ঢ়"], য: ["য়"], র: ["ড়", "ঢ়"], স: ["ঃ"] },
                 { script: "Beng", symbols: nativeDigitSymbols(BENG_NUM), layoutType: "complex",
                   note: "Direct Unicode entry; conjuncts/matras shaped by Android text engine." }),
  "as": caseless("ঔ ঐ আ ঈ ঊ ব হ গ দ জ ড", "ও এ অ ি ু প ৰ ক ত চ ট", "ং ম ন ল স শ ষ",
                 { ৰ: ["ৱ"], ক: ["ক্ষ"] }, { script: "Beng", symbols: nativeDigitSymbols(BENG_NUM), layoutType: "complex",
                   note: "Assamese ৰ/ৱ included; direct Unicode entry." }),

  // ---------------- Thai (Kedmanee-inspired, direct) ----------------
  "th": caseless("ๆ ไ ำ พ ะ ั ี ร น ย บ ล", "ฟ ห ก ด เ ้ ่ า ส ว ง", "ผ ป แ อ ิ ื ท ม ใ ฝ",
                 {}, { script: "Thai", symbols: nativeDigitSymbols(THAI_NUM), layoutType: "complex", cased: false,
                   note: "Direct Unicode entry; vowel/tone marks combine via Android rendering." }),
};

module.exports = { LAYOUTS, DEFAULT_SYMBOLS };
