require("dotenv").config();
const pkg = require("node-wit");
const { Wit } = pkg;
const axios = require("axios");

const accessToken = process.env.WIT_AI_TOKEN;

const handleMessage = async (message) => {
  try {
    const client = new Wit({ accessToken });
    console.log(message);
    const response = await client.message(message.input, {});
    if (response) {
      // console.log(response);
      return handleResponse(response);
    }
  } catch (error) {
    if (error) console.log(error);
  }
};

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
      if (name === "find_events") {
        result = handleEvents(r);
      }
    } else {
      result = handleGibberish(r);
    }
  });
  return result;
};

// const searchWikipedia = async (searchQuery) => {
//   const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
//   const response = await fetch(endpoint);
//   if (!response.ok) {
//     throw Error(response.statusText);
//   }
//   const json = await response.json();
//   console.log(json);
//   return json;
// };

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
    console.error("Error in finding weather!", err);
  }
};

const getEvents = async (input) => {
  const endpoint = `https://api.yelp.com/v3/events?limit=3&sort_by=desc&sort_on=time_start&location=${input}`;
  const YELP_API = process.env.YELP_API;
  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `${YELP_API}` },
    });
    const name = response.data.events[0]["name"];
    const category = response.data.events[0]["category"];
    const event_site = response.data.events[0]["tickets_url"];
    console.log(response.data);
    return `There is a ${category} event called: ${name} in ${input}. You can go to ${event_site} for more information`;
  } catch (err) {
    console.error("Error in finding events!", err);
  }
};
// HANDLE different functions

const handleHello = () => {
  return "Hello! How can I help you today?";
};
const handleGibberish = () => {
  return "Sorry, I don't understand. Can you say that again?";
};
const handleLocation = (r) => {
  if (r.entities["wit$location:location"][0].body) {
    const location = r.entities["wit$location:location"][0].body;
    const timezone =
      r.entities["wit$location:location"][0].resolved["values"][0]["timezone"];

    return `${location} is in ${timezone} timezone. `;
  } else {
    return `Please enter a valid location`;
  }
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
    return `Please specify a location. For example, say "what's the weather in my_city?" `;
  }
};

const handleEvents = (r) => {
  if (r.entities["wit$location:location"]) {
    const location = r.entities["wit$location:location"][0].body;
    return getEvents(location);
  } else {
    return `Please specify a location. For example, say "what's the weather in my_city?" `;
  }
};

module.exports = {
  handleMessage,
};
