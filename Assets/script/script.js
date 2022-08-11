var apiKey = "63ace9a18e2df2f35573367277a78e65";
var now = dayjs().unix();
var formEl = document.getElementById("search-input")
var searchBtn = document.getElementById("search-button");
var cityDisplayEl = document.querySelector(".city-display");
var forecastDisplayEl = document.querySelector(".forecast-item");
var historyTabEl = document.querySelector(".history-tabs")

searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    getAPI(formEl.value);
    formEl.value="";
})

var searchHistory = JSON.parse(localStorage.getItem("city")) || [];

function renderHistory() {
    historyTabEl.innerHTML = '';
    var searchHistory = JSON.parse(localStorage.getItem("city")) || [];

    for (i = 0; i < searchHistory.length; i++) {
        var tab = document.createElement("li");
        tab.innerHTML = "<button>" + searchHistory[i] + "</button>";
        historyTabEl.append(tab);
    }
}

renderHistory();

historyTabEl.addEventListener("click", function (event) {
    event.preventDefault();
    getAPI(event.target.textContent)
})

function getAPI(cityName) {
    // console.log(cityName)
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=63ace9a18e2df2f35573367277a78e65")

        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            console.log(data)
            console.log(data[0].lat)
            var lat = (data[0].lat)
            var lon = (data[0].lon)
            cityName = (data[0].name)

            if (searchHistory.indexOf(cityName) == -1) {
                // var tab = document.createElement("li");
                // tab.innerHTML = "<button>" + cityName + "</button>";
                // historyTabEl.append(tab);
                searchHistory.push(cityName);
                localStorage.setItem("city", JSON.stringify(searchHistory))
            };
            renderHistory();
            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey)
        })

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            displayToday(data)
            forecastDisplayEl.innerHTML = "";
            for (i = 0; i < 5; i++) { displayForecast(data, i) }
            return;
        })


    function displayToday(dataSet) {
        cityDisplayEl.innerHTML = "";
        city = document.createElement("div")
        city.innerHTML = "<h1>" + cityName + "</h1>" + "<image src='https://openweathermap.org/img/w/" + dataSet.current.weather[0].icon + ".png'>" ;
        temp = document.createElement("p")
        temp.textContent = "Temp: " + dataSet.current.temp;
        wind = document.createElement("p")
        wind.textContent = "Wind: " + dataSet.current.wind_speed + "MPH"
        humidity = document.createElement("p")
        humidity.textContent = "Humidity: " + dataSet.current.humidity
        UVIndex = document.createElement("p")
        UVIndex.textContent = "UV Index: " + dataSet.current.uvi
        cityDisplayEl.append(city, temp, wind, humidity, UVIndex)

    }

    function displayForecast(dataSet, i) {

        date = document.createElement("p")
        date.textContent = dayjs().add(i, "day").format("MM/DD/YYYY")
        city = document.createElement("div")
        city.innerHTML = "<h1>" + cityName + "</h1>" + "<image src='https://openweathermap.org/img/w/" + dataSet.daily[i].weather[0].icon + ".png'>";
        temp = document.createElement("p")
        temp.textContent = "Temp: " + dataSet.daily[i].temp.day;
        wind = document.createElement("p")
        wind.textContent = "Wind: " + dataSet.daily[i].wind_speed + "MPH"
        humidity = document.createElement("p")
        humidity.textContent = "Humidity: " + dataSet.daily[i].humidity
        UVIndex = document.createElement("p")
        UVIndex.textContent = "UV Index: " + dataSet.daily[i].uvi

        card = document.createElement("div")
        card.classList.add("card")
        card.append(date, city, temp, wind, humidity, UVIndex)
        forecastDisplayEl.append(card);

    }
}



