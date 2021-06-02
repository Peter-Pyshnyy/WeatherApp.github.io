const search = document.getElementById("search");
const heart = document.getElementById("heart");
let addedLocationsList = document.getElementById("added-location-list");
let currentCity = localStorage.getItem("currentCityKey");
let addedLocation = new Set();

//getting the information on the city
function getWeather(cityName) {
  let key = "8d21e705797d0cfd7ff89a2569d925dd";
  fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key)
    .then((response) => response.json())
    .then((result) => drawWeather(result))
    .catch((err) => console.log(err));
}

//search
search.addEventListener("keypress", setQuery);
function setQuery(e) {
  if (e.key == "Enter") {
    currentCity = e.path[0].value; //currentCity becomes value of search
    localStorage.setItem("currentCityKey", e.path[0].value); //sets city name in local storage
    getWeather(currentCity);
    this.blur();
  }
}

//showing the information on the website
function drawWeather(result) {
  let celsius = Math.round(parseFloat(result.list[0].main.temp) - 273.15);

  document.getElementsByClassName("temperature")[0].innerHTML = celsius + "&deg";
  document.getElementsByClassName("weather-icon")[0].innerHTML = result.list[0].weather[0].description;
  document.getElementsByClassName("city-name")[0].innerHTML = result.city.name;
}

//checking for prev. visits
if (!currentCity) {
  currentCity = "kyiv";
}
getWeather(currentCity);

//added locations
heart.onclick = (e) => {
  if (!localStorage.getItem("addedLocationsKey")) {
    addedLocation.add(currentCity);
    localStorage.setItem("addedLocationsKey", JSON.stringify(...addedLocation));
    return;
  }

  if (Array.isArray(JSON.parse(localStorage.getItem("addedLocationsKey")))) {
    addedLocation = new Set(JSON.parse(localStorage.getItem("addedLocationsKey"))).add(currentCity);
    localStorage.setItem("addedLocationsKey", JSON.stringify(Array.from(addedLocation)));
    return;
  }

  addedLocation = new Set().add(JSON.parse(localStorage.getItem("addedLocationsKey"))).add(currentCity);
  localStorage.setItem("addedLocationsKey", JSON.stringify(Array.from(addedLocation)));
};

console.log(localStorage.getItem("addedLocationsKey"));

// for (let i = 0; i < addedLocationsList.children.length; i++) {
//   console.log(addedLocationsList.children[i].innerHTML);
// }

//виправити баг з білебердою в назві городів
