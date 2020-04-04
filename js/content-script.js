
var isSleeping = false;
var cursorList = [];
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
 
const ref = database.ref('data/olivier');
ref.on('child_changed', function(snapshot, data) {
  console.log(`olivier ${snapshot.key}: ${snapshot.val()}`);
});

createCursor("Me",0,0);


const coord =  async function(e){
    if(isSleeping) return;
    isSleeping = true
    var x = e.pageX;
    var y = e.pageY;
    getCursor("Me").x=x;
    getCursor("Me").y=y;
    animList();
    await sleep(1000);
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
    var cursor = {id: cursorId, x: cursorX, y: cursorY};
    cursorList.push(cursor);
    document.body.innerHTML+="<div name="+cursor.id+" id='animatedDiv'><img id='cursorImg'><p id='cursorTxt'>"+cursor.id+"</p></div>";
}

function deleteCursor(cursorId){
    cursorList.splice(cursorList.indexOf(getCursor(cursorId)), 1);
}

function animList(){
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
        document.getElementsByName(cursor.id)[0].style.left = cursor.x-8;
        document.getElementsByName(cursor.id)[0].style.top = cursor.y-8;
    }
}


document.addEventListener('mousemove', coord, true);