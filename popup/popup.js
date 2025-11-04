document.addEventListener("DOMContentLoaded", () => {
  // Загружаем сохранённые настройки
  loadSettings((data) => {
    fillForm(data);
  });

  if (typeof emailInput !== "undefined" && emailInput) {
    emailInput.addEventListener("input", () => {
      chrome.storage.sync.set({ email: emailInput.value.trim() });
    });
  }
  if (typeof fioInput !== "undefined" && fioInput) {
    fioInput.addEventListener("input", () => {
      chrome.storage.sync.set({ fio: fioInput.value.trim() });
    });
  }
  if (typeof fanIdInput !== "undefined" && fanIdInput) {
    fanIdInput.addEventListener("input", () => {
      chrome.storage.sync.set({ fanId: fanIdInput.value.trim() });
    });
  }
  if (typeof autoConsentCheckbox !== "undefined" && autoConsentCheckbox) {
    autoConsentCheckbox.addEventListener("change", () => {
      chrome.storage.sync.set({ autoConsent: !!autoConsentCheckbox.checked });
    });
  }

  // On/oOff toggle: saved immediately upon change without waiting for saveBtn click.
  const enabledEl = document.getElementById("enabled");
  if (enabledEl) {
    enabledEl.addEventListener("change", (e) => {
      const enabled = !!enabledEl.checked;
      chrome.storage.sync.set({ enabled }, () => {
        if (chrome.runtime.lastError) {
          Logger.warn("Не удалось сохранить флаг включения", chrome.runtime.lastError);
          return;
        }
        Logger.info("Флаг автозаполнения обновлён", { enabled });
      });
    });
  }
});


