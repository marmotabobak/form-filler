document.addEventListener("DOMContentLoaded", () => {
  // Загружаем сохранённые настройки
  loadSettings((data) => {
    fillForm(data);
  });

  // Сохраняем при клике
  saveBtn.addEventListener("click", () => {
    const settings = getFormData();
    saveSettings(settings, () => {
      showPopupMessage("Настройки сохранены!");
    });
  });
});
