// Returns the text of the associated label (<label for> or parent <label>).
function getAssociatedLabelText(input) {
  if (input.id) {
    const lbl = document.querySelector(`label[for="${input.id}"]`);
    if (lbl && lbl.textContent) return lbl.textContent;
  }
  const parentLabel = input.closest("label");
  if (parentLabel && parentLabel.textContent) return parentLabel.textContent;
  return "";
}

// Returns a short descriptor for logging.
function getInputDescriptor(input) {
  return (
    (document.querySelector(`label[for="${input.id}"]`)?.textContent || "").trim() ||
    input.getAttribute("placeholder") ||
    input.getAttribute("name") ||
    input.getAttribute("title") ||
    input.getAttribute("aria-label") ||
    "input"
  );
}

// Returns the vicinity text for matching by keywords.
function buildVicinityText(input) {
  const labelText = getAssociatedLabelText(input);
  const placeholder = input.getAttribute("placeholder") || "";
  const nameAttr = input.getAttribute("name") || "";
  const titleAttr = input.getAttribute("title") || "";
  const ariaLabel = input.getAttribute("aria-label") || "";
  return `${labelText} ${placeholder} ${nameAttr} ${titleAttr} ${ariaLabel}`;
}

// Returns the candidates: inside div and up to two next siblings.
function findCandidateInputsNearDiv(div) {
  const inputs = Array.from(div.querySelectorAll("input, textarea"));
  if (inputs.length === 0) {
    let sib = div.nextElementSibling;
    for (let i = 0; i < 2 && sib; i++) {
      inputs.push(...sib.querySelectorAll("input, textarea"));
      if (inputs.length) break;
      sib = sib.nextElementSibling;
    }
  }
  return inputs;
}

// Checks if the input matches the config by vicinity.
function inputMatchesConfig(input, config) {
  const vicinityText = buildVicinityText(input);
  return (
    containsKeyword(vicinityText, config.keywords) &&
    !containsKeyword(vicinityText, config.exclude)
  );
}

// Sets the value and sends the input event.
function setInputValueWithEvents(input, value) {
  input.value = value;
  input.setAttribute("value", value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function fillFieldByConfig(config, value, logOnMiss = true) {
  if (!value) return false;

  const divs = Array.from(document.querySelectorAll("div"));
  let filled = false;

  for (const div of divs) {
    const text = div.textContent || "";

    if (
      containsKeyword(text, config.keywords) &&
      !containsKeyword(text, config.exclude)
    ) {
      const inputs = findCandidateInputsNearDiv(div);

      let chosen = null;
      for (const input of inputs) {
        if (inputMatchesConfig(input, config)) {
          chosen = input;
          break;
        }
      }

      if (!chosen && inputs.length) {
        chosen = inputs[0];
      }

      if (chosen) {
        if (chosen.value !== value) {
          setInputValueWithEvents(chosen, value);
          const descriptor = getInputDescriptor(chosen);
          Logger.success(`Field ("${descriptor}") is set: "${value}".`);
        }
        filled = true;
        break;
      }
    }
  }

  if (!filled && logOnMiss) {
    Logger.warn(`Field not found for keywords: ${config.keywords.join(", ")}`);
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
        Logger.success(`Checkbox ("${labelText}").`);
      }
      return true;
    }
  }

  Logger.warn("Checkbox not found.");
  return false;
}

function fillFormFields(settings, logOnMiss = false) {
  return {
    emailFilled: fillFieldByConfig(FIELD_CONFIG.email, settings.email, logOnMiss),
    fioFilled: fillFieldByConfig(FIELD_CONFIG.fio, settings.fio, logOnMiss),
    fanIdFilled: fillFieldByConfig(FIELD_CONFIG.fanId, settings.fanId, logOnMiss),
    consentChecked: checkConsentCheckbox(settings.autoConsent)
  };
}


