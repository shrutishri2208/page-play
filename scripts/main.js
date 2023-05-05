window.onload = onWindowLoad;

let heading = document.getElementById("heading");
let list = document.getElementById("list");
list.innerHTML = `<h2>Loading...</h2>`;

const fetchData = async (searchTerm) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&type=video&key=${YOUTUBE_DATA_API}`
  );
  const resjson = await response.json();
  const data = resjson.items;
  displayList(data);
};

function onWindowLoad() {
  chrome.permissions.contains(
    {
      permissions: ["scripting", "activeTab", "tabs"],
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
            // displayList(object);
            let searchTerm = results[0].result;
            fetchData(searchTerm);
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

const displayList = (displayList) => {
  let listItems = "";
  displayList.map(
    (item) =>
      (listItems += `
  <div class="item">
    <a target='_black' href="https://www.youtube.com/watch?v=${item.id.videoId}">
      <img src="${item.snippet.thumbnails.medium.url}" alt="Video Thumbnail" width="320" height="180">
      <h2>${item.snippet.title}</h2>
    </a>
    <h3>${item.snippet.channelTitle}</h3>
  </div>
  `)
  );
  list.innerHTML = listItems;
};

const DOMtoString = (selector, selector1, selector2, selector3) => {
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

  return selector.innerText;
  // return [selector.innerText, selector1.innerText];
  // return [selector.innerText, selector1.innerText, h2Terms, h3Terms];
};
