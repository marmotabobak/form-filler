chrome.runtime.onInstalled.addListener(() => {
  console.log("[X] Service worker installed.");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("[X] Service worker started.");
});

// Receive logs from other parts of the extension.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "log") {
    const prefix = sender.tab
      ? `[Content:${sender.tab.url}]`
      : "[Extension]";
    console.log(`${prefix} [${message.level.toUpperCase()}] ${message.msg}`, message.data || "");
  }
});
