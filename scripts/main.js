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
  if (data.length === 0) {
    list.innerHTML = `<h2>No related videos found :(</h2>`;
  } else {
    displayList(data);
  }
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
              args: ["title"],
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
    <a target='_blank' href="https://www.youtube.com/channel/${item.snippet.channelId}">
      <h3>${item.snippet.channelTitle}</h3>
    </a>
  </div>
  `)
  );
  list.innerHTML = listItems;
};

const DOMtoString = (selector) => {
  if (selector) {
    selector = document.querySelector(selector);

    if (!selector) return "No node found";
  } else {
    selector = document.documentElement;
  }
  return selector.innerText;
};
