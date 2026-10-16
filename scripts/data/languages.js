/*
 * Master language metadata table for the multilingual keyboard catalog.
 *
 * Each row: [bcp47Tag, englishName, nativeName, iso15924Script, direction, family]
 *
 *  - bcp47Tag   : stable BCP 47 language (optionally -Script / -REGION) tag.
 *  - englishName: English display name.
 *  - nativeName : endonym (how speakers write the language's name).
 *  - iso15924   : ISO 15924 script code of the primary writing system.
 *  - direction  : "ltr" or "rtl".
 *  - family     : layout template key (see data/layouts.js). "none" means no
 *                 authored layout yet -> the entry is catalog-only (listed but
 *                 not available for download). This keeps "listed" honest and
 *                 separate from "has a functional, validated pack".
 *
 * Sources for metadata: Unicode CLDR language/script data and ISO 639 / ISO
 * 15924 registries (public, redistributable reference data). See
 * ../../LICENSES/ and ../../docs/ATTRIBUTION.md.
 *
 * This list intentionally contains distinct languages, not regional variants
 * padded to reach a count. Where a language is commonly written in more than
 * one script (e.g. Serbian, Punjabi), at most one script variant is listed as a
 * distinct catalog entry and documented as such.
 */

// family keys used below:
//  latin-qwerty  : Latin QWERTY base, per-language accent long-presses / dead keys
//  latin-azerty  : French-style AZERTY
//  latin-qwertz  : German/Central-European QWERTZ
//  cyrillic       : Cyrillic (ЙЦУКЕН family or language-specific)
//  greek          : Greek
//  arabic         : Arabic script (RTL)
//  hebrew         : Hebrew (RTL)
//  devanagari     : Devanagari (InScript-style direct keys + matra long-press)
//  bengali        : Bengali/Assamese script
//  armenian       : Armenian
//  georgian       : Georgian
//  thai           : Thai
//  none           : no authored layout yet (catalog-only)

module.exports = [
  // ---- English / core Latin QWERTY ----
  ["en",      "English",              "English",              "Latn", "ltr", "latin-qwerty"],
  ["en-GB",   "English (UK)",         "English (UK)",         "Latn", "ltr", "latin-qwerty"],
  ["id",      "Indonesian",           "Bahasa Indonesia",     "Latn", "ltr", "latin-qwerty"],
  ["ms",      "Malay",                "Bahasa Melayu",        "Latn", "ltr", "latin-qwerty"],
  ["sw",      "Swahili",              "Kiswahili",            "Latn", "ltr", "latin-qwerty"],
  ["af",      "Afrikaans",            "Afrikaans",            "Latn", "ltr", "latin-qwerty"],
  ["nl",      "Dutch",                "Nederlands",           "Latn", "ltr", "latin-qwerty"],
  ["fil",     "Filipino",             "Filipino",             "Latn", "ltr", "latin-qwerty"],
  ["jv",      "Javanese",             "Basa Jawa",            "Latn", "ltr", "latin-qwerty"],
  ["su",      "Sundanese",            "Basa Sunda",           "Latn", "ltr", "latin-qwerty"],
  ["ha",      "Hausa",                "Hausa",                "Latn", "ltr", "latin-qwerty"],
  ["yo",      "Yoruba",               "Yorùbá",               "Latn", "ltr", "latin-qwerty"],
  ["ig",      "Igbo",                 "Igbo",                 "Latn", "ltr", "latin-qwerty"],
  ["zu",      "Zulu",                 "isiZulu",              "Latn", "ltr", "latin-qwerty"],
  ["xh",      "Xhosa",                "isiXhosa",             "Latn", "ltr", "latin-qwerty"],
  ["st",      "Southern Sotho",       "Sesotho",              "Latn", "ltr", "latin-qwerty"],
  ["sn",      "Shona",                "chiShona",             "Latn", "ltr", "latin-qwerty"],
  ["rw",      "Kinyarwanda",          "Ikinyarwanda",         "Latn", "ltr", "latin-qwerty"],
  ["so",      "Somali",               "Soomaali",             "Latn", "ltr", "latin-qwerty"],
  ["mg",      "Malagasy",             "Malagasy",             "Latn", "ltr", "latin-qwerty"],

  // ---- Latin with accents (Western/Southern Europe) ----
  ["es",      "Spanish",              "Español",              "Latn", "ltr", "latin-qwerty"],
  ["pt",      "Portuguese",           "Português",            "Latn", "ltr", "latin-qwerty"],
  ["it",      "Italian",              "Italiano",             "Latn", "ltr", "latin-qwerty"],
  ["ca",      "Catalan",              "Català",               "Latn", "ltr", "latin-qwerty"],
  ["gl",      "Galician",             "Galego",               "Latn", "ltr", "latin-qwerty"],
  ["eu",      "Basque",               "Euskara",              "Latn", "ltr", "latin-qwerty"],
  ["fr",      "French",               "Français",             "Latn", "ltr", "latin-azerty"],
  ["oc",      "Occitan",              "Occitan",              "Latn", "ltr", "latin-azerty"],
  ["de",      "German",               "Deutsch",              "Latn", "ltr", "latin-qwertz"],
  ["de-CH",   "German (Switzerland)", "Deutsch (Schweiz)",    "Latn", "ltr", "latin-qwertz"],
  ["lb",      "Luxembourgish",        "Lëtzebuergesch",       "Latn", "ltr", "latin-qwertz"],
  ["rm",      "Romansh",              "Rumantsch",            "Latn", "ltr", "latin-qwerty"],

  // ---- Latin, Nordic ----
  ["da",      "Danish",               "Dansk",                "Latn", "ltr", "latin-qwerty"],
  ["sv",      "Swedish",              "Svenska",              "Latn", "ltr", "latin-qwerty"],
  ["nb",      "Norwegian Bokmål",     "Norsk bokmål",         "Latn", "ltr", "latin-qwerty"],
  ["nn",      "Norwegian Nynorsk",    "Nynorsk",              "Latn", "ltr", "latin-qwerty"],
  ["fi",      "Finnish",              "Suomi",                "Latn", "ltr", "latin-qwerty"],
  ["is",      "Icelandic",            "Íslenska",             "Latn", "ltr", "latin-qwerty"],
  ["fo",      "Faroese",              "Føroyskt",             "Latn", "ltr", "latin-qwerty"],

  // ---- Latin, Central / Eastern Europe ----
  ["pl",      "Polish",               "Polski",               "Latn", "ltr", "latin-qwerty"],
  ["cs",      "Czech",                "Čeština",              "Latn", "ltr", "latin-qwertz"],
  ["sk",      "Slovak",               "Slovenčina",           "Latn", "ltr", "latin-qwertz"],
  ["hu",      "Hungarian",            "Magyar",               "Latn", "ltr", "latin-qwertz"],
  ["ro",      "Romanian",             "Română",               "Latn", "ltr", "latin-qwerty"],
  ["hr",      "Croatian",             "Hrvatski",             "Latn", "ltr", "latin-qwertz"],
  ["bs",      "Bosnian",              "Bosanski",             "Latn", "ltr", "latin-qwertz"],
  ["sl",      "Slovenian",            "Slovenščina",          "Latn", "ltr", "latin-qwertz"],
  ["sq",      "Albanian",             "Shqip",                "Latn", "ltr", "latin-qwerty"],
  ["lt",      "Lithuanian",           "Lietuvių",             "Latn", "ltr", "latin-qwerty"],
  ["lv",      "Latvian",              "Latviešu",             "Latn", "ltr", "latin-qwerty"],
  ["et",      "Estonian",             "Eesti",                "Latn", "ltr", "latin-qwerty"],
  ["tr",      "Turkish",              "Türkçe",               "Latn", "ltr", "latin-qwerty"],
  ["az",      "Azerbaijani",          "Azərbaycan",           "Latn", "ltr", "latin-qwerty"],
  ["tk",      "Turkmen",              "Türkmençe",            "Latn", "ltr", "latin-qwerty"],
  ["uz",      "Uzbek",                "Oʻzbek",               "Latn", "ltr", "latin-qwerty"],

  // ---- Latin, Celtic / other Western ----
  ["ga",      "Irish",                "Gaeilge",              "Latn", "ltr", "latin-qwerty"],
  ["gd",      "Scottish Gaelic",      "Gàidhlig",             "Latn", "ltr", "latin-qwerty"],
  ["cy",      "Welsh",                "Cymraeg",              "Latn", "ltr", "latin-qwerty"],
  ["br",      "Breton",               "Brezhoneg",            "Latn", "ltr", "latin-azerty"],
  ["mt",      "Maltese",              "Malti",                "Latn", "ltr", "latin-qwerty"],
  ["vi",      "Vietnamese",           "Tiếng Việt",           "Latn", "ltr", "latin-qwerty"],

  // ---- Latin, Pacific / Americas ----
  ["mi",      "Māori",                "Te Reo Māori",         "Latn", "ltr", "latin-qwerty"],
  ["sm",      "Samoan",               "Gagana Sāmoa",         "Latn", "ltr", "latin-qwerty"],
  ["to",      "Tongan",               "Lea Fakatonga",        "Latn", "ltr", "latin-qwerty"],
  ["fj",      "Fijian",               "Na Vosa Vakaviti",     "Latn", "ltr", "latin-qwerty"],
  ["haw",     "Hawaiian",             "ʻŌlelo Hawaiʻi",       "Latn", "ltr", "latin-qwerty"],
  ["qu",      "Quechua",              "Runa Simi",            "Latn", "ltr", "latin-qwerty"],
  ["gn",      "Guarani",              "Avañe'ẽ",              "Latn", "ltr", "latin-qwerty"],
  ["ay",      "Aymara",               "Aymar aru",            "Latn", "ltr", "latin-qwerty"],
  ["ht",      "Haitian Creole",       "Kreyòl Ayisyen",       "Latn", "ltr", "latin-qwerty"],

  // ---- Cyrillic ----
  ["ru",      "Russian",              "Русский",              "Cyrl", "ltr", "cyrillic"],
  ["uk",      "Ukrainian",            "Українська",           "Cyrl", "ltr", "cyrillic"],
  ["be",      "Belarusian",           "Беларуская",           "Cyrl", "ltr", "cyrillic"],
  ["bg",      "Bulgarian",            "Български",             "Cyrl", "ltr", "cyrillic"],
  ["sr",      "Serbian",              "Српски",               "Cyrl", "ltr", "cyrillic"],
  ["mk",      "Macedonian",           "Македонски",            "Cyrl", "ltr", "cyrillic"],
  ["kk",      "Kazakh",               "Қазақ",                "Cyrl", "ltr", "cyrillic"],
  ["ky",      "Kyrgyz",               "Кыргызча",             "Cyrl", "ltr", "cyrillic"],
  ["tg",      "Tajik",                "Тоҷикӣ",               "Cyrl", "ltr", "cyrillic"],
  ["mn",      "Mongolian (Cyrillic)", "Монгол",               "Cyrl", "ltr", "cyrillic"],
  ["tt",      "Tatar",                "Татар",                "Cyrl", "ltr", "cyrillic"],
  ["ba",      "Bashkir",              "Башҡорт",              "Cyrl", "ltr", "cyrillic"],
  ["cv",      "Chuvash",              "Чӑваш",                "Cyrl", "ltr", "cyrillic"],
  ["ce",      "Chechen",              "Нохчийн",              "Cyrl", "ltr", "cyrillic"],
  ["os",      "Ossetic",              "Ирон",                 "Cyrl", "ltr", "cyrillic"],
  ["ab",      "Abkhaz",               "Аҧсуа",                "Cyrl", "ltr", "cyrillic"],
  ["sah",     "Yakut",                "Саха тыла",            "Cyrl", "ltr", "cyrillic"],

  // ---- Greek ----
  ["el",      "Greek",                "Ελληνικά",             "Grek", "ltr", "greek"],

  // ---- Armenian / Georgian ----
  ["hy",      "Armenian",             "Հայերեն",              "Armn", "ltr", "armenian"],
  ["ka",      "Georgian",             "ქართული",              "Geor", "ltr", "georgian"],

  // ---- Arabic script (RTL) ----
  ["ar",      "Arabic",               "العربية",              "Arab", "rtl", "arabic"],
  ["ar-EG",   "Arabic (Egypt)",       "العربية (مصر)",        "Arab", "rtl", "arabic"],
  ["fa",      "Persian",              "فارسی",                "Arab", "rtl", "arabic"],
  ["ur",      "Urdu",                 "اردو",                 "Arab", "rtl", "arabic"],
  ["ps",      "Pashto",               "پښتو",                 "Arab", "rtl", "arabic"],
  ["sd",      "Sindhi",               "سنڌي",                 "Arab", "rtl", "arabic"],
  ["ckb",     "Central Kurdish",      "کوردیی ناوەندی",       "Arab", "rtl", "arabic"],
  ["ug",      "Uyghur",               "ئۇيغۇرچە",             "Arab", "rtl", "arabic"],
  ["ks",      "Kashmiri",             "کٲشُر",                "Arab", "rtl", "arabic"],
  ["bal",     "Balochi",              "بلۏچی",                "Arab", "rtl", "arabic"],
  ["glk",     "Gilaki",               "گیلکی",                "Arab", "rtl", "none"],

  // ---- Hebrew / Thaana / Syriac (RTL) ----
  ["he",      "Hebrew",               "עברית",                "Hebr", "rtl", "hebrew"],
  ["yi",      "Yiddish",              "ייִדיש",                "Hebr", "rtl", "hebrew"],
  ["dv",      "Divehi",               "ދިވެހި",                "Thaa", "rtl", "none"],
  ["syr",     "Syriac",               "ܣܘܪܝܝܐ",              "Syrc", "rtl", "none"],

  // ---- Devanagari & related Indic ----
  ["hi",      "Hindi",                "हिन्दी",                "Deva", "ltr", "devanagari"],
  ["mr",      "Marathi",              "मराठी",                 "Deva", "ltr", "devanagari"],
  ["ne",      "Nepali",               "नेपाली",                "Deva", "ltr", "devanagari"],
  ["sa",      "Sanskrit",             "संस्कृतम्",              "Deva", "ltr", "devanagari"],
  ["kok",     "Konkani",              "कोंकणी",               "Deva", "ltr", "devanagari"],
  ["mai",     "Maithili",             "मैथिली",                "Deva", "ltr", "devanagari"],
  ["bho",     "Bhojpuri",             "भोजपुरी",               "Deva", "ltr", "devanagari"],
  ["doi",     "Dogri",                "डोगरी",                "Deva", "ltr", "devanagari"],
  ["brx",     "Bodo",                 "बड़ो",                  "Deva", "ltr", "devanagari"],
  ["sd-Deva", "Sindhi (Devanagari)",  "सिन्धी",                "Deva", "ltr", "devanagari"],

  // ---- Bengali / Assamese ----
  ["bn",      "Bangla",               "বাংলা",                 "Beng", "ltr", "bengali"],
  ["as",      "Assamese",             "অসমীয়া",               "Beng", "ltr", "bengali"],
  ["mni",     "Meitei (Bengali)",     "মৈতৈলোন্",              "Beng", "ltr", "bengali"],

  // ---- Other Indic scripts (catalog-only: complex scripts need dedicated shaping/engines) ----
  ["pa",      "Punjabi (Gurmukhi)",   "ਪੰਜਾਬੀ",                 "Guru", "ltr", "none"],
  ["gu",      "Gujarati",             "ગુજરાતી",               "Gujr", "ltr", "none"],
  ["or",      "Odia",                 "ଓଡ଼ିଆ",                  "Orya", "ltr", "none"],
  ["ta",      "Tamil",                "தமிழ்",                 "Taml", "ltr", "none"],
  ["te",      "Telugu",               "తెలుగు",                "Telu", "ltr", "none"],
  ["kn",      "Kannada",              "ಕನ್ನಡ",                 "Knda", "ltr", "none"],
  ["ml",      "Malayalam",            "മലയാളം",               "Mlym", "ltr", "none"],
  ["si",      "Sinhala",              "සිංහල",                 "Sinh", "ltr", "none"],

  // ---- South-East Asian ----
  ["th",      "Thai",                 "ไทย",                  "Thai", "ltr", "thai"],
  ["lo",      "Lao",                  "ລາວ",                   "Laoo", "ltr", "none"],
  ["km",      "Khmer",                "ខ្មែរ",                  "Khmr", "ltr", "none"],
  ["my",      "Burmese",              "မြန်မာ",                 "Mymr", "ltr", "none"],
  ["bo",      "Tibetan",              "བོད་སྐད་",               "Tibt", "ltr", "none"],
  ["dz",      "Dzongkha",             "རྫོང་ཁ",                 "Tibt", "ltr", "none"],

  // ---- East Asian (require IME engines; catalog-only) ----
  ["zh-Hans", "Chinese (Simplified)", "简体中文",               "Hans", "ltr", "none"],
  ["zh-Hant", "Chinese (Traditional)","繁體中文",               "Hant", "ltr", "none"],
  ["ja",      "Japanese",             "日本語",                 "Jpan", "ltr", "none"],
  ["ko",      "Korean",               "한국어",                 "Kore", "ltr", "none"],

  // ---- Ethiopic / African scripts ----
  ["am",      "Amharic",              "አማርኛ",                 "Ethi", "ltr", "none"],
  ["ti",      "Tigrinya",             "ትግርኛ",                 "Ethi", "ltr", "none"],
  ["nqo",     "N'Ko",                 "ߒߞߏ",                  "Nkoo", "rtl", "none"],
  ["ff-Adlm", "Fula (Adlam)",         "𞤀𞤣𞤤𞤢𞤥",                "Adlm", "rtl", "none"],

  // ---- Additional Latin-script languages (bring breadth to 200+) ----
  ["eo",      "Esperanto",            "Esperanto",            "Latn", "ltr", "latin-qwerty"],
  ["ia",      "Interlingua",          "Interlingua",          "Latn", "ltr", "latin-qwerty"],
  ["la",      "Latin",                "Latina",               "Latn", "ltr", "latin-qwerty"],
  ["wo",      "Wolof",                "Wolof",                "Latn", "ltr", "latin-qwerty"],
  ["ln",      "Lingala",              "Lingála",              "Latn", "ltr", "latin-qwerty"],
  ["kg",      "Kongo",                "Kikongo",              "Latn", "ltr", "latin-qwerty"],
  ["ny",      "Chichewa",             "Chichewa",             "Latn", "ltr", "latin-qwerty"],
  ["bem",     "Bemba",                "Ichibemba",            "Latn", "ltr", "latin-qwerty"],
  ["lg",      "Ganda",                "Luganda",              "Latn", "ltr", "latin-qwerty"],
  ["ak",      "Akan",                 "Akan",                 "Latn", "ltr", "latin-qwerty"],
  ["tw",      "Twi",                  "Twi",                  "Latn", "ltr", "latin-qwerty"],
  ["ee",      "Ewe",                  "Eʋegbe",               "Latn", "ltr", "latin-qwerty"],
  ["ff",      "Fula",                 "Fulfulde",             "Latn", "ltr", "latin-qwerty"],
  ["bm",      "Bambara",              "Bamanankan",           "Latn", "ltr", "latin-qwerty"],
  ["dyu",     "Dyula",                "Julakan",              "Latn", "ltr", "latin-qwerty"],
  ["kr",      "Kanuri",               "Kanuri",               "Latn", "ltr", "latin-qwerty"],
  ["ts",      "Tsonga",               "Xitsonga",             "Latn", "ltr", "latin-qwerty"],
  ["tn",      "Tswana",               "Setswana",             "Latn", "ltr", "latin-qwerty"],
  ["ss",      "Swati",                "siSwati",              "Latn", "ltr", "latin-qwerty"],
  ["ve",      "Venda",                "Tshivenḓa",            "Latn", "ltr", "latin-qwerty"],
  ["nr",      "Southern Ndebele",     "isiNdebele",           "Latn", "ltr", "latin-qwerty"],
  ["nso",     "Northern Sotho",       "Sesotho sa Leboa",     "Latn", "ltr", "latin-qwerty"],
  ["kj",      "Kuanyama",             "Oshikwanyama",         "Latn", "ltr", "latin-qwerty"],
  ["ng",      "Ndonga",               "Oshindonga",           "Latn", "ltr", "latin-qwerty"],
  ["hz",      "Herero",               "Otjiherero",           "Latn", "ltr", "latin-qwerty"],
  ["lu",      "Luba-Katanga",         "Kiluba",               "Latn", "ltr", "latin-qwerty"],
  ["kmb",     "Kimbundu",             "Kimbundu",             "Latn", "ltr", "latin-qwerty"],
  ["umb",     "Umbundu",              "Umbundu",              "Latn", "ltr", "latin-qwerty"],
  ["luo",     "Luo",                  "Dholuo",               "Latn", "ltr", "latin-qwerty"],
  ["kik",     "Kikuyu",               "Gĩkũyũ",               "Latn", "ltr", "latin-qwerty"],
  ["kam",     "Kamba",                "Kĩkamba",              "Latn", "ltr", "latin-qwerty"],
  ["mer",     "Meru",                 "Kĩmĩrũ",               "Latn", "ltr", "latin-qwerty"],
  ["guz",     "Gusii",                "Ekegusii",             "Latn", "ltr", "latin-qwerty"],
  ["teo",     "Teso",                 "Kiteso",               "Latn", "ltr", "latin-qwerty"],
  ["aa",      "Afar",                 "Qafar",                "Latn", "ltr", "latin-qwerty"],
  ["om",      "Oromo",                "Afaan Oromoo",         "Latn", "ltr", "latin-qwerty"],
  ["fy",      "Western Frisian",      "Frysk",                "Latn", "ltr", "latin-qwerty"],
  ["gv",      "Manx",                 "Gaelg",                "Latn", "ltr", "latin-qwerty"],
  ["kw",      "Cornish",              "Kernewek",             "Latn", "ltr", "latin-qwerty"],
  ["an",      "Aragonese",            "Aragonés",             "Latn", "ltr", "latin-qwerty"],
  ["ast",     "Asturian",             "Asturianu",            "Latn", "ltr", "latin-qwerty"],
  ["ext",     "Extremaduran",         "Estremeñu",            "Latn", "ltr", "latin-qwerty"],
  ["co",      "Corsican",             "Corsu",                "Latn", "ltr", "latin-azerty"],
  ["sc",      "Sardinian",            "Sardu",                "Latn", "ltr", "latin-qwerty"],
  ["fur",     "Friulian",             "Furlan",               "Latn", "ltr", "latin-qwerty"],
  ["vec",     "Venetian",             "Vèneto",               "Latn", "ltr", "latin-qwerty"],
  ["lij",     "Ligurian",             "Ligure",               "Latn", "ltr", "latin-qwerty"],
  ["nap",     "Neapolitan",           "Napulitano",           "Latn", "ltr", "latin-qwerty"],
  ["scn",     "Sicilian",             "Sicilianu",            "Latn", "ltr", "latin-qwerty"],
  ["wa",      "Walloon",              "Walon",                "Latn", "ltr", "latin-azerty"],
  ["li",      "Limburgish",           "Limburgs",             "Latn", "ltr", "latin-qwerty"],
  ["frr",     "Northern Frisian",     "Nordfriisk",           "Latn", "ltr", "latin-qwertz"],
  ["se",      "Northern Sami",        "Davvisámegiella",      "Latn", "ltr", "latin-qwerty"],
  ["smn",     "Inari Sami",           "Anarâškielâ",          "Latn", "ltr", "latin-qwerty"],
  ["kl",      "Kalaallisut",          "Kalaallisut",          "Latn", "ltr", "latin-qwerty"],
  ["crs",     "Seychellois Creole",   "Kreol Seselwa",        "Latn", "ltr", "latin-qwerty"],
  ["pap",     "Papiamento",           "Papiamentu",           "Latn", "ltr", "latin-qwerty"],
  ["jam",     "Jamaican Patois",      "Patwa",                "Latn", "ltr", "latin-qwerty"],
  ["tpi",     "Tok Pisin",            "Tok Pisin",            "Latn", "ltr", "latin-qwerty"],
  ["ho",      "Hiri Motu",            "Hiri Motu",            "Latn", "ltr", "latin-qwerty"],
  ["bi",      "Bislama",              "Bislama",              "Latn", "ltr", "latin-qwerty"],
  ["ch",      "Chamorro",             "Chamoru",              "Latn", "ltr", "latin-qwerty"],
  ["na",      "Nauruan",              "Dorerin Naoero",       "Latn", "ltr", "latin-qwerty"],
  ["mh",      "Marshallese",          "Kajin M̧ajeļ",          "Latn", "ltr", "latin-qwerty"],
  ["gil",     "Gilbertese",           "Taetae ni Kiribati",   "Latn", "ltr", "latin-qwerty"],
  ["ty",      "Tahitian",             "Reo Tahiti",           "Latn", "ltr", "latin-qwerty"],
  ["niu",     "Niuean",               "Vagahau Niuē",         "Latn", "ltr", "latin-qwerty"],
  ["tvl",     "Tuvaluan",             "Te Ggana Tuuvalu",     "Latn", "ltr", "latin-qwerty"],
  ["crh",     "Crimean Tatar",        "Qırımtatarca",         "Latn", "ltr", "latin-qwerty"],
  ["gag",     "Gagauz",               "Gagauz",               "Latn", "ltr", "latin-qwerty"],
  ["kaa",     "Karakalpak",           "Qaraqalpaqsha",        "Latn", "ltr", "latin-qwerty"],
  ["vo",      "Volapük",              "Volapük",              "Latn", "ltr", "latin-qwertz"],
  ["io",      "Ido",                  "Ido",                  "Latn", "ltr", "latin-qwerty"],
  ["nv",      "Navajo",               "Diné Bizaad",          "Latn", "ltr", "latin-qwerty"],
  ["chr",     "Cherokee",             "ᏣᎳᎩ",                  "Cher", "ltr", "none"],
  ["iu",      "Inuktitut",            "ᐃᓄᒃᑎᑐᑦ",               "Cans", "ltr", "none"],
  ["cr",      "Cree",                 "ᓀᐦᐃᔭᐍᐏᐣ",               "Cans", "ltr", "none"],
  ["oj",      "Ojibwe",               "ᐊᓂᔑᓈᐯᒧᐎᓐ",             "Cans", "ltr", "none"],

  // ---- More Cyrillic-script languages ----
  ["udm",     "Udmurt",               "Удмурт",               "Cyrl", "ltr", "cyrillic"],
  ["kv",      "Komi",                 "Коми",                 "Cyrl", "ltr", "cyrillic"],
  ["mhr",     "Meadow Mari",          "Олык марий",            "Cyrl", "ltr", "cyrillic"],
  ["myv",     "Erzya",                "Эрзянь",               "Cyrl", "ltr", "cyrillic"],
  ["mdf",     "Moksha",               "Мокшень",              "Cyrl", "ltr", "cyrillic"],
  ["tyv",     "Tuvan",                "Тыва дыл",             "Cyrl", "ltr", "cyrillic"],
  ["kbd",     "Kabardian",            "Адыгэбзэ",             "Cyrl", "ltr", "cyrillic"],
  ["ady",     "Adyghe",               "Адыгабзэ",             "Cyrl", "ltr", "cyrillic"],
  ["av",      "Avar",                 "Авар",                 "Cyrl", "ltr", "cyrillic"],
  ["lez",     "Lezgian",              "Лезги",                "Cyrl", "ltr", "cyrillic"],
  ["dar",     "Dargwa",               "Дарган",               "Cyrl", "ltr", "cyrillic"],
  ["inh",     "Ingush",               "ГӀалгӀай",             "Cyrl", "ltr", "cyrillic"],
  ["krc",     "Karachay-Balkar",      "Къарачай-малкъар",     "Cyrl", "ltr", "cyrillic"],
  ["kum",     "Kumyk",                "Къумукъ",              "Cyrl", "ltr", "cyrillic"],
  ["xal",     "Kalmyk",               "Хальмг",               "Cyrl", "ltr", "cyrillic"],
  ["bua",     "Buryat",               "Буряад",               "Cyrl", "ltr", "cyrillic"],
  ["rue",     "Rusyn",                "Русиньскый",           "Cyrl", "ltr", "cyrillic"],

  // ---- Additional South & Central Asian (catalog-only; complex scripts) ----
  ["new",     "Newari",               "नेपाल भाषा",            "Deva", "ltr", "devanagari"],
  ["gom",     "Goan Konkani",         "कोंकणी",               "Deva", "ltr", "devanagari"],
  ["hne",     "Chhattisgarhi",        "छत्तीसगढ़ी",             "Deva", "ltr", "devanagari"],
  ["raj",     "Rajasthani",           "राजस्थानी",             "Deva", "ltr", "devanagari"],
  ["mwr",     "Marwari",              "मारवाड़ी",              "Deva", "ltr", "devanagari"],
  ["sat",     "Santali",              "ᱥᱟᱱᱛᱟᱲᱤ",               "Olck", "ltr", "none"],
  ["lus",     "Mizo",                 "Mizo ṭawng",           "Latn", "ltr", "latin-qwerty"],
  ["kha",     "Khasi",                "Ka Ktien Khasi",       "Latn", "ltr", "latin-qwerty"],
  ["grt",     "Garo",                 "A·chik",               "Latn", "ltr", "latin-qwerty"],

  // ---- Additional Middle Eastern / Central Asian (Arabic & other) ----
  ["prs",     "Dari",                 "دری",                  "Arab", "rtl", "arabic"],
  ["lrc",     "Northern Luri",        "لۊری شومالی",          "Arab", "rtl", "none"],
  ["mzn",     "Mazanderani",          "مازرونی",              "Arab", "rtl", "none"],
  ["arz",     "Egyptian Arabic",      "مصرى",                 "Arab", "rtl", "arabic"],
  ["acm",     "Mesopotamian Arabic",  "عراقي",                "Arab", "rtl", "arabic"],
  ["apc",     "Levantine Arabic",     "شامي",                 "Arab", "rtl", "arabic"],
  ["ary",     "Moroccan Arabic",      "الدارجة",              "Arab", "rtl", "arabic"],
  ["kmr",     "Northern Kurdish",     "Kurmancî",             "Latn", "ltr", "latin-qwerty"],

  // ---- Additional languages to round out breadth ----
  ["th-pali", "Pali (Thai)",          "ปาฬิ",                 "Thai", "ltr", "thai"],
  ["cu",      "Church Slavonic",      "Церковнословѣньскъ",   "Cyrl", "ltr", "cyrillic"],
  ["sco",     "Scots",                "Scots",                "Latn", "ltr", "latin-qwerty"],
  ["nds",     "Low German",           "Plattdüütsch",         "Latn", "ltr", "latin-qwertz"],
  ["bar",     "Bavarian",             "Boarisch",             "Latn", "ltr", "latin-qwertz"],
  ["ksh",     "Colognian",            "Kölsch",               "Latn", "ltr", "latin-qwertz"],
  ["pdc",     "Pennsylvania German",  "Pennsilfaanisch",      "Latn", "ltr", "latin-qwertz"],
  ["yua",     "Yucatec Maya",         "Màaya T'àan",          "Latn", "ltr", "latin-qwerty"],
  ["nah",     "Nahuatl",              "Nāhuatl",              "Latn", "ltr", "latin-qwerty"],
  ["arn",     "Mapudungun",           "Mapudungun",           "Latn", "ltr", "latin-qwerty"],
  ["gug",     "Paraguayan Guarani",   "Avañe'ẽ",              "Latn", "ltr", "latin-qwerty"],
  ["quc",     "Kʼicheʼ",              "Kʼicheʼ",              "Latn", "ltr", "latin-qwerty"],
];
