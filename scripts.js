const search = document.getElementById("search");
const menu = document.getElementById("menu");
let heart = document.getElementById("heart");
let addedLocationsList = document.getElementById("added-location-list");
let currentCity = localStorage.getItem("currentCityKey");
let addedLocation = new Set();

//getting the forcast information on the city
function getWeatherForecast(cityName) {
  let key = "8d21e705797d0cfd7ff89a2569d925dd";
  fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key)
    .then((response) => response.json())
    .then((result) => handleResult(result))
    .catch((err) => console.log(err));
}

//getting current information on the city
function getWeather(cityName) {
  let key = "8d21e705797d0cfd7ff89a2569d925dd";
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + key)
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
    console.log(result);
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
  document.getElementsByClassName("weather-icon")[0].src = `/img/${result.weather[0].main}.png`;
  document.getElementsByClassName("city-name")[0].innerHTML = result.name;
  drawAddedHeart();

  //details-page
  document.getElementsByClassName("city-name")[1].innerHTML = result.name;
  document.getElementsByClassName("details-temperature")[0].innerHTML = "Temprerature: " + celsius + "&deg";
  document.getElementsByClassName("details-feel")[0].innerHTML = "Feels like:  " + feelsLike + "&deg";
  document.getElementsByClassName("details-weather")[0].innerHTML = "Weather: " + result.weather[0].main;
  document.getElementsByClassName("details-sunrise")[0].innerHTML = "Sunrise: " + sunriseTime;
  document.getElementsByClassName("details-sunset")[0].innerHTML = "Sunset: " + sunsetTime;
}

//checking for prev. visits
if (!currentCity) {
  currentCity = "kyiv";
}
getWeather(currentCity);
drawList();

//added locations
heart.onclick = (e) => {
  //for the first added location / to remove locations
  if (!localStorage.getItem("addedLocationsKey")) {
    addedLocation.add(currentCity);
    localStorage.setItem("addedLocationsKey", JSON.stringify(...addedLocation));
    drawList();
    drawAddedHeart();
    return;
  } else if (JSON.parse(localStorage.getItem("addedLocationsKey")).includes(currentCity)) {
    let arr = JSON.parse(localStorage.getItem("addedLocationsKey"));
    let index = arr.indexOf(currentCity);
    arr.splice(index, 1);
    localStorage.setItem("addedLocationsKey", JSON.stringify(arr));
    drawList();
    drawAddedHeart();
    return;
  }

  //for the 3+ added location
  if (Array.isArray(JSON.parse(localStorage.getItem("addedLocationsKey")))) {
    addedLocation = new Set(JSON.parse(localStorage.getItem("addedLocationsKey"))).add(currentCity);
    localStorage.setItem("addedLocationsKey", JSON.stringify(Array.from(addedLocation)));
    drawList();
    drawAddedHeart();
    return;
  }

  //for the second  added location, otherwise cityname will be broken into latters
  addedLocation = new Set().add(JSON.parse(localStorage.getItem("addedLocationsKey"))).add(currentCity);
  localStorage.setItem("addedLocationsKey", JSON.stringify(Array.from(addedLocation)));
  drawList();
  drawAddedHeart();
};

//draw the added list
function drawList() {
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

//heart white-black change
function drawAddedHeart() {
  let arr = JSON.parse(localStorage.getItem("addedLocationsKey"));
  if (arr.includes(currentCity)) {
    heart.src = "/img/heart(added).png";
  } else {
    heart.src = "/img/heart.png";
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
  switch (e.target.parentElement.classList[0]) {
    case "menu-now":
      e.target.parentElement.classList.add("menu-active");
      document.getElementsByClassName("weather-now")[0].classList.add("active");

      document.getElementsByClassName("menu-details")[0].classList.remove("menu-active");
      document.getElementsByClassName("weather-details")[0].classList.remove("active");
      document.getElementsByClassName("menu-forecast")[0].classList.remove("menu-active");
      document.getElementsByClassName("weather-forecast")[0].classList.remove("active");
      break;
    case "menu-details":
      e.target.parentElement.classList.add("menu-active");
      document.getElementsByClassName("weather-details")[0].classList.add("active");

      document.getElementsByClassName("menu-now")[0].classList.remove("menu-active");
      document.getElementsByClassName("weather-now")[0].classList.remove("active");
      document.getElementsByClassName("menu-forecast")[0].classList.remove("menu-active");
      document.getElementsByClassName("weather-forecast")[0].classList.remove("active");
      break;
    case "menu-forecast":
      e.target.parentElement.classList.add("menu-active");
      document.getElementsByClassName("weather-forecast")[0].classList.add("active");

      document.getElementsByClassName("menu-details")[0].classList.remove("menu-active");
      document.getElementsByClassName("weather-details")[0].classList.remove("active");
      document.getElementsByClassName("menu-now")[0].classList.remove("menu-active");
      document.getElementsByClassName("weather-now")[0].classList.remove("active");
      break;

    default:
      break;
  }
};

// e.target.parentElement.classList

//поміняти set() на array?
//зробити скролл нормальним на всіх браузерах
