const PopupLogger = {
  info: (msg, data) => console.log("ℹ️ [Popup]", msg, data || ""),
  success: (msg) => console.log("✅ [Popup]", msg),
  warn: (msg) => console.warn("⚠️ [Popup]", msg),
  error: (msg, err) => console.error("❌ [Popup]", msg, err || "")
};
