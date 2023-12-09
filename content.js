// content.js
document.addEventListener("mouseup", function () {
  const selectedText = window.getSelection().toString();
  chrome.runtime.sendMessage({ action: "setSelectedText", selectedText });
});
