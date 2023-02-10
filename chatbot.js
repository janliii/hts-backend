require("dotenv").config();
const pkg = require("node-wit");
const { Wit } = pkg;
const axios = require("axios");

const accessToken = process.env.WIT_AI_TOKEN;

const handleMessage = async (message) => {
  try {
    const client = new Wit({ accessToken });
    // Send the message to the AI
    console.log(message);
    const response = await client.message(message.input, {});
    // CHECK RESPONSE
    if (response) {
      // console.log(response);
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
  let result = "";
  // Loop
  Array(response).forEach((r) => {
    if (r.intents.length > 0) {
      name = r.intents[0].name;
      confidence = r.intents[0].confidence;

      if (name === "greeting") {
        result = handleHello(r);
      }
      if (name === "wit_location") {
        result = handleLocation(r);
      }
      if (name === "wit$get_time") {
        result = handleTime(r);
      }
      if (name === "wit$get_date") {
        result = handleDate(r);
      }
      if (name === "wit$get_weather") {
        result = handleWeather(r);
      }
    } else {
      result = handleGibberish(r);
    }
  });
  return result;
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
const searchWikipedia = async (searchQuery) => {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const json = await response.json();
  console.log(json);
  return json;
};

const getWeather = async (lat, lon) => {
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API}`;
  try {
    const response = await axios.get(endpoint);
    const currentTemp = Math.floor(
      (Number(await response.data.main.temp) - 273.15) * 1.8 + 32
    );
    const weatherDes = await response.data.weather[0].description;
    const city = await response.data.name;
    // return response;
    return `It is ${weatherDes} in ${city}. The current temperature is ${currentTemp} degrees`;
  } catch (err) {
    console.error("error in findweather!", err);
  }
};
// HANDLE different functions
const handleHello = () => {
  return "Hello, can I help you?";
};
const handleGibberish = () => {
  return "Sorry, I don't understand. Can you say that again?";
};
const handleLocation = (r) => {
  const location = r.entities["wit$location:location"][0].body;
  const timezone =
    r.entities["wit$location:location"][0].resolved["values"][0]["timezone"];
  // const wikiRes = searchWikipedia(location).then((json) => {
  //   json;
  // });
  return `${location} is in ${timezone} timezone. `;
};

const handleTime = (r) => {
  const time = r.entities["wit$datetime:datetime"][0].value;
  return `It is ${time.slice(11, 16)} now `;
};
const handleDate = (r) => {
  const time = r.entities["wit$datetime:datetime"][0].value;
  return `Today is ${time.slice(0, 10)} `;
};
const handleWeather = (r) => {
  if (r.entities["wit$location:location"]) {
    const location = r.entities["wit$location:location"][0].body;
    const lat =
      r.entities["wit$location:location"][0].resolved["values"][0]["coords"][
        "lat"
      ];
    const long =
      r.entities["wit$location:location"][0].resolved["values"][0]["coords"][
        "long"
      ];
    return getWeather(lat, long);
    console.log(getWeather(lat, long));
  } else {
    return `please specify your city. For example,say "what's the weather in my_city?" `;
  }
};

module.exports = {
  handleMessage,
};
