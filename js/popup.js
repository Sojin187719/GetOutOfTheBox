
document.getElementById('buttonUSER').addEventListener('click', function () { 
    // Enregistrer des données dans sessionStorage
    localStorage.userName =  document.getElementById('username').value;

    var data = localStorage.getItem("userName");
        alert(data);

},false);   