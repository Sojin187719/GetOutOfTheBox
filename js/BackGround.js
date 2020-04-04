alert("** Start **");

chrome.tabs.onActivated.addListener(function(activeInfo) {
    alert(activeInfo.tabId);
});