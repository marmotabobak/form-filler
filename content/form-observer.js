const MAX_ATTEMPTS = 20;
const TIMEOUT_MS = 5000;  // Maximum timeout for Observer.
const DEBOUNCE_MS = 200;

function startObserver(settings) {
  let attemptCount = 0;
  let debounceTimer;

  const runAttempt = () => {
    attemptCount++;
    const isLast = attemptCount >= MAX_ATTEMPTS;
    if (isLast || attemptCount % 5 === 0) {
      Logger.info("MutationObserver: attempt #" + attemptCount, { attemptCount });
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

    setTimeout(() => {
      observer.disconnect();
      Logger.warn(`Observer stopped by timeout ${TIMEOUT_MS / 1000} seconds.`);
    }, TIMEOUT_MS);
  } catch (err) {
    Logger.error("Error starting Observer.", err);
  }
}

function attemptFill(settings, observer, attemptCount, isLast) {
  const result = fillFormFields(settings, isLast);

  if (result.emailFilled && result.fioFilled && result.fanIdFilled && result.consentChecked) {
    observer.disconnect();
    Logger.success("All fields are set. Observer stopped.");
  } else if (attemptCount >= MAX_ATTEMPTS) {
    observer.disconnect();
    Logger.warn(`Observer stopped after ${MAX_ATTEMPTS} attempts.`);
  } else {
    if (isLast || attemptCount % 5 === 0) {
      Logger.info("Attempt #" + attemptCount + ": " + result);
    }
  }
}


