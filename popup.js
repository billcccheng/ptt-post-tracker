function runPlugin() {
  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
    }, function() {
      if (chrome.runtime.lastError) {
        alert('There was an error injecting script : \n' + chrome.runtime.lastError.message);
      }
    });
}

document.addEventListener('DOMContentLoaded', function() {
  getLinkData(null, function(result) {
    if(result !== null){
      document.getElementById("delete_all").addEventListener("click", deleteAll);
      console.log(document.getElementsByTagName('button'));
      Object.keys(result).forEach(function(key) {
        result[key].map(function(item) {
          let link = item.split(";")[1];
        });
      });
    }
  });
});

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

function deleteItem(){
  alert("DELETE");
}

function deleteAll(){
  if (confirm('Are you sure you want to delete all you savings?')) {
    alert("DELETED Everything!");
    let div = document.getElementById('mainContent');
    div.innerHTML = "";
    chrome.storage.sync.clear();
  } 
}

function showData() {
  getLinkData(null, function(result) {
    convertToList(result);
  });
}

function convertToList(data) {
  let div = document.getElementById('mainContent');
  Object.keys(data).sort().forEach(function(key) {
    let links = '';
    data[key].map(function(item) {
      let title = item.split(";")[0]
      let link = item.split(";")[1]
      links += "<a href=" + link + " target='_blank'>" + title + "</a><button class='delete' id="+ link +">x</button>";
    });
    div.innerHTML += "<div class='dropdown'><button class='dropbtn'>" + key.toUpperCase() + "</button><div class='dropdown-content'>" + links + "</div>";
  });
}

function saveLink(board, link){
  getLinkData(board, function(result) {
    let obj = {};
    let links = !!result[board] ? result[board] : [];
    if(links && !links.includes(link)){
      links.unshift(link);
      obj[board] = links;
      chrome.storage.sync.set( obj, function() {
        let message = document.querySelector('#mainContent');
        message.innerHTML = "<h3 style=color:red>SAVED " + link.split(';')[0] + "</h3><br/>";
      });
    }
    showData();
  });
}

function updateLink(){

}

function getBoardName(link) {
  if (!link) {
    return;
  }
  let subLink = link.substring(8); 
  let board = subLink.split("/")[2];
  return board;
}

function getLinkData(board, next) {
  chrome.storage.sync.get(board, next);
}
window.onload = runPlugin();
