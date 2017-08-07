function runPlugin() {
  let message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
    }, function() {
      if (chrome.runtime.lastError) {
        alert('There was an error injecting script : \n' + chrome.runtime.lastError.message);
      }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    let link = request.source;
    console.log(link);
    let board = getBoardName(link);
    saveBoard(board, link);
  }
});

function saveBoard(board, link){
  chrome.storage.sync.get([board], function(result) {
    let links = !!result ? [link] : result;
    links = links.includes(link) ? links : links.unshift(link);
    chrome.storage.sync.set({ board: links }, function() {
      console.log("Link Saved");
      getLinks(board);
    });
  });
}

function getBoardName(link) {
  if (!link) {
    return;
  }
  let subLink = link.substring(8); 
  let board = subLink.split("/")[2];
  return board;
}

function getLinks(board) {
  chrome.storage.sync.get([board], function(result) {
    console.log(result);
  });
}
window.onload = runPlugin();
