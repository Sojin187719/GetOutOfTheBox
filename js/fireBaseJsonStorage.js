//<script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>

//executer lors de la fermeture
window.onbeforeunload = function () {

    //initialize firebase
    var config = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        storagrBucket: "",
    };
    firebase.initializeApP(config);

    //get elements
    var uploader = document.getElementById('uploader');
    var fileButton = document.getElementById('fileButton');

    fileButton.addEventListener('change', function(e){
        //get file
        var file = e.target.files[0];
        //create a storage file
        var storageRef = firebase.storage().ref('folder_name/' + file.name);
        //upload file
        var task = storageRef.put(file);
        //update progress bar
        task.on('state_changed', 
            function progress(snapshot){
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploader.value = percentage;
                //dans le 'service firebase.storage' changer la condition du if par true
            },

            function error(){
                
            },

            function complete() {
                
            }
        );
    });
    return "close";
}