var socket = io();
var userNameInput = document.getElementById("nick");
var redirector = document.createElement("a");
document.appendChild(redirector);

socket.on("welcome", function(data){
    console.log(data)
});


function redirectToChat(chatName){
    redirector.href = `chat?chatName=${chatName}&userName=${userNameInput.value}`;
    redirector.click();
}