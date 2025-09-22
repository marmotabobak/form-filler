const Logger = {
  info: (msg, data) => console.log("ℹ️", msg, data || ""),
  success: (msg) => console.log("✅", msg),
  warn: (msg) => console.warn("⚠️", msg),
  error: (msg, err) => console.error("❌", msg, err || "")
};
