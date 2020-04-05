	var isSleeping = false;
	var cursorList = [];
	var localURL = location.href;
	var interval = 1000;
	var id = 0;
	var myUser=[""];

	chrome.storage.sync.get(['userName'],function(item){
		myUser = item.userName;
	});

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
	
	const ref = database.ref('data');
	ref.on('child_changed', function(snapshot, data) {
		var user = `${snapshot.key}`;
		var x = snapshot.child("x").val();
		var y = snapshot.child("y").val();
		var url= snapshot.child("url").val();
		if(user==myUser) return;
		var cursor = getCursor(user);
		if(url==localURL){
			if(cursor==null) createCursor(user,x,y);
			else{
				updateCursor(cursor,x,y);
				moveCursor(cursor);
			}
		}else{
			if(cursor!=null) deleteCursor(cursor, url);
		}
	});

	const coord =  async function(e){
		if(isSleeping) return;
		if(myUser==null||myUser=="") return;
		localURL = location.href;
		isSleeping = true
		database.ref('data/'+myUser).set({
			x: e.pageX,
			y: e.pageY,
			url:localURL
		});
		await sleep(interval);
		isSleeping = false;
	};

	document.addEventListener('mousemove', coord, true);

	window.onbeforeunload = function () {
		isSleeping=true;
		database.ref('data/'+myUser).remove();
		for(i = 0 ; i<cursorList.length ; i++){
			document.body.removeChild(cursorList[i].docElement);
		}
		cursorList.splice(0, cursorList.length);
		return "close";
	}

	function updateCursor(cursor, x, y){
		cursor.oldX=cursor.x;
		cursor.oldY=cursor.y;
		cursor.x=x;
		cursor.y=y;
	}

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
		p.style.backgroundColor = 'rgb(0,0,0,0.5)';
		p.style.bordeRadius="3px";
		p.style.color="white";
		var node = document.createTextNode(cursorId);
		p.appendChild(node);
		mainDiv.appendChild(img);
		mainDiv.appendChild(p);
		var cursor = {id: cursorId, x: cursorX, y: cursorY, oldX: 0, oldY: 0,docElement: mainDiv,};
		cursorList.push(cursor);
		document.body.appendChild(mainDiv);
		moveCursor(cursor);
	}
	

	async function deleteCursor(cursor, url){
		cursorList.splice(cursorList.indexOf(cursor), 1);
		cursor.docElement.innerHTML = "<a href='"+url+"'>"+url+"</a>";
		cursor.docElement.style.pointerEvents="auto";
		await sleep(3500);
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
