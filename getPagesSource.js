// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
chrome.runtime.sendMessage({
  action: "getSource",
  //source: findLink(document)
  source: findWebLink(document)
});

function findLink(document) {
  let links = document.getElementsByClassName("y q7 b0");
  let targetLink = "";
  for(let i = 0; i < links.length; i++){
    if(links[i].href.includes("https://www.ptt.cc")){
      targetLink = links[i].href;
      break;
    }
  }
  return targetLink ? targetLink : "No Link Available";
}

function findWebLink(document) {
  let title = document.getElementsByClassName("article-meta-value");
  let links = document.getElementsByClassName("f2")[1].getElementsByTagName("a");
  return [title[2].innerHTML, links[0].href];
}
