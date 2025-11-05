document.addEventListener("DOMContentLoaded", () => {
  loadSettings((data) => {
    fillForm(data);
  });

  const emailInput = document.getElementById("email");
  const fioInput = document.getElementById("fio");
  const fanIdInput = document.getElementById("fanId");
  const autoConsentCheckbox = document.getElementById("autoConsent");
  const enabledEl = document.getElementById("enabled");

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      chrome.storage.sync.set({ email: emailInput.value.trim() });
    });
  }
  if (fioInput) {
    fioInput.addEventListener("input", () => {
      chrome.storage.sync.set({ fio: fioInput.value.trim() });
    });
  }
  if (fanIdInput) {
    fanIdInput.addEventListener("input", () => {
      chrome.storage.sync.set({ fanId: fanIdInput.value.trim() });
    });
  }
  if (autoConsentCheckbox) {
    autoConsentCheckbox.addEventListener("change", () => {
      chrome.storage.sync.set({ autoConsent: !!autoConsentCheckbox.checked });
    });
  }

  if (enabledEl) {
    enabledEl.addEventListener("change", () => {
      chrome.storage.sync.set({ enabled: !!enabledEl.checked });
    });
  }
});


