// Metaphrase AI Extension Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "metaphrase_fluent",
    title: "Paraphrase (Natural & Fluent)",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "metaphrase_humanize",
    title: "Humanize Selected Text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "metaphrase_concise",
    title: "Simplify & Condense",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!info.selectionText || !tab.id) return;

  const endpoint = info.menuItemId === "metaphrase_humanize" 
    ? "http://localhost:8000/api/humanize" 
    : "http://localhost:8000/api/paraphrase";

  const payload = info.menuItemId === "metaphrase_humanize"
    ? { text: info.selectionText, target_language: "English" }
    : { 
        text: info.selectionText, 
        tone: info.menuItemId === "metaphrase_concise" ? "Simple" : "Fluent" 
      };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const result = data.paraphrased_text || data.humanized_text;

    if (result) {
      chrome.tabs.sendMessage(tab.id, {
        action: "REPLACE_SELECTED_TEXT",
        replacement: result
      });
    }
  } catch (err) {
    console.error("[Metaphrase Extension] Transformation failed:", err);
  }
});
