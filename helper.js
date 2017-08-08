function addListener(){
  getLinkData(null, function(result){
    Object.keys(result).forEach(function(key) {
      result[key].map(function(item) {
        let link = item.split(";")[1];
        deleteLink(link);
        //button.addEventListener('click', function(){
          //deleteItem(link);
        //});
      });
    });
  });
}

function deleteLink(link){
  let start = 0;
  let end = 0;
  let delta = 0;
  let _link = document.getElementById(link);
  _link.addEventListener("mousedown", function(e){
    e.preventDefault();
    start = new Date();
  });
  _link.addEventListener("mouseup", function(e) {
    e.preventDefault();
    end = new Date();
    delta = end - start;
    if (delta > 1000) {
      deleteItem(link);
    }else{
      window.open(link, '_blank');
    }
  });
}

function deleteAll(){
  if(confirm('Are you sure you want to delete all you savings?')) {
    alert("DELETED Everything!");
    let div = document.getElementById('mainContent');
    div.innerHTML = "";
    chrome.storage.sync.clear();
  } 
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
        message.innerHTML = "<h3 style=color:red>SAVED " + link.split(';')[0] + "</h3><br/>";
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
      links += "<a href=" + link + " id=" +link+ " >" + title + "</a>";
    });
    div.innerHTML += "<div class='dropdown'><button class='dropbtn'>" + key.toUpperCase() + "</button><div class='dropdown-content'>" + links + "</div>";
  });
  addListener();
}

function deleteItem(link){
  let board = getBoardName(link);
  getLinkData(board, function(result){
    let index = -1;
    for(let i = 0; i < result[board].length; i++){
      let foundLink = result[board][i].split(";")[1];
      if(foundLink === link){
        index = i;
        break;
      }
    }
    console.log(index);
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
