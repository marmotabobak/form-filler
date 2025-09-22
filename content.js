// =======================
// Конфигурация полей
// =======================
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

// =======================
// Утилиты
// =======================
function containsKeyword(text, keywords) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

function logInfo(msg, data) {
  console.log("ℹ️", msg, data || "");
}
function logSuccess(msg) {
  console.log("✅", msg);
}
function logWarn(msg) {
  console.warn("⚠️", msg);
}
function logError(msg, err) {
  console.error("❌", msg, err || "");
}

// =======================
// Основная логика заполнения
// =======================
function fillFieldByConfig(config, value) {
  if (!value) return false;

  const divs = Array.from(document.querySelectorAll("div"));
  let filled = false;

  for (const div of divs) {
    const text = div.textContent || "";

    if (
      containsKeyword(text, config.keywords) &&
      !containsKeyword(text, config.exclude)
    ) {
      let input =
        div.querySelector("input, textarea") ||
        (div.parentElement && div.parentElement.querySelector("input, textarea"));

      if (input && input.value !== value) {
        input.value = value;
        input.setAttribute("value", value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        logSuccess(`Поле заполнено: ${config.keywords.join(", ")}`);
        filled = true;
      }
    }
  }

  if (!filled) {
    logWarn(`Не найдено поле для ключей: ${config.keywords.join(", ")}`);
  }

  return filled;
}

function checkConsentCheckbox(autoCheckConsent) {
  if (!autoCheckConsent) return true;

  const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));

  for (const checkbox of checkboxes) {
    let labelText = "";

    if (checkbox.id) {
      const label = document.querySelector(`label[for="${checkbox.id}"]`);
      if (label) labelText = label.textContent || "";
    }

    if (!labelText) {
      const parentLabel = checkbox.closest("label");
      if (parentLabel) labelText = parentLabel.textContent || "";
    }

    if (containsKeyword(labelText, CONSENT_KEYWORDS)) {
      if (!checkbox.checked) {
        checkbox.click();
        logSuccess("Чекбокс согласия установлен.");
      }
      return true;
    }
  }

  logWarn("Чекбокс согласия не найден.");
  return false;
}

function fillFormFields(settings) {
  const emailFilled = fillFieldByConfig(FIELD_CONFIG.email, settings.email);
  const fioFilled = fillFieldByConfig(FIELD_CONFIG.fio, settings.fio);
  const fanIdFilled = fillFieldByConfig(FIELD_CONFIG.fanId, settings.fanId);
  const consentChecked = checkConsentCheckbox(settings.autoConsent);

  return { emailFilled, fioFilled, fanIdFilled, consentChecked };
}

// =======================
// Observer
// =======================
chrome.storage.sync.get(["email", "fio", "fanId", "autoConsent"], (settings) => {
  if (chrome.runtime.lastError) {
    logError("Ошибка при чтении настроек", chrome.runtime.lastError);
    return;
  }

  const observer = new MutationObserver(() => {
    logInfo("MutationObserver triggered");
    attemptFill();
  });

  function attemptFill() {
    const result = fillFormFields(settings);

    if (result.emailFilled && result.fioFilled && result.fanIdFilled && result.consentChecked) {
      observer.disconnect();
      logSuccess("Все поля заполнены и согласие установлено. Observer остановлен.");
    } else {
      logInfo("Попытка заполнения:", result);
    }
  }

  try {
    attemptFill();
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (err) {
    logError("Ошибка при запуске заполнения формы", err);
  }
});

