document.addEventListener("DOMContentLoaded", () => {
  // Загружаем сохранённые настройки
  loadSettings((data) => {
    fillForm(data);
  });

  // Сохраняем
  saveBtn.addEventListener("click", () => {
    const settings = getFormData();
    saveSettings(settings, () => {
      showPopupMessage("success");
      Logger.success("Настройки обновлены пользователем");
    });
  });

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


