require("dotenv").config();
const pkg = require("node-wit");
const { Wit } = pkg;

const accessToken = process.env.WIT_AI_TOKEN;

const handleMessage = async (message) => {
  try {
    const client = new Wit({ accessToken });
    // Send the message to the AI
    console.log(message);
    const response = await client.message(message.input, {});
    // CHECK RESPONSE
    if (response) {
      // return console.log(response);
      return handleResponse(response);
    }
  } catch (error) {
    if (error) console.log(error);
  }
};
// Run message function
// handleMessage('what time is it now');

// HANDLE RESPONSE
const handleResponse = (response) => {
  let name = undefined;
  let confidence = 0;
  // Loop
  Array(response).forEach((r) => {
    if (r.intents.length > 0) {
      name = r.intents[0].name;
      confidence = r.intents[0].confidence;

      if (name === "greeting") {
        handleHello(r);
      }
      if (name === "wit_location") {
        handleLocation(r);
      }
      if (name === "wit$get_time") {
        handleTime(r);
      }
    } else {
      handleGibberish(r);
    }
  });
};

// SWITCH
// switch(name){
//     case 'hello':
//         return console.log('Hello, can I help you?');
//         // return handleHello();
//     default:
//         return console.log("Please don't forget good manners, say hello first!");
//         // return handleGibberish();
// }

// HANDLE different functions
const handleHello = () => {
  console.log("Hello, can I help you?");
};
// HANDLE GIBBERISH
const handleGibberish = () => {
  console.log("Sorry, I don't understand. Can you say that again?");
};
const handleLocation = (r) => {
  const location = r.entities["wit$location:location"][0].body;
  console.log(`${location} is in `);
};

const handleTime = (r) => {
  const time = r.entities["wit$datetime:datetime"][0].value;
  console.log(`It is ${time} now `);
};

module.exports = {
  handleMessage,
};
