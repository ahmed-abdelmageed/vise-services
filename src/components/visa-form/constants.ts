
// Constants for the visa form components
export const NATIONALITIES = ["أفغاني", "ألباني", "جزائري", "أمريكي", "أندوري", "أنغولي", "أنتيغوا", "أرجنتيني", "أرميني", "أسترالي", "نمساوي", "أذربيجاني", "باهامي", "بحريني", "بنغلاديشي", "بربادوسي", "بيلاروسي", "بلجيكي", "بليز", "بنيني", "بوتاني", "بوليفي", "بوسني", "برازيلي", "بريطاني", "بروناي", "بلغاري", "بوركيني", "بورمي", "بوروندي", "كمبودي", "كاميروني", "كندي", "الرأس الأخضر", "وسط أفريقي", "تشادي", "تشيلي", "صيني", "كولومبي", "جزر القمر", "كونغولي", "كوستاريكي", "كرواتي", "كوبي", "قبرصي", "تشيكي", "دنماركي", "جيبوتي", "دومينيكي", "هولندي", "تيموري شرقي", "إكوادوري", "مصري", "إماراتي", "غيني الاستوائي", "إريتري", "إستوني", "إثيوبي", "فيجي", "فلبيني", "فنلندي", "فرنسي", "غابوني", "غامبي", "جورجي", "ألماني", "غاني", "يوناني", "غرينادي", "غواتيمالي", "غيني بيساوي", "غيني", "غياني", "هايتي", "هرسك", "هندوراسي", "مجري", "أيسلندي", "هندي", "إندونيسي", "إيراني", "عراقي", "أيرلندي", "إسرائيلي", "إيطالي", "ساحل العاج", "جامايكي", "ياباني", "أردني", "كازاخستاني", "كيني", "كيريباتي", "كويتي", "قيرغيزستاني", "لاوسي", "لاتفي", "لبناني", "ليبيري", "ليبي", "ليختنشتاين", "ليتواني", "لوكسمبورغي", "مقدوني", "مدغشقري", "مالاوي", "ماليزي", "مالديفي", "مالي", "مالطي", "مارشالي", "موريتاني", "موريشيوسي", "مكسيكي", "ميكرونيزي", "مولدوفي", "موناكو", "منغولي", "مغربي", "موزمبيقي", "ناميبي", "ناورو", "نيبالي", "نيوزيلندي", "نيكاراغوا", "نيجيري", "نيجر", "كوري شمالي", "شمال أيرلندا", "نرويجي", "عماني", "باكستاني", "بالاو", "بنمي", "بابوا غينيا الجديدة", "باراغواي", "بيروفي", "بولندي", "برتغالي", "قطري", "روماني", "روسي", "رواندي", "سانت لوسيا", "سلفادوري", "ساموي", "سان مارينو", "ساو تومي", "سعودي", "اسكتلندي", "سنغالي", "صربي", "سيشيل", "سيراليوني", "سنغافوري", "سلوفاكي", "سلوفيني", "جزر سليمان", "صومالي", "جنوب أفريقي", "كوري جنوبي", "إسباني", "سريلانكي", "سوداني", "سورينامي", "سوازيلاندي", "سويدي", "سويسري", "سوري", "تايواني", "طاجيكستاني", "تنزاني", "تايلاندي", "توغو", "تونغا", "ترينيداد وتوباغو", "تونسي", "تركي", "توفالو", "أوغندي", "أوكراني", "أوروغواي", "أوزبكستاني", "فنزويلي", "فيتنامي", "ويلزي", "يمني", "زامبي", "زيمبابوي", "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguan", "Argentine", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djiboutian", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kiribati", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean"];

// GCC, USA, and UK nationalities to be excluded from Other Nationals form
export const EXCLUDED_NATIONALITIES = ["سعودي", "كويتي", "بحريني", "قطري", "إماراتي", "عماني", "أمريكي", "بريطاني", "Saudi", "Kuwaiti", "Bahraini", "Qatari", "Emirian", "Omani", "American", "British"];

// Filtered nationalities for Other Nationals form
export const OTHER_NATIONALITIES = NATIONALITIES.filter(nat => !EXCLUDED_NATIONALITIES.includes(nat));

// GCC nationalities in the specific order requested
export const GCC_NATIONALITIES = [{
  value: "سعودي",
  label: "المملكة العربية السعودية",
  englishValue: "Saudi",
  englishLabel: "Saudi Arabia"
}, {
  value: "بحريني",
  label: "البحرين",
  englishValue: "Bahraini",
  englishLabel: "Bahrain"
}, {
  value: "كويتي",
  label: "الكويت",
  englishValue: "Kuwaiti",
  englishLabel: "Kuwait"
}, {
  value: "عماني",
  label: "عمان",
  englishValue: "Omani",
  englishLabel: "Oman"
}, {
  value: "قطري",
  label: "قطر",
  englishValue: "Qatari",
  englishLabel: "Qatar"
}, {
  value: "إماراتي",
  label: "الإمارات العربية المتحدة",
  englishValue: "Emirian",
  englishLabel: "United Arab Emirates"
}];

export const COUNTRY_CODES = [{
  code: "+966",
  country: "المملكة العربية السعودية",
  englishCountry: "Saudi Arabia"
}, {
  code: "+1",
  country: "الولايات المتحدة",
  englishCountry: "United States"
}, {
  code: "+44",
  country: "المملكة المتحدة",
  englishCountry: "United Kingdom"
}, {
  code: "+91",
  country: "الهند",
  englishCountry: "India"
}, {
  code: "+86",
  country: "الصين",
  englishCountry: "China"
}, {
  code: "+971",
  country: "الإمارات العربية المتحدة",
  englishCountry: "United Arab Emirates"
}, {
  code: "+49",
  country: "ألمانيا",
  englishCountry: "Germany"
}, {
  code: "+33",
  country: "فرنسا",
  englishCountry: "France"
}, {
  code: "+7",
  country: "روسيا",
  englishCountry: "Russia"
}, {
  code: "+81",
  country: "اليابان",
  englishCountry: "Japan"
}, {
  code: "+234",
  country: "نيجيريا",
  englishCountry: "Nigeria"
}, {
  code: "+55",
  country: "البرازيل",
  englishCountry: "Brazil"
}, {
  code: "+61",
  country: "أستراليا",
  englishCountry: "Australia"
}, {
  code: "+92",
  country: "باكستان",
  englishCountry: "Pakistan"
}, {
  code: "+20",
  country: "مصر",
  englishCountry: "Egypt"
}];

// Define Spain Visa appointment types and prices
export const SPAIN_APPOINTMENT_TYPES = [
  {
    id: "normal",
    name: "عادي",
    englishName: "Normal",
    price: 330
  },
  {
    id: "prime",
    name: "وقت الذروة",
    englishName: "Prime Time",
    price: 610
  },
  {
    id: "vip",
    name: "كبار الشخصيات/متميز",
    englishName: "VIP/Premium",
    price: 865
  }
];

// Define Spain Visa locations
export const SPAIN_LOCATIONS = [
  {
    id: "riyadh",
    name: "الرياض",
    englishName: "Riyadh"
  },
  {
    id: "khobar",
    name: "الخبر",
    englishName: "Al Khobar"
  },
  {
    id: "jeddah",
    name: "جدة",
    englishName: "Jeddah"
  }
];

// Import the visa configurations from the main config file
export { VISA_CONFIGS, DEFAULT_VISA_CONFIG } from "@/config/visaConfig";
