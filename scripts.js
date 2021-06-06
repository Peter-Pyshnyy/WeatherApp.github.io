const search = document.getElementById("search");
const menu = document.getElementById("menu");
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let heart = document.getElementById("heart");
let addedLocationsList = document.getElementById("added-location-list");
let currentCity = localStorage.getItem("currentCityKey");

//getting the forcast information on the city
function getWeatherForecast(cityName) {
  let key = "8d21e705797d0cfd7ff89a2569d925dd";
  let url = "https://api.openweathermap.org";
  fetch(url + "/data/2.5/forecast?q=" + cityName + "&appid=" + key)
    .then((response) => response.json())
    .then((result) => drawForecast(result))
    .catch((err) => console.log(err));
}

//getting current information on the city
function getWeather(cityName) {
  let key = "8d21e705797d0cfd7ff89a2569d925dd";
  let url = "https://api.openweathermap.org";
  fetch(url + "/data/2.5/weather?q=" + cityName + "&appid=" + key)
    .then((response) => response.json())
    .then((result) => handleResult(result))
    .catch((err) => console.log(err));
}

//result validation
function handleResult(result) {
  if (result.cod != 200) {
    search.style.borderBottom = "1px solid red";
    search.value = result.message.charAt(0).toUpperCase() + result.message.slice(1) + "!";
    setTimeout(() => {
      search.style.borderBottom = "1px solid black";
      search.blur();
      search.value = "Search..";
    }, 1000);
  } else {
    currentCity = result.name;
    localStorage.setItem("currentCityKey", currentCity);
    drawWeather(result);
  }
}

//search
search.addEventListener("keypress", setQuery);
function setQuery(e) {
  if (e.key == "Enter") {
    let searchedCity = e.path[0].value;
    getWeather(searchedCity);
    this.blur();
  }
}

//showing the information on the website
function drawWeather(result) {
  let celsius = Math.round(parseFloat(result.main.temp) - 273.15);
  let feelsLike = Math.round(parseFloat(result.main.feels_like) - 273.15);
  let sunrise = new Date(result.sys.sunrise * 1000);
  let sunset = new Date(result.sys.sunset * 1000);
  let sunriseTime = `${sunrise.getHours()}:${(sunrise.getMinutes() < 10 ? "0" : "") + sunrise.getMinutes()}`;
  let sunsetTime = `${sunset.getHours()}:${(sunset.getMinutes() < 10 ? "0" : "") + sunset.getMinutes()} `;

  //now-page
  document.getElementsByClassName("temperature")[0].innerHTML = celsius + "&deg";
  document.getElementsByClassName("weather-icon")[0].src = `img/${result.weather[0].main}.png`;
  document.getElementsByClassName("city-name")[0].innerHTML = result.name;

  //forecast-page
  getWeatherForecast(result.name);
  document.getElementsByClassName("city-name")[2].innerHTML = result.name;

  //details-page
  document.getElementsByClassName("city-name")[1].innerHTML = result.name;
  document.getElementsByClassName("details-temperature")[0].innerHTML = "Temprerature: " + celsius + "&deg";
  document.getElementsByClassName("details-feel")[0].innerHTML = "Feels like:  " + feelsLike + "&deg";
  document.getElementsByClassName("details-weather")[0].innerHTML = "Weather: " + result.weather[0].main;
  document.getElementsByClassName("details-sunrise")[0].innerHTML = "Sunrise: " + sunriseTime;
  document.getElementsByClassName("details-sunset")[0].innerHTML = "Sunset: " + sunsetTime;

  drawAddedHeart();
}

//checking for prev. visits
if (!currentCity) {
  currentCity = "kyiv";
}
getWeather(currentCity);
drawList();
getWeatherForecast(currentCity);

//added locations
heart.onclick = (e) => {
  let storedItems = JSON.parse(localStorage.getItem("addedLocationsKey"));
  let addedLocation = [];

  if (!storedItems) {
    addedLocation.push(currentCity);
  } else if (!storedItems.includes(currentCity)) {
    addedLocation = storedItems;
    addedLocation.push(currentCity);
  } else {
    addedLocation = storedItems;
    let index = addedLocation.indexOf(currentCity);
    addedLocation.splice(index, 1);
  }

  localStorage.setItem("addedLocationsKey", JSON.stringify(addedLocation));
  drawList();
  drawAddedHeart();
};

//draw the added list
function drawList() {
  if (!localStorage.getItem("addedLocationsKey")) return;
  let listArray = JSON.parse(localStorage.getItem("addedLocationsKey"));
  const list = document.getElementById("added-location-list");
  list.innerHTML = "";

  listArray.forEach((addedCity) => {
    let li = document.createElement("li");
    li.innerHTML = addedCity;
    li.classList.add("pointer");
    list.append(li);
  });
}

//drawing forecast cards
function drawForecast(result) {
  const list = document.getElementById("forecast-list");
  let arr = [];
  list.innerHTML = "";
  for (let i = 0; i < 17; i++) {
    arr.push(createCard(result, i));
  }

  arr.forEach((forecastTime) => {
    let li = document.createElement("li");
    li = forecastTime;
    list.append(li);
  });
}

//create forecast card
function createCard(result, index) {
  let card = document.getElementById("for-item").cloneNode(true);
  let cardLeft = card.childNodes[1].childNodes[1].childNodes;
  let cardRight = card.childNodes[1].childNodes[3].childNodes;
  let date = new Date(result.list[index].dt * 1000);
  let celsius = Math.round(parseFloat(result.list[index].main.temp) - 273.15);
  let feelsLike = Math.round(parseFloat(result.list[index].main.feels_like) - 273.15);

  cardLeft[1].innerHTML = date.getUTCDate() + " " + monthNames[date.getMonth()];
  cardLeft[3].innerHTML = `Temperature: ${celsius}&deg`;
  cardLeft[5].innerHTML = `Feels like: ${feelsLike}&deg`;

  cardRight[1].innerHTML = date.getUTCHours() + ":00";
  cardRight[3].innerHTML = result.list[index].weather[0].main;
  cardRight[5].src = `img/${result.list[index].weather[0].main}.png`;

  card.classList.remove("hidden");

  return card;
}

//heart white-black change
function drawAddedHeart() {
  let arr = JSON.parse(localStorage.getItem("addedLocationsKey"));
  if (arr.includes(currentCity)) {
    heart.src = "img/heart(added).png";
  } else {
    heart.src = "img/heart.png";
  }
}

//select location from list
addedLocationsList.onclick = function (e) {
  if (e.target.tagName == "LI") {
    getWeather(e.target.innerHTML);
  }
};

//switch in menu
menu.onclick = function (e) {
  document.getElementsByClassName("weather-now")[0].classList.remove("active");
  document.getElementsByClassName("weather-details")[0].classList.remove("active");
  document.getElementsByClassName("weather-forecast")[0].classList.remove("active");
  document.getElementsByClassName("menu-now")[0].classList.remove("menu-active");
  document.getElementsByClassName("menu-details")[0].classList.remove("menu-active");
  document.getElementsByClassName("menu-forecast")[0].classList.remove("menu-active");

  switch (e.target.parentElement.classList[0]) {
    case "menu-now":
      e.target.parentElement.classList.add("menu-active");
      document.getElementsByClassName("weather-now")[0].classList.add("active");
      break;
    case "menu-details":
      e.target.parentElement.classList.add("menu-active");
      document.getElementsByClassName("weather-details")[0].classList.add("active");
      break;
    case "menu-forecast":
      e.target.parentElement.classList.add("menu-active");
      document.getElementsByClassName("weather-forecast")[0].classList.add("active");
      break;

    default:
      break;
  }
};

//автоматичний запрос через 2 секунди
