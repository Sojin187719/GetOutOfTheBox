
document.getElementById('buttonUSER').addEventListener('click', function () { 
    // Enregistrer des données dans sessionStorage

    chrome.storage.sync.set({'userName' : document.getElementById('username').value});


},false);   