function runPlugin() {
  chrome.tabs.executeScript(null, {
    file: "js/getPagesSource.js"
    }, function() {
      if (chrome.runtime.lastError) {
        alert('There was an error injecting script : \n' + chrome.runtime.lastError.message);
      }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource" && request.source !== "Not a ptt website") {
    let title = request.source[0];
    let link = request.source[1];
    let board = getBoardName(link);
    saveLink(board, title+";"+link);
    return;
  }
  showData();
});

document.addEventListener('DOMContentLoaded', function() {
  getLinkData(null, function(result) {
    document.getElementById("delete_all").addEventListener("click", deleteAll);
  });

  document.getElementById("trash").addEventListener("drop", function(e){
    let link = e.dataTransfer.getData("Link");
    deleteLink(link);
    e.preventDefault();
  });
  //Allow Drop
  document.getElementById("trash").addEventListener("dragover", function(e){
    e.preventDefault();
  });
});

window.onload = runPlugin();
