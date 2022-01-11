let lastId = null;

chrome.runtime.onInstalled.addListener((details) => {
  console.log(details);
  
  // A generic onclick callback function.
  function genericOnClick(info, tab) {
    debugger;
    if (!lastId) {
      chrome.tabs.sendMessage(tab.id, { setGUID: false, id: lastId });
    }
    else {
      chrome.tabs.sendMessage(tab.id, { setGUID: true, id: lastId });
    }
  }

  // Create one test item for each context type.
  let id = chrome.contextMenus.create({
    "id": "guid-uuid-extension",
    "title": "Generate GUID/UUID", 
    "contexts": [ "editable" ]
  });

  chrome.contextMenus.onClicked.addListener(genericOnClick);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('I am here');
  lastId = request.id;
});
