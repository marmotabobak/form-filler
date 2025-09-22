// Конфигурация ключевых слов для разных типов полей
const FIELD_CONFIG = {
  email: {
    keywords: ["почт", "e-mail", "email"],
    exclude: ["фио", "fan id", "фан id"]
  },
  fio: {
    keywords: ["фио"],
    exclude: ["почт", "e-mail", "email", "fan id", "фан id"]
  },
  fanId: {
    keywords: ["fan id", "фан id"],
    exclude: ["почт", "e-mail", "email", "фио"]
  }
};

const CONSENT_KEYWORDS = ["персональных данных", "personal data"];
