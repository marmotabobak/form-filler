chrome.storage.sync.get(["email", "fio", "fanId", "autoConsent"], (settings) => {
  if (chrome.runtime.lastError) {
    Logger.error("Error reading settings.", chrome.runtime.lastError);
    return;
  }
  startObserver(settings);
});


