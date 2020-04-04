
var isSleeping = false;
var cursorList = [];
var localURL = location;
var interval = 1000;
var id = 0;


var firebaseConfig = {
    apiKey: "AIzaSyBl6wXfdx33ui2MJ5tnTJUkVgmknleZpUU",
    authDomain: "getoutofthebox-b57d8.firebaseapp.com",
    databaseURL: "https://getoutofthebox-b57d8.firebaseio.com",
    projectId: "getoutofthebox-b57d8",
    storageBucket: "getoutofthebox-b57d8.appspot.com",
    messagingSenderId: "279156731745",
    appId: "1:279156731745:web:0b577fcd6ef1e41ded1f20",
    measurementId: "G-0RY5LGNS3N"
};

const app = firebase.initializeApp(firebaseConfig);
const database = app.database();
 
const div = document.createElement('div');
        div.id = "cursor";
        div.innerHTML = 'lala';
        div.style.position = 'fixed';
        document.body.appendChild(div);
        

const ref = database.ref('data/olivier');
ref.on('child_changed', function(snapshot, data) {
  console.log(`olivier ${snapshot.key}: ${snapshot.val()}`);

  if (snapshot.key === 'x') {
    document.querySelector('#cursor').style.left = snapshot.val() + 'px';
} else {
    document.querySelector('#cursor').style.top = snapshot.val() + 'px';
}

});



const coord =  async function(e){
    if(isSleeping) return;
    isSleeping = true
    var x = e.pageX;
    var y = e.pageY;
    if(getCursor("Me")==null) createCursor("Me",x,y);
    getCursor("Me").x=x;
    getCursor("Me").y=y;
    moveCursor(getCursor("Me"))
    await sleep(interval);
    isSleeping = false;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getCursor(id) {
    for(i = 0 ; i<cursorList.length ; i++){
        if(cursorList[i].id == id){
            return cursorList[i];
        }
    }
    return null;
}
function createCursor(cursorId, cursorX, cursorY){
    var mainDiv =document.createElement("div");
    mainDiv.name=cursorId;
    mainDiv.style.position="absolute";
    mainDiv.style.pointerEvents="none";
    var img = document.createElement("img");
    img.src="https://openclipart.org/download/222074/White-Pixel-Mouse-Cursor-Arow-Fixed.svg";
    img.style.width="9px";
    img.style.height="auto";
    var p = document.createElement("p");
    p.style.fontSize ="13px";
    p.style.position ="absolute";
    p.style.top ="0%";
    p.style.left ="75%";
    var node = document.createTextNode(cursorId);
    p.appendChild(node);
    mainDiv.appendChild(img);
    mainDiv.appendChild(p);
    var cursor = {id: cursorId, x: cursorX, y: cursorY,docElement: mainDiv};
    cursorList.push(cursor);
    document.body.appendChild(mainDiv);
}

function deleteCursor(cursorId){
    var cursor = getCursor(cursorId);
    cursorList.splice(cursorList.indexOf(cursor), 1);
    document.body.removeChild(cursor.docElement);
}


function moveCursor(){
    for(i = 0 ; i<cursorList.length ; i++){
        cursor = cursorList[i];
        console.log("id : "+cursor.id+" | x: "+cursor.x+" | y: "+cursor.y);
        database.ref('data/olivier').set({
            cursorId: cursor.id,
            x: cursor.x,
            y: cursor.y
        }, function(error) {
            if (error) {
                console.log(`arf: ${error}`);
            } else {
                console.log('what!?');
            }
        });
        cursor.docElement.style.top = cursor.y-8;
        cursor.docElement.style.left = cursor.x-8;
    }
}


document.addEventListener('mousemove', coord, true);