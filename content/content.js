chrome.storage.sync.get(["email", "fio", "fanId", "autoConsent"], (settings) => {
  if (chrome.runtime.lastError) {
    Logger.error("Ошибка при чтении настроек", chrome.runtime.lastError);
    return;
  }
  startObserver(settings);
});
