window.onload = onWindowLoad;

let clickBtn = document.getElementById("click-btn");
let heading = document.getElementById("heading");
let list = document.getElementById("list");

// clickBtn.addEventListener("click", () => {
//   let sel = document.querySelectorAll(".trial");
//   sel.forEach((item) => console.log(item.innerText));
// });

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
              args: ["title", "h1", "h2", "h3"],
            });
          })
          .then(function (results) {
            console.log(results);
            // console.log(results[0].result[0]);
            // console.log(results[0].result[1]);
            // console.log(results[0].result[2]);
            // searchTerm = results[0].result;
            // list.innerText = searchTerm;
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

function DOMtoString(selector, selector1, selector2, selector3) {
  if (selector || selector1 || selector2 || selector3) {
    selector = document.querySelector(selector);
    selector1 = document.querySelector(selector1);
    selector2 = document.querySelectorAll(selector2);
    selector3 = document.querySelectorAll(selector3);
    if (!selector && !selector1 && !selector2 && !selector3)
      return "No node found";
  } else {
    selector = document.documentElement;
    selector1 = document.documentElement;
    selector2 = document.documentElement;
    selector3 = document.documentElement;
  }

  let h2Terms = [];
  let h3Terms = [];

  selector2.forEach((item) => h2Terms.push(item.innerText));
  selector3.forEach((item) => h3Terms.push(item.innerText));

  return [selector.innerText, selector1.innerText, h2Terms, h3Terms];
}
