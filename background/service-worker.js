chrome.runtime.onInstalled.addListener((details) => {
  const { version } = chrome.runtime.getManifest();
  console.log("[Lifecycle] onInstalled", {
    reason: details.reason, previousVersion: details.previousVersion, version,
    ts: new Date().toISOString()
  });
});

chrome.runtime.onStartup.addListener(() => {
  console.log("[Lifecycle] onStartup", {
    version: chrome.runtime.getManifest().version,
    ts: new Date().toISOString()
  });
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
