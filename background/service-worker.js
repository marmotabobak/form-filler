chrome.runtime.onInstalled.addListener(() => {
  console.log("🟢 Extension installed");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("🟢 Extension started");
});

// Принимаем логи из других частей расширения
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "log") {
    const prefix = sender.tab
      ? `[Content:${sender.tab.url}]`
      : "[Extension]";
    console.log(`${prefix} [${message.level.toUpperCase()}] ${message.msg}`, message.data || "");
  }
});


