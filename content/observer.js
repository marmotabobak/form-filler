function startObserver(settings) {
  const observer = new MutationObserver(() => {
    Logger.info("MutationObserver triggered");
    attemptFill(settings, observer);
  });

  try {
    attemptFill(settings, observer);
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (err) {
    Logger.error("Ошибка при запуске заполнения формы", err);
  }
}

function attemptFill(settings, observer) {
  const result = fillFormFields(settings);

  if (result.emailFilled && result.fioFilled && result.fanIdFilled && result.consentChecked) {
    observer.disconnect();
    Logger.success("Все поля заполнены и согласие установлено. Observer остановлен.");
  } else {
    Logger.info("Попытка заполнения:", result);
  }
}
