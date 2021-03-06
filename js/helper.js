function addListener(){
  getLinkData(null, function(result){
    Object.keys(result).forEach(function(key) {
      result[key].map(function(item) {
        let link = item.split(";")[1];
        addMoveToTrashListener(link);
      });
    });
  });
}

function deleteAll(){
    let div = document.getElementById('mainContent');
    div.innerHTML = "";
    chrome.storage.sync.clear();
    alert("DELETED Everything!");
}

function saveLink(board, link){
  getLinkData(board, function(result) {
    let obj = {};
    let links = !!result[board] ? result[board] : [];
    if(links && !links.includes(link)){
      links.unshift(link);
      obj[board] = links;
      chrome.storage.sync.set( obj, function() {
        let message = document.querySelector('#message');
        message.innerHTML = "<h3 id='save-message'>SAVED " +board.toUpperCase()+": "+ link.split(';')[0] + "</h3><br/>";
      });
    }
    showData();
  });
}

function showData() {
  getLinkData(null, function(result) {
    let div = document.getElementById('mainContent');
    div.innerHTML = "";
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
      links += "<a href=" + link + " id=" +link+ " draggable=true>" + title + "</a>";
    });
    div.innerHTML += "<div class='dropdown'><button draggable=true class='dropbtn' id="+key+">" + key.toUpperCase() + "</button><div class='dropdown-content'>" + links + "</div>";
  });
  addListener();
}

function addListener(){
  getLinkData(null, function(result){
    Object.keys(result).forEach(function(board) {
      addMoveBoardToTrashListener(board);
      result[board].map(function(link) {
        let _link = link.split(";")[1];
        addMoveLinkToTrashListener(_link);
      });
    });
  });
}

function addMoveBoardToTrashListener(link){
  let _link = document.getElementById(link);
  _link.addEventListener("dragstart", function(e){
    e.dataTransfer.setData("id", e.target.id);
  });
}

function addMoveLinkToTrashListener(link){
  let _link = document.getElementById(link);
  _link.addEventListener("dragstart", function(e){
    e.dataTransfer.setData("id", e.target.id);
  });
  _link.addEventListener("click", function(e){
    window.open(link, '_blank');
  });
}

function deleteLink(item){
  let board = getBoardName(item);
  getLinkData(board, function(result){
    let index = -1;
    for(let i = 0; i < result[board].length; i++){
      let foundLink = result[board][i].split(";")[1];
      if(foundLink === item){
        index = i;
        break;
      }
    }
    result[board].splice(index, 1);
    updateLink(board, result[board]);
  });
}

function updateLink(board, newLinks){
  if(newLinks.length == 0){
    chrome.storage.sync.remove(board);
  }else{
    let obj = {};
    obj[board] = newLinks;
    chrome.storage.sync.set(obj);
  }
  showData();
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
