var socket = io();
var userNameInput = document.getElementById("nick");
var redirector = document.createElement("a");

socket.on("CHAT_STATE", function(data){
    const counters = document.querySelectorAll(".roomCounter");
    
    counters.forEach((counter) => {
        if(data[counter.getAttribute("room")] != undefined){
            counter.innerHTML = data[counter.getAttribute("room")].users.length;
        }
    });
});

socket.on("IS_OCUPIED", function(data){
    if(data.isOcupied){
        alert("Ta nazwa jest aktualnie przez kogoś używana. Wybierz inną.");
    } else if(data.isForbidden){
        alert("Ta nazwa zawiera wulgaryzm. Wybierz inną.");
    } else {
        redirector.click();
    }
});


function join1on1(){
    if(userNameInput.value == ""){
        alert("Musisz najpierw podać swoją nazwę!");
        return ;
    }

    if(userNameInput.value.length < 2 || userNameInput.value.length > 25){
        alert("Nazwa musi mieć od 3 do 25 znaków!");
        return ;
    }

    if(/[!@#$%^&*(),.?":{}|<>]/g.test(userNameInput.value)){
        alert("Nazwa nie może zawierać znaków speclanych !@#$%^&*(),.?\":{}|<>");
        return ;
    }

    redirector.href = `queue?userName=${userNameInput.value}`;
    
    socket.emit("CHECK_NICKNAME", {userName: userNameInput.value});
}


function redirectToChat(chatName){
    if(userNameInput.value == ""){
        alert("Musisz najpierw podać swoją nazwę!");
        return ;
    }

    if(userNameInput.value.length < 2 || userNameInput.value.length > 25){
        alert("Nazwa musi mieć od 3 do 25 znaków!");
        return ;
    }

    if(/[!@#$%^&*(),.?":{}|<>]/g.test(userNameInput.value)){
        alert("Nazwa nie może zawierać znaków speclanych !@#$%^&*(),.?\":{}|<>");
        return ;
    }

    redirector.href = `chat?chatName=${chatName}&userName=${userNameInput.value}`;

    socket.emit("CHECK_NICKNAME", {userName: userNameInput.value});
}