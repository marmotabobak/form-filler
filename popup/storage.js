function loadSettings(callback) {
  chrome.storage.sync.get(["email", "fio", "fanId", "autoConsent"], (data) => {
    if (chrome.runtime.lastError) {
      PopupLogger.error("Ошибка загрузки настроек", chrome.runtime.lastError);
      return;
    }
    callback(data);
  });
}

function saveSettings(settings, callback) {
  chrome.storage.sync.set(settings, () => {
    if (chrome.runtime.lastError) {
      PopupLogger.error("Ошибка сохранения настроек", chrome.runtime.lastError);
      return;
    }
    PopupLogger.success("Настройки сохранены");
    if (callback) callback();
  });
}
