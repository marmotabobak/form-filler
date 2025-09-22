function containsKeyword(text, keywords) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

// Универсальный поиск и заполнение по ключевым словам
function fillField(keywords, fillValue, excludeKeywords = []) {
  const divs = Array.from(document.querySelectorAll('div'));
  let filled = false;

  for (const div of divs) {
    const text = div.textContent || "";
    if (
      keywords.some(kw => text.toLowerCase().includes(kw.toLowerCase())) &&
      !excludeKeywords.some(exkw => text.toLowerCase().includes(exkw.toLowerCase()))
    ) {
      let input = div.querySelector('input, textarea') ||
                  (div.parentElement && div.parentElement.querySelector('input, textarea'));

      if (input && input.value !== fillValue) {
        input.value = fillValue;
        input.setAttribute('value', fillValue);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`✅ Поле заполнено: ${keywords.join(", ")}`);
        filled = true;
      }
    }
  }

  if (!filled) {
    console.warn(`⚠️ Не найдено поле для ключей: ${keywords.join(", ")}`);
  }
  return filled;
}

// Проверка чекбокса согласия
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

    const consentTextKeywords = ["персональных данных", "personal data"];

    if (containsKeyword(labelText, consentTextKeywords)) {
      if (!checkbox.checked) {
        checkbox.click();
        console.log("✅ Чекбокс согласия установлен.");
      }
      return true;
    }
  }

  console.warn("⚠️ Чекбокс согласия не найден.");
  return false;
}

// Отдельные функции для разных типов полей
function fillEmail(settings) {
  const emailKeywords = ["почт", "e-mail", "email"];
  const exclude = ["фио", "fan id", "фан id"];
  return settings.email ? fillField(emailKeywords, settings.email, exclude) : false;
}

function fillFio(settings) {
  const fioKeywords = ["фио"];
  const exclude = ["почт", "e-mail", "email", "fan id", "фан id"];
  return settings.fio ? fillField(fioKeywords, settings.fio, exclude) : false;
}

function fillFanId(settings) {
  const fanIdKeywords = ["fan id", "фан id"];
  const exclude = ["почт", "e-mail", "email", "фио"];
  return settings.fanId ? fillField(fanIdKeywords, settings.fanId, exclude) : false;
}

// Основная функция
function fillFormFields(settings) {
  let emailFilled = fillEmail(settings);
  let fioFilled = fillFio(settings);
  let fanIdFilled = fillFanId(settings);
  let consentChecked = checkConsentCheckbox(settings.autoConsent);

  return { emailFilled, fioFilled, fanIdFilled, consentChecked };
}

chrome.storage.sync.get(['email', 'fio', 'fanId', 'autoConsent'], (settings) => {
  if (chrome.runtime.lastError) {
    console.error("❌ Ошибка при чтении настроек:", chrome.runtime.lastError);
    return;
  }

  const observer = new MutationObserver(() => {
    console.log("🔄 MutationObserver triggered");
    attemptFill();
  });

  function attemptFill() {
    const { emailFilled, fioFilled, fanIdFilled, consentChecked } = fillFormFields(settings);

    if (emailFilled && fioFilled && fanIdFilled && consentChecked) {
      observer.disconnect();
      console.log("🎉 Все поля заполнены и согласие установлено. Observer остановлен.");
    }
  }

  try {
    attemptFill();
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (err) {
    console.error("❌ Ошибка при попытке заполнить форму:", err);
  }
});

