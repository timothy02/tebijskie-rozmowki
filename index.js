const io = require("socket.io");
const express = require("express");
const PORT = process.env.PORT || 3000;
const INDEX = '/pages/index.html';
const CHAT = '/pages/chat.html';

const server = express()
  .use(express.static("public"))
  .get("/",(req, res) => res.sendFile(INDEX, { root: __dirname }))
  .get("/chat", (req, res) => res.sendFile(CHAT, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const wsServer = io(server);


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
  socket.emit("welcome", "welcome man");

  socket.on("CHAT_CONNECTION", data => {
    if(chats[data.roomName] == undefined){
      return ;
    }

    chats[data.roomName].users.push(data.userName);

    socket.emit("CHAT_CONNECTION", data);
    wsServer.emit("CHAT_STATE", chats);
  });

  socket.on("CHAT_DISCONNECT", data => {
    var index = chats[data.roomName].users.indexOf(data.userName);
    if (index !== -1) chats[data.roomName].users.splice(index, 1);
    
    socket.emit("CHAT_DISCONNECT", data);
    wsServer.emit("CHAT_STATE", chats);
  });

  socket.on("CHAT_MESSAGE", data => {
    wsServer.emit("CHAT_MESSAGE", data);
  });
});

