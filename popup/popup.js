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
      Logger.success("Настройки обновлены пользователем");
    });
  });
});
