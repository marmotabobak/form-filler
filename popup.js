const emailInput = document.getElementById('email');
const fioInput = document.getElementById('fio');
const fanIdInput = document.getElementById('fanId');
const autoConsentCheckbox = document.getElementById('autoConsent');
const saveBtn = document.getElementById('saveBtn');
const popupMsg = document.getElementById('popupMsg');

// Загрузка сохраненных настроек при открытии popup
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['email', 'fio', 'fanId', 'autoConsent'], (data) => {
    if (data.email) emailInput.value = data.email;
    if (data.fio) fioInput.value = data.fio;
    if (data.fanId) fanIdInput.value = data.fanId;
    autoConsentCheckbox.checked = !!data.autoConsent;
  });
});

// Сохранение настроек и показ подтверждения
saveBtn.addEventListener('click', () => {
  const settings = {
    email: emailInput.value.trim(),
    fio: fioInput.value.trim(),
    fanId: fanIdInput.value.trim(),
    autoConsent: autoConsentCheckbox.checked
  };

  chrome.storage.sync.set(settings, () => {
    showPopupMessage("Настройки сохранены!");
  });
});

function showPopupMessage(text) {
  popupMsg.textContent = text;
  popupMsg.classList.add('show');
  setTimeout(() => popupMsg.classList.remove('show'), 2000);
}

