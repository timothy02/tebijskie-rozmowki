var socket = io();

var userNameInput = document.getElementById("nick");
var redirector = document.createElement("a");

const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get('userName');

socket.on("QUEUE_MATCHED", function(data){
    if(data.user1 == userName || data.user2 == userName){
        redirector.href = `chat?chatName=${data.roomName}&userName=${userName}`;
        redirector.click();
    }
});

/* QUEUE ENTER AND DISCONNECTION */
socket.emit("JOIN_QUEUE", {
    userName: userName
});

window.addEventListener('beforeunload', function (e) { 
    e.preventDefault(); 
    delete e['returnValue'];
    socket.emit("LEAVE_QUEUE", {
        userName: userName
    });
});