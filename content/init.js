chrome.storage.sync.get(["email", "fio", "fanId", "autoConsent", "enabled"], (settings) => {
  if (chrome.runtime.lastError) {
    Logger.error("Error reading settings.", chrome.runtime.lastError);
    return;
  }
  const isEnabled = settings.enabled !== false; // по умолчанию включено
  if (!isEnabled) {
    Logger.info("Autofill is disabled in settings.");
    return;
  }
  startObserver(settings);
});


