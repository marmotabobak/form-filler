function loadSettings(callback) {
  chrome.storage.sync.get(["email", "fio", "fanId", "autoConsent", "enabled"], (data) => {
    if (chrome.runtime.lastError) {
      Logger.error("Error loading settings.", chrome.runtime.lastError);
      return;
    }
    callback(data);
  });
}

function saveSettings(settings, callback) {
  chrome.storage.sync.set(settings, () => {
    if (chrome.runtime.lastError) {
      Logger.error("Error saving settings.", chrome.runtime.lastError);
      return;
    }
    Logger.success("Settings saved.");
    if (callback) callback();
  });
}
