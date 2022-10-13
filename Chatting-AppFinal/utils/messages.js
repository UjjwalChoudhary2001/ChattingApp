const moment = require("moment"); //Requiring moment.js package.
function formatMessage(username, text) {
  //returning an object consisting these key value pairs.
  return {
    username,
    text,
    time: moment().format("h:mm a"), //Formatting the messages wrt to hour:min am/pm format
  };
}
module.exports = formatMessage;

//The above function is to return the messages in a formatted way.
