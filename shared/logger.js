function logToBackground(level, msg, data) {
  try {
    chrome.runtime?.sendMessage({ type: "log", level, msg, data });
  } catch (err) {
    // Если отправка недоступна (например, в background), просто игнорируем
  }
}

const Logger = {
  info: (msg, data) => {
    console.log("ℹ️", msg, data || "");
    logToBackground("info", msg, data);
  },
  success: (msg, data) => {
    console.log("✅", msg, data || "");
    logToBackground("success", msg, data);
  },
  warn: (msg, data) => {
    console.warn("⚠️", msg, data || "");
    logToBackground("warn", msg, data);
  },
  error: (msg, err) => {
    console.error("❌", msg, err || "");
    logToBackground("error", msg, err);
  }
};
