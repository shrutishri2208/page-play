window.onload = onWindowLoad;

let clickBtn = document.getElementById("click-btn");
let heading = document.getElementById("heading");

let searchTerm;

function onWindowLoad() {
  chrome.permissions.contains(
    {
      permissions: ["scripting", "activeTab", "tabs"],
      // origins: ["https://www.google.com/"],
    },
    (result) => {
      if (result) {
        chrome.tabs
          .query({ active: true, currentWindow: true })
          .then(function (tabs) {
            var activeTab = tabs[0];
            var activeTabId = activeTab.id;

            return chrome.scripting.executeScript({
              target: { tabId: activeTabId },
              func: DOMtoString,
              args: ["title"],
            });
          })
          .then(function (results) {
            searchTerm = results[0].result;
            console.log(searchTerm);
          })
          .catch(function (error) {
            heading.innerText =
              "There was an error injecting script : \n" + error.message;
          });
      } else {
        heading.innerHTML = "NOT GRANTED";
      }
    }
  );
}

function DOMtoString(selector) {
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return "ERROR: querySelector failed to find node";
  } else {
    selector = document.documentElement;
  }
  return selector.outerHTML;
}
