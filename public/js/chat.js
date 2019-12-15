var socket = io();

const urlParams = new URLSearchParams(window.location.search);
const chatName = urlParams.get('chatName');
const userName = urlParams.get('userName');

const roomNameElement = document.getElementById("roomName");
const kryptonimyElement = document.getElementById("kryptonimy");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messagesContainer");
const messageForm = document.getElementById("messageForm");


/* MESSAGE SENDING AND RECEIVING */
messageForm.onsubmit = function (e){
    e.preventDefault();

    if(messageInput.value != ""){
        socket.emit("CHAT_MESSAGE", {
            roomName: chatName,
            userName: userName,
            message: messageInput.value
        });

        messageInput.value = "";
    }
}

socket.on("CHAT_MESSAGE", function(data){
    if(data.roomName != chatName){
        return ;
    }
    const messageContainer = document.createElement("p");
    const messageSender = document.createElement("span");
    const messageValue = document.createElement("span");

    if(data.userName == userName){
        messageSender.classList.add("me");
    } else {
        messageSender.classList.add("somebody");
    }

    messageSender.innerHTML = data.userName + ": ";
    messageValue.innerHTML = data.message;

    messageContainer.appendChild(messageSender);  
    messageContainer.appendChild(messageValue);  

    messagesContainer.appendChild(messageContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

/* UPDATE CHAT STATE */
socket.on("CHAT_STATE", function(data){
    roomNameElement.innerHTML = chatName;

    kryptonimyElement.innerHTML = "";

    data[chatName].users.forEach((user) => {
        if(user != userName){
            kryptonimyElement.innerHTML += " " + user + ",";
        }
    });

    kryptonimyElement.innerHTML = kryptonimyElement.innerHTML.slice(0, -1);
});

/* CHAT ENTER AND DISCONNECTION */
socket.emit("CHAT_CONNECTION", {
    roomName: chatName,
    userName: userName
});

window.addEventListener('beforeunload', function (e) { 
    e.preventDefault(); 
    e.returnValue = ''; 
    socket.emit("CHAT_DISCONNECT", {
        roomName: chatName,
        userName: userName
    });
});