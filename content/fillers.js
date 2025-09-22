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
        Logger.success(`Поле заполнено: ${config.keywords.join(", ")}`);
        filled = true;
      }
    }
  }

  if (!filled) {
    Logger.warn(`Не найдено поле для ключей: ${config.keywords.join(", ")}`);
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
        Logger.success("Чекбокс согласия установлен.");
      }
      return true;
    }
  }

  Logger.warn("Чекбокс согласия не найден.");
  return false;
}

function fillFormFields(settings) {
  return {
    emailFilled: fillFieldByConfig(FIELD_CONFIG.email, settings.email),
    fioFilled: fillFieldByConfig(FIELD_CONFIG.fio, settings.fio),
    fanIdFilled: fillFieldByConfig(FIELD_CONFIG.fanId, settings.fanId),
    consentChecked: checkConsentCheckbox(settings.autoConsent)
  };
}
