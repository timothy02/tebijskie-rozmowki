const io = require("socket.io");
const express = require("express");
const PORT = process.env.PORT || 3000;
const INDEX = '/pages/index.html';
const CHAT = '/pages/chat.html';
const QUEUE = '/pages/queue.html';
const wulgaryzmy = require("./wulgaryzmy.json");

const server = express()
  .use(express.static("public"))
  .get("/",(req, res) => res.sendFile(INDEX, { root: __dirname }))
  .get("/chat", (req, res) => res.sendFile(CHAT, { root: __dirname }))
  .get("/queue", (req, res) => res.sendFile(QUEUE, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const wsServer = io(server);

let userQueue = [];
let privIterator = 0;

let userNickNames = [];

let chats = {
  toaleta: {
    users: [],
    fullRoomName: "toaleta na 4"
  },
  kantyna: {
    users: [],
    fullRoomName: "kantyna"
  },
  exbochen: {
    users: [],
    fullRoomName: "ex-bochen"
  },
  palarnia: {
    users: [],
    fullRoomName: "palarnia"
  },
  wsb: {
    users: [],
    fullRoomName: "wejście do wsb"
  },
  garaze: {
    users: [],
    fullRoomName: "garaże"
  }
}

wsServer.on("connection", function(socket) {
  socket.emit("CHAT_STATE", chats);

  socket.on("CHAT_CONNECTION", data => {
    if(userNickNames.indexOf(data.userName) == -1){
      userNickNames.push(data.userName);
    }

    if(chats[data.roomName] == undefined){
      return ;
    } else {
      chats[data.roomName].users.push(data.userName);

      socket.emit("CHAT_CONNECTION", data);
      wsServer.emit("CHAT_STATE", chats);

      wsServer.emit("CHAT_MESSAGE", {
        userName: `<b style="color: yellow">CZARODZIEJ:</b>`,
        message: `Tebijczyk <b>${data.userName}</b> dołączył do rozmowy!`,
        roomName: data.roomName
      });
    }
  });
  
  socket.on("disconnect", data => {
console.log(data)
  });

  socket.on("CHAT_DISCONNECT", data => {
    if(chats[data.roomName] == undefined){
      return ;
    } else {
      var index = chats[data.roomName].users.indexOf(data.userName);
      if (index !== -1) chats[data.roomName].users.splice(index, 1);
      
      userNickNames.splice(userNickNames.indexOf(data.userName), 1);
      socket.emit("CHAT_DISCONNECT", data);
      wsServer.emit("CHAT_STATE", chats);

      wsServer.emit("CHAT_MESSAGE", {
        userName: `<b style="color: yellow">CZARODZIEJ:</b>`,
        message: `Tebijczyk <b>${data.userName}</b> opuścił rozmowę!`,
        roomName: data.roomName
      });
    }
  });

  socket.on("CHAT_MESSAGE", data => {
    wulgaryzmy.map(wulgaryzm => {
      const regeX = new RegExp(wulgaryzm, "i", "g");

      if((regeX.test(data.message))){
        data.message = data.message.replace(regeX, "*****");
      }

      if((regeX.test(data.userName))){
        data.userName = data.userName.replace(regeX, "*****");
      }
    });
    wsServer.emit("CHAT_MESSAGE", data);
  });

  socket.on("JOIN_QUEUE", data => {
    userQueue.push(data.userName);
    userNickNames.push(data.userName);

    setTimeout(matchUsersInQueue, 2500);
  });

  socket.on("LEAVE_QUEUE", data => {
    if(userQueue.indexOf(data.userName) == -1){
      return ;
    } else {
      userQueue.splice(userQueue.indexOf(data.userName), 1);
    }
  });

  socket.on("CHECK_NICKNAME", (data) => {
    const isOcupied = (userNickNames.indexOf(data.userName) != -1);
    let isForbidden = false;

    wulgaryzmy.map(wulgaryzm => {
      const regeX = new RegExp(wulgaryzm, "i", "g");

      if((regeX.test(data.userName))){
        isForbidden = true;
      }
    });

    socket.emit("IS_OCUPIED", {isOcupied, isForbidden});
  });
});

function matchUsersInQueue(){
  if(userQueue.length <= 1){
    return;
  }

  const user1 = userQueue[0];
  const user2 = userQueue[1];
  userQueue.splice(0, 2);

  chats["prywatny"+privIterator] = {
    users: [],
    fullRoomName: "Rozmowa 1 na 1"
  }

  wsServer.emit("QUEUE_MATCHED", {
    user1: user1,
    user2: user2,
    roomName: "prywatny"+privIterator
  });

  privIterator++;
}

