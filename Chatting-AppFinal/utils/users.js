//This file is for managing the users
const users = [];

//Join the user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

//Get the current user
function getCurrentUser(id) {
  return users.find((user) => id === user.id); //Dont use curly braces as its not a callback func.s
}

//When a user leaves
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index != -1) {
    //Removing that person from the array.
    return users.splice(index, 1)[0]; //Returning that person
  }
}

//Get room users

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeave,
};
