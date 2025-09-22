function loadSettings(callback) {
  chrome.storage.sync.get(["email", "fio", "fanId", "autoConsent"], (data) => {
    if (chrome.runtime.lastError) {
      Logger.error("Ошибка загрузки настроек", chrome.runtime.lastError);
      return;
    }
    callback(data);
  });
}

function saveSettings(settings, callback) {
  chrome.storage.sync.set(settings, () => {
    if (chrome.runtime.lastError) {
      Logger.error("Ошибка сохранения настроек", chrome.runtime.lastError);
      return;
    }
    Logger.success("Настройки сохранены");
    if (callback) callback();
  });
}

function resetSettings(callback) {
  chrome.storage.sync.clear(() => {
    if (chrome.runtime.lastError) {
      Logger.error("Ошибка при сбросе настроек", chrome.runtime.lastError);
      return;
    }
    Logger.success("Настройки сброшены");
    if (callback) callback();
  });
}
