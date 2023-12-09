function summarizeSelectedText() {
  let tabId; // Declare tabId in the broader scope

  // Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    tabId = tabs[0].id; // Assign value to tabId
    // Execute the content script to get the selected text
    chrome.tabs.executeScript(tabId, { file: "content.js" }, function () {
      // Wait for a short time to allow the content script to set up
      setTimeout(function () {
        // Request the selected text from the content script
        chrome.tabs.sendMessage(
          tabId,
          { action: "getSelectedText" },
          function (response) {
            if (response && response.selectedText) {
              // Use a simple word frequency algorithm for extractive summarization
              const wordFrequencies = getWordFrequencies(response.selectedText);
              const sortedWords = Object.keys(wordFrequencies).sort(
                (a, b) => wordFrequencies[b] - wordFrequencies[a]
              );
              const summary = sortedWords.slice(0, 10).join(" ");

              document.getElementById(
                "summary"
              ).innerText = `Summary: ${summary}`;
            } else {
              document.getElementById("summary").innerText =
                "No text selected. Please highlight text on the webpage.";
            }
          }
        );
      }, 300);
    });
  });
}

document
  .getElementById("summarizeButton")
  .addEventListener("click", summarizeSelectedText);
