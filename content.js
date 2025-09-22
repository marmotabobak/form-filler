const AUTO_CHECK_CONSENT = true;

const email = "igurvantsev@ozon.ru";
const fioValue = "Урванцев Игорь Анатольевич";
const fanIdValue = "195074116";

const emailKeywords = ["почт", "e-mail", "email"];
const fioKeywords = ["фио"];
const fanIdKeywords = ["fan id", "фан id"];

const consentTextKeywords = ["персональных данных", "personal data"];

let emailFilled = false;
let fioFilled = false;
let fanIdFilled = false;
let consentChecked = false;

function containsKeyword(text, keywords) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

function findAndFillByKeywords(keywords, fillValue, excludeKeywords = []) {
  const candidates = Array.from(document.querySelectorAll('div')).filter(div => {
    const text = div.textContent || "";
    return keywords.some(kw => text.toLowerCase().includes(kw.toLowerCase())) &&
      !excludeKeywords.some(exkw => text.toLowerCase().includes(exkw.toLowerCase()));
  });

  for (const div of candidates) {
    let input = div.querySelector('input, textarea');

    if (!input && div.parentElement) {
      input = div.parentElement.querySelector('input, textarea');
    }

    if (input && input.value !== fillValue) {
      input.value = fillValue;
      input.setAttribute('value', fillValue);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
  }
  return false;
}

function checkConsentCheckbox() {
  if (consentChecked || !AUTO_CHECK_CONSENT) return AUTO_CHECK_CONSENT;

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

    if (containsKeyword(labelText, consentTextKeywords)) {
      if (!checkbox.checked) {
        // Вместо check + events — просто программно кликаем по чекбоксу
        checkbox.click();
      }
      consentChecked = true;
      return true;
    }
  }
  return false;
}

function fillFormFields() {
  if (!emailFilled) {
    emailFilled = findAndFillByKeywords(emailKeywords, email, [...fioKeywords, ...fanIdKeywords]);
  }
  if (!fioFilled) {
    fioFilled = findAndFillByKeywords(fioKeywords, fioValue, [...emailKeywords, ...fanIdKeywords]);
  }
  if (!fanIdFilled) {
    fanIdFilled = findAndFillByKeywords(fanIdKeywords, fanIdValue, [...emailKeywords, ...fioKeywords]);
  }
  if (AUTO_CHECK_CONSENT && !consentChecked) {
    consentChecked = checkConsentCheckbox();
  }
  return emailFilled && fioFilled && fanIdFilled && (AUTO_CHECK_CONSENT ? consentChecked : true);
}

fillFormFields();

const observer = new MutationObserver(() => {
  if (fillFormFields()) {
    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

