function logToBackground(level, msg, data) {
  try {
    chrome.runtime?.sendMessage({ type: "log", level, msg, data });
  } catch (err) {
    // If the sending is not available (e.g. in background), simply ignore it.
  }
}

const Logger = {
  info: (msg, data) => {
    console.info(msg, data || "");
    logToBackground("info", msg, data);
  },
  success: (msg, data) => {
    console.info(msg, data || "");
    logToBackground("success", msg, data);
  },
  warn: (msg, data) => {
    console.warn(msg, data || "");
    logToBackground("warn", msg, data);
  },
  error: (msg, err) => {
    console.error(msg, err || "");
    logToBackground("error", msg, err);
  }
};
