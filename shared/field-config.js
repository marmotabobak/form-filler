const FIELD_CONFIG = {
  email: {
    keywords: [
      "почт",
      "mail"
    ],
    exclude: ["фио", "fan id", "фан id"]
  },
  fio: {
    keywords: [
      "фио",
      "фамилия",
      "имя",
      "отчество",
      "полное имя",
      "full name"
    ],
    exclude: ["почт", "e-mail", "email", "fan id", "фан id"]
  },
  fanId: {
    keywords: ["fan id", "фан id", "fanid", "идентификатор болельщика"],
    exclude: ["почт", "e-mail", "email", "фио", "фамилия", "имя", "отчество"]
  }
};

const CONSENT_KEYWORDS = [
  "персональных данных",
  "personal data",
  "согласие",
  "обработка персональных данных",
  "privacy",
  "terms",
  "agreement",
  "ПД"
];


