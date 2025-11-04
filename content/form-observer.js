const MAX_ATTEMPTS = 20;
const TIMEOUT_MS = 5000;  // Maximum timeout for Observer.
const DEBOUNCE_MS = 200;

function startObserver(settings) {
  let attemptCount = 0;
  let debounceTimer;
  let stopped = false;
  let timeoutId;

  const runAttempt = () => {
    if (stopped) return;
    attemptCount++;
    const isLast = attemptCount >= MAX_ATTEMPTS;
    if (isLast || attemptCount % 5 === 0) {
      Logger.info("MutationObserver: attempt #" + attemptCount, { attemptCount });
    }
    const done = attemptFill(settings, observer, attemptCount, isLast);
    if (done) {
      stopped = true;
      clearTimeout(debounceTimer);
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
      return;
    }
    if (isLast) {
      observer.disconnect();
    }
  };

  const observer = new MutationObserver(() => {
    if (stopped) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runAttempt, DEBOUNCE_MS);
  });

  try {
    runAttempt();
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    timeoutId = setTimeout(() => {
      if (stopped) return;
      try {
        // Final attempt with forced logging of misses
        const done = attemptFill(settings, observer, attemptCount, true);
        if (done) {
          stopped = true;
          clearTimeout(debounceTimer);
          observer.disconnect();
          return;
        }
      } catch (e) {
        Logger.warn("Final attempt on timeout failed.", e);
      } finally {
        if (stopped) return;
        stopped = true;
        observer.disconnect();
        Logger.warn(`Observer stopped by timeout ${TIMEOUT_MS / 1000} seconds.`);
      }
    }, TIMEOUT_MS);  
  } catch (err) {
    Logger.error("Error starting Observer.", err);
  }
}

function attemptFill(settings, observer, attemptCount, isLast) {
  const result = fillFormFields(settings, isLast);

  // Fill only those fields that are defined by the settings.
  const allDefinedFieldsAreFilled =
    (!settings.email || result.emailFilled) &&
    (!settings.fio || result.fioFilled) &&
    (!settings.fanId || result.fanIdFilled) &&
    (!settings.autoConsent || result.consentChecked);

  if (allDefinedFieldsAreFilled) {
    observer.disconnect();
    Logger.success("All fields are set. Observer stopped.");
    return true;
  } else if (attemptCount >= MAX_ATTEMPTS) {
    observer.disconnect();
    Logger.warn(`Observer stopped after ${MAX_ATTEMPTS} attempts.`);
    return false;
  } else {
    if (isLast || attemptCount % 5 === 0) {
      Logger.info("Attempt #" + attemptCount, result);
    }
    return false;
  }
}


