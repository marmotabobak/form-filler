const MAX_ATTEMPTS = 20;
const TIMEOUT_MS = 5000;  // Maximum timeout for observer (5 seconds).
const DEBOUNCE_MS = 200;

function startObserver(settings) {
  let attemptCount = 0;
  let debounceTimer;

  const runAttempt = () => {
    attemptCount++;
    const isLast = attemptCount >= MAX_ATTEMPTS;
    if (isLast || attemptCount % 5 === 0) {
      Logger.info("MutationObserver: попытка", { attemptCount });
    }
    attemptFill(settings, observer, attemptCount, isLast);
    if (isLast) {
      observer.disconnect();
    }
  };

  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runAttempt, DEBOUNCE_MS);
  });

  try {
    runAttempt();
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // ограничение по времени
    setTimeout(() => {
      observer.disconnect();
      Logger.warn(`Observer остановлен по таймауту ${TIMEOUT_MS / 1000} секунд.`);
    }, TIMEOUT_MS);
  } catch (err) {
    Logger.error("Ошибка при запуске заполнения формы", err);
  }
}

function attemptFill(settings, observer, attemptCount, isLast) {
  const result = fillFormFields(settings, isLast);

  if (result.emailFilled && result.fioFilled && result.fanIdFilled && result.consentChecked) {
    observer.disconnect();
    Logger.success("Все поля заполнены и согласие установлено. Observer остановлен.");
  } else if (attemptCount >= MAX_ATTEMPTS) {
    observer.disconnect();
    Logger.warn(`Observer остановлен после ${MAX_ATTEMPTS} попыток.`);
  } else {
    if (isLast || attemptCount % 5 === 0) {
      Logger.info("Попытка заполнения:", result);
    }
  }
}


