// Content script for in-page selection handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "REPLACE_SELECTED_TEXT" && message.replacement) {
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === "TEXTAREA" || (activeEl.tagName === "INPUT" && activeEl.type === "text"))) {
      const start = activeEl.selectionStart;
      const end = activeEl.selectionEnd;
      const val = activeEl.value;
      activeEl.value = val.substring(0, start) + message.replacement + val.substring(end);
      activeEl.selectionStart = activeEl.selectionEnd = start + message.replacement.length;
    } else if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(message.replacement));
      }
    }
  }
});
