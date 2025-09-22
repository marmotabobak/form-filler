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
      }
      return true;
    }
  }

  return false;
}

function fillFormFields(settings) {
  const emailKeywords = ["почт", "e-mail", "email"];
  const fioKeywords = ["фио"];
  const fanIdKeywords = ["fan id", "фан id"];

  let emailFilled = false;
  let fioFilled = false;
  let fanIdFilled = false;
  let consentChecked = false;

  if (settings.email) {
    emailFilled = findAndFillByKeywords(emailKeywords, settings.email, [...fioKeywords, ...fanIdKeywords]);
  }
  if (settings.fio) {
    fioFilled = findAndFillByKeywords(fioKeywords, settings.fio, [...emailKeywords, ...fanIdKeywords]);
  }
  if (settings.fanId) {
    fanIdFilled = findAndFillByKeywords(fanIdKeywords, settings.fanId, [...emailKeywords, ...fioKeywords]);
  }
  consentChecked = checkConsentCheckbox(settings.autoConsent);

  return emailFilled && fioFilled && fanIdFilled && consentChecked;
}

chrome.storage.sync.get(['email', 'fio', 'fanId', 'autoConsent'], (settings) => {
  function attemptFill() {
    if (fillFormFields(settings)) {
      observer.disconnect();
      console.log('All fields filled and consent set.');
    }
  }
  
  attemptFill();

  const observer = new MutationObserver(() => {
    console.log('MutationObserver triggered');
    attemptFill();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

