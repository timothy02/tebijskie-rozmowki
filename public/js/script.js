var socket = io();
var userNameInput = document.getElementById("nick");
var redirector = document.createElement("a");
document.appendChild(redirector);

socket.on("welcome", function(data){
    console.log(data)
});


function redirectToChat(chatName){
    if(userNameInput.value == ""){
        alert("Musisz najpierw podać swoją nazwę!");
        return ;
    }

    if(userNameInput.value.length < 2 || userNameInput.value.length > 15){
        alert("Nazwa musi mieć od 3 do 15 znaków!");
        return ;
    }

    if(/[!@#$%^&*(),.?":{}|<>]/g.test(userNameInput.value)){
        alert("Nazwa nie może zawierać znaków speclanych !@#$%^&*(),.?\":{}|<>");
        return ;
    }

    redirector.href = `chat?chatName=${chatName}&userName=${userNameInput.value}`;
    redirector.click();
}