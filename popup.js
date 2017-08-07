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
  if (request.action == "getSource" && request.source !== "No Link Availabe") {
    let title = request.source[0];
    let link = request.source[1];
    let board = getBoardName(link);
    //chrome.storage.sync.clear();
    saveLink(board, title+";"+link);
    //alert(HIHI);
    //getLinks(board);
    showData();
  }
  //showData();
});

function showData() {
  chrome.storage.sync.get(null, function(result) {
    convertToList(result);
  });
}

function convertToList(data) {
  console.log(data);
  let div = document.getElementById('mainContent');
  Object.keys(data).forEach(function(key) {
    div.innerHTML += key.toUpperCase() + ":<br/>";
    data[key].map(function(item) {
      let title = item.split(";")[0]
      let link = item.split(";")[1]
      div.innerHTML += "<li><a href=" + link + " target='_blank'>" + title + "</a></li>";
    });
  });
}

function saveLink(board, link){
  chrome.storage.sync.get(board, function(result) {
    let obj = {};
    let links = !!result[board] ? result[board] : [];
    if(links)
      links.includes(link) ? links : links.unshift(link);
    obj[board] = links;

    chrome.storage.sync.set( obj, function() {
      console.log("Link Saved");
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
  chrome.storage.sync.get(board, function(result) {
    return result;
  });
}
window.onload = runPlugin();
