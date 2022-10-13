const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
//Getting query String parameters from the url and ignoring characters like & , $ ,? etc
const link = window.location.search;
const urlParams = new URLSearchParams(link); //URLSearchParams will extract query string parameters to store it in the variable.
const param1 = urlParams.get("username");
const param2 = urlParams.get("room");
console.log(param1, param2);

const socket = io();

//Join chatroom
socket.emit("joinroom", { username: param1, room: param2 });

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Got message text from form
  const msg = document.getElementById("msg");
  //   console.log(msg);
  //Emitting message to show it on server console
  socket.emit("chatmessage", msg.value);
  //Clearing I/P box
  msg.value = "";
  msg.focus();
});

//Output messages on DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <p class="meta">${message.username} <span>&nbsp;${message.time}</span></p>
  <p class="text">
   ${message.text}
  </p>`;

  document.querySelector(".chat-messages").append(div);
}

//Add roomname to Dom
function outputRoomName(room) {
  roomName.innerText = room;
}

//Add users to DOM function
function outputUsers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}
