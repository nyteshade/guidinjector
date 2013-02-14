var lastId = null;

// A generic onclick callback function.
function genericOnClick(info, tab) {
  if (!lastId) {
    chrome.tabs.sendMessage(tab.id, {setGUID: false, id: lastId});
  }
  else {
    chrome.tabs.sendMessage(tab.id, {setGUID:true, id:lastId});
  }
}

// Create one test item for each context type.
var id = chrome.contextMenus.create({
  "title": "Generate GUID/UUID", 
  "contexts":["editable"],
  "onclick": genericOnClick
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  lastId = request.id;
});