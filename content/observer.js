const MAX_ATTEMPTS = 20;      // максимум попыток заполнения
const TIMEOUT_MS = 30000;     // максимум 30 секунд работы

function startObserver(settings) {
  let attemptCount = 0;

  const observer = new MutationObserver(() => {
    attemptCount++;
    Logger.info("MutationObserver triggered", { attemptCount });
    attemptFill(settings, observer, attemptCount);
  });

  try {
    attemptFill(settings, observer, attemptCount);
    observer.observe(document.body, { childList: true, subtree: true });

    // ограничение по времени
    setTimeout(() => {
      observer.disconnect();
      Logger.warn(`Observer остановлен по таймауту ${TIMEOUT_MS / 1000} секунд.`);
    }, TIMEOUT_MS);
  } catch (err) {
    Logger.error("Ошибка при запуске заполнения формы", err);
  }
}

function attemptFill(settings, observer, attemptCount) {
  const result = fillFormFields(settings);

  if (result.emailFilled && result.fioFilled && result.fanIdFilled && result.consentChecked) {
    observer.disconnect();
    Logger.success("Все поля заполнены и согласие установлено. Observer остановлен.");
  } else if (attemptCount >= MAX_ATTEMPTS) {
    observer.disconnect();
    Logger.warn(`Observer остановлен после ${MAX_ATTEMPTS} попыток.`);
  } else {
    Logger.info("Попытка заполнения:", result);
  }
}
