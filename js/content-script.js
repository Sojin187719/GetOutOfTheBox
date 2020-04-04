
var isSleeping = false;
var cursorList = [];
var localURL = location;
var interval = 1000;
var id = 0;

createCursor("Me",0,0);

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
 


// const ref = database.ref('data/olivier');
// ref.on('child_changed', function(snapshot, data) {
//     console.log(`olivier ${snapshot.key}: ${snapshot.val()}`);

    // if (snapshot.key === 'x') {
    //     document.querySelector('#cursor').style.left = snapshot.val() + 'px';
    // }else {
    //     document.querySelector('#cursor').style.top = snapshot.val() + 'px';
    // }
// });




// var data = localStorage.getItem("userName");
// alert(data);








const coord =  async function(e){
	if(isSleeping) return;
	isSleeping = true
	var cursor = getCursor("Me");
	var x = e.pageX;
	var y = e.pageY;
	cursor.oldX=cursor.x;
	cursor.oldY=cursor.y;
	cursor.x=x;
	cursor.y=y;
	moveCursor(cursor)
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
	mainDiv.style.zIndex="2147483647";
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
	var cursor = {id: cursorId, x: cursorX, y: cursorY, oldX: 0, oldY: 0,docElement: mainDiv};
	cursorList.push(cursor);
	document.body.appendChild(mainDiv);
}
   

function deleteCursor(cursorId){
	var cursor = getCursor(cursorId);
	cursorList.splice(cursorList.indexOf(cursor), 1);
	document.body.removeChild(cursor.docElement);
}


function moveCursor(cursor){
	console.log("x: "+cursor.x+" | y: "+cursor.y);
	var diffX = cursor.x-cursor.oldX;
	var diffY = cursor.y-cursor.oldY;
	var nbDepl = Math.abs(diffX)>Math.abs(diffY) ? Math.abs(diffX):Math.abs(diffY);
	var count=1;
	var speed = interval/nbDepl;
	
	if(speed<10){
		nbDepl/=12.5;
		speed=10;
	}
	
	var distanceY=diffY/nbDepl;
	var distanceX=diffX/nbDepl;
	
	var id = setInterval(frame, speed);

	function frame() {
		if (count>=nbDepl) {
			clearInterval(id);
		} else {
			count++;
			cursor.docElement.style.top = cursor.oldY+distanceY*count+"px";
			cursor.docElement.style.left =  cursor.oldX+distanceX*count+"px";
		}
	}
}


document.addEventListener('mousemove', coord, true); 

// database.ref('data/olivier').set({
//             cursorId: cursor.id,
//             x: cursor.x,
//             y: cursor.y
//         }, function(error) {
//             if (error) {
//                 console.log(`arf: ${error}`);
//             } else {
//                 console.log('what!?');
//             }
//         });