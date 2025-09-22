document.addEventListener("DOMContentLoaded", () => {
  // Загружаем сохранённые настройки
  loadSettings((data) => {
    fillForm(data);
  });

  // Сохраняем
  saveBtn.addEventListener("click", () => {
    const settings = getFormData();
    saveSettings(settings, () => {
      showPopupMessage("Настройки сохранены!", "success");
    });
  });

  // Сброс
  resetBtn.addEventListener("click", () => {
    resetSettings(() => {
      fillForm({});
      showPopupMessage("Настройки сброшены", "success");
    });
  });
});
